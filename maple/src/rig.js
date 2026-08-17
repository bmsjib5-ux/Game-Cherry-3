// ═══════════════════════════════════════════════════════════════════════════
// rig.js — ตัวละครแบบข้อต่อ (จุดหมุนสะโพก/ไหล่) ไม่ใช้ sprite sheet
//
// ข้อดีคือท่าทางคำนวณสด ๆ ทำให้เพิ่มท่าใหม่เขียนแค่ฟังก์ชัน ไม่ต้องวาดเฟรมเพิ่ม
// และย้อมสีตามอาชีพจาก CLASS_OUTFIT ได้ทั้ง 8 อาชีพด้วยชิ้นส่วนชุดเดียว
//
// พิกัดภายใน container: y = 0 คือ "ปลายเท้า" ทุกชิ้นส่วนจึงมี y เป็นลบ
// ทำให้วางตัวละครบน foothold ได้ตรง ๆ โดยไม่ต้องคิดออฟเซ็ตกลางตัว
// ═══════════════════════════════════════════════════════════════════════════

import { CLASSES, CLASS_OUTFIT } from '../../shared/gamedata.js';
import { WEAPON_SHAPE } from './textures.js';
import { shade } from './color.js';

const HIP_Y = -26;
const SHOULDER_Y = -54;
const SKIN = 0xf7d3b3;
const HAIR = 0x33241d;

export class Rig {
  constructor(scene, x, y, cls) {
    this.scene = scene;
    this.cls = cls;
    const look = CLASS_OUTFIT[cls] || CLASS_OUTFIT.warrior;
    const meta = CLASSES[cls] || CLASSES.warrior;
    this.look = look;

    const c = scene.add.container(x, y);
    this.container = c;

    // ── แขนหลัง (อยู่หลังลำตัว) ──
    this.backArm = scene.add.container(-7, SHOULDER_Y);
    const backLimb = scene.add.image(0, 0, 'part_limb').setOrigin(0.5, 0).setTint(shade(look.shirt, 0.72));
    this.backArm.add(backLimb);

    // ── ขา ──
    this.legs = [];
    for (const side of [-1, 1]) {
      const leg = scene.add.container(side * 6, HIP_Y);
      const limb = scene.add.image(0, 0, 'part_limb').setOrigin(0.5, 0).setTint(look.pants);
      const foot = scene.add.image(0, 23, 'part_foot').setOrigin(0.5, 0).setTint(shade(look.pants, 0.6));
      leg.add([limb, foot]);
      this.legs.push(leg);
    }

    // ── ผ้าคลุม/เครื่องประดับหลัง ──
    this.cape = null;
    if (look.acc === 'cape' || look.acc === 'robe' || look.acc === 'kimono') {
      this.cape = scene.add.image(0, SHOULDER_Y - 4, 'part_cape').setOrigin(0.5, 0).setTint(look.accColor).setAlpha(0.95);
    }

    // ── ลำตัว + แถบขอบสี (trim) ──
    this.torso = scene.add.image(0, -42, 'part_torso').setTint(look.shirt);
    this.trim = scene.add.image(0, -30, 'part_torso').setTint(look.trim).setScale(1, 0.22).setAlpha(0.95);

    // ── หัว ──
    this.head = scene.add.image(0, -74, 'part_head').setTint(SKIN);
    this.hair = scene.add.image(0, -86, 'part_hair').setTint(look.acc === 'hood' || look.acc === 'hoodie' ? look.accColor : HAIR);
    this.eyeL = scene.add.image(-6, -73, 'px').setTint(0x2a2119).setScale(0.85, 1.5);
    this.eyeR = scene.add.image(5, -73, 'px').setTint(0x2a2119).setScale(0.85, 1.5);

    // ── แขนหน้า + อาวุธ (อาวุธเป็นลูกของแขน จึงหมุนตามไหล่เองโดยไม่ต้องคำนวณซ้ำ) ──
    this.frontArm = scene.add.container(4, SHOULDER_Y);
    const frontLimb = scene.add.image(0, 0, 'part_limb').setOrigin(0.5, 0).setTint(look.shirt);
    this.weapon = scene.add.image(2, 20, WEAPON_SHAPE[cls] || 'wp_blade').setOrigin(0.5, 0.85).setTint(meta.color);
    this.weapon.rotation = -0.35;
    this.frontArm.add([frontLimb, this.weapon]);

    const order = [this.cape, this.backArm, ...this.legs, this.torso, this.trim, this.head, this.hair, this.eyeL, this.eyeR, this.frontArm];
    c.add(order.filter(Boolean));

    this.state = 'idle';
    this.facing = 1;
    this.t = 0;
    this.attackT = -1;      // ≥0 = กำลังฟัน (นับเวลาถอยหลัง)
    this.attackDur = 0.24;
  }

  setFacing(dir) {
    if (dir !== 0 && dir !== this.facing) {
      this.facing = dir;
      this.container.scaleX = dir;
    }
  }

  setState(s) {
    this.state = s;
  }

  // เรียกตอนกดโจมตี — ท่าฟันเล่นทับท่าเดินอยู่ ไม่ตัดการเคลื่อนที่
  swing(dur = 0.24) {
    this.attackT = 0;
    this.attackDur = dur;
  }

  get busySwinging() {
    return this.attackT >= 0;
  }

  update(dt) {
    this.t += dt;
    const bobBase = -1;
    let torsoBob = 0;
    let legA = 0;
    let legB = 0;
    let armBack = 0;
    let armFront = 0;

    if (this.state === 'walk') {
      const p = this.t * 11;
      legA = Math.sin(p) * 0.62;
      legB = Math.sin(p + Math.PI) * 0.62;
      armBack = Math.sin(p + Math.PI) * 0.5;
      armFront = Math.sin(p) * 0.45;
      torsoBob = Math.abs(Math.sin(p)) * -2.2;
    } else if (this.state === 'jump') {
      legA = 0.55;
      legB = -0.28;
      armBack = -0.75;
      armFront = -0.55;
      torsoBob = -1.5;
    } else if (this.state === 'climb') {
      const p = this.t * 7;
      legA = Math.sin(p) * 0.34;
      legB = Math.sin(p + Math.PI) * 0.34;
      armBack = -2.35 + Math.sin(p) * 0.3;      // แขนเอื้อมขึ้นสลับกัน
      armFront = -2.35 + Math.sin(p + Math.PI) * 0.3;
      torsoBob = Math.sin(p * 2) * -1.2;
    } else {
      const p = this.t * 2.6;                    // ยืนเฉย ๆ — หายใจเบา ๆ
      torsoBob = Math.sin(p) * -1.1;
      armBack = Math.sin(p) * 0.07;
      armFront = Math.sin(p + 0.6) * 0.07 + 0.05;
    }

    // ท่าฟันเขียนทับแขนหน้าเท่านั้น ท่าขายังเดินต่อได้
    if (this.attackT >= 0) {
      this.attackT += dt;
      const k = Math.min(1, this.attackT / this.attackDur);
      // เอาแขนไปข้างหลังเร็ว แล้วเหวี่ยงลงหน้าแบบ ease-out ให้รู้สึกมีน้ำหนัก
      const sweep = k < 0.28 ? -2.1 * (k / 0.28) : -2.1 + 3.0 * ease(( k - 0.28) / 0.72);
      armFront = sweep;
      this.weapon.rotation = -0.35 - sweep * 0.45;
      if (k >= 1) {
        this.attackT = -1;
        this.weapon.rotation = -0.35;
      }
    }

    this.legs[0].rotation = legA;
    this.legs[1].rotation = legB;
    this.backArm.rotation = armBack;
    this.frontArm.rotation = armFront;

    const ty = bobBase + torsoBob;
    this.torso.y = -42 + ty;
    this.trim.y = -30 + ty * 0.6;
    this.head.y = -74 + ty;
    this.hair.y = -86 + ty;
    this.eyeL.y = -73 + ty;
    this.eyeR.y = -73 + ty;
    this.backArm.y = SHOULDER_Y + ty;
    this.frontArm.y = SHOULDER_Y + ty;
    if (this.cape) {
      this.cape.y = SHOULDER_Y - 4 + ty;
      this.cape.rotation = this.state === 'walk' ? Math.sin(this.t * 11) * 0.12 : Math.sin(this.t * 2) * 0.05;
    }
  }

  setPosition(x, y) {
    this.container.x = x;
    this.container.y = y;
  }

  destroy() {
    this.container.destroy();
  }
}

const ease = (k) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 2.2);

