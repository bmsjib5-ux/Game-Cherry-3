// ═══════════════════════════════════════════════════════════════════════════
// build-standalone.mjs — รวมทุกอย่างเป็น standalone.html ไฟล์เดียว
//
// เวอร์ชันหลัก (maple/index.html) ใช้ ES module โหลดตรงในเบราว์เซอร์ + Phaser จาก CDN
// ซึ่งดีสำหรับการพัฒนา (แก้ไฟล์แล้วรีเฟรชเห็นผลทันที ไม่มี build step)
// แต่ต้องมีเว็บเซิร์ฟเวอร์และต้องต่อเน็ต
//
// ไฟล์นี้สร้างอีกเวอร์ชันสำหรับ "เอาไปเล่น": ฝัง Phaser + โค้ดเกมทั้งหมดในไฟล์เดียว
// ดับเบิลคลิกเปิดได้เลย เล่นออฟไลน์ได้ ส่งต่อเป็นไฟล์เดียวได้
//
// วิธีรวม: ต่อไฟล์เรียงตามลำดับ dependency แล้วตัดบรรทัด import กับคำ export ออก
// ทำได้เพราะทุกโมดูลไม่มีชื่อ top-level ซ้ำกันเลย (ตรวจไว้ในสคริปต์นี้ด้วย)
// ไม่ต้องพึ่ง bundler ภายนอก
//
//   node maple/build-standalone.mjs
// ═══════════════════════════════════════════════════════════════════════════

import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHASER_VERSION, getPhaser, bundleFiles, kb } from '../tools/bundle.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const PHASER_CACHE = resolve(ROOT, '.cache', `phaser-${PHASER_VERSION}.min.js`);

const ORDER = [
  'shared/gamedata.js',
  'maple/src/color.js',
  'maple/src/rng.js',
  'maple/src/fx.js',
  'maple/src/maps.js',
  'maple/src/textures.js',
  'maple/src/rig.js',
  'maple/src/stats.js',
  'maple/src/save.js',
  'maple/src/input.js',
  'maple/src/hud.js',
  'maple/src/drop.js',
  'maple/src/mob.js',
  'maple/src/player.js',
  'maple/src/scenes/BootScene.js',
  'maple/src/scenes/TitleScene.js',
  'maple/src/scenes/FieldScene.js',
  'maple/src/main.js',
];

const [phaser, bundle] = await Promise.all([
  getPhaser(PHASER_CACHE),
  bundleFiles(ROOT, ORDER),
]);
const gameJs = bundle.code;

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>🍒 น้องเชอร์รี่ 2D — แดนมอนสเตอร์</title>

<!-- ไฟล์นี้สร้างอัตโนมัติจาก maple/build-standalone.mjs — อย่าแก้ตรงนี้
     แก้ที่ maple/src/ แล้วสั่ง: node maple/build-standalone.mjs
     ทุกอย่างฝังอยู่ในไฟล์นี้หมด ไม่เรียกอินเทอร์เน็ตเลย เล่นออฟไลน์ได้ -->

<style>
  html, body {
    margin: 0; padding: 0; width: 100%; height: 100%;
    overflow: hidden; background: #101a0c;
    /* ไม่โหลดฟอนต์จากเน็ต ใช้ฟอนต์ไทยที่มีในเครื่อง (มีครบทั้ง Windows/macOS/Android/iOS) */
    font-family: 'Noto Sans Thai', 'Sarabun', 'Leelawadee UI', 'Thonburi', system-ui, -apple-system, sans-serif;
    -webkit-user-select: none; user-select: none;
    -webkit-touch-callout: none; touch-action: none;
  }
  #game { width: 100%; height: 100%; }
  #game canvas { display: block; }
  #loading {
    position: fixed; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 14px;
    color: #cfe0b8; background: #101a0c; z-index: 99;
  }
  .spin { font-size: 52px; animation: bounce 0.8s infinite alternate ease-in-out; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-16px); } }
  #fatal {
    position: fixed; inset: 0; display: none; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px; padding: 24px;
    text-align: center; color: #ffd0c0; background: #1a0c0c; z-index: 100;
  }
</style>
</head>
<body>

<div id="loading">
  <div class="spin">🍒</div>
  <div>กำลังเตรียมแดนมอนสเตอร์...</div>
</div>

<div id="fatal">
  <div style="font-size:44px">🕸️</div>
  <div style="font-size:19px;font-weight:700">เกิดข้อผิดพลาด</div>
  <div id="fatal-msg" style="font-size:14px;opacity:.85;max-width:560px"></div>
</div>

<div id="game"></div>

<script>
  function fatal(msg) {
    const el = document.getElementById('fatal');
    document.getElementById('fatal-msg').textContent = msg;
    const load = document.getElementById('loading');
    if (load) load.remove();
    el.style.display = 'flex';
  }
  window.addEventListener('error', (e) => fatal(e.message || String(e.error)));
  window.addEventListener('unhandledrejection', (e) => fatal(String(e.reason)));
</script>

<!-- Phaser ${PHASER_VERSION} (ฝังไว้ในไฟล์) -->
<script>${phaser}</script>

<!-- โค้ดเกมทั้งหมด ${ORDER.length} โมดูล รวมเป็นสโคปเดียว -->
<script>
${gameJs}
</script>

</body>
</html>
`;

const out = resolve(HERE, 'standalone.html');
await writeFile(out, html);

console.log(`สร้าง ${out.replace(ROOT + '/', '')} แล้ว`);
console.log(`  Phaser ${PHASER_VERSION}   ${kb(phaser.length)}`);
console.log(`  โค้ดเกม ${ORDER.length} โมดูล  ${kb(gameJs.length)}  (${bundle.names} ชื่อ top-level ไม่ซ้ำกัน)`);
console.log(`  รวมทั้งไฟล์        ${kb(html.length)}`);
