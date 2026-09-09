// ═══════════════════════════════════════════════════════════════════════════
// build-pet.mjs — สร้าง desktop-pet/pet.html (หน้าต่างภาพของ pet)
//
// Electron โหลดไฟล์ผ่าน file:// ซึ่ง Chromium ไม่ยอมให้ ES module import กันได้
// จึงต้องรวมโค้ดเป็นสโคปเดียวเหมือนที่ทำกับ standalone.html ของเกม
//
// เอาเฉพาะโมดูลที่ pet ต้องใช้: ข้อมูลอาชีพ + ยูทิลสี + เท็กซ์เจอร์ + Rig
// ไม่เอา maps/mob/hud/player มาด้วย pet ไม่ได้ใช้
//
//   node desktop-pet/build-pet.mjs
// ═══════════════════════════════════════════════════════════════════════════

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHASER_VERSION, getPhaser, bundleFiles, kb } from '../tools/bundle.mjs';
import { encodePng, encodeIco, drawCherry } from '../tools/png.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const PHASER_CACHE = resolve(ROOT, '.cache', `phaser-${PHASER_VERSION}.min.js`);

const ORDER = [
  'shared/gamedata.js',
  'maple/src/color.js',
  'maple/src/textures.js',
  'maple/src/rig.js',
  'desktop-pet/src/pet-view.js',
];

const [phaser, bundle] = await Promise.all([
  getPhaser(PHASER_CACHE),
  bundleFiles(ROOT, ORDER),
]);

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<title>น้องเชอร์รี่</title>

<!-- ไฟล์นี้สร้างอัตโนมัติจาก desktop-pet/build-pet.mjs — อย่าแก้ตรงนี้
     แก้ที่ desktop-pet/src/pet-view.js แล้วสั่ง: node desktop-pet/build-pet.mjs -->

<style>
  /* ทุกชั้นต้องโปร่งใสจริง ไม่ใช่แค่สีขาว ไม่งั้นจะเห็นเป็นกล่องทับเดสก์ท็อป */
  html, body {
    margin: 0; padding: 0; width: 100%; height: 100%;
    overflow: hidden; background: transparent;
    -webkit-user-select: none; user-select: none;
    cursor: grab;
  }
  body.dragging { cursor: grabbing; }
  #pet { width: 100%; height: 100%; }
  #pet canvas { display: block; background: transparent !important; }
</style>
</head>
<body>

<div id="pet"></div>

<!-- Phaser ${PHASER_VERSION} (ฝังไว้ในไฟล์) -->
<script>${phaser}</script>

<!-- โค้ด pet ${ORDER.length} โมดูล รวมเป็นสโคปเดียว -->
<script>
${bundle.code}
</script>

<script>
// ── เมาส์: แยก "คลิก" กับ "ลาก" ออกจากกัน ──
// ลากเกินระยะ threshold ถือว่าเป็นการอุ้ม ต่ำกว่านั้นถือว่าเป็นการจับหัวเล่น
(function () {
  const DRAG_THRESHOLD = 4;
  let down = false, moved = false, sx = 0, sy = 0;

  addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    down = true; moved = false; sx = e.screenX; sy = e.screenY;
  });

  addEventListener('mousemove', (e) => {
    if (!down || moved) return;
    if (Math.abs(e.screenX - sx) > DRAG_THRESHOLD || Math.abs(e.screenY - sy) > DRAG_THRESHOLD) {
      moved = true;
      document.body.classList.add('dragging');
      window.petBridge?.dragStart();
    }
  });

  addEventListener('mouseup', (e) => {
    if (e.button !== 0 || !down) return;
    down = false;
    document.body.classList.remove('dragging');
    if (moved) window.petBridge?.dragEnd();
    else window.petBridge?.poke();
  });

  addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.petBridge?.menu();
  });
})();
</script>

</body>
</html>
`;

// ── ไอคอน ──
// สร้างจากโค้ดทุกครั้ง จึงไม่ต้องคอมมิตไฟล์รูปไบนารีเข้ามาใน repo
const ASSETS = resolve(HERE, 'assets');
await mkdir(ASSETS, { recursive: true });

const trayPng = encodePng(32, 32, drawCherry(32));
await writeFile(resolve(ASSETS, 'tray.png'), trayPng);

// electron-builder ต้องการ .ico อย่างน้อย 256×256 สำหรับตัวติดตั้ง Windows
const icoSizes = [16, 32, 48, 64, 128, 256];
const ico = encodeIco(icoSizes.map((size) => ({ size, png: encodePng(size, size, drawCherry(size)) })));
await writeFile(resolve(ASSETS, 'icon.ico'), ico);

const out = resolve(HERE, 'pet.html');
await writeFile(out, html);
console.log(`สร้าง ${out.replace(ROOT + '/', '')} แล้ว`);
console.log(`  Phaser ${PHASER_VERSION}  ${kb(phaser.length)}`);
console.log(`  โค้ด pet ${ORDER.length} โมดูล  ${kb(bundle.code.length)}  (${bundle.names} ชื่อ top-level)`);
console.log(`  รวมทั้งไฟล์       ${kb(html.length)}`);
console.log(`  assets/tray.png   ${kb(trayPng.length)}`);
console.log(`  assets/icon.ico   ${kb(ico.length)}  (${icoSizes.join('/')})`);
