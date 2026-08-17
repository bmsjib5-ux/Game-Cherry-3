// ═══════════════════════════════════════════════════════════════════════════
// stats.js — คณิตศาสตร์การต่อสู้ ค่าประสบการณ์ และการดรอปของ
//
// ดึงค่าฐานจากข้อมูลกลางทั้งหมด (CLASSES / SPECIES / LOOT / WEAK / SKILL_ELEM)
// สิ่งที่ไฟล์นี้เพิ่มคือการ "แปลงเกมเทิร์นเบสให้เป็นเกมแอ็กชัน":
//   • เกมเดิมตีกันทีละเทิร์น เลือดน้อยได้ — เกม 2D โดนรัว ต้องคูณเลือดผู้เล่นขึ้น
//   • เกมเดิมมีมานาต่อเทิร์น — เกม 2D ใช้มานาฟื้นตามเวลาจริง
// ═══════════════════════════════════════════════════════════════════════════

import {
  CLASSES, CLASS_SKILLS, SPECIES, WEAK, SKILL_ELEM, LOOT,
  MATERIALS, RARITY, TIER, rollRarity, rollQuality, prefixOf,
} from '../../shared/gamedata.js';

// โอกาสคริพื้นฐานต่ออาชีพ — สรุปมาจากช่อง perk ของ CLASSES (ที่เป็นข้อความบรรยาย)
// ให้เป็นตัวเลขที่โค้ดใช้ได้จริง
export const BASE_CRIT = {
  warrior: 10, archer: 25, mage: 12, assassin: 30,
  lancer: 14, samurai: 22, coder: 18, office: 12,
};

// ความคล่องตัวต่ออาชีพ — นักธนู/นักฆ่าไวกว่า นักรบหนักกว่า
export const MOBILITY = {
  warrior: { spd: 250, jump: 700 },
  archer: { spd: 300, jump: 740 },
  mage: { spd: 255, jump: 700 },
  assassin: { spd: 330, jump: 790 },
  lancer: { spd: 265, jump: 710 },
  samurai: { spd: 295, jump: 745 },
  coder: { spd: 275, jump: 725 },
  office: { spd: 265, jump: 715 },
};

export const MAX_LEVEL = 120;

// เลเวลอัปต้องใช้เอ็กซ์พีเท่าไหร่ — โค้งกำลัง ไม่ชันเกินจนตันช่วงต้น
export const expToNext = (lv) => Math.round(28 * Math.pow(lv, 1.58) + 22 * lv);

// สเตตัสผู้เล่นที่เลเวลหนึ่ง ๆ (ยังไม่รวมของสวมใส่)
export function playerStats(cls, lv) {
  const b = CLASSES[cls] || CLASSES.warrior;
  const mob = MOBILITY[cls] || MOBILITY.warrior;
  return {
    hpMax: Math.round(b.hp * 3 + (lv - 1) * 14),
    mpMax: Math.round(42 + (lv - 1) * 6),
    mpRegen: 3.2 + lv * 0.14,          // ต่อวินาที
    atk: b.atk + (lv - 1) * 2.2,
    def: b.def + (lv - 1) * 0.6,
    crit: BASE_CRIT[cls] ?? 10,
    critDmg: 1.75,
    spd: mob.spd,
    jump: mob.jump,
  };
}

// รวมสเตตัสของสวมใส่เข้ากับสเตตัสพื้น
export function withGear(base, equipped) {
  const s = { ...base };
  for (const it of Object.values(equipped)) {
    if (!it) continue;
    const m = it.q?.m ?? 1;                       // ตัวคูณคุณภาพจาก rollQuality
    s.atk += (it.atk || 0) * m;
    s.def += (it.def || 0) * m;
    s.hpMax += Math.round((it.hp || 0) * m);
    s.crit += (it.crit || 0) * m;
    s.spd += (it.spd || 0) * 0.6;
  }
  s.hpMax = Math.round(s.hpMax);
  return s;
}

// สเตตัสมอนตามสายพันธุ์ + เลเวล
export function mobStats(speciesKey, lv) {
  const sp = SPECIES[speciesKey];
  return {
    key: speciesKey,
    name: sp.name,
    emoji: sp.emoji,
    color: sp.color,
    tier: sp.tier,
    hpMax: Math.round(sp.hp * (1 + lv * 0.3)),
    atk: Math.round(sp.atk * (1 + lv * 0.14)),
    def: Math.round(lv * 0.5),
    lv,
    exp: Math.round((sp.hp * 0.38 + lv * 2.4) * (1 + sp.tier * 0.22)),
    gold: Math.round((6 + lv * 1.7) * (1 + sp.tier * 0.3)),
    floaty: sp.animal === 'bird' || speciesKey === 'mekha' || speciesKey === 'phi',
  };
}

// สกิล 4 อันของอาชีพ (ผูกกับปุ่ม 1–4) — ดึงจาก CLASS_SKILLS ตรง ๆ
export function skillsFor(cls) {
  return (CLASS_SKILLS[cls] || CLASS_SKILLS.warrior).slice(0, 4);
}

// ── ดาเมจ ──────────────────────────────────────────────────────────────────
// คืน { dmg, crit, weak } เพื่อให้ UI แสดงเลขสีต่างกันได้
export function rollDamage(pStats, skill, mob) {
  const mult = skill ? skill.mult : 1.0;
  const elem = skill ? SKILL_ELEM[skill.id] : null;
  const weak = !!elem && WEAK[mob.key] === elem;

  let dmg = pStats.atk * mult - mob.def * 0.8;
  dmg *= 0.9 + Math.random() * 0.2;                     // แกว่ง ±10% ให้เลขไม่ซ้ำ
  if (weak) dmg *= 1.5;                                 // ตีเข้าจุดอ่อนธาตุ

  const crit = Math.random() * 100 < (pStats.crit + (skill?.critBonus || 0) * 100);
  if (crit) dmg *= pStats.critDmg;

  return { dmg: Math.max(1, Math.round(dmg)), crit, weak };
}

// ดาเมจที่มอนทำกับผู้เล่น
export function mobDamage(mob, pStats) {
  const d = mob.atk * (0.85 + Math.random() * 0.3) - pStats.def * 0.7;
  return Math.max(1, Math.round(d));
}

// ── ของดรอป ────────────────────────────────────────────────────────────────
// ใช้ rollRarity / rollQuality / prefixOf จากเกมเดิม เพื่อให้ของที่ได้จากเกม 2D
// มีสถิติและคำนำหน้า (ชำรุด…สมบูรณ์แบบ) แบบเดียวกันเป๊ะ
const EQUIPPABLE = LOOT.filter((it) => it.slot);
const MAT_KEYS = Object.keys(MATERIALS);

export function rollDrops(mob, isBoss = false) {
  const out = [];

  out.push({ kind: 'gold', amount: mob.gold + Math.round(Math.random() * mob.gold * 0.4) });

  // โอกาสได้ของสวมใส่ — บอสการันตี, มอนธรรมดาราว 18%
  if (isBoss || Math.random() < 0.18) {
    const rarity = rollRarity(isBoss);
    const pool = EQUIPPABLE.filter((it) => it.rarity === rarity);
    if (pool.length) {
      const base = pool[Math.floor(Math.random() * pool.length)];
      out.push({ kind: 'item', item: { ...base, q: rollQuality() } });
    }
  }

  // วัตถุดิบคราฟต์ — มอนแรง ๆ ให้ของดีกว่า
  if (Math.random() < 0.3) {
    const key = mob.tier >= 4 && Math.random() < 0.25
      ? 'dragonScale'
      : MAT_KEYS[Math.floor(Math.random() * (MAT_KEYS.length - 1))];
    out.push({ kind: 'mat', key, amount: 1 });
  }

  return out;
}

// ชื่อไอเทมพร้อมคำนำหน้าคุณภาพ สำหรับโชว์บนป้ายของที่ตกพื้น
export function itemLabel(item) {
  const p = prefixOf(item.q?.p);
  return `${p.emoji} ${item.name}`;
}

export const rarityColor = (r) => RARITY[r]?.color || '#8a9aa8';
export const rarityRank = (r) => TIER[r] || 1;
