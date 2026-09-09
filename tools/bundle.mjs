// ═══════════════════════════════════════════════════════════════════════════
// tools/bundle.mjs — ตัวรวมโมดูลเล็ก ๆ ที่ใช้ร่วมกันระหว่างตัว build ทั้งสอง
// (maple/build-standalone.mjs สำหรับเกม และ desktop-pet/build-pet.mjs สำหรับ pet)
//
// วิธีรวม: ต่อไฟล์ตามลำดับ dependency แล้วตัดบรรทัด import กับคำนำหน้า export ออก
// พอทุกโมดูลอยู่สโคปเดียวกัน ชื่อที่เคย import กันก็มองเห็นกันเองอยู่แล้ว
// เงื่อนไขคือต้องไม่มีชื่อ top-level ซ้ำกันข้ามไฟล์ — ตรวจให้ใน assertNoDuplicateNames
//
// ไม่ต้องพึ่ง bundler ภายนอก และไม่ต้องมี node_modules ในโปรเจกต์
// ═══════════════════════════════════════════════════════════════════════════

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export const PHASER_VERSION = '3.80.1';

// ตัด import (รองรับที่เขียนคร่อมหลายบรรทัด) และคำนำหน้า export
export function stripModuleSyntax(src) {
  return src
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]*['"];?[ \t]*$/gm, '')
    .replace(/^export\s+(?=(?:const|let|var|function|class|async)\b)/gm, '');
}

// กันพลาด: ชื่อ top-level ซ้ำกันข้ามไฟล์จะทำให้ไฟล์รวมพังตอนรัน
export function assertNoDuplicateNames(chunks) {
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

// โหลด Phaser จากแคชในเครื่อง ถ้าไม่มีก็ดึงจาก CDN แล้วเก็บไว้
export async function getPhaser(cachePath) {
  try {
    await stat(cachePath);
    return readFile(cachePath, 'utf8');
  } catch {
    const url = `https://cdn.jsdelivr.net/npm/phaser@${PHASER_VERSION}/dist/phaser.min.js`;
    process.stdout.write(`ดาวน์โหลด Phaser ${PHASER_VERSION} ...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`โหลด Phaser ไม่สำเร็จ: HTTP ${res.status}`);
    const js = await res.text();
    await mkdir(dirname(cachePath), { recursive: true });
    await writeFile(cachePath, js);
    console.log(' เสร็จ');
    return js;
  }
}

// อ่านไฟล์ตามลำดับที่ให้ แล้วคืนโค้ดที่รวมเป็นสโคปเดียว
export async function bundleFiles(root, order) {
  const sources = await Promise.all(order.map((rel) => readFile(resolve(root, rel), 'utf8')));
  const chunks = order.map((file, i) => ({ file, code: stripModuleSyntax(sources[i]) }));
  const names = assertNoDuplicateNames(chunks);
  const code = chunks
    .map(({ file, code }) => `\n// ${'═'.repeat(70)}\n// ${file}\n// ${'═'.repeat(70)}\n${code.trim()}\n`)
    .join('\n');
  return { code, names, count: order.length };
}

export const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
