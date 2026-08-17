// ═══════════════════════════════════════════════════════════════════════════
// drop.js — ของที่ตกอยู่บนพื้น
//
// เมเปิ้ลไม่เก็บของอัตโนมัติ ของเด้งออกจากตัวมอนแล้วตกค้างบนแท่น
// ผู้เล่นต้องเดินไปทับแล้วกดปุ่มเก็บ — จังหวะ "ตีจบแล้วเดินเก็บ" เป็นส่วนหนึ่งของเกม
//
// ของหายเองใน 45 วินาที (กะพริบเตือน 8 วินาทีสุดท้าย) กันของท่วมแมพตอนฟาร์มนาน ๆ
// ═══════════════════════════════════════════════════════════════════════════

import { MATERIALS } from '../../shared/gamedata.js';
import { rarityColor, itemLabel } from './stats.js';
import { FONT } from './fx.js';

const LIFETIME = 45000;
const WARN_AT = 8000;
export const PICKUP_RANGE = 58;

export class Drop {
  constructor(scene, x, y, payload) {
    this.scene = scene;
    this.payload = payload;
    this.picked = false;
    this.bornAt = scene.gameTime;

    let texture = 'fx_bag';
    let tint = 0xffffff;
    let label = '';

    if (payload.kind === 'gold') {
      texture = 'ico_coin';
      label = `${payload.amount} 🪙`;
    } else if (payload.kind === 'mat') {
      const m = MATERIALS[payload.key];
      texture = `mat_${payload.key}`;
      this.ensureEmoji(texture, m.emoji);
      label = m.name;
    } else {
      tint = Phaser.Display.Color.HexStringToColor(rarityColor(payload.item.rarity)).color;
      label = itemLabel(payload.item);
    }

    const sp = scene.physics.add.sprite(x, y - 40, texture).setOrigin(0.5, 1).setDepth(300);
    if (payload.kind === 'gold' || payload.kind === 'mat') sp.setScale(0.52);
    else sp.setTint(tint);
    sp.body.setSize(30, 26, true);
    sp.body.setGravityY(1500);
    sp.body.setBounce(0.34, 0.34);
    sp.body.setDragX(180);
    // เด้งกระจายออกจากจุดที่มอนตาย ไม่ให้ของกองซ้อนกันเป็นตั้ง
    sp.body.setVelocity(Phaser.Math.Between(-110, 110), Phaser.Math.Between(-360, -230));
    this.sprite = sp;

    // ของต้องตกค้างบนแท่นที่มอนตาย ไม่ร่วงทะลุลงพื้นล่างสุด
    if (scene.platforms) scene.physics.add.collider(sp, scene.platforms);

    this.text = scene.add
      .text(x, y - 44, label, {
        fontFamily: FONT, fontSize: '12px', fontStyle: '700',
        color: payload.kind === 'item' ? rarityColor(payload.item.rarity) : '#ffe9a0',
        stroke: '#000000', strokeThickness: 3,
      })
      .setOrigin(0.5, 1)
      .setDepth(301);
  }

  // สร้างเท็กซ์เจอร์อีโมจิของวัตถุดิบตามต้องการ (ครั้งแรกที่ดรอปชนิดนั้น)
  ensureEmoji(key, emoji) {
    const s = this.scene;
    if (s.textures.exists(key)) return;
    const size = 64;
    const canvas = s.textures.createCanvas(key, size, size);
    const ctx = canvas.getContext();
    ctx.font = `${Math.floor(size * 0.78)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2 + 2);
    canvas.refresh();
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  get alive() { return !this.picked && this.sprite.active; }

  update(now) {
    if (!this.alive) return;
    this.text.setPosition(this.sprite.x, this.sprite.y - this.sprite.displayHeight - 4);

    const age = now - this.bornAt;
    if (age > LIFETIME) return this.destroy();
    if (age > LIFETIME - WARN_AT) {
      const blink = Math.sin(age / 90) > 0 ? 0.35 : 1;
      this.sprite.setAlpha(blink);
      this.text.setAlpha(blink);
    }
  }

  // เอฟเฟกต์ตอนเก็บ — ดูดขึ้นหาผู้เล่น
  collect(toX, toY) {
    this.picked = true;
    this.sprite.body.setEnable(false);
    this.scene.tweens.add({
      targets: [this.sprite, this.text],
      x: toX,
      y: toY - 40,
      alpha: 0,
      scale: 0.3,
      duration: 190,
      ease: 'Quad.easeIn',
      onComplete: () => this.destroy(),
    });
    return this.payload;
  }

  destroy() {
    this.picked = true;
    this.sprite.destroy();
    this.text.destroy();
  }
}
