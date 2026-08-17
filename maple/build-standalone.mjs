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

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const PHASER_VERSION = '3.80.1';
const PHASER_URL = `https://cdn.jsdelivr.net/npm/phaser@${PHASER_VERSION}/dist/phaser.min.js`;
const PHASER_LOCAL = resolve(HERE, 'vendor', `phaser-${PHASER_VERSION}.min.js`);

// เรียงตามลำดับ dependency — โมดูลที่ถูก import ต้องมาก่อนผู้ใช้งานเสมอ
// maps.js มีโค้ดระดับบนสุดที่สร้าง MAPS จาก BIOMES จึงต้องอยู่หลัง gamedata.js
// main.js สร้าง Phaser.Game ทันทีที่รัน จึงต้องอยู่ท้ายสุด
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

async function getPhaser() {
  try {
    await stat(PHASER_LOCAL);
    return readFile(PHASER_LOCAL, 'utf8');
  } catch {
    process.stdout.write(`ดาวน์โหลด Phaser ${PHASER_VERSION} ...`);
    const res = await fetch(PHASER_URL);
    if (!res.ok) throw new Error(`โหลด Phaser ไม่สำเร็จ: HTTP ${res.status}`);
    const js = await res.text();
    await mkdir(dirname(PHASER_LOCAL), { recursive: true });
    await writeFile(PHASER_LOCAL, js);
    console.log(` เก็บไว้ที่ ${PHASER_LOCAL.replace(ROOT + '/', '')}`);
    return js;
  }
}

// ตัด import (รองรับแบบหลายบรรทัด) และคำนำหน้า export ออก
// เมื่อทุกโมดูลอยู่ในสโคปเดียวกัน ชื่อที่ import กันก็มองเห็นกันอยู่แล้ว
function stripModuleSyntax(src) {
  return src
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]*['"];?[ \t]*$/gm, '')
    .replace(/^export\s+(?=(?:const|let|var|function|class|async)\b)/gm, '');
}

// กันพลาด: ถ้ามีชื่อ top-level ซ้ำกันข้ามไฟล์ การรวมสโคปเดียวจะพังตอนรัน
function assertNoDuplicateNames(chunks) {
  const seen = new Map();
  const dupes = [];
  for (const { file, code } of chunks) {
    const re = /^(?:const|let|var|function|class|async function)\s+([A-Za-z_$][\w$]*)/gm;
    let m;
    while ((m = re.exec(code))) {
      const name = m[1];
      if (seen.has(name)) dupes.push(`${name} (${seen.get(name)} + ${file})`);
      else seen.set(name, file);
    }
  }
  if (dupes.length) {
    throw new Error(`ชื่อ top-level ซ้ำกัน จะรวมเป็นไฟล์เดียวไม่ได้:\n  ${dupes.join('\n  ')}`);
  }
  return seen.size;
}

const [phaser, ...sources] = await Promise.all([
  getPhaser(),
  ...ORDER.map((rel) => readFile(resolve(ROOT, rel), 'utf8')),
]);

const chunks = ORDER.map((file, i) => ({ file, code: stripModuleSyntax(sources[i]) }));
const names = assertNoDuplicateNames(chunks);

const gameJs = chunks
  .map(({ file, code }) => `\n// ${'═'.repeat(70)}\n// ${file}\n// ${'═'.repeat(70)}\n${code.trim()}\n`)
  .join('\n');

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

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(`สร้าง ${out.replace(ROOT + '/', '')} แล้ว`);
console.log(`  Phaser ${PHASER_VERSION}   ${kb(phaser.length)}`);
console.log(`  โค้ดเกม ${ORDER.length} โมดูล  ${kb(gameJs.length)}  (${names} ชื่อ top-level ไม่ซ้ำกัน)`);
console.log(`  รวมทั้งไฟล์        ${kb(html.length)}`);
