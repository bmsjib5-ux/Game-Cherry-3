// ═══════════════════════════════════════════════════════════════════════════
// tools/png.mjs — เขียนไฟล์ PNG และ ICO ด้วย JS ล้วน
//
// ใช้สร้างไอคอนถาดระบบและไอคอนแอปตอน build จึงไม่ต้องคอมมิตไฟล์รูปไบนารี
// เข้ามาใน repo และไม่ต้องลง dependency เพิ่ม (zlib มากับ Node อยู่แล้ว)
// ═══════════════════════════════════════════════════════════════════════════

import { deflateSync } from 'node:zlib';

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

// rgba = Buffer ขนาด width*height*4
export function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;                  // bit depth
  ihdr[9] = 6;                  // truecolor + alpha
  // แต่ละแถวต้องมีไบต์ filter นำหน้า ใช้ 0 (None) ทั้งหมด
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ICO ตั้งแต่ Vista ขึ้นไปห่อข้อมูล PNG ไว้ตรง ๆ ได้ ไม่ต้องแปลงเป็น BMP
export function encodeIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);          // 1 = ไอคอน
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  images.forEach((img, i) => {
    const o = i * 16;
    dir[o] = img.size >= 256 ? 0 : img.size;      // 0 หมายถึง 256
    dir[o + 1] = img.size >= 256 ? 0 : img.size;
    dir[o + 2] = 0;                                // จำนวนสีในพาเลตต์
    dir[o + 3] = 0;
    dir.writeUInt16LE(1, o + 4);                   // color planes
    dir.writeUInt16LE(32, o + 6);                  // bits per pixel
    dir.writeUInt32LE(img.png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.png.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.png)]);
}

// ── วาดเชอร์รี่ 🍒 ลงบัฟเฟอร์ RGBA ──
// พิกัดใช้สัดส่วน 0–1 จึงวาดขนาดไหนก็ได้ ลบรอยหยักด้วยการสุ่มตัวอย่าง 3×3 ต่อพิกเซล
export function drawCherry(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const SS = 3;

  const BERRY = [0xd9, 0x29, 0x4a];
  const BERRY_DARK = [0x9c, 0x16, 0x30];
  const SHINE = [0xff, 0xa8, 0xb8];
  const STEM = [0x4f, 0x7a, 0x33];
  const LEAF = [0x76, 0xb0, 0x4a];

  const circle = (px, py, cx, cy, r) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r;

  // ก้านสองเส้น: สุ่มจุดบนเส้นโค้งเบซิเยร์กำลังสองแล้วแสตมป์วงกลมเล็ก ๆ
  const onStem = (px, py, endX, endY, ctrlX, ctrlY) => {
    for (let t = 0; t <= 1; t += 0.02) {
      const mt = 1 - t;
      const bx = mt * mt * 0.5 + 2 * mt * t * ctrlX + t * t * endX;
      const by = mt * mt * 0.12 + 2 * mt * t * ctrlY + t * t * endY;
      if (circle(px, py, bx, by, 0.028)) return true;
    }
    return false;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let acc = [0, 0, 0, 0];
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = (x + (sx + 0.5) / SS) / size;
          const py = (y + (sy + 0.5) / SS) / size;
          let c = null;

          if (circle(px, py, 0.36, 0.66, 0.235)) {
            c = circle(px, py, 0.30, 0.58, 0.075) ? SHINE
              : circle(px, py, 0.36, 0.66, 0.20) ? BERRY : BERRY_DARK;
          } else if (circle(px, py, 0.68, 0.72, 0.205)) {
            c = circle(px, py, 0.63, 0.65, 0.062) ? SHINE
              : circle(px, py, 0.68, 0.72, 0.172) ? BERRY : BERRY_DARK;
          } else if (onStem(px, py, 0.36, 0.5, 0.30, 0.26) || onStem(px, py, 0.68, 0.56, 0.66, 0.26)) {
            c = STEM;
          } else if (circle(px, py, 0.66, 0.16, 0.115) && py < 0.24) {
            c = LEAF;
          }

          if (c) { acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; acc[3] += 255; }
        }
      }
      const n = SS * SS;
      const a = acc[3] / n;
      const i = (y * size + x) * 4;
      if (a > 0) {
        // หารด้วยจำนวนตัวอย่างที่ "โดน" จริง ไม่ใช่ทั้งหมด ไม่งั้นขอบจะคล้ำ
        const hits = acc[3] / 255;
        rgba[i] = Math.round(acc[0] / hits);
        rgba[i + 1] = Math.round(acc[1] / hits);
        rgba[i + 2] = Math.round(acc[2] / hits);
        rgba[i + 3] = Math.round(a);
      }
    }
  }
  return rgba;
}
