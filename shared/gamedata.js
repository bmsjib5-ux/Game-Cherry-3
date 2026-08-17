// ═══════════════════════════════════════════════════════════════════════════
// gamedata.js — ตารางข้อมูลเกมกลาง (species / biomes / classes / skills / loot)
//
// ไฟล์นี้สกัดมาจากส่วนหัวของ cherry-adventure.jsx เพื่อให้เกม 3D เดิม และเกม 2D
// แนวเมเปิ้ล (maple/) ใช้ตัวเลขสมดุลชุดเดียวกัน — แก้ที่นี่ที่เดียวมีผลทั้งสองเกม
//
// สีทั้งหมดเป็นเลขฐานสิบหก (0xRRGGBB) ใช้ได้ทั้งกับ three.js และ Phaser
// ═══════════════════════════════════════════════════════════════════════════

// ---------- Monster species ----------
export const SPECIES = {
  mochi: { name: "โมจิ", emoji: "🐰", color: 0xf6a8c0, hp: 30, atk: 5, catch: 0.5, tier: 1, desc: "กระต่ายก้อนกลมขี้อ้อน" },
  baibua: { name: "ใบบัว", emoji: "🍃", color: 0x8fc98a, hp: 40, atk: 6, catch: 0.45, tier: 1, desc: "สไลม์ใบไม้ใจดี" },
  mekha: { name: "เมฆา", emoji: "☁️", color: 0x9ec3ef, hp: 45, atk: 7, catch: 0.35, tier: 2, desc: "ก้อนเมฆลอยได้" },
  plerng: { name: "เพลิง", emoji: "🔥", color: 0xf09a5a, hp: 50, atk: 9, catch: 0.3, tier: 2, desc: "จิ้งจอกไฟจอมซน" },
  kirara: { name: "คิราระ", emoji: "⭐", color: 0xf5d05a, hp: 60, atk: 11, catch: 0.2, tier: 3, desc: "ดาวทองสุดหายาก!" },
  phi: { name: "ผีราตรี", emoji: "👻", color: 0xdcdcf0, hp: 75, atk: 13, catch: 0.12, tier: 3, desc: "ภูตแห่งดงไม้แห้ง โผล่เฉพาะกลางคืน" },
  // 🐾 animal-type monsters (scarier at higher level)
  nam: { name: "น้ำเงี้ยว", emoji: "🐟", color: 0x4aa0d0, hp: 42, atk: 7, catch: 0.4, tier: 1, desc: "ปลาปีศาจแห่งลำธาร", animal: "fish", weak: "wind" },
  khiao: { name: "เขี้ยวป่า", emoji: "🐺", color: 0x8a8a92, hp: 55, atk: 10, catch: 0.28, tier: 2, desc: "หมาป่าดุร้าย เขี้ยวคม", animal: "wolf", weak: "fire" },
  ngu: { name: "นาคาน้อย", emoji: "🐍", color: 0x6ab04a, hp: 60, atk: 11, catch: 0.24, tier: 2, desc: "งูพิษเลื้อยเงียบ", animal: "snake", weak: "earth" },
  paksi: { name: "เวหาปักษี", emoji: "🦅", color: 0xc98a4a, hp: 65, atk: 12, catch: 0.2, tier: 3, desc: "อินทรีจอมโฉบ", animal: "bird", weak: "ice" },
  saming: { name: "เสือสมิง", emoji: "🐯", color: 0xe0a040, hp: 80, atk: 14, catch: 0.14, tier: 3, desc: "เสือปีศาจ ราชาแห่งไพร", animal: "tiger", weak: "water" },
  garuda: { name: "ครุฑอสูร", emoji: "🦁", color: 0xd07a2a, hp: 100, atk: 17, catch: 0.1, tier: 4, desc: "อสูรกายพญาครุฑ", animal: "beast", weak: "light" },
  // ☁️ sky-realm monsters (map 6: floating islands)
  wayu: { name: "วายุเทพ", emoji: "🌪️", color: 0xa0e0f0, hp: 90, atk: 16, catch: 0.14, tier: 4, desc: "เทพสายลมแห่งเวหา", animal: "bird", weak: "earth" },
  taara: { name: "ธาราทิพย์", emoji: "💫", color: 0xc0a0f5, hp: 130, atk: 20, catch: 0.08, tier: 5, desc: "เทพเจ้าดวงดาวสูงสุด!", weak: "arcane" },
};
export const SPAWN_POOL = ["mochi", "mochi", "baibua", "baibua", "mekha", "plerng", "nam", "khiao", "ngu", "paksi"]; // kirara is a rare roll
export const FLOATY = { mekha: true, phi: true, paksi: true, wayu: true, taara: true }; // species that hover
// 🗺️ multiple adventure maps (biomes) — warp between them
export const BIOMES = [
  { id: "meadow", name: "ทุ่งซากุระ", emoji: "🌸", lvMin: 1, lvMax: 10, ground: 0xa8c98a, sky: 0xf0fae2, fog: 0xf0fae2, pool: ["mochi", "baibua", "mekha", "plerng", "nam"], tree: "normal", boss: "baibua", bossName: "ราชินีบุปผา 🌸" },
  { id: "desert", name: "ทะเลทรายเพลิง", emoji: "🏜️", lvMin: 20, lvMax: 40, ground: 0xe8cc8a, sky: 0xfbe8c0, fog: 0xf5dca8, pool: ["plerng", "ngu", "khiao", "saming"], tree: "dead", boss: "saming", bossName: "ราชาเสือทะเลทราย 🐯" },
  { id: "snow", name: "ทุ่งหิมะเยือก", emoji: "❄️", lvMin: 40, lvMax: 60, ground: 0xe4ecf5, sky: 0xdce8f5, fog: 0xd0e0f0, pool: ["mekha", "paksi", "nam", "kirara"], tree: "snow", boss: "paksi", bossName: "พญาอินทรีเยือกแข็ง 🦅" },
  { id: "cave", name: "ถ้ำมรกต", emoji: "🕳️", lvMin: 60, lvMax: 80, ground: 0x5a6a5a, sky: 0x2a3a3a, fog: 0x1a2a2a, pool: ["ngu", "khiao", "phi", "garuda"], tree: "none", boss: "garuda", bossName: "อสูรครุฑเงามืด 🦁" },
  { id: "volcano", name: "ภูเขาไฟอสูร", emoji: "🌋", lvMin: 80, lvMax: 99, ground: 0x6a3a30, sky: 0x3a1810, fog: 0x5a2418, pool: ["plerng", "saming", "garuda", "phi"], tree: "dead", boss: "garuda", bossName: "พญาอัคคีอสูร 🔥" },
  { id: "sky", name: "เกาะลอยสวรรค์", emoji: "☁️", lvMin: 99, lvMax: 120, ground: 0xcfe0f0, sky: 0xbfe0ff, fog: 0xd8ecff, pool: ["wayu", "taara", "paksi", "kirara"], tree: "none", boss: "taara", bossName: "เทพเจ้าดวงดาว 💫" },
];
export const EVOLVED = { mochi: "โมจิคิง", baibua: "บัวหลวง", mekha: "พายุเมฆ", plerng: "อัคคีวัต", kirara: "โนวา", phi: "ภูตราชัน", nam: "วารีนาคี", khiao: "หมาป่าจันทรา", ngu: "พญานาคา", paksi: "สุบรรณราช", saming: "เสือสมิงราชันย์", garuda: "มหาครุฑเทพ", wayu: "พายุเทพเจ้า", taara: "จักรวาลเทพ" };

// ---------- Loot: weapons & outfits ----------
export const RARITY = {
  common: { name: "ทั่วไป", color: "#8a9aa8" },
  rare: { name: "หายาก", color: "#59a0e8" },
  epic: { name: "มหากาพย์", color: "#b07ae0" },
  secret: { name: "SECRET", color: "#f5c542" },
  dragon: { name: "มังกร 🐉", color: "#e8552e" },
};
export const TIER = { common: 1, rare: 2, epic: 3, secret: 4, dragon: 5 };
export const ELEM_GLOW = {
  fire: 0xf5652e, ice: 0x9adcf5, wind: 0xb8e8c0, water: 0x59a0e8,
  earth: 0xc09a5a, light: 0xffe28a, arcane: 0xb07ae0, dragon: 0xff4a2a,
};
// ⚔️🛡️💨 ARCHETYPES — at every tier each armour slot comes in three flavours that spend the
// SAME stat budget differently, so gearing up becomes a choice instead of an auto-equip.
export const STAT_COST = { atk: 2.2, hp: 0.45, def: 2.0, spd: 0.8, eva: 1.4, crit: 1.1 }; // budget cost per +1
export const TIER_BUDGET = { rare: 26, epic: 50, secret: 82 };
export const ARCHETYPES = [
  { k: "atk", name: "จู่โจม", emoji: "⚔️", w: { atk: 5, crit: 3, hp: 1, def: 1, spd: 0, eva: 0 } },
  { k: "def", name: "ปราการ", emoji: "🛡️", w: { atk: 1, crit: 0, hp: 5, def: 4, spd: 0, eva: 1 } },
  { k: "agi", name: "ว่องไว", emoji: "💨", w: { atk: 2, crit: 2, hp: 1, def: 1, spd: 4, eva: 3 } },
];
// ✨ AFFIXES — real effects, not just numbers. An epic with a good affix can beat a plain secret.
export const AFFIXES = {
  vamp:   { name: "ดูดเลือด",   emoji: "🩸", desc: "ดูดเลือด 8% ของดาเมจ" },
  double: { name: "ตีสองครั้ง", emoji: "⚡", desc: "โอกาส 12% โจมตีซ้ำ" },
  burn:   { name: "เพลิงกรีด",  emoji: "🔥", desc: "โอกาส 25% ติดไฟ" },
  gold:   { name: "ล่าสมบัติ",  emoji: "💰", desc: "ได้ทอง +25%" },
  thorns: { name: "หนามสะท้อน", emoji: "🌵", desc: "สะท้อนดาเมจ 12%" },
  mana:   { name: "ดูดมานา",    emoji: "🔮", desc: "ฟื้น 3 MP เมื่อโจมตี" },
};
// slot flavour: name fragments + emoji per slot × archetype
export const ARCH_NAMES = {
  outfit: { atk: ["เสื้อคลุมนักรบ", "🥋"], def: ["เกราะปราการ", "🛡️"], agi: ["ชุดพรายลม", "🎐"] },
  hat:    { atk: ["หมวกนักล่า", "🪖"],     def: ["หมวกเหล็กกล้า", "⛑️"], agi: ["หมวกขนนก", "🪶"] },
  mask:   { atk: ["หน้ากากอสูร", "👹"],    def: ["หน้ากากศิลา", "🗿"],   agi: ["หน้ากากสายลม", "🌬️"] },
  gloves: { atk: ["ถุงมือทมิฬ", "✊"],      def: ["ถุงมือเหล็ก", "🧱"],   agi: ["ถุงมือไหมพราย", "🕸️"] },
  pants:  { atk: ["กางเกงนักรบ", "🩳"],    def: ["สนับเกราะหนา", "🦿"],  agi: ["กางเกงว่องไว", "🩱"] },
  shoes:  { atk: ["บูทบุกตะลุย", "🥾"],    def: ["บูทเหล็กหนัก", "🦶"],  agi: ["รองเท้าพราย", "🩰"] },
};
export const RAR_TAG = { rare: "ชั้นดี", epic: "ชั้นเลิศ", secret: "ระดับตำนาน" };
export const RAR_REQ = { rare: 5, epic: 12, secret: 22 };
export const RAR_ELEM = { rare: "earth", epic: "arcane", secret: "light" };
// affix assignment: epics get one, secrets get a stronger pick
export const ARCH_AFFIX = {
  rare:   { atk: "gold",  def: "thorns", agi: "mana" },
  epic:   { atk: "burn",  def: "vamp",   agi: "mana" },
  secret: { atk: "vamp",  def: "thorns", agi: "double" },
};
// spend `budget` across stats using the archetype's weights
export const genArmour = () => {
  const out = [];
  const slots = ["outfit", "hat", "mask", "gloves", "pants", "shoes"];
  for (const slot of slots) {
    for (const rar of ["rare", "epic", "secret"]) {
      for (const a of ARCHETYPES) {
        const wTotal = Object.values(a.w).reduce((x, y) => x + y, 0);
        const item = {
          id: `${slot[0]}${rar[0]}${a.k}`, slot,
          name: `${ARCH_NAMES[slot][a.k][0]}${RAR_TAG[rar]}`,
          emoji: ARCH_NAMES[slot][a.k][1],
          rarity: rar, elem: RAR_ELEM[rar], req: RAR_REQ[rar],
        };
        for (const st of Object.keys(STAT_COST)) {
          const share = (a.w[st] || 0) / wTotal;          // fraction of the budget
          const v = Math.round((TIER_BUDGET[rar] * share) / STAT_COST[st]);
          if (v > 0) item[st] = v;
        }
        const af = ARCH_AFFIX[rar] && ARCH_AFFIX[rar][a.k];
        if (af) item.affix = af;
        out.push(item);
      }
    }
  }
  return out;
};
export const LOOT = [
  // starter weapons per class (ได้รับตอนเริ่มเกม)
  { id: "st_w", slot: "weapon", name: "ดาบฝึกหัด", emoji: "🗡️", rarity: "common", atk: 3, cls: "warrior", starter: true },
  { id: "st_a", slot: "weapon", name: "ธนูไม้ซ้อม", emoji: "🏹", rarity: "common", atk: 3, cls: "archer", starter: true },
  { id: "st_m", slot: "weapon", name: "คทาฝึกเวท", emoji: "🪄", rarity: "common", atk: 3, cls: "mage", starter: true },
  { id: "st_s", slot: "weapon", name: "มีดสั้นฝึกหัด", emoji: "🔪", rarity: "common", atk: 3, cls: "assassin", starter: true },
  { id: "st_l", slot: "weapon", name: "หอกฝึกหัด", emoji: "🔱", rarity: "common", atk: 3, cls: "lancer", starter: true },
  { id: "st_k", slot: "weapon", name: "ดาบไม้ซ้อม", emoji: "🗡️", rarity: "common", atk: 3, cls: "samurai", starter: true },
  { id: "st_o", slot: "weapon", name: "ปากกาฝึกงาน", emoji: "🖊️", rarity: "common", atk: 3, cls: "office", starter: true },
  { id: "st_c", slot: "weapon", name: "คีย์บอร์ดฝึกหัด", emoji: "⌨️", rarity: "common", atk: 3, cls: "coder", starter: true },
  // ⚔️ samurai katanas — multiple tiers, each with a distinct look
  { id: "kf", slot: "weapon", name: "คาตานะเพลิง", emoji: "🔥", rarity: "rare", atk: 7, elem: "fire", cls: "samurai", req: 5 },
  { id: "ki", slot: "weapon", name: "คาตานะเยือกเย็น", emoji: "❄️", rarity: "epic", atk: 11, def: 2, elem: "ice", cls: "samurai", req: 10 },
  { id: "kw", slot: "weapon", name: "คาตานะวายุ", emoji: "🍃", rarity: "epic", atk: 13, elem: "wind", cls: "samurai", req: 15 },
  { id: "kl", slot: "weapon", name: "คาตานะฟ้าสวรรค์", emoji: "🌟", rarity: "secret", atk: 16, def: 3, elem: "light", cls: "samurai", req: 22 },
  { id: "kl2", slot: "weapon", name: "ดาบซากุระราตรี", emoji: "🌸", rarity: "secret", atk: 17, crit: 12, spd: 6, elem: "wind", cls: "samurai", req: 25, affix: "double" },
  { id: "kd", slot: "weapon", name: "คาตานะมังกร", emoji: "🐉", rarity: "dragon", atk: 22, def: 5, hp: 20, elem: "fire", cls: "samurai", req: 28, set: "dragon" },
  // ⚔️ warrior elemental swords
  // ⚔️ WARRIOR swords — unlock every 5 levels (req)
  { id: "wfw", slot: "weapon", name: "ดาบเพลิงอัคคี", emoji: "🔥", rarity: "rare", atk: 6, elem: "fire", cls: "warrior", req: 5 },
  { id: "wiw", slot: "weapon", name: "ดาบน้ำแข็งพันปี", emoji: "❄️", rarity: "epic", atk: 10, def: 3, elem: "ice", cls: "warrior", req: 10 },
  { id: "wew", slot: "weapon", name: "ดาบปฐพีศิลา", emoji: "🌍", rarity: "epic", atk: 11, def: 5, hp: 15, elem: "earth", cls: "warrior", req: 15 },
  { id: "www", slot: "weapon", name: "ดาบเทพวายุ", emoji: "🌪️", rarity: "secret", atk: 16, def: 4, crit: 8, elem: "wind", cls: "warrior", req: 20 },
  { id: "wlw", slot: "weapon", name: "ดาบเทพจันทรา", emoji: "🌙", rarity: "secret", atk: 18, hp: 20, crit: 10, elem: "light", cls: "warrior", req: 25 },
  // 🏹 ARCHER bows
  { id: "wfa", slot: "weapon", name: "ธนูเพลิง", emoji: "🔥", rarity: "rare", atk: 6, elem: "fire", cls: "archer", req: 5 },
  { id: "wia", slot: "weapon", name: "ธนูน้ำแข็ง", emoji: "❄️", rarity: "epic", atk: 10, crit: 5, elem: "ice", cls: "archer", req: 10 },
  { id: "wea", slot: "weapon", name: "ธนูพสุธา", emoji: "🌍", rarity: "epic", atk: 11, def: 3, crit: 6, elem: "earth", cls: "archer", req: 15 },
  { id: "wwa", slot: "weapon", name: "ธนูพายุวายุ", emoji: "🌪️", rarity: "secret", atk: 15, spd: 8, crit: 10, elem: "wind", cls: "archer", req: 20 },
  { id: "wla", slot: "weapon", name: "ธนูแสงดารา", emoji: "🌟", rarity: "secret", atk: 17, crit: 15, eva: 5, elem: "light", cls: "archer", req: 25 },
  // 🔮 MAGE staves
  { id: "wfm", slot: "weapon", name: "คทาเพลิงนรก", emoji: "🔥", rarity: "rare", atk: 6, elem: "fire", cls: "mage", req: 5 },
  { id: "wim", slot: "weapon", name: "คทาน้ำแข็งนิรันดร์", emoji: "❄️", rarity: "epic", atk: 10, elem: "ice", cls: "mage", req: 10 },
  { id: "wtm", slot: "weapon", name: "คทาวารีชล", emoji: "💧", rarity: "epic", atk: 11, hp: 20, elem: "water", cls: "mage", req: 15 },
  { id: "wwm", slot: "weapon", name: "คทาจันทราวายุ", emoji: "🌪️", rarity: "secret", atk: 15, eva: 5, elem: "wind", cls: "mage", req: 20 },
  { id: "wlm", slot: "weapon", name: "คทาสุริยเทพ", emoji: "🌟", rarity: "secret", atk: 18, hp: 15, elem: "light", cls: "mage", req: 25 },
  // 🗡️ ASSASSIN dual daggers
  { id: "wfs", slot: "weapon", name: "มีดคู่เพลิงพิษ", emoji: "🔥", rarity: "rare", atk: 6, crit: 8, elem: "fire", cls: "assassin", req: 5 },
  { id: "wis", slot: "weapon", name: "มีดคู่เกล็ดน้ำแข็ง", emoji: "❄️", rarity: "epic", atk: 9, crit: 10, elem: "ice", cls: "assassin", req: 10 },
  { id: "wes", slot: "weapon", name: "มีดคู่พสุธา", emoji: "🌍", rarity: "epic", atk: 10, def: 3, crit: 8, elem: "earth", cls: "assassin", req: 15 },
  { id: "wws", slot: "weapon", name: "มีดคู่วายุเงา", emoji: "🌪️", rarity: "secret", atk: 14, spd: 10, crit: 15, eva: 5, elem: "wind", cls: "assassin", req: 20 },
  { id: "wls", slot: "weapon", name: "มีดคู่จันทราลับ", emoji: "🌙", rarity: "secret", atk: 16, crit: 20, eva: 6, elem: "light", cls: "assassin", req: 25 },
  { id: "wDs", slot: "weapon", name: "มีดคู่เขี้ยวมังกร", emoji: "🐉", rarity: "dragon", atk: 20, crit: 15, eva: 5, elem: "dragon", cls: "assassin", req: 30 },
  // 💼 OFFICE WORKER — magic pens (the mightiest weapon)
  { id: "wfo", slot: "weapon", name: "ปากกาไฟลนก้น", emoji: "🔥", rarity: "rare", atk: 6, mp: 2, elem: "fire", cls: "office", req: 5 },
  { id: "wio", slot: "weapon", name: "ปากกาแอร์ออฟฟิศ", emoji: "❄️", rarity: "epic", atk: 10, def: 3, elem: "ice", cls: "office", req: 10 },
  { id: "weo", slot: "weapon", name: "ปากกาตรายางศิลา", emoji: "🌍", rarity: "epic", atk: 11, hp: 15, def: 3, elem: "earth", cls: "office", req: 15 },
  { id: "wwo", slot: "weapon", name: "ปากกาเดดไลน์", emoji: "🌪️", rarity: "secret", atk: 15, spd: 10, crit: 8, elem: "wind", cls: "office", req: 20 },
  { id: "wlo", slot: "weapon", name: "ปากกาทองผู้บริหาร", emoji: "🌟", rarity: "secret", atk: 17, mp: 6, crit: 12, elem: "light", cls: "office", req: 25 },
  // 💻 ARCANE CODER — magic keyboards
  { id: "wfc", slot: "weapon", name: "คีย์บอร์ดโอเวอร์คล็อก", emoji: "🔥", rarity: "rare", atk: 6, mp: 3, elem: "fire", cls: "coder", req: 5 },
  { id: "wic", slot: "weapon", name: "คีย์บอร์ดลิควิดคูล", emoji: "❄️", rarity: "epic", atk: 10, def: 3, elem: "ice", cls: "coder", req: 10 },
  { id: "wec", slot: "weapon", name: "คีย์บอร์ดเมนบอร์ด", emoji: "🌍", rarity: "epic", atk: 11, hp: 14, mp: 4, elem: "earth", cls: "coder", req: 15 },
  { id: "wwc", slot: "weapon", name: "คีย์บอร์ดควอนตัม", emoji: "🌪️", rarity: "secret", atk: 15, spd: 10, crit: 10, elem: "wind", cls: "coder", req: 20 },
  { id: "wlc", slot: "weapon", name: "คีย์บอร์ดนิวรัล", emoji: "🌟", rarity: "secret", atk: 17, mp: 8, crit: 12, elem: "light", cls: "coder", req: 25 },
  // 🔱 LANCER — spears
  { id: "wfl", slot: "weapon", name: "หอกเพลิงพิฆาต", emoji: "🔥", rarity: "rare", atk: 7, elem: "fire", cls: "lancer", req: 5 },
  { id: "wil", slot: "weapon", name: "หอกน้ำแข็งนิรันดร์", emoji: "❄️", rarity: "epic", atk: 10, def: 3, elem: "ice", cls: "lancer", req: 10 },
  { id: "wel", slot: "weapon", name: "หอกพสุธาศิลา", emoji: "🌍", rarity: "epic", atk: 12, def: 5, hp: 15, elem: "earth", cls: "lancer", req: 15 },
  { id: "wwl", slot: "weapon", name: "หอกวายุทะลวง", emoji: "🌪️", rarity: "secret", atk: 16, spd: 8, crit: 8, elem: "wind", cls: "lancer", req: 20 },
  { id: "wll", slot: "weapon", name: "หอกเทพจันทรา", emoji: "🌙", rarity: "secret", atk: 18, hp: 18, crit: 10, elem: "light", cls: "lancer", req: 25 },
  { id: "o1", slot: "outfit", name: "ผ้าพันคอนุ่มฟู", emoji: "🧣", rarity: "common", hp: 10 },
  { id: "o2", slot: "outfit", name: "ชุดใบไม้พราย", emoji: "🍀", rarity: "rare", hp: 20, def: 2, elem: "earth" },
  { id: "o3", slot: "outfit", name: "เกราะเมฆานิล", emoji: "🌩️", rarity: "epic", hp: 30, def: 5, elem: "water" },
  { id: "oS", slot: "outfit", name: "อาภรณ์ดวงดาว", emoji: "✨", rarity: "secret", hp: 50, def: 8, atk: 5, eva: 5, elem: "light" },
  { id: "h1", slot: "hat", name: "หมวกฟางชาวสวน", emoji: "👒", rarity: "common", def: 2 },
  { id: "h2", slot: "hat", name: "หมวกแม่มดราตรี", emoji: "🎩", rarity: "epic", atk: 4, def: 2, elem: "arcane" },
  { id: "hS", slot: "hat", name: "มงกุฎแสงดารา", emoji: "👑", rarity: "secret", atk: 6, hp: 20, def: 4, crit: 6, elem: "light" },
  { id: "m1", slot: "mask", name: "แว่นหัวใจ", emoji: "🕶️", rarity: "common", def: 1, eva: 3 },
  { id: "m2", slot: "mask", name: "หน้ากากจิ้งจอก", emoji: "🦊", rarity: "rare", atk: 3, crit: 8, elem: "fire" },
  { id: "g1", slot: "gloves", name: "ถุงมือขนนุ่ม", emoji: "🧤", rarity: "common", atk: 1, def: 1 },
  { id: "g2", slot: "gloves", name: "ถุงมือนักสู้", emoji: "🥊", rarity: "epic", atk: 6, elem: "wind" },
  { id: "gS", slot: "gloves", name: "กำปั้นเทพวายุ", emoji: "🌪️", rarity: "secret", atk: 10, def: 3, spd: 5, crit: 10, elem: "wind" },
  { id: "p1", slot: "pants", name: "กางเกงยีนส์ฟ้า", emoji: "👖", rarity: "common", hp: 8 },
  { id: "p2", slot: "pants", name: "กางเกงเกราะนิล", emoji: "🩹", rarity: "epic", hp: 15, def: 4, elem: "earth" },
  { id: "s1", slot: "shoes", name: "ผ้าใบชมพูหวาน", emoji: "👟", rarity: "common", def: 2, spd: 5, eva: 4 },
  { id: "s2", slot: "shoes", name: "บูทสายฟ้า", emoji: "⚡", rarity: "epic", def: 3, spd: 15, elem: "wind" },
  // 🐉 THE DRAGON SET — 7 pieces, ultimate tier
  { id: "wDw", slot: "weapon", name: "ดาบเขี้ยวมังกร", emoji: "🐉", rarity: "dragon", atk: 22, def: 6, elem: "dragon", cls: "warrior", req: 30 },
  { id: "wDa", slot: "weapon", name: "ธนูอสูรมังกร", emoji: "🐉", rarity: "dragon", atk: 21, crit: 12, elem: "dragon", cls: "archer", req: 30 },
  { id: "wDm", slot: "weapon", name: "คทาราชันมังกร", emoji: "🐉", rarity: "dragon", atk: 21, hp: 25, elem: "dragon", cls: "mage", req: 30 },
  { id: "wDl", slot: "weapon", name: "หอกเขี้ยวมังกร", emoji: "🐉", rarity: "dragon", atk: 22, def: 5, crit: 8, elem: "dragon", cls: "lancer", req: 30 },
  { id: "wDo", slot: "weapon", name: "ปากกามังกร CEO", emoji: "🐉", rarity: "dragon", atk: 21, mp: 10, crit: 12, elem: "dragon", cls: "office", req: 30 },
  { id: "wDc", slot: "weapon", name: "คีย์บอร์ดมังกรดิจิทัล", emoji: "🐉", rarity: "dragon", atk: 21, mp: 12, crit: 14, elem: "dragon", cls: "coder", req: 30 },
  { id: "oD", slot: "outfit", name: "เกราะเกล็ดมังกร", emoji: "🐉", rarity: "dragon", hp: 70, def: 12, atk: 6, elem: "dragon" },
  { id: "hD", slot: "hat", name: "หมวกเขามังกร", emoji: "🐉", rarity: "dragon", atk: 8, hp: 30, def: 6, elem: "dragon" },
  { id: "mD", slot: "mask", name: "หน้ากากอสุรมังกร", emoji: "🐉", rarity: "dragon", atk: 10, def: 4, crit: 10, eva: 4, elem: "dragon" },
  { id: "gD", slot: "gloves", name: "กรงเล็บมังกร", emoji: "🐉", rarity: "dragon", atk: 14, def: 3, elem: "dragon" },
  { id: "pD", slot: "pants", name: "สนับเกล็ดมังกร", emoji: "🐉", rarity: "dragon", hp: 40, def: 8, elem: "dragon" },
  { id: "sD", slot: "shoes", name: "รองเท้ามังกรเหิน", emoji: "🐉", rarity: "dragon", def: 5, spd: 20, eva: 6, crit: 5, elem: "dragon" },
].concat(genArmour()); // ⚔️🛡️💨 + 54 archetype pieces (3 flavours × 6 slots × 3 tiers)
// 🏷️ build stamp — shown on the title screen so you can tell at a glance whether a
// browser is running a stale cached copy (GitHub Pages CDN caches index.html ~10 min).
export const BUILD_VER = "2026.07.16.0633";
export const SLOT_NAMES = { weapon: "อาวุธ", outfit: "ชุด", hat: "หมวก", mask: "หน้ากาก", gloves: "ถุงมือ", pants: "กางเกง", shoes: "รองเท้า" };
export const SLOT_ICON = { weapon: "⚔️", outfit: "👕", hat: "🎩", mask: "😷", gloves: "🧤", pants: "👖", shoes: "👟" };
export const SLOTS = Object.keys(SLOT_NAMES);
export const EMPTY_EQUIP = () => ({ weapon: null, outfit: null, hat: null, mask: null, gloves: null, pants: null, shoes: null });

// ---------- Elemental skills (unlock by level) ----------
export const ELEMENTS = {
  fire: { name: "เพลิงผลาญ", emoji: "🔥", lv: 1, color: 0xf5652e, desc: "×2.2 + เผาไหม้ 2 เทิร์น" },
  ice: { name: "น้ำแข็งกักขัง", emoji: "❄️", lv: 3, color: 0x9adcf5, desc: "×1.6 + แช่แข็งข้ามเทิร์น" },
  wind: { name: "พายุเฉือน", emoji: "🌪️", lv: 5, color: 0xb8e8c0, desc: "ฟันรัว 2 ครั้ง ×0.95" },
  water: { name: "คลื่นชีวา", emoji: "💧", lv: 7, color: 0x59a0e8, desc: "×1.7 + ดูดฟื้น HP 25%" },
  earth: { name: "กำแพงปฐพี", emoji: "🌍", lv: 9, color: 0xc09a5a, desc: "×1.5 + ป้องกัน +4 ทั้งศึก" },
  light: { name: "แสงสวรรค์", emoji: "🌟", lv: 11, color: 0xffe9a0, desc: "×1.8 + ล้างสถานะร้าย" },
};
export const WEAK = { mochi: "wind", baibua: "fire", mekha: "earth", plerng: "water", kirara: "ice", phi: "fire", nam: "wind", khiao: "fire", ngu: "earth", paksi: "ice", saming: "water", garuda: "light", wayu: "earth", taara: "arcane" };
export const PET_ELEM = { mochi: "wind", baibua: "earth", mekha: "water", plerng: "fire", kirara: "ice", phi: "ice", nam: "water", khiao: "wind", ngu: "earth", paksi: "wind", saming: "fire", garuda: "light", wayu: "wind", taara: "arcane" };
export const PET_SKILL = { mochi: "ลมกระต่ายหมุน", baibua: "หินใบไม้ถล่ม", mekha: "ระเบิดหยดน้ำ", plerng: "เพลิงจิ้งจอก", kirara: "ดาวน้ำแข็ง", phi: "วิญญาณเยือกแข็ง", nam: "คลื่นวารี", khiao: "ตะปบพายุ", ngu: "พ่นพิษพสุธา", paksi: "โฉบเวหา", saming: "ตะปบเพลิง", garuda: "ปีกแสงสวรรค์", wayu: "พายุหมุนเทพ", taara: "แสงจักรวาล" };
// 🌈 element display metadata (name + emoji) for clear weakness indicators
export const ELEM_META = {
  fire: { name: "ไฟ", emoji: "🔥" }, ice: { name: "น้ำแข็ง", emoji: "❄️" },
  wind: { name: "ลม", emoji: "🌪️" }, water: { name: "น้ำ", emoji: "💧" },
  earth: { name: "ดิน", emoji: "🪨" }, light: { name: "แสง", emoji: "✨" },
  arcane: { name: "เวท", emoji: "🔮" }, dragon: { name: "มังกร", emoji: "🐉" },
};

// ---------- Character classes ----------
export const CLASSES = {
  warrior: {
    name: "นักรบ", emoji: "🛡️", color: 0xd9536b,
    hp: 55, atk: 9, def: 3,
    desc: "เลือดหนา ป้องกันสูง ฟันดาบระยะประชิด",
    perk: "รับดาเมจลดลง -2 เพิ่มเติม",
  },
  archer: {
    name: "นักธนู", emoji: "🏹", color: 0x7ba05b,
    hp: 42, atk: 10, def: 1,
    desc: "ยิงธนูจากระยะไกล แม่นยำสูง",
    perk: "โอกาสคริติคอล 25% แรง ×2 🎯",
  },
  mage: {
    name: "นักเวท", emoji: "🔮", color: 0x9a6ad0,
    hp: 36, atk: 8, def: 0,
    desc: "ร่ายเวทลูกแก้วอาคม พลังทำลายสูง",
    perk: "สกิลแรง ×1.15 · พลังสกิลเริ่ม +2",
  },
  assassin: {
    name: "นักฆ่า", emoji: "🗡️", color: 0x4a4a5a,
    hp: 40, atk: 8, def: 1,
    desc: "มีดสั้นคู่ จู่โจมสองมือรวดเร็ว",
    perk: "โจมตี 2 ครั้ง · คริ 30% · หลบ +12%",
  },
  lancer: {
    name: "นักหอก", emoji: "🔱", color: 0x4a90c0,
    hp: 50, atk: 9, def: 2,
    desc: "หอกยาวจ้วงระยะกลาง เจาะเกราะทะลุ",
    perk: "โจมตีทะลุการ์ด/บล็อก · เจาะเกราะ -2 DEF ศัตรู",
  },
  samurai: {
    name: "ซามูไร", emoji: "⚔️", color: 0xc0392b,
    hp: 46, atk: 11, def: 1,
    desc: "ดาบคาตานะเร็วดุ ฟันติดต่อกันคมกริบ",
    perk: "คริ 22% · โจมตีปกติมีโอกาสฟัน 2 ครั้ง",
  },
  coder: {
    name: "จอมเวทโค้ด", emoji: "💻🔮", color: 0x2ad0e8,
    hp: 44, atk: 10, def: 2,
    desc: "โปรแกรมเมอร์เวทมนตร์ ใช้โค้ด AI และเวทดิจิทัล",
    perk: "AI ช่วยคำนวณ — คริ +8% · มานาฟื้นเร็ว",
  },
  office: {
    name: "พนักงานออฟฟิศ", emoji: "💼", color: 0x2a7ad0,
    hp: 46, atk: 9, def: 2,
    desc: "นักรบโต๊ะทำงาน ใช้เวทเทคโนโลยี กาแฟ และเอกสาร",
    perk: "กาแฟฟื้นมานาทุกเทิร์น · ยิ่งเลือดน้อยยิ่ง OT แรง",
  },
};
export const CLASS_WEAPON = { warrior: "cw", archer: "ca", mage: "cm", assassin: "cs", lancer: "cl", samurai: "ck", office: "co", coder: "cc" };
// 👗 per-class outfit look: shirt/pants/trim colors + which accessory to show
export const CLASS_OUTFIT = {
  warrior:  { shirt: 0x5a4a4a, pants: 0x4a4038, trim: 0xe8c848, acc: "cape",     accColor: 0xc41a2a }, // 🛡️ steel plate armor + red cape
  archer:   { shirt: 0xe8ede8, pants: 0x3a7a52, trim: 0xe8cf6a, acc: "hood",     accColor: 0x3a8a5a }, // 🏹 elven white+green light armor
  mage:     { shirt: 0x1e3a8a, pants: 0x152a68, trim: 0xe8c04a, acc: "robe",     accColor: 0x1e3a8a }, // 🔮 royal blue & gold wizard robe
  assassin: { shirt: 0x16161c, pants: 0x111116, trim: 0x9a1424, acc: "scarf",    accColor: 0x9a1424 }, // 🗡️ matte black leather + crimson
  lancer:   { shirt: 0x2a2d34, pants: 0x1c1e24, trim: 0xaeb6c0, acc: "pauldron", accColor: 0x7a1420 }, // 🔱 dark knight black steel + crimson
  samurai:  { shirt: 0x2a3450, pants: 0x3a3830, trim: 0xbfa055, acc: "kimono",   accColor: 0x2a3450 }, // ⚔️ ronin indigo kimono + gold
  office:   { shirt: 0x1c1c22, pants: 0x18181e, trim: 0xd8dce4, acc: "tie",      accColor: 0xc4102a }, // 💼 black suit + red necktie
  coder:    { shirt: 0x14161c, pants: 0x1a1d24, trim: 0x2ad0e8, acc: "hoodie",   accColor: 0x2ad0e8 }, // 💻 black hoodie + neon circuits
};
export const ULTS = {
  warrior: { name: "คำพิพากษาศักดิ์สิทธิ์", emoji: "⚔️✨", desc: "พาลาดินอัญเชิญผู้พิทักษ์ ฟาดดาบศักดิ์สิทธิ์ ×4 + สตัน + ทำลายเกราะ + ฟื้น HP" },
  archer: { name: "ฝนธนูพันดอก", emoji: "🏹", desc: "ธนู 5 ดอกร่วงจากฟ้า ×0.55 การันตีคริ 1 ดอก" },
  mage: { name: "วิบัติจักรวาล", emoji: "☄️🌌", desc: "เปิดพอร์ทัลกาแล็กซี่ ฝนอุกกาบาตถล่ม ×3.5 + เผาไหม้ + สตัน + ลดต้านทานเวท" },
  assassin: { name: "ประหารเงามัจจุราช", emoji: "🗡️🌑", desc: "หายตัวในเงา ร่างโคลน 5 รุมฟัน + กากบาทมรณะ ×3.5 · คริการันตี เจาะเกราะ + เลือดไหล" },
  lancer: { name: "คำพิพากษาหอกมังกร", emoji: "🔱🐉", desc: "อัญเชิญมังกรสายฟ้า ขว้างหอกยักษ์ ×3.5 · เจาะเกราะ + สตัน + น็อคอัพ" },
  coder: { name: "เขียนความจริงใหม่", emoji: "💻🔮", desc: "คอมไพล์โลกใหม่ 100% · ศัตรูสลายเป็นพิกเซล ×3.6 + เจาะเกราะ + แช่แข็ง + สับสน" },
  office: { name: "โอทีล้นทะลัก", emoji: "💻⚡", desc: "เอกสารถล่มฟ้า โน้ตบุ๊กยักษ์ทุบ ระเบิดดิจิทัล ×3.5 + สตัน + ทำลายเกราะ" },
  samurai: { name: "ฟันฟ้าแยก", emoji: "⚔️🌸", desc: "เวลาหยุด ชักดาบเสี้ยววินาที ฟันฟ้าแยก ×3.6 · เจาะเกราะ + เลือดไหล + หวาดกลัว" },
};
// 👑 alternate ultimates — unlocked classes can switch between two ults (toggled in the skill panel)
export const ULT_ALT = {
  samurai: { name: "เทพดาบซากุระ", emoji: "👑🌸", desc: "จันทร์แตก ซากุระถล่ม ฟันร้อยดาบ ×4 · เจาะเกราะ + ทำลายเกราะ + เลือดไหล + หวาดกลัว" },
};
// resolve which ultimate a class is currently using
export const ultOf = (cls, alt) => (alt && ULT_ALT[cls]) ? ULT_ALT[cls] : ULTS[cls];
// 🎯 4 signature skills per class — each level up gives 5 skill points to rank them up (max Lv.20)
// dmg = base attack × (mult + perLv×(rank-1)); each skill costs "cost" mana 💧
export const CLASS_SKILLS = {
  warrior: [
    { id: "w_cleave", cost: 8, name: "ฟันวงกว้าง", emoji: "🌙", color: 0x6ac0f0, mult: 1.6, perLv: 0.35, fx: "slash", desc: "ฟันปล่อยใบมีดลมสีฟ้า วงเสี้ยวกว้าง 💨" },
    { id: "w_bash", cost: 6, name: "โล่กระแทก", emoji: "🛡️", color: 0xc09a5a, mult: 1.2, perLv: 0.25, buffDef: 3, fx: "bash", desc: "กระแทกโล่ + ป้องกัน" },
    { id: "w_rage", cost: 12, name: "คลั่งสงคราม", emoji: "🔥", color: 0xf5652e, mult: 2.0, perLv: 0.45, rage: true, buffCrit: 15, fx: "rage", desc: "ดาเมจหนัก ยิ่งเลือดน้อยยิ่งแรง + คริเพิ่ม 🔥" },
    { id: "w_quake", cost: 10, name: "ปฐพีแยก", emoji: "🌍", color: 0x8a6a3a, mult: 1.8, perLv: 0.4, stun: true, fx: "quake", desc: "ทุบพื้นสะเทือน มีโอกาสมึน" },
  ],
  archer: [
    { id: "a_power", cost: 9, name: "ธนูเจาะเกราะ", emoji: "🎯", color: 0x59a0e8, mult: 1.7, perLv: 0.4, pierce: true, fx: "shot", desc: "ยิงทะลุการ์ด/บล็อก" },
    { id: "a_multi", cost: 10, name: "ยิงสามนัด", emoji: "🏹", color: 0x7ba05b, mult: 0.7, perLv: 0.18, hits: 3, stun: true, fx: "multi", desc: "ยิงรัว 3 ดอก (ธรรมดา→เขียว→ทองคริ) มีโอกาสมึน 💫" },
    { id: "a_poison", cost: 8, name: "ลูกศรพิษ", emoji: "🐍", color: 0x4ad04a, mult: 1.3, perLv: 0.3, poison: 4, fx: "shot", desc: "ลูกศรพิษเขียว หมอกพิษกระจาย ติดพิษ 4 เทิร์น + ลดความเร็ว 🫧" },
    { id: "a_snipe", cost: 11, name: "นัดสุดท้าย", emoji: "💥", color: 0xf5a623, mult: 1.5, perLv: 0.5, critBonus: 0.5, burn: 2, fx: "shot", desc: "น้าวเต็มแรง กระสุนทองยักษ์ คริสูงมาก + เผาไหม้ 🔥" },
    { id: "a_weak", cost: 14, name: "ยิงจุดอ่อน", emoji: "🦅", color: 0xf5d24a, mult: 2.2, perLv: 0.55, pierce: true, guaranteedCrit: true, weakPoint: true, stun: true, fx: "shot", desc: "เล็งจุดอ่อน คริการันตี เจาะเกราะ ดาเมจ×3 + สตัน 💫" },
  ],
  mage: [
    { id: "m_fire", cost: 9, name: "เพลิงนรก", emoji: "🔥", color: 0xf5652e, mult: 1.8, perLv: 0.4, burn: 2, fx: "orb", desc: "ลูกไฟนรกยักษ์ ระเบิดรุนแรง + เผาไหม้ 5 เทิร์น 🔥" },
    { id: "m_ice", cost: 9, name: "หอกน้ำแข็ง", emoji: "❄️", color: 0x9adcf5, mult: 1.6, perLv: 0.38, freeze: true, fx: "orb", desc: "หอกคริสตัลทะลุ แช่แข็ง + ลดความเร็ว ❄️" },
    { id: "m_bolt", cost: 12, name: "สายฟ้าฟาด", emoji: "⚡", color: 0xf5e042, mult: 2.0, perLv: 0.45, fx: "bolt", desc: "เรียกพายุฟ้าผ่า AoE + อัมพาต + สายฟ้าลูกโซ่ ⚡" },
    { id: "m_heal", cost: 10, name: "แสงเยียวยา", emoji: "✨", color: 0xffe9a0, mult: 1.0, perLv: 0.2, heal: 0.4, fx: "heal", desc: "ฟื้น HP + ฟื้นต่อเนื่อง + ล้างสถานะ + ป้องกันเวท ✨" },
  ],
  assassin: [
    { id: "s_double", cost: 7, name: "รัวมีดคู่", emoji: "🗡️", color: 0xc4102a, mult: 1.8, perLv: 0.35, hits: 2, bleed: 6, buffCrit: 15, fx: "stab", desc: "พุ่งฟันไขว้ 2 ครั้ง ×1.8 · เลือดไหล 6 เทิร์น + คริ +15% 🩸" },
    { id: "s_poison", cost: 9, name: "มีดอาบยาพิษ", emoji: "☠️", color: 0x9a4ad0, mult: 1.65, perLv: 0.3, hits: 3, poison: 5, poisonChance: 0.3, fx: "stab", desc: "ปามีดพิษหมุน 3 เล่ม ×1.65 · โอกาสติดพิษ 30% นาน 5 เทิร์น 🟣" },
    { id: "s_shadow", cost: 13, name: "ลอบสังหาร", emoji: "🌑", color: 0x4a4a5a, mult: 2.2, perLv: 0.5, critBonus: 1.0, pierce: true, fx: "shadow", desc: "หายในควันดำ เทเลพอร์ตหลังเป้า ×2.2 · คริ 100% · เจาะเกราะ 🎯" },
    { id: "s_evade", cost: 8, name: "ระบำเงา", emoji: "🌪️", color: 0x4a7ad0, mult: 1.8, perLv: 0.35, hits: 4, buffEva: true, buffSpd: true, fx: "stab", desc: "หมุนเร็ว โคลนเงา 4 ตัวฟันพร้อมกัน ×1.8 · หลบ +20% + เร็วขึ้น 🌪️" },
  ],
  lancer: [
    { id: "l_thrust", cost: 6, name: "จ้วงทะลวง", emoji: "🔱", color: 0x4a90c0, mult: 1.3, perLv: 0.3, pierce: true, buffCrit: 15, fx: "pierce", desc: "พุ่งแทงทะลุ เจาะเกราะ/การ์ด + คริ +15% 💨" },
    { id: "l_sweep", cost: 9, name: "กวาดหอก", emoji: "🌪️", color: 0x6ab0d0, mult: 1.8, perLv: 0.35, hits: 2, fx: "pierce", desc: "หมุนหอกเป็นพายุ กวาด 2 ครั้ง ×1.8 · AoE + ดูดเข้ากลาง 🌪️" },
    { id: "l_quake", cost: 11, name: "หอกปฐพี", emoji: "🌍", color: 0x8a6a3a, mult: 1.7, perLv: 0.36, stun: true, fx: "quake", desc: "กระแทกพื้น + ทำสตัน" },
    { id: "l_charge", cost: 13, name: "พุ่งทะยาน", emoji: "⚡", color: 0x4a9ae8, mult: 2.3, perLv: 0.5, pierce: true, fx: "pierce", desc: "มังกรสายฟ้าพุ่งทะลุ ×2.3 · เจาะเกราะ + ทำลายเกราะ + น็อคถอย ⚡" },
  ],
  samurai: [
    { id: "k_slash", cost: 6, name: "ฟันเฉียง", emoji: "⚔️", color: 0x9ad8f0, mult: 1.4, perLv: 0.32, critBonus: 0.25, fx: "slash", desc: "ท่าไอไอโด ก้าวฟันทแยงคมกริบ · คริสูง 💨" },
    { id: "k_double", cost: 9, name: "ดาบคู่ฟ้า", emoji: "🌸", color: 0x7ab8e8, mult: 1.5, perLv: 0.32, hits: 2, critBonus: 0.3, fx: "slash", desc: "พุ่งฟันไขว้ นอน+ตั้ง เป็นกากบาท ×2 · คริสูง 🌸" },
    { id: "k_iai", cost: 12, name: "ชักดาบสายฟ้า", emoji: "⚡", color: 0x4a9ae8, mult: 2.0, perLv: 0.44, critBonus: 0.3, stun: true, fx: "bolt", desc: "ไอไอจุตสึสายฟ้า ชักดาบเสี้ยววินาที ×2 · คริสูง + โอกาสสตัน ⚡" },
    { id: "k_moon", cost: 13, name: "เพลงดาบจันทรา", emoji: "🌙", color: 0xbfd8f0, mult: 1.0, perLv: 0.22, hits: 5, critBonus: 0.35, bleed: 4, fx: "slash", desc: "ระบำดาบใต้จันทร์ ฟันรัว 5 ครั้ง · คริสูง + เลือดไหล 🌙" },
  ],
  office: [
    { id: "o_coffee", cost: 5, name: "กาแฟเพิ่มพลัง", emoji: "☕", color: 0xd8a840, mult: 0.6, perLv: 0.14, heal: 0.25, mpHeal: 0.3, buffCrit: 12, buffSpd: true, regen: 3, fx: "heal", desc: "ซดกาแฟ ฟื้น HP/MP + คริ+12% + เร็ว+15% + ฟื้นต่อเนื่อง ☕" },
    { id: "o_paper", cost: 9, name: "พายุเอกสาร", emoji: "📄", color: 0xe8eef6, mult: 1.5, perLv: 0.3, hits: 3, bleed: 5, fx: "shot", desc: "โยนแฟ้มขึ้นฟ้า ทอร์นาโดกระดาษ 3 ระลอก · บาดกระดาษ 5 เทิร์น 🩸" },
    { id: "o_smash", cost: 10, name: "โน้ตบุ๊กทุบ", emoji: "💻", color: 0x2a7ad0, mult: 1.9, perLv: 0.4, stun: true, fx: "quake", desc: "ทุบโน้ตบุ๊กใส่ · โอกาสสตัน 💫" },
    { id: "o_deadline", cost: 12, name: "เดดไลน์เร่ง", emoji: "⏰", color: 0x2a7ad0, mult: 2.1, perLv: 0.45, rage: true, buffSpd: true, buffCritDmg: 25, fx: "bolt", desc: "โหมดโอที! ยิ่งเลือดน้อยยิ่งแรง + เร็ว+30% + ดาเมจคริ+25% ⏰" },
    { id: "o_ceo", cost: 15, name: "คำสั่งจาก CEO", emoji: "🏆", color: 0xd8a840, mult: 1.1, perLv: 0.24, hits: 5, stun: true, confuse: 3, slow: true, defDown: 5, fx: "quake", desc: "CEO สั่งงานด่วน! ของออฟฟิศถล่มฟ้า + ตึกทับ · สตัน + สับสน + ช้า + ป้องกัน-5 🏆" },
  ],
  coder: [
    { id: "c_inject", cost: 7, name: "ฉีดโค้ด", emoji: "⌨️", color: 0x2ad0e8, mult: 1.7, perLv: 0.34, hits: 2, defDown: 3, fx: "shot", desc: "ฉีดโค้ดเจาะระบบ ×2 · ลดป้องกัน -3 ⌨️" },
    { id: "c_wall", cost: 9, name: "ไฟร์วอลล์", emoji: "🛡️", color: 0x4ae8c0, mult: 1.2, perLv: 0.24, buffDef: 7, heal: 0.2, regen: 3, fx: "bash", desc: "ตั้งไฟร์วอลล์ · ป้องกัน+7 + ฟื้นต่อเนื่อง 🛡️" },
    { id: "c_drone", cost: 11, name: "โดรน AI", emoji: "🤖", color: 0x6ac0ff, mult: 0.9, perLv: 0.2, hits: 4, buffCrit: 10, fx: "multi", desc: "เรียกโดรน AI ยิงเลเซอร์ ×4 + คริ+10% 🤖" },
    { id: "c_crash", cost: 13, name: "ระบบล่ม", emoji: "💥", color: 0xe84a7a, mult: 2.2, perLv: 0.46, stun: true, freeze: true, confuse: 2, fx: "bolt", desc: "ทำระบบศัตรูล่ม · แช่แข็ง + สตัน + สับสน 💥" },
    { id: "c_matrix", cost: 15, name: "เมทริกซ์", emoji: "🟩", color: 0x2ae84a, mult: 1.2, perLv: 0.26, hits: 5, slow: true, poison: 4, fx: "quake", desc: "ฝนโค้ดเขียวถล่ม ×5 · ช้าลง + กัดกร่อนระบบ 🟩" },
  ],
};
// 🏅 TITLES — earned by playing, each grants a real bonus and you pick which one to wear.
// (The old system auto-picked a cosmetic string; there was nothing to chase.)
// `cond(st)` gets { wins, bosses, floor, dragon, catches, species, ngPlus, gold, crits }
export const TITLES = [
  { id: "t_none",    name: "ผู้ผจญภัย",           emoji: "🌱", desc: "เริ่มต้นการเดินทาง", cond: () => true, bonus: {} },
  { id: "t_fighter", name: "นักล่าฝีมือดี",        emoji: "🔥", desc: "ชนะ 50 ครั้ง",        cond: (s) => s.wins >= 50,    bonus: { atk: 4 } },
  { id: "t_boss",    name: "นักล่าบอส",           emoji: "🐲", desc: "ล้มบอส 5 ตัว",        cond: (s) => s.bosses >= 5,   bonus: { atk: 6, crit: 3 } },
  { id: "t_warlord", name: "ตำนานนักรบ",          emoji: "👑", desc: "ชนะ 200 ครั้ง",       cond: (s) => s.wins >= 200,   bonus: { atk: 9, hp: 5 } },
  { id: "t_climber", name: "ผู้พิชิตความสูง",      emoji: "🏔️", desc: "ดันเจี้ยนชั้น 50",     cond: (s) => s.floor >= 50,   bonus: { def: 10, hp: 8 } },
  { id: "t_tower",   name: "เจ้าแห่งหอคอย",        emoji: "🏆", desc: "ดันเจี้ยนชั้น 100",    cond: (s) => s.floor >= 100,  bonus: { atk: 7, def: 7, hp: 7 } },
  { id: "t_dex",     name: "นักสะสมสมบูรณ์",       emoji: "📖", desc: "เก็บครบทุกสายพันธุ์",  cond: (s) => s.species >= Object.keys(SPECIES).length, bonus: { luck: 18 } },
  { id: "t_dragon",  name: "นักล่ามังกร",          emoji: "🐉", desc: "ล้มมังกร 10 ตัว",      cond: (s) => s.dragon >= 10,  bonus: { critDmg: 18, atk: 4 } },
  { id: "t_rich",    name: "เศรษฐีทอง",           emoji: "💰", desc: "สะสมทองรวม 100,000",   cond: (s) => s.gold >= 100000, bonus: { gold: 22, luck: 8 } },
  { id: "t_crit",    name: "ราชาคริติคอล",        emoji: "🎯", desc: "ออกคริ 300 ครั้ง",     cond: (s) => s.crits >= 300,  bonus: { crit: 9, critDmg: 10 } },
  { id: "t_tamer",   name: "จอมเลี้ยงสัตว์",       emoji: "🐾", desc: "จับมอนสเตอร์ 50 ตัว",  cond: (s) => s.catches >= 50, bonus: { hp: 10, luck: 8 } },
  { id: "t_eternal", name: "ตำนานอมตะ",           emoji: "⭐", desc: "ตื่นพลัง (NG+) 1 ครั้ง", cond: (s) => (s.ngPlus || 0) >= 1, bonus: { atk: 10, def: 10, hp: 10, crit: 5 } },
];
export const titleOf = (id) => TITLES.find((t) => t.id === id) || TITLES[0];
export const TITLE_LABEL = { atk: "โจมตี", def: "ป้องกัน", hp: "พลังชีวิต", crit: "คริ", critDmg: "ดาเมจคริ", luck: "โชค", gold: "ทอง" };
export const TITLE_ICON = { atk: "⚔️", def: "🛡️", hp: "❤️", crit: "🎯", critDmg: "💥", luck: "🍀", gold: "💰" };
export const titleBonusText = (t) => {
  const e = Object.entries(t.bonus || {});
  if (!e.length) return "ไม่มีโบนัส";
  return e.map(([k, v]) => `${TITLE_ICON[k] || ""} ${TITLE_LABEL[k] || k} +${v}${["crit", "critDmg", "luck", "gold"].includes(k) ? "%" : ""}`).join(" · ");
};
// 💎 RANDOM STATS — every item you own rolls a quality multiplier + a prefix the first time
// you obtain it. Rolls are keyed by item id (matching how G.plus/enhancement already works),
// and can be re-rolled at the forge, so chasing a perfect roll is the endgame loop.
export const PREFIXES = [
  { id: "worn",    name: "ชำรุด",     emoji: "🥀", lo: 0.80, hi: 0.89, color: "#9a9a8a" },
  { id: "plain",   name: "ธรรมดา",    emoji: "▫️", lo: 0.90, hi: 0.99, color: "#8a8a7a" },
  { id: "fine",    name: "คุณภาพดี",  emoji: "✨", lo: 1.00, hi: 1.07, color: "#5aa06a" },
  { id: "sharp",   name: "คมกริบ",    emoji: "⚔️", lo: 1.08, hi: 1.14, color: "#3a7ac0" },
  { id: "superb",  name: "ยอดเยี่ยม", emoji: "💠", lo: 1.15, hi: 1.21, color: "#9a4ad0" },
  { id: "perfect", name: "สมบูรณ์แบบ", emoji: "👑", lo: 1.22, hi: 1.30, color: "#e0a020" },
];
// weighted roll — great rolls are rare, so a 👑 feels earned
export const ROLL_W = [10, 26, 30, 20, 11, 3];
export const rollQuality = () => {
  const total = ROLL_W.reduce((a, b) => a + b, 0);
  let r = Math.random() * total, i = 0;
  while (i < ROLL_W.length - 1 && r > ROLL_W[i]) { r -= ROLL_W[i]; i++; }
  const p = PREFIXES[i];
  return { p: p.id, m: +(p.lo + Math.random() * (p.hi - p.lo)).toFixed(3) };
};
export const prefixOf = (key) => PREFIXES.find((x) => x.id === key) || PREFIXES[1];
// 💎 GEMS — socketed at the forge. Slot count scales with rarity.
export const GEMS = {
  g_atk:  { name: "ทับทิมพลัง",   emoji: "♦️", color: "#e8324a", stat: "atk",  val: 4 },
  g_hp:   { name: "มรกตชีวิต",    emoji: "💚", color: "#3aa06a", stat: "hp",   val: 18 },
  g_def:  { name: "ไพลินป้องกัน", emoji: "🔷", color: "#3a7ac0", stat: "def",  val: 3 },
  g_crit: { name: "เพชรคริติคอล", emoji: "💎", color: "#e0a020", stat: "crit", val: 5 },
  g_spd:  { name: "โทแพซความเร็ว", emoji: "🔶", color: "#d88a20", stat: "spd",  val: 6 },
  g_eva:  { name: "โอปอลหลบหลีก", emoji: "🟣", color: "#9a4ad0", stat: "eva",  val: 4 },
};
export const SOCKETS_BY_RARITY = { common: 0, rare: 1, epic: 2, secret: 3, dragon: 3 };
// 🌟 CLASS PATHS (สายอาชีพขั้นสูง) — at Lv.40 every class splits into two specialisations.
// Each path grants permanent stat multipliers, a passive perk, and unlocks a 6th signature skill.
// (Distinct from "การตื่นพลัง"/ngPlus, which is the prestige reset.)
export const PATH_LV = 40;
export const CLASS_PATHS = {
  warrior: [
    { id: "w_pal", name: "อัศวินศักดิ์สิทธิ์", emoji: "🛡️✨", tint: 0xf5d24a,
      desc: "สายป้องกัน — เลือดหนา ทนทาน ฟื้นตัวเอง", perk: "ฟื้น HP 4% ทุกเทิร์น",
      mul: { atk: 1.0, def: 1.35, hp: 1.25, crit: 0 }, regen: true,
      skill: { id: "p_bulwark", cost: 11, name: "ปราการศักดิ์สิทธิ์", emoji: "🛡️✨", color: 0xf5d24a, mult: 1.6, perLv: 0.32, buffDef: 6, heal: 0.3, fx: "bash", desc: "ตั้งปราการ ป้องกัน+6 + ฟื้น HP ✨" } },
    { id: "w_ber", name: "เบอร์เซิร์ก", emoji: "🪓🔥", tint: 0xe8324a,
      desc: "สายบ้าคลั่ง — โจมตีโหด ดูดเลือด", perk: "ดูดเลือด 15% ของดาเมจ",
      mul: { atk: 1.3, def: 0.85, hp: 1.05, crit: 8 }, lifesteal: 0.15,
      skill: { id: "p_frenzy", cost: 12, name: "สังหารบ้าคลั่ง", emoji: "🪓🔥", color: 0xe8324a, mult: 1.3, perLv: 0.3, hits: 3, rage: true, bleed: 4, fx: "slash", desc: "ฟันบ้าคลั่ง ×3 · ยิ่งเลือดน้อยยิ่งแรง 🩸" } },
  ],
  archer: [
    { id: "a_sharp", name: "จอมแม่นปืน", emoji: "🎯💫", tint: 0xf5d24a,
      desc: "สายแม่นยำ — คริสูง ดาเมจคริโหด", perk: "ดาเมจคริ +30%",
      mul: { atk: 1.2, def: 1.0, hp: 1.0, crit: 15 }, critDmg: 30,
      skill: { id: "p_pierce", cost: 13, name: "ศรทะลุมิติ", emoji: "🎯💫", color: 0xf5d24a, mult: 2.6, perLv: 0.55, pierce: true, critBonus: 0.5, fx: "shot", desc: "ศรทะลุทุกการ์ด คริสูงมาก 💫" } },
    { id: "a_range", name: "เรนเจอร์พงไพร", emoji: "🌿🏹", tint: 0x4a9a4a,
      desc: "สายว่องไว — หลบสูง ยิงรัว", perk: "หลบหลีก +12% ถาวร",
      mul: { atk: 1.12, def: 1.05, hp: 1.1, crit: 5 }, eva: 12,
      skill: { id: "p_volley", cost: 12, name: "ห่าฝนลูกศร", emoji: "🌿🏹", color: 0x4a9a4a, mult: 0.9, perLv: 0.2, hits: 5, poison: 3, fx: "multi", desc: "ยิงรัว 5 ดอกอาบพิษ 🍃" } },
  ],
  mage: [
    { id: "m_elem", name: "จอมเวทธาตุ", emoji: "🔮💥", tint: 0x9a4ad0,
      desc: "สายทำลาย — เวทแรง มานาเยอะ", perk: "ดาเมจเวท +20%",
      mul: { atk: 1.32, def: 0.9, hp: 0.95, crit: 6 }, mpBonus: 20,
      skill: { id: "p_nova", cost: 14, name: "โนวาธาตุแตก", emoji: "🔮💥", color: 0x9a4ad0, mult: 2.4, perLv: 0.5, burn: 3, freeze: true, fx: "orb", desc: "ระเบิดธาตุรวม เผา+แช่แข็ง 💥" } },
    { id: "m_priest", name: "นักบวชแสง", emoji: "✨🕊️", tint: 0xfff2b0,
      desc: "สายสนับสนุน — ฟื้นตัวเก่ง ทนทาน", perk: "ฟื้น HP 5% ทุกเทิร์น",
      mul: { atk: 1.05, def: 1.25, hp: 1.2, crit: 0 }, regen: true,
      skill: { id: "p_bless", cost: 11, name: "พรแห่งเทวะ", emoji: "✨🕊️", color: 0xfff2b0, mult: 1.2, perLv: 0.25, heal: 0.45, buffDef: 5, regen: 4, fx: "heal", desc: "ฟื้น HP หนัก + ป้องกัน + ฟื้นต่อเนื่อง ✨" } },
  ],
  assassin: [
    { id: "s_shade", name: "เงามัจจุราช", emoji: "🌑🗡️", tint: 0x6a2ab0,
      desc: "สายลอบฆ่า — คริโหด หลบเก่ง", perk: "ดาเมจคริ +35%",
      mul: { atk: 1.28, def: 0.9, hp: 0.95, crit: 18 }, critDmg: 35, eva: 8,
      skill: { id: "p_execute", cost: 14, name: "ประหารเงา", emoji: "🌑🗡️", color: 0x6a2ab0, mult: 2.8, perLv: 0.6, pierce: true, critBonus: 1.0, bleed: 5, fx: "shadow", desc: "ลอบประหาร คริ 100% เจาะเกราะ 🩸" } },
    { id: "s_venom", name: "ราชาพิษ", emoji: "☠️🟣", tint: 0x4ad04a,
      desc: "สายพิษ — พิษซ้อนหนัก บั่นทอน", perk: "พิษแรงขึ้น 2 เท่า",
      mul: { atk: 1.15, def: 1.05, hp: 1.1, crit: 8 }, poisonAmp: 2,
      skill: { id: "p_plague", cost: 12, name: "โรคระบาด", emoji: "☠️🟣", color: 0x4ad04a, mult: 1.4, perLv: 0.3, hits: 2, poison: 5, confuse: 2, slow: true, defDown: 4, fx: "poison", desc: "แพร่โรค พิษหนัก + สับสน + ลดเกราะ ☠️" } },
  ],
  lancer: [
    { id: "l_dragoon", name: "ดราก้อนไนท์", emoji: "🐉🔱", tint: 0x4a9ae8,
      desc: "สายมังกร — โจมตีสูง เจาะเกราะ", perk: "เจาะเกราะทุกการโจมตี",
      mul: { atk: 1.3, def: 1.0, hp: 1.05, crit: 8 }, alwaysPierce: true,
      skill: { id: "p_dive", cost: 13, name: "มังกรดิ่งฟ้า", emoji: "🐉🔱", color: 0x4a9ae8, mult: 2.7, perLv: 0.58, pierce: true, stun: true, fx: "pierce", desc: "ดิ่งจากฟ้า เจาะเกราะ + สตัน 🐉" } },
    { id: "l_guard", name: "ผู้พิทักษ์ปฐพี", emoji: "🛡️🌍", tint: 0x8a6a3a,
      desc: "สายตั้งรับ — แข็งแกร่ง สะท้อนดาเมจ", perk: "สะท้อนดาเมจ 20%",
      mul: { atk: 1.05, def: 1.4, hp: 1.3, crit: 0 }, thorns: 0.2,
      skill: { id: "p_fortress", cost: 12, name: "ป้อมปราการ", emoji: "🛡️🌍", color: 0x8a6a3a, mult: 1.7, perLv: 0.34, buffDef: 8, stun: true, fx: "quake", desc: "ตั้งป้อม ป้องกัน+8 + สตัน 🌍" } },
  ],
  samurai: [
    { id: "k_kensei", name: "เคนเซย์", emoji: "⚔️🌸", tint: 0xbfd8f0,
      desc: "สายดาบเทพ — คริสูง ฟันรัว", perk: "ดาเมจคริ +30%",
      mul: { atk: 1.26, def: 1.0, hp: 1.0, crit: 16 }, critDmg: 30,
      skill: { id: "p_thousand", cost: 13, name: "พันดาบเทวะ", emoji: "⚔️🌸", color: 0xbfd8f0, mult: 0.85, perLv: 0.2, hits: 6, critBonus: 0.4, bleed: 4, fx: "slash", desc: "ฟันรัว 6 ครั้ง คริสูง 🌸" } },
    { id: "k_iai", name: "จอมชักดาบ", emoji: "⚡🗡️", tint: 0x4a9ae8,
      desc: "สายไอไอ — ดาบเดียวจบ ดาเมจมหาศาล", perk: "ดาเมจครั้งแรกของศึก ×2",
      mul: { atk: 1.34, def: 0.92, hp: 0.98, crit: 10 }, firstStrike: 2,
      skill: { id: "p_flash", cost: 14, name: "ชักดาบอสูร", emoji: "⚡🗡️", color: 0x4a9ae8, mult: 3.0, perLv: 0.62, critBonus: 0.6, stun: true, fx: "bolt", desc: "ชักดาบเสี้ยววินาที ดาเมจมหาศาล ⚡" } },
  ],
  coder: [
    { id: "c_hacker", name: "แฮกเกอร์เงา", emoji: "🕶️💻", tint: 0x2ae84a,
      desc: "สายเจาะระบบ — ดาเมจสูง เจาะเกราะทุกครั้ง", perk: "เจาะเกราะทุกการโจมตี",
      mul: { atk: 1.3, def: 0.9, hp: 0.98, crit: 12 }, alwaysPierce: true,
      skill: { id: "p_zeroday", cost: 14, name: "ช่องโหว่ Zero-Day", emoji: "🕶️💥", color: 0x2ae84a, mult: 2.9, perLv: 0.6, pierce: true, critBonus: 0.5, defDown: 8, fx: "shot", desc: "เจาะช่องโหว่ · เจาะเกราะ + คริสูง + ป้องกัน-8 🕶️" } },
    { id: "c_ai", name: "สถาปนิก AI", emoji: "🤖✨", tint: 0x6ac0ff,
      desc: "สายอัจฉริยะ — เวทแรง มานาเยอะ ฟื้นเอง", perk: "มานาฟื้น 2 เท่า",
      mul: { atk: 1.18, def: 1.15, hp: 1.12, crit: 8 }, mpRegenMul: 2, regen: true,
      skill: { id: "p_singularity", cost: 15, name: "ซิงกูลาริตี้", emoji: "🤖🌌", color: 0x6ac0ff, mult: 1.3, perLv: 0.28, hits: 6, freeze: true, confuse: 2, fx: "orb", desc: "AI ตื่นรู้! ยิงรัว 6 ครั้ง + แช่แข็ง + สับสน 🌌" } },
  ],
  office: [
    { id: "o_ceo", name: "ซีอีโอ", emoji: "👑💼", tint: 0xd8a840,
      desc: "สายผู้บริหาร — เก่งรอบด้าน ทองเยอะ", perk: "ได้ทอง +50%",
      mul: { atk: 1.2, def: 1.2, hp: 1.15, crit: 10 }, goldBonus: 0.5,
      skill: { id: "p_merger", cost: 14, name: "ควบรวมกิจการ", emoji: "👑💼", color: 0xd8a840, mult: 2.5, perLv: 0.52, defDown: 6, confuse: 2, stun: true, fx: "quake", desc: "เทคโอเวอร์! ลดเกราะ + สับสน + สตัน 👑" } },
    { id: "o_work", name: "เวิร์กโฮลิก", emoji: "⏰🔥", tint: 0xe84a4a,
      desc: "สายบ้างาน — ยิ่งเลือดน้อยยิ่งแรง เร็วสุด", perk: "มานาฟื้น 2 เท่า",
      mul: { atk: 1.28, def: 0.95, hp: 1.0, crit: 12 }, mpRegenMul: 2,
      skill: { id: "p_burnout", cost: 12, name: "หมดไฟ", emoji: "⏰🔥", color: 0xe84a4a, mult: 1.2, perLv: 0.28, hits: 4, rage: true, buffSpd: true, buffCritDmg: 30, fx: "bolt", desc: "โหมดหมดไฟ ×4 · ยิ่งเลือดน้อยยิ่งโหด 🔥" } },
  ],
};
// resolve the player's chosen path object (null until they pick one)
export const pathOf = (cls, pathId) => (CLASS_PATHS[cls] || []).find((p) => p.id === pathId) || null;
// a path's signature skill appears as a 6th entry in the skill list
export const skillsOf = (cls, pathId) => {
  const base = CLASS_SKILLS[cls] || [];
  const p = pathOf(cls, pathId);
  return p && p.skill ? base.concat([p.skill]) : base;
};
// 🔒 SKILL UNLOCK CONDITIONS — every class gates skills 2..5 behind level, the previous
// skill's rank, and an allocated base stat. Skill 1 is always free so you can always fight.
// slot = index in CLASS_SKILLS[cls]; stat keys match G.baseStats (atk/hp/def/crit/luck/mp)
export const SKILL_GATE = [
  null,                                                    // slot 0 — starter, always open
  { lv: 5,  prevRank: 2, stat: "atk",  need: 1 },          // slot 1
  { lv: 10, prevRank: 3, stat: "atk",  need: 3 },          // slot 2
  { lv: 16, prevRank: 3, stat: "crit", need: 2 },          // slot 3
  { lv: 24, prevRank: 4, stat: "mp",   need: 3 },          // slot 4 (5th skill)
  null,                                                    // slot 5 — 🌟 path signature: choosing the path IS the gate
];
export const STAT_LABEL = { atk: "พลังโจมตี ⚔️", hp: "พลังชีวิต ❤️", def: "ป้องกัน 🛡️", crit: "คริติคอล 🎯", luck: "โชค 🍀", mp: "มานา 🔮" };
// returns { open, reasons[] } for a skill slot of a class
export const skillGate = (cls, slot, level, ranks, stats, pathId) => {
  const g = SKILL_GATE[slot];
  if (!g) return { open: true, reasons: [] };
  const list = skillsOf(cls, pathId);
  const prev = list[slot - 1];
  const prevRank = (prev && ranks && ranks[prev.id]) || 1;
  const statVal = (stats && stats[g.stat]) || 0;
  const reasons = [
    { ok: (level || 1) >= g.lv, text: `เลเวล ${level || 1}/${g.lv}` },
    { ok: prevRank >= g.prevRank, text: `${prev ? prev.emoji + " " + prev.name : "สกิลก่อนหน้า"} Lv.${prevRank}/${g.prevRank}` },
    { ok: statVal >= g.need, text: `${STAT_LABEL[g.stat] || g.stat} ${statVal}/${g.need}` },
  ];
  return { open: reasons.every((r) => r.ok), reasons };
};
// which element each skill counts as (for weakness advantage). null = neutral
export const SKILL_ELEM = {
  w_cleave: null, w_bash: null, w_rage: "fire", w_quake: "earth",
  a_power: null, a_multi: "wind", a_poison: "earth", a_snipe: null,
  o_coffee: null, o_paper: "wind", o_smash: "earth", o_deadline: "light", o_ceo: "arcane",
  c_inject: "arcane", c_wall: null, c_drone: "light", c_crash: "ice", c_matrix: "arcane",
  m_fire: "fire", m_ice: "ice", m_bolt: "wind", m_heal: "light",
  s_double: null, s_poison: "earth", s_shadow: null, s_evade: "wind",
  l_thrust: null, l_sweep: "wind", l_quake: "earth", l_charge: null,
  k_slash: null, k_double: null, k_iai: "wind", k_moon: null,
};

// ---------- ⛏️ Crafting materials (drop from monsters, used at the forge) ----------
export const MATERIALS = {
  ironOre:   { name: "แร่เหล็ก", emoji: "⛏️", color: 0x9aa0a8, desc: "แร่พื้นฐาน ใช้ตีบวกอาวุธ" },
  crystal:   { name: "คริสตัลเวท", emoji: "💎", color: 0x6ac0f0, desc: "ผลึกเวทมนตร์ ใช้เสริมธาตุ" },
  fireEss:   { name: "แก่นเพลิง", emoji: "🔥", color: 0xf5652e, desc: "พลังไฟ ใส่ธาตุไฟให้อาวุธ" },
  iceEss:    { name: "แก่นเยือก", emoji: "❄️", color: 0x9adcf5, desc: "พลังน้ำแข็ง ใส่ธาตุน้ำแข็ง" },
  windEss:   { name: "แก่นวายุ", emoji: "🌪️", color: 0xa0e8c0, desc: "พลังลม ใส่ธาตุลม" },
  earthEss:  { name: "แก่นปฐพี", emoji: "🌍", color: 0xc9a86a, desc: "พลังดิน ใส่ธาตุดิน" },
  dragonScale: { name: "เกล็ดมังกร", emoji: "🐉", color: 0xd94a4a, desc: "หายากสุด เพิ่มพลังโจมตีถาวร" },
};
// forge recipes: infuse an element onto the equipped weapon
export const ELEM_INFUSE = {
  fire:  { mat: "fireEss",  qty: 3, name: "ธาตุไฟ",     emoji: "🔥" },
  ice:   { mat: "iceEss",   qty: 3, name: "ธาตุน้ำแข็ง", emoji: "❄️" },
  wind:  { mat: "windEss",  qty: 3, name: "ธาตุลม",     emoji: "🌪️" },
  earth: { mat: "earthEss", qty: 3, name: "ธาตุดิน",     emoji: "🌍" },
};

// ---------- 🌳 Skill tree: passive nodes unlocked with skill points (per class) ----------
// each node: cost in SP, a stat buff applied passively. Shared nodes + a class-signature node.
// 🏅 PvP rank tiers by score
export const PVP_TIERS = [
  { min: 0,    name: "บรอนซ์",  emoji: "🥉", color: "#b87333" },
  { min: 1100, name: "เงิน",    emoji: "🥈", color: "#9aa2ac" },
  { min: 1250, name: "ทอง",     emoji: "🥇", color: "#e8b840" },
  { min: 1450, name: "แพลทินัม", emoji: "💠", color: "#4ad0c0" },
  { min: 1650, name: "เพชร",    emoji: "💎", color: "#6ac0f0" },
  { min: 1900, name: "ปรมาจารย์", emoji: "👑", color: "#d94ad0" },
];
export function pvpTier(score) {
  let t = PVP_TIERS[0];
  for (const tier of PVP_TIERS) if (score >= tier.min) t = tier;
  return t;
}

// 🔨 advanced craft recipes — forge a powerful dragon-tier weapon from materials (per class)
// 🐉 dragon ARMOUR recipes — priced per slot (body armour costs the most, boots the least)
// so the full dragon set is a real project rather than one big purchase.
export const CRAFT_ARMOUR_MATS = {
  outfit:  { dragonScale: 3, crystal: 4, ironOre: 8 },
  hat:     { dragonScale: 2, crystal: 3, ironOre: 6 },
  mask:    { dragonScale: 2, crystal: 3, ironOre: 5 },
  gloves:  { dragonScale: 2, crystal: 2, ironOre: 5 },
  pants:   { dragonScale: 2, crystal: 3, ironOre: 6 },
  shoes:   { dragonScale: 1, crystal: 2, ironOre: 4 },
  default: { dragonScale: 2, crystal: 3, ironOre: 6 },
};
export const CRAFT_RECIPES = {
  warrior:  { itemId: "wDw", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  archer:   { itemId: "wDa", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  mage:     { itemId: "wDm", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  assassin: { itemId: "wDs", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  lancer:   { itemId: "wDl", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  samurai:  { itemId: "kd",  mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  office:   { itemId: "wDo", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
  coder:    { itemId: "wDc", mats: { dragonScale: 3, crystal: 5, ironOre: 10 } },
};

// 🌳 Skill tree: each node can be leveled up (rank 1..max). Bonuses are PER RANK.
// Conditions: reqLv = min player level, req = prerequisite node id (must have ≥1 rank).
export const SKILL_TREE = {
  common: [
    { id: "t_hp1",   name: "พลังชีวิต",   emoji: "❤️", cost: 2, max: 5, reqLv: 1,  hp: 8,  desc: "HP สูงสุด +8%/ระดับ" },
    { id: "t_atk1",  name: "พลังโจมตี",   emoji: "⚔️", cost: 2, max: 5, reqLv: 1,  atk: 3, desc: "พลังโจมตี +3/ระดับ" },
    { id: "t_def1",  name: "เกราะแกร่ง",  emoji: "🛡️", cost: 2, max: 5, reqLv: 3,  def: 3, desc: "ป้องกัน +3/ระดับ" },
    { id: "t_crit1", name: "แม่นยำ",      emoji: "🎯", cost: 3, max: 5, reqLv: 5,  crit: 4, req: "t_atk1", desc: "คริติคอล +4%/ระดับ (ต้องมีพลังโจมตี)" },
    { id: "t_hp2",   name: "อมตะ",        emoji: "💗", cost: 4, max: 3, reqLv: 12, hp: 12, req: "t_hp1", desc: "HP +12%/ระดับ (ต้องมีพลังชีวิต)" },
  ],
  warrior:  { id: "t_warrior", name: "หัวใจนักรบ", emoji: "🦁", cost: 4, max: 3, reqLv: 8, req: "t_atk1", atk: 5, hp: 12, def: 3, desc: "โจมตี+5 HP+12% ป้องกัน+3 /ระดับ" },
  archer:   { id: "t_archer",  name: "ตาเหยี่ยว",  emoji: "🦅", cost: 4, max: 3, reqLv: 8, req: "t_crit1", atk: 4, crit: 8, desc: "โจมตี+4 คริ+8% /ระดับ" },
  mage:     { id: "t_mage",    name: "ปราชญ์เวท",  emoji: "🔮", cost: 4, max: 3, reqLv: 8, req: "t_atk1", atk: 6, hp: 8, crit: 4, desc: "โจมตี+6 คริ+4% HP+8% /ระดับ" },
  assassin: { id: "t_assassin",name: "เงามรณะ",    emoji: "🌑", cost: 4, max: 3, reqLv: 8, req: "t_crit1", atk: 5, crit: 9, desc: "โจมตี+5 คริ+9% /ระดับ" },
  lancer:   { id: "t_lancer",  name: "หอกอมตะ",    emoji: "🔱", cost: 4, max: 3, reqLv: 8, req: "t_def1", atk: 5, hp: 10, def: 4, desc: "โจมตี+5 HP+10% ป้องกัน+4 /ระดับ" },
  coder:    { id: "t_coder",   name: "อัลกอริทึมเทพ", emoji: "💻", cost: 4, max: 3, reqLv: 8, req: "t_atk1", atk: 3, mp: 5, crit: 6, desc: "โจมตี+3 มานา+5 คริ+6% /ระดับ" },
  office:   { id: "t_office",  name: "มือโปรออฟฟิศ", emoji: "💼", cost: 4, max: 3, reqLv: 8, req: "t_atk1", atk: 4, mp: 3, crit: 5, desc: "โจมตี+4 มานา+3 คริ+5% /ระดับ" },
  samurai:  { id: "t_samurai", name: "วิถีซามูไร", emoji: "⚔️", cost: 4, max: 3, reqLv: 8, req: "t_atk1", atk: 5, hp: 8, crit: 6, desc: "โจมตี+5 คริ+6% HP+8% /ระดับ" },
};

// ---------- 🎀 Character customization options ----------
export const CUSTOM = {
  genders: [
    { n: "หญิง", emoji: "👧" },
    { n: "ชาย", emoji: "👦" },
  ],
  skins: [
    { n: "ขาวธรรมชาติ", c: 0xffe0c8 }, { n: "น้ำผึ้ง", c: 0xe8b28a },
    { n: "แทนเข้ม", c: 0xc98e62 }, { n: "ครีมนวล", c: 0xf7dcc4 },
  ],
  hairColors: [
    { n: "น้ำตาล", c: 0x5a3b26 }, { n: "ดำขลับ", c: 0x2a2226 }, { n: "บลอนด์", c: 0xd9b56a },
    { n: "ชมพูซากุระ", c: 0xf2a0b4 }, { n: "ฟ้าพาสเทล", c: 0x6a9ad0 },
  ],
  hairStyles: ["ยาวประบ่า", "บ๊อบสั้น", "หางม้าคู่", "หางม้าสูง", "บ๊อบติดเขาดำ 🖤", "บ๊อบตรง", "ยาวตรงหน้าม้า", "เปียโบว์กระต่าย 🎀", "มวยผมหน้าม้า"],
  eyes: ["กลมใส", "โตประกาย", "ยิ้มหวาน", "ประกายดาวเขียว ✨"],
  outfits: [
    { n: "ลายทางกรม", base: "#33415e", stripe: "#dfe6f2", pants: 0xf7f5f0 },
    { n: "ชมพูหวาน", base: "#e8879e", stripe: "#ffe3ec", pants: 0xfff5f8 },
    { n: "มิ้นต์สดชื่น", base: "#4f9a7d", stripe: "#dff5ea", pants: 0xf2efe6 },
    { n: "ดำสุดเท่", base: "#3a3a44", stripe: "#8a8a98", pants: 0x52525c },
    { n: "เดรสดำขลิบทอง", base: "#2b2724", stripe: "#c9a24a", pants: 0xf5f2ec, collar: true },
  ],
};
export const WEAPON_TIP = { w1: 0xf28ba8, w2: 0xf5652e, w3: 0x7ad0e8, wS: 0xcfe0ff };
export const rollRarity = (boss) => {
  const r = Math.random();
  if (boss) return r < 0.05 ? "dragon" : r < 0.18 ? "secret" : r < 0.65 ? "epic" : "rare"; // boss = big loot
  return r < 0.003 ? "dragon" : r < 0.013 ? "secret" : r < 0.12 ? "epic" : r < 0.45 ? "rare" : "common";
};
export const BOSS_LEVELS_STEP = 5; // bosses at 10, 15, 20, ...

