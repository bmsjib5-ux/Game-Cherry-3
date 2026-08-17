// ═══════════════════════════════════════════════════════════════════════════
// fx.js — ตัวเลขดาเมจ ข้อความลอย และเอฟเฟกต์การฟัน (พิกัดในโลกเกม)
//
// ตัวเลขดาเมจแบบเมเปิ้ล: เด้งขึ้นเป็นชั้น ๆ ตอนตีรัว คริตัวใหญ่สีทอง
// ตีเข้าจุดอ่อนธาตุขึ้น "WEAK!" — ผู้เล่นอ่านออกทันทีว่าเลือกสกิลถูก
// ═══════════════════════════════════════════════════════════════════════════

export const FONT = "'Noto Sans Thai', 'Sarabun', system-ui, -apple-system, sans-serif";

export function popDamage(scene, x, y, dmg, { crit = false, weak = false } = {}) {
  const size = crit ? 34 : 24;
  const color = crit ? '#ffd34a' : weak ? '#8ef0a0' : '#ffffff';
  const t = scene.add
    .text(x + Phaser.Math.Between(-12, 12), y, String(dmg), {
      fontFamily: FONT,
      fontSize: `${size}px`,
      fontStyle: '900',
      color,
      stroke: '#3a1408',
      strokeThickness: crit ? 6 : 5,
    })
    .setOrigin(0.5, 1)
    .setDepth(900);

  // คริกระตุกขยายก่อนลอยขึ้น ให้รู้สึกหนักกว่าตีธรรมดา
  if (crit) {
    t.setScale(0.5);
    scene.tweens.add({ targets: t, scale: 1.15, duration: 90, ease: 'Back.easeOut' });
  }
  scene.tweens.add({
    targets: t,
    y: y - (crit ? 74 : 56),
    alpha: 0,
    duration: crit ? 720 : 560,
    ease: 'Quad.easeOut',
    onComplete: () => t.destroy(),
  });

  if (weak) {
    const w = scene.add
      .text(x, y - 26, 'WEAK!', {
        fontFamily: FONT, fontSize: '15px', fontStyle: '900',
        color: '#8ef0a0', stroke: '#0d2a12', strokeThickness: 4,
      })
      .setOrigin(0.5, 1)
      .setDepth(900);
    scene.tweens.add({ targets: w, y: y - 78, alpha: 0, duration: 640, onComplete: () => w.destroy() });
  }
  return t;
}

// ข้อความลอยทั่วไป — ใช้กับ "เลเวลอัป!" "มานาไม่พอ" "+120 EXP"
export function popText(scene, x, y, msg, color = '#ffffff', size = 20) {
  const t = scene.add
    .text(x, y, msg, {
      fontFamily: FONT, fontSize: `${size}px`, fontStyle: '700',
      color, stroke: '#000000', strokeThickness: 4,
    })
    .setOrigin(0.5, 1)
    .setDepth(910);
  scene.tweens.add({
    targets: t, y: y - 62, alpha: 0, duration: 900, ease: 'Quad.easeOut',
    onComplete: () => t.destroy(),
  });
  return t;
}

// เสี้ยวฟันหน้าตัวละคร — พลิกตามทิศที่หันหน้า สีตามสกิล
export function slashFx(scene, x, y, facing, color = 0xffffff) {
  const s = scene.add
    .image(x + facing * 34, y - 46, 'fx_slash')
    .setTint(color)
    .setDepth(500)
    .setFlipX(facing < 0)
    .setAlpha(0.95)
    .setScale(0.55, 0.8)
    .setAngle(facing > 0 ? -14 : 14);
  scene.tweens.add({
    targets: s,
    scaleX: facing > 0 ? 1.15 : 1.15,
    scaleY: 1.05,
    alpha: 0,
    angle: facing > 0 ? 22 : -22,
    duration: 210,
    ease: 'Quad.easeOut',
    onComplete: () => s.destroy(),
  });
  return s;
}

// ประกายกระจายตอนโดน — ให้จุดที่ปะทะมีน้ำหนัก
export function sparks(scene, x, y, color = 0xffffff, n = 8) {
  for (let i = 0; i < n; i++) {
    const p = scene.add.image(x, y, 'fx_dot').setTint(color).setDepth(880).setScale(Phaser.Math.FloatBetween(0.35, 0.8));
    const a = Phaser.Math.FloatBetween(-Math.PI, 0);
    const d = Phaser.Math.Between(26, 62);
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(a) * d,
      y: y + Math.sin(a) * d,
      alpha: 0,
      scale: 0,
      duration: Phaser.Math.Between(240, 420),
      ease: 'Quad.easeOut',
      onComplete: () => p.destroy(),
    });
  }
}

// วงแหวนกระเพื่อม — ใช้กับเลเวลอัปและสกิลใหญ่
export function ring(scene, x, y, color = 0xffe28a, scaleTo = 2.4) {
  const r = scene.add.image(x, y, 'fx_ring').setTint(color).setDepth(870).setAlpha(0.9);
  scene.tweens.add({
    targets: r, scale: scaleTo, alpha: 0, duration: 520, ease: 'Cubic.easeOut',
    onComplete: () => r.destroy(),
  });
}
