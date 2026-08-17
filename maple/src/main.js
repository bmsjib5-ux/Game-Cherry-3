// ═══════════════════════════════════════════════════════════════════════════
// main.js — จุดเริ่มของเกม 2D
//
// Phaser โหลดมาเป็น global จาก CDN (ไม่ใช่ ES module) ส่วนโค้ดเกมทั้งหมด
// เป็น ES module โหลดตรงในเบราว์เซอร์ — ไม่มี build step ไม่มี node_modules
// เปิดผ่าน GitHub Pages หรือเซิร์ฟเวอร์สแตติกอะไรก็เล่นได้ทันที
// ═══════════════════════════════════════════════════════════════════════════

import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { FieldScene } from './scenes/FieldScene.js';
import { VIEW_W, VIEW_H } from './maps.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW_W,
  height: VIEW_H,
  backgroundColor: '#101a0c',
  // FIT + CENTER_BOTH = ขยายเต็มจอโดยคงสัดส่วน ใช้ได้ทั้งจอคอมและมือถือแนวนอน
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    // fixedStep ที่ 60fps สำคัญมาก: ทำให้ความเร็วตกสูงสุดต่อเฟรมคงที่
    // แท่นสูง 24px จึงกันการทะลุแท่นได้แน่นอน ไม่ขึ้นกับเฟรมเรตเครื่องผู้เล่น
    arcade: { gravity: { y: 0 }, fps: 60, fixedStep: true },
  },
  render: { antialias: true, powerPreference: 'high-performance' },
  scene: [BootScene, TitleScene, FieldScene],
});

// เผื่อดีบัก
window.__game = game;
