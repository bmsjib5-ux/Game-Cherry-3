// ═══════════════════════════════════════════════════════════════════════════
// mob.js — มอนสเตอร์: เดินวนบนแท่นของตัวเอง กระเด็นตอนโดนตี ดรอปของตอนตาย
//
// มอนแต่ละตัว "ผูก" กับ foothold ที่มันเกิด แล้วเดินกลับไปกลับมาในช่วงนั้น
// ไม่มีการไล่ล่าข้ามแท่น เพราะเมเปิ้ลตั้งใจให้ผู้เล่นเลือกได้ว่าจะลงไปตีหรือไม่
// ตัวที่ลอยได้ (FLOATY ในข้อมูลกลาง) ปิดแรงโน้มถ่วงแล้วโยกขึ้นลงเป็นคลื่นไซน์
// ═══════════════════════════════════════════════════════════════════════════

import { mobStats, rollDrops } from './stats.js';
import { mobSize } from './textures.js';

const HP_BAR_W = 46;

export class Mob {
  // group = กลุ่ม physics ที่ใช้ทำ collider กับ foothold
  //
  // ต้องเพิ่มสไปรต์เข้ากลุ่ม "ก่อน" ตั้งค่า body เพราะ Phaser.Physics.Arcade.Group
  // มีค่าตั้งต้นของตัวเอง (gravityY: 0, allowGravity: true) ที่จะถูกยัดใส่ body
  // ทุกครั้งที่มีลูกเข้ากลุ่ม ถ้าตั้งค่าก่อนแล้วเพิ่มเข้ากลุ่มทีหลัง แรงโน้มถ่วงที่ตั้งไว้
  // จะถูกล้างเป็น 0 มอนทุกตัวเลยลอยนิ่งอยู่ที่จุดเกิด และถ้าถูกตีกระเด็นขึ้นก็ไม่ตกกลับ
  constructor(scene, x, y, speciesKey, lv, foothold, group = null) {
    this.scene = scene;
    this.stats = mobStats(speciesKey, lv);
    this.hp = this.stats.hpMax;
    this.foothold = foothold;
    this.dying = false;

    // เท็กซ์เจอร์ถูกสร้างมาที่ขนาดสุดท้ายแล้ว จึงไม่ setScale() — กล่องชนตรงกับภาพ 1:1
    const size = mobSize(this.stats.tier);
    const sp = scene.physics.add.sprite(x, y, `mob_${speciesKey}`).setOrigin(0.5, 1);
    if (group) group.add(sp);
    const bw = Math.round(size * 0.6);
    const bh = Math.round(size * 0.72);
    sp.body.setSize(bw, bh, false);
    sp.body.setOffset(Math.round((size - bw) / 2), size - bh);
    this.size = size;
    this.sprite = sp;
    sp.setDataEnabled().data.set('mob', this);

    this.hover = this.stats.floaty;
    if (this.hover) {
      sp.body.setAllowGravity(false);
      this.hoverBase = y - 46;
      this.hoverT = Math.random() * Math.PI * 2;
    } else {
      sp.body.setGravityY(1900);
    }

    // เดินวน — ตัวเล็กไวกว่าตัวใหญ่เล็กน้อย
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.speed = 42 + (5 - this.stats.tier) * 7;
    this.pauseT = 0;

    // แถบเลือด — โชว์เฉพาะตอนเลือดพร่อง ไม่ให้รกจอ
    this.bar = scene.add.graphics().setVisible(false);

    this.label = scene.add
      .text(x, y - size - 14, `Lv.${lv} ${this.stats.name}`, {
        fontFamily: 'inherit', fontSize: '13px', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3,
      })
      .setOrigin(0.5, 1)
      .setAlpha(0.82);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  get alive() { return !this.dying && this.hp > 0; }

  update(dt) {
    if (this.dying) return;
    const sp = this.sprite;

    if (this.hover) {
      this.hoverT += dt * 2.1;
      sp.y = this.hoverBase + Math.sin(this.hoverT) * 16;
    }

    // หยุดยืนพักเป็นช่วง ๆ ให้ดูมีชีวิตกว่าการเดินไม่หยุด
    this.pauseT -= dt;
    if (this.pauseT <= -3.2) this.pauseT = 0.9 + Math.random() * 0.8;

    if (this.pauseT > 0) {
      sp.body.setVelocityX(0);
    } else {
      const fh = this.foothold;
      const lo = fh.x + 24;
      const hi = fh.x + fh.w - 24;
      if (sp.x <= lo) this.dir = 1;
      else if (sp.x >= hi) this.dir = -1;
      sp.body.setVelocityX(this.dir * this.speed);
      sp.setFlipX(this.dir < 0);
    }

    // ล็อกไม่ให้หลุดออกนอกแท่นของตัวเอง — แรงกระเด็นตอนโดนตีผลักมอนตกชั้นล่างได้
    // ถ้าปล่อยไว้มอนทั้งแมพจะไหลมากองรวมกันที่พื้นล่างสุด
    const fh = this.foothold;
    sp.x = Phaser.Math.Clamp(sp.x, fh.x + 14, fh.x + fh.w - 14);

    this.label.setPosition(sp.x, sp.y - this.size - 14);
    if (this.bar.visible) this.drawBar();
  }

  drawBar() {
    const y = this.sprite.y - this.size - 10;
    const x = this.sprite.x - HP_BAR_W / 2;
    const pct = Math.max(0, this.hp / this.stats.hpMax);
    this.bar.clear();
    this.bar.fillStyle(0x000000, 0.55).fillRect(x - 1, y - 1, HP_BAR_W + 2, 6);
    this.bar.fillStyle(pct > 0.5 ? 0x6ad06a : pct > 0.22 ? 0xf5c542 : 0xe8552e, 1);
    this.bar.fillRect(x, y, HP_BAR_W * pct, 4);
  }

  // คืน true ถ้าตายจากหมัดนี้
  takeHit(dmg, fromX) {
    if (this.dying) return false;
    this.hp -= dmg;
    this.bar.setVisible(true);
    this.drawBar();

    // กระเด็นถอย + วูบขาว — ฟีดแบ็กว่าโดนจริง
    const away = this.x < fromX ? -1 : 1;
    this.sprite.body.setVelocityX(away * 150);
    if (!this.hover) this.sprite.body.setVelocityY(-120);
    this.sprite.setTintFill(0xffffff);
    this.scene.time.delayedCall(70, () => {
      if (this.sprite.active) this.sprite.clearTint();
    });

    if (this.hp <= 0) {
      this.die(away);
      return true;
    }
    return false;
  }

  die(away) {
    this.dying = true;
    this.sprite.body.setEnable(false);
    this.bar.destroy();
    this.label.destroy();

    // ลอยกระเด็นแล้วจางหาย
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x + away * 40,
      y: this.sprite.y - 26,
      alpha: 0,
      angle: away * 90,
      scale: this.sprite.scale * 0.7,
      duration: 380,
      ease: 'Quad.easeOut',
      onComplete: () => this.sprite.destroy(),
    });
  }

  drops(isBoss = false) {
    return rollDrops(this.stats, isBoss);
  }

  destroy() {
    this.sprite.destroy();
    this.bar.destroy();
    this.label.destroy();
  }
}
