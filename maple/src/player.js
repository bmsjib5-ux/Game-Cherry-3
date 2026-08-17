// ═══════════════════════════════════════════════════════════════════════════
// player.js — การเคลื่อนที่ของผู้เล่น = หัวใจของเกมแนวเมเปิ้ล
//
// สี่อย่างที่ต้องถูกไม่งั้นไม่ใช่เมเปิ้ล:
//   1. กระโดดทะลุแท่นจากใต้ได้ แต่ยืนบนแท่นได้ (one-way foothold)
//   2. กด ↓ + กระโดด = ทิ้งตัวลงชั้นล่าง
//   3. เชือก/บันไดไต่ขึ้นลง กระโดดออกจากเชือกได้กลางทาง
//   4. กระโดดโค้งลอย ๆ ควบคุมทิศกลางอากาศได้ ไม่มีความเฉื่อยหน่วง
//
// กล่องชน (arcade body) แยกจากภาพตัวละคร (Rig) — ภาพเหวี่ยงแขนขาได้อิสระ
// โดยขนาดชนไม่เปลี่ยน ป้องกันบั๊กติดขอบแท่นตอนเล่นท่าฟัน
// ═══════════════════════════════════════════════════════════════════════════

import { Rig } from './rig.js';
import { playerStats, withGear, skillsFor, expToNext, MAX_LEVEL } from './stats.js';

export const GRAVITY = 1900;
const MAX_FALL = 980;
const CLIMB_SPD = 190;
const DROP_SAFETY_MS = 1500;      // กันค้าง: ยกเลิกสถานะทิ้งตัวถ้าเกินเวลานี้ไม่ว่าอะไรจะเกิดขึ้น
const IFRAME_MS = 700;            // อมตะชั่วคราวหลังโดนตี
const ROPE_GRAB_W = 30;           // ความกว้างที่ถือว่า "จับเชือกติด"

export class Player {
  constructor(scene, x, y, cls, save = {}) {
    this.scene = scene;
    this.cls = cls;

    this.level = save.level || 1;
    this.exp = save.exp || 0;
    this.gold = save.gold || 0;
    this.equipped = save.equipped || {};
    this.inventory = save.inventory || [];
    this.materials = save.materials || {};
    this.skills = skillsFor(cls);

    this.recalc();
    this.hp = save.hp ?? this.stats.hpMax;
    this.mp = save.mp ?? this.stats.mpMax;

    // กล่องชน — จุดกำเนิดปลายเท้า ทำให้วางบน foothold ได้ตรง ๆ
    this.sprite = scene.physics.add.sprite(x, y, 'hit_player').setOrigin(0.5, 1).setVisible(false);
    this.sprite.body.setGravityY(GRAVITY);
    this.sprite.body.setMaxVelocityY(MAX_FALL);
    this.sprite.setDataEnabled().data.set('player', this);

    this.rig = new Rig(scene, x, y, cls);

    this.state = 'idle';          // idle | walk | jump | climb | dead
    this.rope = null;             // เชือกที่กำลังไต่อยู่
    // ระดับ y ของแท่นที่กำลังทิ้งตัวลงมา (null = ไม่ได้ทิ้งตัว)
    // ใช้ระดับแท่นแทนตัวจับเวลา เพราะจับเวลาแล้วเจอปัญหาสองด้าน:
    // สั้นไปการชนกลับมาทำงานตอนตัวยังคาบเกี่ยวแท่น → ถูกดันกลับขึ้นไป
    // ยาวไปก็ร่วงทะลุแท่นชั้นถัดไปด้วย เพราะชั้นห่างกันแค่ 140px
    this.dropFrom = null;
    this.dropSafetyUntil = 0;
    this.iframeUntil = 0;
    this.attackCd = 0;
    this.dead = false;
  }

  // เรียกทุกครั้งที่เลเวลหรือของสวมใส่เปลี่ยน
  recalc() {
    const base = playerStats(this.cls, this.level);
    this.stats = withGear(base, this.equipped);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }         // = ปลายเท้า
  get body() { return this.sprite.body; }
  get facing() { return this.rig.facing; }

  // ── กรอบการโจมตี: สี่เหลี่ยมด้านหน้าตัว กินมอนหลายตัวพร้อมกัน ─────────────
  // เมเปิ้ลไม่ล็อกเป้า สกิลกินพื้นที่ — ตรงนี้คือสิ่งที่ทำให้ฟาร์มมอนสนุก
  hitbox(reach = 118, height = 96) {
    const dir = this.facing;
    const x = dir > 0 ? this.x + 6 : this.x - reach - 6;
    return new Phaser.Geom.Rectangle(x, this.y - height, reach, height);
  }

  // ── อินพุตหลัก ─────────────────────────────────────────────────────────────
  update(dt, input, map, now) {
    if (this.dead) {
      this.rig.setState('idle');
      this.rig.update(dt);
      return;
    }

    this.attackCd = Math.max(0, this.attackCd - dt);
    this.mp = Math.min(this.stats.mpMax, this.mp + this.stats.mpRegen * dt);

    if (this.state === 'climb') this.updateClimb(dt, input, map);
    else this.updateGround(dt, input, map, now);

    // ภาพตัวละครตามกล่องชน
    this.rig.setPosition(this.x, this.y);
    this.rig.update(dt);
  }

  updateGround(dt, input, map, now) {
    const b = this.body;
    const onFloor = b.blocked.down || b.touching.down;

    // เลิกสถานะทิ้งตัวเมื่อร่วงพ้นแท่นเดิมแล้วจริง ๆ — วัดจากตำแหน่ง ไม่ใช่เวลา
    if (this.dropFrom !== null) {
      const bodyCleared = this.y - 84 > this.dropFrom + 26;   // ตัวทั้งตัวต่ำกว่าแท่นแล้ว
      const landedBelow = onFloor && this.y > this.dropFrom + 4;
      if (bodyCleared || landedBelow || now > this.dropSafetyUntil) this.dropFrom = null;
    }

    // เดิน — ตอบสนองทันที ไม่มีการเร่ง/หน่วง (สแนปแบบเมเปิ้ล)
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    b.setVelocityX(dir * this.stats.spd);
    if (dir !== 0) this.rig.setFacing(dir);

    // กด ↓ + กระโดด = ทิ้งตัวลงชั้นล่าง (ห้ามทิ้งตัวผ่านพื้นดินล่างสุด)
    if (input.jumpJustDown && input.down && onFloor && !this.onSolidGround(map)) {
      this.dropFrom = this.y;
      this.dropSafetyUntil = now + DROP_SAFETY_MS;
      b.setVelocityY(60);
    } else if (input.jumpJustDown && onFloor) {
      b.setVelocityY(-this.stats.jump);
    }

    // จับเชือก
    const rope = this.ropeAt(map);
    if (rope) {
      const feet = this.y;
      if (input.up && rope.top < feet - 12) return this.grabRope(rope, feet);
      // ยืนบนหัวเชือกแล้วกด ↓ = ไต่ลง
      //
      // แต่ถ้าเพิ่งกด ↓ + กระโดด (dropFrom ถูกตั้งไว้) ต้องทิ้งตัวลงเท่านั้น ไม่ใช่จับเชือก
      // ไม่งั้นแท่นที่มีหัวเชือกอยู่จะทิ้งตัวลงไม่ได้เลย — กดแล้วไปเกาะเชือกไต่ลงช้า ๆ ทุกครั้ง
      if (input.down && onFloor && this.dropFrom === null &&
          Math.abs(feet - rope.top) < 14 && rope.bottom > feet + 20) {
        return this.grabRope(rope, feet + 10);
      }
    }

    this.state = onFloor ? (dir !== 0 ? 'walk' : 'idle') : 'jump';
    this.rig.setState(this.state);
  }

  grabRope(rope, feetY) {
    this.state = 'climb';
    this.rope = rope;
    this.body.setAllowGravity(false);
    this.body.setVelocity(0, 0);
    this.sprite.x = rope.x;
    this.sprite.y = Math.min(rope.bottom, Math.max(rope.top, feetY));
    this.rig.setState('climb');
  }

  updateClimb(dt, input, map) {
    const r = this.rope;
    this.sprite.x = r.x;

    const dir = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    this.sprite.y += dir * CLIMB_SPD * dt;
    this.rig.setState(dir !== 0 ? 'climb' : 'idle');

    // กระโดดออกจากเชือก — เด้งออกด้านข้างเล็กน้อยให้เกาะแท่นข้าง ๆ ได้
    if (input.jumpJustDown) {
      const away = input.left ? -1 : input.right ? 1 : 0;
      this.releaseRope();
      this.body.setVelocityY(-this.stats.jump * 0.78);
      this.body.setVelocityX(away * this.stats.spd * 0.9);
      if (away !== 0) this.rig.setFacing(away);
      return;
    }

    // ไต่ถึงยอด → ขึ้นไปยืนบนแท่นด้านบน
    if (this.sprite.y <= r.top) {
      this.sprite.y = r.top;
      this.releaseRope();
      return;
    }
    // ไต่ถึงพื้นล่าง → ปล่อยลงยืน
    if (this.sprite.y >= r.bottom) {
      this.sprite.y = r.bottom;
      this.releaseRope();
    }
  }

  releaseRope() {
    this.rope = null;
    this.state = 'idle';
    this.body.setAllowGravity(true);
  }

  // เชือกที่อยู่ในระยะจับ และช่วงความสูงของมันครอบตัวเราอยู่
  ropeAt(map) {
    const feet = this.y;
    return map.ropes.find(
      (r) => Math.abs(r.x - this.x) < ROPE_GRAB_W && feet >= r.top - 6 && feet <= r.bottom + 6
    );
  }

  // ยืนบนพื้นดินล่างสุดอยู่ไหม (ถ้าใช่ ห้ามทิ้งตัวลง)
  onSolidGround(map) {
    const ground = map.footholds.find((f) => f.ground);
    return ground && Math.abs(this.y - ground.y) < 6;
  }

  // ── โจมตี ──────────────────────────────────────────────────────────────────
  // คืนข้อมูลการฟันให้ฉากไปคิดดาเมจ หรือ null ถ้าฟันไม่ได้ (คูลดาวน์/มานาไม่พอ)
  tryAttack(skillIndex) {
    if (this.dead || this.attackCd > 0 || this.state === 'climb') return null;

    const skill = skillIndex === null ? null : this.skills[skillIndex];
    if (skill && this.mp < skill.cost) return { error: 'mp', skill };

    if (skill) this.mp -= skill.cost;
    const hits = skill?.hits || 1;
    const dur = skill ? 0.3 : 0.22;
    this.attackCd = dur + 0.06;
    this.rig.swing(dur);

    return { skill, hits, reach: skill ? 150 : 118, height: skill ? 110 : 96 };
  }

  // ── โดนตี ──────────────────────────────────────────────────────────────────
  takeHit(dmg, fromX, now) {
    if (this.dead || now < this.iframeUntil) return false;
    this.iframeUntil = now + IFRAME_MS;
    this.hp -= dmg;

    // ผลักถอย — เมเปิ้ลจะเด้งกระเด็นเสมอ ทำให้รู้สึกว่าโดนจริง
    if (this.state === 'climb') this.releaseRope();
    const away = this.x < fromX ? -1 : 1;
    this.body.setVelocity(away * 230, -300);

    // กะพริบให้เห็นว่าอยู่ในช่วงอมตะ
    this.scene.tweens.add({
      targets: this.rig.container,
      alpha: 0.35,
      duration: 90,
      yoyo: true,
      repeat: 3,
      onComplete: () => { this.rig.container.alpha = 1; },
    });

    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
      this.state = 'dead';
      this.body.setVelocity(0, 0);
      this.rig.container.setAngle(90);
      this.rig.container.setAlpha(0.6);
    }
    return true;
  }

  revive() {
    this.dead = false;
    this.state = 'idle';
    this.hp = Math.round(this.stats.hpMax * 0.5);
    this.mp = Math.round(this.stats.mpMax * 0.5);
    this.iframeUntil = this.scene.gameTime + 1600;
    this.rig.container.setAngle(0);
    this.rig.container.setAlpha(1);
  }

  // ── ค่าประสบการณ์ ──────────────────────────────────────────────────────────
  // คืนจำนวนเลเวลที่ขึ้น เพื่อให้ฉากเล่นเอฟเฟกต์ได้
  gainExp(amount) {
    if (this.level >= MAX_LEVEL) return 0;
    this.exp += amount;
    let ups = 0;
    while (this.level < MAX_LEVEL && this.exp >= expToNext(this.level)) {
      this.exp -= expToNext(this.level);
      this.level++;
      ups++;
    }
    if (ups) {
      const beforeMax = this.stats.hpMax;
      this.recalc();
      this.hp += this.stats.hpMax - beforeMax;   // เลเวลอัปแล้วเลือดที่เพิ่มมาเต็มเลย
      this.mp = this.stats.mpMax;
    }
    return ups;
  }

  toSave() {
    return {
      cls: this.cls,
      level: this.level,
      exp: this.exp,
      gold: this.gold,
      hp: this.hp,
      mp: this.mp,
      equipped: this.equipped,
      inventory: this.inventory,
      materials: this.materials,
    };
  }
}
