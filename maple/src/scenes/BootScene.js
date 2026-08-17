// BootScene — สร้างเท็กซ์เจอร์ทั้งหมดตอนรันไทม์ แล้วไปหน้าเลือกอาชีพ
// ไม่มีการโหลดไฟล์รูปเลย จึงไม่มีจังหวะ "โหลดค้าง" ให้ผู้เล่นรอ
import { buildTextures } from '../textures.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    buildTextures(this);
    const el = document.getElementById('loading');
    if (el) el.remove();
    this.scene.start('title');
  }
}
