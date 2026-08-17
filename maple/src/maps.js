// ═══════════════════════════════════════════════════════════════════════════
// maps.js — โครงสร้างแมพ 2D แนวเมเปิ้ล
//
// หัวใจของเกมแนวนี้คือ "foothold" = เส้นพื้นลอย ๆ ซ้อนเป็นชั้น ไม่ใช่ tilemap ตัน
// ผู้เล่นกระโดดทะลุขึ้นจากใต้แท่นได้ แต่ยืนบนแท่นได้เมื่อตกลงมาจากด้านบน
// เชื่อมชั้นด้วยเชือก/บันได และข้ามแมพด้วยพอร์ทัล
//
// แมพแรก (ทุ่งซากุระ) ออกแบบมือทั้งหมดเพื่อคุมฟีลให้ดีที่สุด
// ไบโอมที่เหลือสร้างแบบ procedural จาก BIOMES ด้วย seed คงที่ — ครบ 6 แมพโดยไม่ต้องวางมือทุกอัน
// ═══════════════════════════════════════════════════════════════════════════

import { BIOMES } from '../../shared/gamedata.js';
import { makeRng, seedOf } from './rng.js';

export const VIEW_W = 1280;
export const VIEW_H = 720;

// พื้นล่างสุดอยู่ที่ 590 ไม่ใช่ 720 — เว้นช่องล่างจอ 130px ให้ HUD (แถบสกิล/EXP/คำใบ้ปุ่ม)
// ทับได้โดยไม่บังตัวมอนที่เดินอยู่บนพื้น ส่วนที่ต่ำกว่านั้นวาดเป็นเนื้อดินทึบ
export const GROUND_Y = 590;

// ระดับแท่นแต่ละชั้น ห่างกัน 135px — มากกว่าความสูงกระโดดสูงสุด (~129px ที่ jump 700)
// จงใจให้กระโดดข้ามชั้นไม่ได้ ต้องใช้เชือก เป็นหัวใจการวางแมพแบบเมเปิ้ล
export const TIERS = [455, 320, 185];

// ── แมพแรก: วางมือ ─────────────────────────────────────────────────────────
// สี่ชั้น (พื้น GROUND_Y แล้วไล่ขึ้น T1/T2/T3) เชือกทุกเส้นถูกตรวจแล้วว่าปลายทั้งสองข้าง
// ตกลงบนแท่นจริง ไม่มีเชือกที่ไต่ขึ้นไปแล้วไม่มีพื้นรอรับ
const [T1, T2, T3] = TIERS;

const MEADOW = {
  id: 'meadow',
  biome: 'meadow',
  width: 2400,
  footholds: [
    { x: 0, y: GROUND_Y, w: 2400, ground: true },
    // ชั้น 1
    { x: 180, y: T1, w: 300 },
    { x: 640, y: T1, w: 260 },
    { x: 1080, y: T1, w: 340 },
    { x: 1600, y: T1, w: 280 },
    { x: 2020, y: T1, w: 300 },
    // ชั้น 2
    { x: 360, y: T2, w: 280 },
    { x: 900, y: T2, w: 320 },
    { x: 1420, y: T2, w: 300 },
    { x: 1900, y: T2, w: 260 },
    // ชั้น 3 — ชั้นบนสุด มอนแรร์อยู่ตรงนี้
    { x: 800, y: T3, w: 320 },
    { x: 1300, y: T3, w: 340 },
  ],
  ropes: [
    { x: 300, top: T1, bottom: GROUND_Y, kind: 'rope' },
    { x: 760, top: T1, bottom: GROUND_Y, kind: 'ladder' },
    { x: 1240, top: T1, bottom: GROUND_Y, kind: 'rope' },
    { x: 1720, top: T1, bottom: GROUND_Y, kind: 'ladder' },
    { x: 2140, top: T1, bottom: GROUND_Y, kind: 'rope' },
    { x: 460, top: T2, bottom: T1, kind: 'ladder' },
    { x: 1100, top: T2, bottom: T1, kind: 'rope' },
    { x: 1650, top: T2, bottom: T1, kind: 'ladder' },
    { x: 2100, top: T2, bottom: T1, kind: 'rope' },
    { x: 950, top: T3, bottom: T2, kind: 'rope' },
    { x: 1500, top: T3, bottom: T2, kind: 'ladder' },
  ],
  spawns: [
    { x: 500, y: GROUND_Y, species: 'mochi', n: 3 },
    { x: 1500, y: GROUND_Y, species: 'baibua', n: 3 },
    { x: 2100, y: GROUND_Y, species: 'mochi', n: 2 },
    { x: 300, y: T1, species: 'baibua', n: 2 },
    { x: 1200, y: T1, species: 'nam', n: 2 },
    { x: 1700, y: T1, species: 'mochi', n: 2 },
    { x: 480, y: T2, species: 'mekha', n: 2 },
    { x: 1000, y: T2, species: 'plerng', n: 2 },
    { x: 1980, y: T2, species: 'mekha', n: 1 },
    { x: 950, y: T3, species: 'plerng', n: 2 },
    { x: 1450, y: T3, species: 'nam', n: 2 },
  ],
  // จุดเกิดต้องห่างจากพอร์ทัล (อยู่ที่ x=60 และ width-60) เกินระยะตรวจจับ 62px
  // ไม่งั้นเดินเข้าแมพใหม่ทั้งที่ยังกด ↑ อยู่ จะถูกส่งกลับแมพเดิมทันที
  spawnPoints: { left: { x: 190, y: GROUND_Y }, right: { x: 2210, y: GROUND_Y } },
};

// ── สร้างแมพจาก biome แบบ procedural ────────────────────────────────────────
// วางแท่นเป็นชั้นจากล่างขึ้นบน แล้วต่อเชือกเฉพาะคู่แท่นที่ x ซ้อนกันจริง
// ทำให้ทุกแท่นที่สร้างขึ้นมาไปถึงได้ ไม่มีแท่นลอยตายที่ปีนไม่ถึง
function generateMap(biome) {
  const rng = makeRng(seedOf(biome.id));
  const width = rng.int(2200, 3000);
  const tiers = TIERS;
  const footholds = [{ x: 0, y: GROUND_Y, w: width, ground: true }];
  const ropes = [];
  const spawns = [];

  // ชั้นล่างสุดคือพื้น — ใช้เป็นฐานให้ชั้นถัดไปต่อเชือกลงมา
  let below = [{ x: 0, y: GROUND_Y, w: width }];

  for (const tierY of tiers) {
    const row = [];
    // เดินจากซ้ายไปขวา วางแท่นเว้นช่องให้กระโดดข้ามได้ (ช่องกว้าง 120–260)
    let x = rng.int(120, 260);
    while (x < width - 300) {
      const w = rng.int(240, 380);
      row.push({ x, y: tierY, w });
      x += w + rng.int(120, 260);
    }
    for (const p of row) {
      footholds.push(p);
      // หาแท่นชั้นล่างที่ซ้อน x กับแท่นนี้ เพื่อวางเชือกเชื่อม
      const overlap = below.filter((b) => b.x < p.x + p.w - 40 && b.x + b.w > p.x + 40);
      if (overlap.length) {
        const b = rng.pick(overlap);
        const lo = Math.max(p.x + 40, b.x + 40);
        const hi = Math.min(p.x + p.w - 40, b.x + b.w - 40);
        ropes.push({
          x: Math.round(rng.range(lo, hi)),
          top: tierY,
          bottom: b.y,
          kind: rng.chance(0.5) ? 'rope' : 'ladder',
        });
      }
      if (rng.chance(0.8)) {
        spawns.push({
          x: Math.round(p.x + p.w / 2),
          y: tierY,
          species: rng.pick(biome.pool),
          n: rng.int(1, 3),
        });
      }
    }
    // แท่นที่ปีนถึงแล้วเท่านั้นจึงเป็นฐานของชั้นถัดไป
    below = row.filter((p) => ropes.some((r) => r.top === tierY && r.x > p.x && r.x < p.x + p.w));
    if (!below.length) break; // ชั้นนี้ไปไม่ถึงเลย — หยุดสร้างชั้นบนต่อ
  }

  // มอนบนพื้นดิน กระจายตลอดความกว้างแมพ
  for (let gx = 300; gx < width - 200; gx += rng.int(380, 620)) {
    spawns.push({ x: gx, y: GROUND_Y, species: rng.pick(biome.pool), n: rng.int(2, 3) });
  }

  return {
    id: biome.id,
    biome: biome.id,
    width,
    footholds,
    ropes,
    spawns,
    spawnPoints: { left: { x: 190, y: GROUND_Y }, right: { x: width - 190, y: GROUND_Y } },
  };
}

// ── ประกอบแมพทั้งหมด + ต่อพอร์ทัลเรียงตามลำดับ biome ────────────────────────
const ORDER = BIOMES.map((b) => b.id);

export const MAPS = {};
for (const b of BIOMES) {
  MAPS[b.id] = b.id === 'meadow' ? { ...MEADOW } : generateMap(b);
}

// พอร์ทัลซ้าย = ถอยกลับ biome ก่อนหน้า, ขวา = ไป biome ถัดไป
for (let i = 0; i < ORDER.length; i++) {
  const m = MAPS[ORDER[i]];
  m.portals = [];
  if (i > 0) {
    m.portals.push({ x: 60, y: GROUND_Y, to: ORDER[i - 1], spawn: 'right' });
  }
  if (i < ORDER.length - 1) {
    m.portals.push({ x: m.width - 60, y: GROUND_Y, to: ORDER[i + 1], spawn: 'left' });
  }
}

export const biomeOf = (mapId) => BIOMES.find((b) => b.id === mapId) || BIOMES[0];

// ระดับมอนในแมพ — ไล่จาก lvMin ถึง lvMax ตามความสูงของชั้น (ชั้นบน = แรงกว่า)
export function mobLevel(biome, y) {
  const t = Math.min(1, Math.max(0, (GROUND_Y - y) / (GROUND_Y - TIERS[TIERS.length - 1])));
  return Math.round(biome.lvMin + (biome.lvMax - biome.lvMin) * (0.15 + 0.55 * t));
}
