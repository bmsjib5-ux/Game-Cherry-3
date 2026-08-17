// ═══════════════════════════════════════════════════════════════════════════
// FieldScene — ฉากเล่นจริง: ประกอบแมพ มอน ผู้เล่น ของดรอป และกล้อง
//
// การข้ามแมพใช้ scene.restart() แล้วส่งสถานะผู้เล่นไปกับข้อมูลฉาก
// วิธีนี้ทำให้ไม่ต้องเขียนโค้ดรื้อของเก่าทีละชิ้น (มอน/ของดรอป/กราฟิกพื้น)
// Phaser เคลียร์ให้หมดเอง ส่วนเท็กซ์เจอร์ยังอยู่ในแคชจึงไม่โหลดซ้ำ
// ═══════════════════════════════════════════════════════════════════════════

import { MAPS, biomeOf, mobLevel, VIEW_W, VIEW_H } from '../maps.js';
import { Player } from '../player.js';
import { Mob } from '../mob.js';
import { Drop, PICKUP_RANGE } from '../drop.js';
import { Hud } from '../hud.js';
import { Input } from '../input.js';
import { rollDamage, mobDamage } from '../stats.js';
import { popDamage, popText, slashFx, sparks, ring, FONT } from '../fx.js';
import { writeSave } from '../save.js';
import { shade, luma } from '../color.js';
import { MATERIALS } from '../../../shared/gamedata.js';

const RESPAWN_MS = 4200;
const AUTOSAVE_MS = 15000;
const MAX_TARGETS = 8;          // ตีทีเดียวกินมอนได้สูงสุดกี่ตัว

export class FieldScene extends Phaser.Scene {
  constructor() {
    super('field');
  }

  init(data) {
    const carried = data.carry || data.save?.player || null;
    this.carry = carried;
    this.cls = data.cls || carried?.cls || 'warrior';
    this.mapId = data.mapId || data.save?.mapId || 'meadow';
    this.spawnKey = data.spawn || 'left';
  }

  create() {
    this.map = MAPS[this.mapId];
    this.biome = biomeOf(this.mapId);
    const map = this.map;

    // ── นาฬิกาในเกม ──
    // ตัวจับเวลาทุกอย่าง (อมตะชั่วคราว, รีสปอว์น, ของหมดอายุ, ออโตเซฟ) ต้องอ้างค่านี้
    // ไม่ใช่ scene.time.now ซึ่งเป็นเวลานาฬิกาจริง
    //
    // Phaser หนีบ delta ไว้เมื่อเฟรมตก (เกมเดินช้าลงแบบสโลว์โมชัน) ทำให้เวลาจริง
    // เดินเร็วกว่าเวลาในเกมมาก ถ้าจับเวลาด้วยเวลาจริง เครื่องช้าจะเสียเปรียบ:
    // ช่วงอมตะหลังโดนตีหมดก่อนที่ตัวละครจะขยับหนีพ้น และมอนรีสปอว์นเร็วเกินจริง
    this.gameTime = 0;

    this.cameras.main.setBackgroundColor(this.biome.sky);
    this.cameras.main.setBounds(0, 0, map.width, VIEW_H);
    this.physics.world.setBounds(0, 0, map.width, VIEW_H + 400);

    this.drawBackground();
    this.buildFootholds();
    this.drawRopes();
    this.buildPortals();

    // ── ผู้เล่น ──
    const sp = map.spawnPoints[this.spawnKey] || map.spawnPoints.left;
    this.player = new Player(this, sp.x, sp.y, this.cls, this.carry || {});
    this.player.rig.container.setDepth(400);

    this.physics.add.collider(this.player.sprite, this.platforms, null, (_ps, plat) => {
      const from = this.player.dropFrom;
      if (from === null) return true;
      if (plat.getData('ground')) return true;       // พื้นล่างสุดชนเสมอ ไม่ให้ร่วงหลุดแมพ
      // ปิดการชนเฉพาะแท่น "ระดับเดียวกับที่กำลังทิ้งตัวลงมา"
      // แท่นชั้นถัดไปยังชนปกติ จึงไม่ร่วงทะลุสองชั้นในการกดครั้งเดียว
      return Math.abs(plat.body.top - from) > 8;
    });

    // ── มอน ──
    this.mobGroup = this.physics.add.group();
    this.physics.add.collider(this.mobGroup, this.platforms);
    this.mobs = [];
    this.spawners = map.spawns.map((s) => ({ ...s, alive: [], nextAt: 0 }));
    this.fillSpawners(true);

    this.drops = [];

    // ── UI ──
    this.input.keyboard.enabled = true;
    this.controls = new Input(this);
    this.hud = new Hud(this, this.player, (i) => this.controls.queueSkill(i));
    this.hud.setMapName(`${this.biome.emoji} ${this.biome.name}  (Lv.${this.biome.lvMin}–${this.biome.lvMax})`);

    this.cameras.main.startFollow(this.player.sprite, false, 0.14, 0.14, 0, 120);

    this.deathUi = null;
    this.lastSave = 0;

    // เตือนถ้าเลเวลต่ำกว่าแมพมาก — เข้าได้ แต่ให้รู้ตัวว่าจะเจ็บ
    if (this.player.level < this.biome.lvMin - 4) {
      popText(this, this.player.x, this.player.y - 110, '⚠️ เลเวลต่ำกว่าแมพนี้มาก!', '#ff9a6a', 20);
    }
  }

  // ── ฉากหลัง: เนินซ้อนชั้นเลื่อนช้ากว่าฉากหน้า (parallax) ────────────────────
  drawBackground() {
    const { width } = this.map;
    const b = this.biome;

    const layer = (factor, alpha, color, baseY, amp, step) => {
      const g = this.add.graphics().setScrollFactor(factor).setDepth(-50 + factor * 10);
      g.fillStyle(color, alpha);
      // วาดเนินเป็นชุดวงรีทับกัน ได้ขอบโค้งนุ่มโดยไม่ต้องคำนวณเส้นโค้ง
      for (let x = -200; x < width + 400; x += step) {
        const h = amp * (0.6 + Math.abs(Math.sin(x * 0.0021)) * 0.8);
        g.fillEllipse(x, baseY, step * 2.4, h * 2);
      }
      g.fillRect(-200, baseY, width + 600, VIEW_H - baseY + 200);
      return g;
    };

    // ฉากหลังจงใจให้ซีดและอ่อน ส่วนแท่นที่เหยียบได้ย้อมเข้ม (ดู buildFootholds)
    // ถ้าสองอย่างนี้ความเข้มใกล้กัน ผู้เล่นจะแยกไม่ออกว่าอะไรเหยียบได้
    layer(0.2, 0.26, b.fog, 400, 120, 230);
    layer(0.45, 0.32, b.ground, 470, 90, 180);

    // บรรยากาศเฉพาะไบโอม — เพิ่มบุคลิกให้แต่ละแมพด้วยของถูก ๆ
    const ambient = { snow: '❄️', volcano: '🔥', sky: '☁️', meadow: '🌸', desert: '🍂', cave: '✨' }[b.id];
    if (ambient) {
      for (let i = 0; i < 22; i++) this.spawnAmbient(ambient);
    }
  }

  spawnAmbient(char) {
    const up = this.biome.id === 'volcano' || this.biome.id === 'cave';
    const t = this.add
      .text(Phaser.Math.Between(0, this.map.width), Phaser.Math.Between(0, VIEW_H), char, {
        fontFamily: FONT, fontSize: `${Phaser.Math.Between(12, 22)}px`,
      })
      .setAlpha(Phaser.Math.FloatBetween(0.2, 0.6))
      .setDepth(-10)
      .setScrollFactor(0.7);
    this.tweens.add({
      targets: t,
      y: up ? -40 : VIEW_H + 40,
      x: t.x + Phaser.Math.Between(-90, 90),
      alpha: 0,
      duration: Phaser.Math.Between(6000, 13000),
      delay: Phaser.Math.Between(0, 5000),
      onComplete: () => {
        t.destroy();
        if (this.scene.isActive()) this.spawnAmbient(char);
      },
    });
  }

  // ── foothold: แท่นชนทางเดียว (ยืนบนได้ กระโดดทะลุขึ้นจากใต้ได้) ───────────────
  buildFootholds() {
    this.platforms = this.physics.add.staticGroup();
    const g = this.add.graphics().setDepth(100);

    // ทิศการย้อมสีต้องกลับด้านตามความสว่างของไบโอม
    // ไบโอมสว่าง (ทุ่ง/หิมะ/ทะเลทราย): ย้อมแท่นให้เข้มกว่าฉากหลัง
    // ไบโอมมืด (ถ้ำ/ภูเขาไฟ): ย้อมแท่นให้สว่างกว่า ไม่งั้นแท่นจมหายไปกับฉากหลังทั้งแมพ
    const dark = luma(this.biome.sky) < 0.34;
    const grass = shade(this.biome.ground, dark ? 1.4 : 0.82);
    const dirt = shade(this.biome.ground, dark ? 0.92 : 0.42);
    const edge = shade(this.biome.ground, dark ? 1.85 : 0.26);

    for (const f of this.map.footholds) {
      const h = f.ground ? VIEW_H - f.y + 60 : 24;

      // ตัวชน — สูง 24px พอที่ความเร็วตกสูงสุด (980px/s ที่ 60fps ≈ 16px/เฟรม) จะไม่ทะลุ
      //
      // ต้องตั้งขนาดด้วย setDisplaySize() + refreshBody() ไม่ใช่ body.setSize()
      // เพราะ StaticBody.refreshBody() อ่านขนาดจาก displayWidth/Height ของ GameObject
      // ถ้าไปตั้งที่ body โดยตรงแล้วเรียก refresh ทีหลัง ขนาดจะถูกเขียนทับกลับเป็น 4×4 (ขนาดเท็กซ์เจอร์ px)
      const body = this.platforms.create(f.x + f.w / 2, f.y + 12, 'px');
      body.setVisible(false).setDisplaySize(f.w, 24).refreshBody();
      body.setData('ground', !!f.ground);
      // ชนเฉพาะหน้าบน — ปิดด้านล่างและด้านข้าง ไม่งั้นจะติดขอบแท่นกลางอากาศ
      body.body.checkCollision.down = false;
      body.body.checkCollision.left = false;
      body.body.checkCollision.right = false;

      // ภาพ — ขอบเข้ม + แถบสว่างบนสุด ทำให้เห็นชัดว่า "เส้นนี้เหยียบได้"
      if (f.ground) {
        g.fillStyle(dirt, 1).fillRect(f.x, f.y + 12, f.w, h);
        g.fillStyle(grass, 1).fillRect(f.x, f.y, f.w, 14);
        g.fillStyle(edge, 1).fillRect(f.x, f.y + 14, f.w, 2);
      } else {
        g.fillStyle(0x000000, 0.16).fillRoundedRect(f.x + 3, f.y + 12, f.w, 20, 8);   // เงาทอดใต้แท่น
        g.fillStyle(dirt, 1).fillRoundedRect(f.x, f.y + 8, f.w, 22, 8);
        g.fillStyle(grass, 1).fillRoundedRect(f.x, f.y, f.w, 14, 7);
        g.lineStyle(2, edge, 0.9).strokeRoundedRect(f.x, f.y, f.w, 30, 8);
      }
      g.fillStyle(0xffffff, 0.18).fillRect(f.x + 5, f.y + 2, f.w - 10, 3);
    }
  }

  // ── เชือกกับบันได ──────────────────────────────────────────────────────────
  drawRopes() {
    const g = this.add.graphics().setDepth(90);
    for (const r of this.map.ropes) {
      if (r.kind === 'ladder') {
        g.lineStyle(4, 0x8a6a42, 1);
        g.lineBetween(r.x - 11, r.top, r.x - 11, r.bottom);
        g.lineBetween(r.x + 11, r.top, r.x + 11, r.bottom);
        g.lineStyle(4, 0xa88a5a, 1);
        for (let y = r.top + 12; y < r.bottom; y += 22) g.lineBetween(r.x - 11, y, r.x + 11, y);
      } else {
        g.lineStyle(4, 0xc9a86a, 1);
        g.lineBetween(r.x, r.top, r.x, r.bottom);
        g.fillStyle(0xa88a5a, 1);
        for (let y = r.top + 10; y < r.bottom; y += 18) g.fillCircle(r.x, y, 3.5);
      }
    }
  }

  // ── พอร์ทัลข้ามแมพ ─────────────────────────────────────────────────────────
  buildPortals() {
    this.portals = [];
    for (const p of this.map.portals) {
      const target = biomeOf(p.to);
      const img = this.add.image(p.x, p.y - 10, 'fx_portal').setOrigin(0.5, 1).setDepth(80).setTint(0x9ad8f0).setAlpha(0.8);
      this.tweens.add({ targets: img, alpha: 0.42, scaleX: 1.08, duration: 1100, yoyo: true, repeat: -1 });
      // พอร์ทัลอยู่ริมแมพ กล้องเลื่อนเลยขอบไม่ได้ ป้ายจึงต้องหุบเข้ามาไม่ให้ตกขอบจอ
      const labelX = Phaser.Math.Clamp(p.x, 150, this.map.width - 150);
      const label = this.add
        .text(labelX, p.y - 140, `${target.emoji} ${target.name}\nLv.${target.lvMin}–${target.lvMax}  ↑ เพื่อเข้า`, {
          fontFamily: FONT, fontSize: '13px', color: '#ffffff', align: 'center',
          stroke: '#000000', strokeThickness: 4,
        })
        .setOrigin(0.5, 1)
        .setDepth(81);
      this.portals.push({ ...p, img, label });
    }
  }

  // ── สปอว์นมอน ──────────────────────────────────────────────────────────────
  fillSpawners(instant = false) {
    const now = this.gameTime;
    for (const s of this.spawners) {
      s.alive = s.alive.filter((m) => m.alive);
      if (s.alive.length >= s.n) {
        s.nextAt = 0;
        continue;
      }

      // นับเวลารีสปอว์นจาก "ตอนที่มอนตาย" ไม่ใช่ตอนที่ตัวก่อนหน้าเกิด
      // ถ้านับจากตอนเกิด เวลาจะหมดไปนานแล้วตอนผู้เล่นมาถึง มอนจะโผล่ใหม่ทันทีที่ตาย
      if (!instant) {
        if (s.nextAt === 0) {
          s.nextAt = now + RESPAWN_MS;
          continue;
        }
        if (now < s.nextAt) continue;
      }

      const fh = this.footholdAt(s.x, s.y);
      if (!fh) continue;
      const lv = mobLevel(this.biome, s.y);
      const x = Phaser.Math.Clamp(
        s.x + Phaser.Math.Between(-70, 70), fh.x + 30, fh.x + fh.w - 30
      );
      const m = new Mob(this, x, s.y, s.species, lv, fh, this.mobGroup);
      m.sprite.setDepth(200);
      this.mobs.push(m);
      s.alive.push(m);
      s.nextAt = 0;              // ตัวถัดไป (ถ้ายังไม่ครบ n) เริ่มนับเวลาใหม่ → โผล่ทีละตัว
    }
  }

  footholdAt(x, y) {
    return this.map.footholds.find((f) => f.y === y && x >= f.x && x <= f.x + f.w);
  }

  // ── ลูปหลัก ────────────────────────────────────────────────────────────────
  update(_time, delta) {
    const dtMs = Math.min(delta, 50);           // จำกัดสเต็ป กันกระโดดข้ามเฟรมตอนสลับแท็บ
    this.gameTime += dtMs;
    const dt = dtMs / 1000;
    const now = this.gameTime;
    const input = this.controls.poll();
    const p = this.player;

    if (p.dead) {
      this.updateDeath(input);
      p.update(dt, { left: false, right: false, up: false, down: false }, this.map, now);
      this.hud.update();
      return;
    }

    p.update(dt, input, this.map, now);
    p.sprite.x = Phaser.Math.Clamp(p.sprite.x, 18, this.map.width - 18);

    // ตะแกรงกันตก — ถ้าหลุดใต้แมพ (บั๊กชน/แลก) ดึงกลับจุดเกิดแทนที่จะร่วงไม่สิ้นสุด
    if (p.y > VIEW_H + 160) {
      const sp = this.map.spawnPoints[this.spawnKey] || this.map.spawnPoints.left;
      p.sprite.setPosition(sp.x, sp.y - 40);
      p.body.setVelocity(0, 0);
    }

    // โจมตี: X = ตีธรรมดา, 1–4 = สกิล
    if (input.skillJustDown >= 0) this.doAttack(input.skillJustDown);
    else if (input.attackJustDown) this.doAttack(null);

    for (const m of this.mobs) m.update(dt);
    this.mobs = this.mobs.filter((m) => m.sprite.active || m.dying);

    for (const d of this.drops) d.update(now);
    this.drops = this.drops.filter((d) => d.alive);

    this.checkMobContact(now);
    if (input.pickupJustDown) this.pickup();
    if (input.up && p.state !== 'climb') this.tryPortal();

    this.fillSpawners();
    this.hud.update();

    if (now - this.lastSave > AUTOSAVE_MS) {
      this.lastSave = now;
      this.persist();
    }
  }

  // ── การฟัน ─────────────────────────────────────────────────────────────────
  doAttack(skillIndex) {
    const p = this.player;
    const res = p.tryAttack(skillIndex);
    if (!res) return;

    if (res.error === 'mp') {
      popText(this, p.x, p.y - 100, 'มานาไม่พอ 💧', '#8ecfff', 17);
      return;
    }

    const skill = res.skill;
    const color = skill ? skill.color : 0xffffff;
    slashFx(this, p.x, p.y, p.facing, color);

    // ตีรัวหลายครั้ง (hits จากข้อมูลสกิลเดิม) — ทยอยลงทีละ 90ms
    // ทำให้ตัวเลขดาเมจเด้งซ้อนกันเป็นชุด แบบที่เมเปิ้ลให้ความรู้สึก "รัว"
    for (let h = 0; h < res.hits; h++) {
      if (h === 0) this.applyHit(res, skill, color);
      else this.time.delayedCall(h * 90, () => this.scene.isActive() && this.applyHit(res, skill, color));
    }
  }

  applyHit(res, skill, color) {
    const p = this.player;
    if (p.dead) return;
    const rect = p.hitbox(res.reach, res.height);

    const targets = this.mobs
      .filter((m) => m.alive && Phaser.Geom.Rectangle.Overlaps(rect, m.sprite.getBounds()))
      .slice(0, MAX_TARGETS);

    for (const m of targets) {
      const { dmg, crit, weak } = rollDamage(p.stats, skill, m.stats);
      popDamage(this, m.x, m.y - m.size * 0.5, dmg, { crit, weak });
      sparks(this, m.x, m.y - m.size * 0.45, color, crit ? 12 : 7);
      if (m.takeHit(dmg, p.x)) this.onKill(m);
    }

    // ฟันโดนอะไรบ้าง — กล้องสะเทือนเบา ๆ ตอนคริเพื่อเพิ่มน้ำหนัก
    if (targets.length) this.cameras.main.shake(70, 0.0022);
  }

  onKill(mob) {
    const p = this.player;
    const ups = p.gainExp(mob.stats.exp);
    popText(this, mob.x, mob.y - mob.size - 8, `+${mob.stats.exp} EXP`, '#c8e88a', 15);

    if (ups > 0) {
      ring(this, p.x, p.y - 46, 0xffe28a, 3.2);
      popText(this, p.x, p.y - 120, `⬆️ LEVEL UP!  Lv.${p.level}`, '#ffd34a', 26);
      this.cameras.main.flash(180, 255, 240, 180);
    }

    for (const payload of mob.drops()) {
      this.drops.push(new Drop(this, mob.x, mob.y, payload));
    }
  }

  // ── มอนชนตัวผู้เล่น = เสียเลือด (เมเปิ้ลไม่มีท่าโจมตีของมอน ใช้การชนตัว) ────
  checkMobContact(now) {
    const p = this.player;
    const pr = new Phaser.Geom.Rectangle(p.x - 13, p.y - 84, 26, 84);
    for (const m of this.mobs) {
      if (!m.alive) continue;
      if (!Phaser.Geom.Rectangle.Overlaps(pr, m.sprite.getBounds())) continue;
      const dmg = mobDamage(m.stats, p.stats);
      if (p.takeHit(dmg, m.x, now)) {
        popDamage(this, p.x, p.y - 70, dmg, {});
        sparks(this, p.x, p.y - 44, 0xff6a5a, 6);
        if (p.dead) this.showDeath();
      }
      break;                     // โดนตัวเดียวต่อเฟรมพอ ไม่รวมดาเมจหลายตัวซ้อน
    }
  }

  // ── เก็บของ ────────────────────────────────────────────────────────────────
  pickup() {
    const p = this.player;
    let best = null;
    let bestD = PICKUP_RANGE;
    for (const d of this.drops) {
      const dist = Phaser.Math.Distance.Between(p.x, p.y - 20, d.x, d.y - 10);
      if (dist < bestD) { bestD = dist; best = d; }
    }
    if (!best) return;

    const payload = best.collect(p.x, p.y);
    if (payload.kind === 'gold') {
      p.gold += payload.amount;
      popText(this, p.x, p.y - 96, `+${payload.amount} 🪙`, '#ffd34a', 17);
    } else if (payload.kind === 'mat') {
      p.materials[payload.key] = (p.materials[payload.key] || 0) + payload.amount;
      popText(this, p.x, p.y - 96, `+${MATERIALS[payload.key].emoji} ${MATERIALS[payload.key].name}`, '#9ad8f0', 16);
    } else {
      p.inventory.push(payload.item);
      // สวมให้เลยถ้าช่องนั้นว่าง หรือของใหม่แรงกว่าของที่ใส่อยู่
      const cur = p.equipped[payload.item.slot];
      const score = (it) => (it.atk || 0) * 2 + (it.def || 0) * 2 + (it.hp || 0) * 0.4 + (it.crit || 0);
      if (!cur || score(payload.item) > score(cur)) {
        p.equipped[payload.item.slot] = payload.item;
        p.recalc();
        popText(this, p.x, p.y - 118, `สวมใส่ ${payload.item.name}`, '#b07ae0', 17);
      } else {
        popText(this, p.x, p.y - 96, `เก็บ ${payload.item.name}`, '#cfe0b8', 15);
      }
    }
  }

  // ── พอร์ทัล ────────────────────────────────────────────────────────────────
  tryPortal() {
    const p = this.player;
    for (const portal of this.portals) {
      if (Math.abs(p.x - portal.x) < 62 && Math.abs(p.y - portal.y) < 100) {
        this.persist();
        this.cameras.main.fadeOut(180, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.restart({ mapId: portal.to, spawn: portal.spawn, carry: p.toSave() });
        });
        return;
      }
    }
  }

  // ── ตาย / ฟื้น ─────────────────────────────────────────────────────────────
  showDeath() {
    if (this.deathUi) return;
    const cam = this.cameras.main;
    const g = this.add.graphics().setScrollFactor(0).setDepth(1200);
    g.fillStyle(0x000000, 0.55).fillRect(0, 0, VIEW_W, VIEW_H);
    const t = this.add
      .text(VIEW_W / 2, VIEW_H / 2 - 20, '💀 น้องเชอร์รี่หมดแรง...', {
        fontFamily: FONT, fontSize: '34px', fontStyle: '900', color: '#ffffff',
        stroke: '#000000', strokeThickness: 6,
      })
      .setOrigin(0.5).setScrollFactor(0).setDepth(1201);
    const t2 = this.add
      .text(VIEW_W / 2, VIEW_H / 2 + 34, 'กด Space เพื่อฟื้น (เลือดครึ่งหนึ่ง)', {
        fontFamily: FONT, fontSize: '18px', color: '#ffe28a',
      })
      .setOrigin(0.5).setScrollFactor(0).setDepth(1201);
    this.deathUi = [g, t, t2];
    cam.stopFollow();
    this.persist();
  }

  updateDeath(input) {
    if (!input.jumpJustDown) return;
    for (const o of this.deathUi || []) o.destroy();
    this.deathUi = null;

    const sp = this.map.spawnPoints[this.spawnKey] || this.map.spawnPoints.left;
    this.player.sprite.setPosition(sp.x, sp.y);
    this.player.revive();
    this.cameras.main.startFollow(this.player.sprite, false, 0.14, 0.14, 0, 120);
  }

  persist() {
    writeSave({ mapId: this.mapId, player: this.player.toSave() });
  }
}

