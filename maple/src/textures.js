// ═══════════════════════════════════════════════════════════════════════════
// textures.js — สร้างกราฟิกทั้งหมดตอนรันไทม์ ไม่มีไฟล์รูปเลยแม้แต่ไฟล์เดียว
//
// เหตุผล: เกมเดิม (cherry-adventure) ใช้อีโมจิเป็นหน้ามอนอยู่แล้ว เราคงสไตล์นั้นไว้
// ทำให้ไม่ต้องมี sprite sheet ให้ดูแล และเพิ่มมอนใหม่ได้ด้วยการเพิ่มบรรทัดใน SPECIES
//
// ตัวละครประกอบจากชิ้นส่วนสีขาว (หัว/ลำตัว/แขน/ขา) แล้วย้อมสีตาม CLASS_OUTFIT
// ทำให้ 8 อาชีพหน้าตาต่างกันจริงโดยใช้เท็กซ์เจอร์ชุดเดียว
// ═══════════════════════════════════════════════════════════════════════════

import { SPECIES } from '../../shared/gamedata.js';

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

// วาดอีโมจิลงแคนวาสแล้วลงทะเบียนเป็นเท็กซ์เจอร์
//
// bottom = true จัดตัวอีโมจิให้ก้นติดขอบล่างแคนวาส ใช้กับมอนสเตอร์
// เพราะกล่องชนของมอนวางชิดขอบล่างเหมือนกัน — ถ้าจัดกลางจะเกิดช่องว่าง
// ระหว่างเท้ามอนกับพื้นแท่นที่มองเห็นได้ชัด
function emojiTexture(scene, key, emoji, size = 96, bottom = false) {
  if (scene.textures.exists(key)) return;
  const canvas = scene.textures.createCanvas(key, size, size);
  const ctx = canvas.getContext();
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${Math.floor(size * 0.76)}px ${EMOJI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = bottom ? 'bottom' : 'middle';
  ctx.fillText(emoji, size / 2, bottom ? size - 1 : size / 2 + size * 0.04);
  canvas.refresh();
}

// ขนาดมอนตาม tier — มอนแรร์ตัวใหญ่ขึ้นจริง ไม่ได้แค่เลือดเยอะ
// สร้างเท็กซ์เจอร์ตามขนาดสุดท้ายเลย จึงไม่ต้อง setScale() ทำให้กล่องชนตรงกับภาพเสมอ
export const mobSize = (tier) => 58 + tier * 11;

// ชิ้นส่วนตัวละคร — วาดเป็นสีขาวล้วนเพื่อให้ setTint() ย้อมได้อิสระ
function bodyParts(scene) {
  const g = scene.make.graphics({ add: false });

  const shape = (key, w, h, draw) => {
    if (scene.textures.exists(key)) return;
    g.clear();
    draw(g);
    g.generateTexture(key, w, h);
  };

  shape('part_head', 36, 34, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillEllipse(18, 17, 34, 32);
  });
  shape('part_hair', 40, 24, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.slice(20, 20, 19, Math.PI, Math.PI * 2, false);
    gg.fillPath();
  });
  shape('part_torso', 28, 32, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRoundedRect(0, 0, 28, 32, 7);
  });
  shape('part_limb', 10, 24, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRoundedRect(0, 0, 10, 24, 5);
  });
  shape('part_foot', 14, 9, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRoundedRect(0, 0, 14, 9, 4);
  });
  shape('part_cape', 26, 34, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillTriangle(13, 0, 26, 34, 0, 34);
  });

  // อาวุธ 3 ทรง — ดาบ/คทา/ธนู แมพเข้ากับ 8 อาชีพ (ดูตาราง WEAPON_SHAPE)
  shape('wp_blade', 12, 62, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRect(4, 10, 4, 52);                     // ใบมีด
    gg.fillRect(0, 6, 12, 4);                      // ก้าม
    gg.fillRoundedRect(4, 0, 4, 8, 2);             // ด้าม
  });
  shape('wp_staff', 14, 66, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRect(6, 12, 3, 54);                     // ด้าม
    gg.fillCircle(7, 8, 7);                        // หัวคทา
  });
  shape('wp_bow', 26, 58, (gg) => {
    gg.lineStyle(4, 0xffffff, 1);
    gg.beginPath();
    gg.arc(4, 29, 22, -Math.PI / 2.4, Math.PI / 2.4, false);
    gg.strokePath();
    gg.lineStyle(1.5, 0xffffff, 0.85);
    gg.lineBetween(6, 6, 6, 52);                   // สาย
  });

  g.destroy();
}

// เอฟเฟกต์และไอเทม
function fxParts(scene) {
  const g = scene.make.graphics({ add: false });
  const shape = (key, w, h, draw) => {
    if (scene.textures.exists(key)) return;
    g.clear();
    draw(g);
    g.generateTexture(key, w, h);
  };

  shape('fx_dot', 12, 12, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillCircle(6, 6, 6);
  });
  shape('fx_ring', 64, 64, (gg) => {
    gg.lineStyle(5, 0xffffff, 1);
    gg.strokeCircle(32, 32, 28);
  });
  // เสี้ยวฟัน — ใช้กับสกิลระยะประชิด หมุน/พลิกตามทิศที่หันหน้า
  shape('fx_slash', 96, 110, (gg) => {
    gg.lineStyle(13, 0xffffff, 1);
    gg.beginPath();
    gg.arc(4, 55, 76, -Math.PI / 3.1, Math.PI / 3.1, false);
    gg.strokePath();
  });
  shape('fx_bag', 26, 22, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRoundedRect(0, 5, 26, 17, 5);
    gg.fillRect(9, 0, 8, 7);
  });
  // เสาพอร์ทัล — วงรีเรืองแสงซ้อนกัน
  shape('fx_portal', 84, 130, (gg) => {
    gg.lineStyle(6, 0xffffff, 0.95);
    gg.strokeEllipse(42, 65, 62, 118);
    gg.lineStyle(3, 0xffffff, 0.55);
    gg.strokeEllipse(42, 65, 36, 96);
  });
  shape('px', 4, 4, (gg) => {
    gg.fillStyle(0xffffff, 1);
    gg.fillRect(0, 0, 4, 4);
  });
  // กล่องชนของผู้เล่น — โปร่งใส แยกจากภาพตัวละคร (rig) เพื่อให้ขนาดชนคงที่
  // ไม่ว่าท่าทางจะเหวี่ยงแขนขาไปแค่ไหน จุดกำเนิด (0.5, 1) = ปลายเท้า
  shape('hit_player', 26, 84, (gg) => {
    gg.fillStyle(0xffffff, 0);
    gg.fillRect(0, 0, 26, 84);
  });

  g.destroy();
}

// อาชีพ → ทรงอาวุธ (ดึงชื่ออาชีพจาก CLASSES ในข้อมูลกลาง)
export const WEAPON_SHAPE = {
  warrior: 'wp_blade',
  samurai: 'wp_blade',
  assassin: 'wp_blade',
  lancer: 'wp_staff',
  mage: 'wp_staff',
  coder: 'wp_staff',
  office: 'wp_staff',
  archer: 'wp_bow',
};

export function buildTextures(scene) {
  bodyParts(scene);
  fxParts(scene);
  for (const [key, sp] of Object.entries(SPECIES)) {
    emojiTexture(scene, `mob_${key}`, sp.emoji, mobSize(sp.tier), true);
  }
  // อีโมจิที่ UI ใช้ซ้ำ
  emojiTexture(scene, 'ico_coin', '🪙', 48);
  emojiTexture(scene, 'ico_star', '⭐', 48);
}
