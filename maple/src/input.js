// ═══════════════════════════════════════════════════════════════════════════
// input.js — รวมคีย์บอร์ดกับปุ่มจอสัมผัสให้เป็นสถานะอินพุตชุดเดียว
//
// ตัวเกม (player.js) ไม่รู้จักคีย์บอร์ดหรือนิ้วเลย รู้แค่ { left, right, jump, ... }
// ทำให้เพิ่มจอย/gamepad ทีหลังได้โดยไม่ต้องแก้ลอจิกการเคลื่อนที่
//
// ปุ่มสกิล 1–4 ไม่ได้สร้างซ้ำที่นี่ — ใช้ช่องสกิลใน HUD เป็นปุ่มกดเลย
// ═══════════════════════════════════════════════════════════════════════════

import { FONT } from './fx.js';
import { VIEW_W, VIEW_H } from './maps.js';

export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0);

export class Input {
  constructor(scene) {
    this.scene = scene;
    const kb = scene.input.keyboard;

    this.keys = kb.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', down: 'DOWN',
      a: 'A', d: 'D', w: 'W', s: 'S',
      space: 'SPACE', x: 'X', z: 'Z',
      one: 'ONE', two: 'TWO', three: 'THREE', four: 'FOUR',
    });
    // กัน Space/ลูกศรเลื่อนหน้าเว็บระหว่างเล่น
    kb.addCapture(['SPACE', 'UP', 'DOWN', 'LEFT', 'RIGHT']);

    scene.input.addPointer(3);          // รองรับหลายนิ้วพร้อมกัน

    this.touch = { left: false, right: false, up: false, down: false, jump: false, attack: false, pickup: false };
    this.touchQueue = { jump: false, attack: false, pickup: false };
    this.skillQueue = [];

    this.state = {
      left: false, right: false, up: false, down: false,
      jump: false, jumpJustDown: false,
      attackJustDown: false, pickupJustDown: false,
      skillJustDown: -1,
    };

    if (isTouchDevice()) this.buildTouchPad();
  }

  // ── ปุ่มจอสัมผัส ────────────────────────────────────────────────────────────
  buildTouchPad() {
    const s = this.scene;
    const mk = (x, y, r, label, onDown, onUp) => {
      const c = s.add.circle(x, y, r, 0x0a1208, 0.4).setScrollFactor(0).setDepth(1100);
      c.setStrokeStyle(2, 0xd8e8b8, 0.75);
      const t = s.add
        .text(x, y, label, { fontFamily: FONT, fontSize: `${Math.round(r * 0.78)}px`, color: '#ffffff' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(1101);
      c.setInteractive({ useHandCursor: true });
      c.on('pointerdown', () => { c.setFillStyle(0xd8e8b8, 0.35); onDown(); });
      const up = () => { c.setFillStyle(0x0a1208, 0.4); if (onUp) onUp(); };
      c.on('pointerup', up);
      c.on('pointerout', up);
      c.on('pointerupoutside', up);
      return { c, t };
    };

    // แป้นทิศทางซ้ายมือ
    const cx = 130;
    const cy = VIEW_H - 150;
    mk(cx - 74, cy, 40, '◀', () => (this.touch.left = true), () => (this.touch.left = false));
    mk(cx + 74, cy, 40, '▶', () => (this.touch.right = true), () => (this.touch.right = false));
    mk(cx, cy - 74, 38, '▲', () => (this.touch.up = true), () => (this.touch.up = false));
    mk(cx, cy + 66, 38, '▼', () => (this.touch.down = true), () => (this.touch.down = false));

    // ปุ่มขวามือ
    mk(VIEW_W - 92, VIEW_H - 108, 52, '⤒', () => { this.touch.jump = true; this.touchQueue.jump = true; }, () => (this.touch.jump = false));
    mk(VIEW_W - 206, VIEW_H - 148, 46, '⚔', () => { this.touchQueue.attack = true; });
    mk(VIEW_W - 108, VIEW_H - 226, 34, '🎁', () => { this.touchQueue.pickup = true; });
  }

  // เรียกจาก HUD เมื่อแตะช่องสกิล
  queueSkill(i) {
    this.skillQueue.push(i);
  }

  // ── อ่านสถานะรวมต่อเฟรม ─────────────────────────────────────────────────────
  poll() {
    const k = this.keys;
    const st = this.state;
    const t = this.touch;

    st.left = k.left.isDown || k.a.isDown || t.left;
    st.right = k.right.isDown || k.d.isDown || t.right;
    st.up = k.up.isDown || k.w.isDown || t.up;
    st.down = k.down.isDown || k.s.isDown || t.down;

    const jumpKey = Phaser.Input.Keyboard.JustDown(k.space);
    st.jump = k.space.isDown || t.jump;
    st.jumpJustDown = jumpKey || this.touchQueue.jump;

    st.attackJustDown = Phaser.Input.Keyboard.JustDown(k.x) || this.touchQueue.attack;
    st.pickupJustDown = Phaser.Input.Keyboard.JustDown(k.z) || this.touchQueue.pickup;

    st.skillJustDown = -1;
    if (Phaser.Input.Keyboard.JustDown(k.one)) st.skillJustDown = 0;
    else if (Phaser.Input.Keyboard.JustDown(k.two)) st.skillJustDown = 1;
    else if (Phaser.Input.Keyboard.JustDown(k.three)) st.skillJustDown = 2;
    else if (Phaser.Input.Keyboard.JustDown(k.four)) st.skillJustDown = 3;
    else if (this.skillQueue.length) st.skillJustDown = this.skillQueue.shift();

    // ล้างคิวการแตะ — การแตะนับเป็น "กดครั้งเดียว" หนึ่งเฟรมเท่านั้น
    this.touchQueue.jump = false;
    this.touchQueue.attack = false;
    this.touchQueue.pickup = false;

    return st;
  }
}
