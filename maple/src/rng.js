// 🎲 Deterministic RNG — แมพที่สร้างแบบ procedural ต้องออกมาเหมือนกันทุกครั้งที่โหลด
// ไม่งั้นผู้เล่นเซฟไว้ตรงแท่นหนึ่ง กลับมาเปิดใหม่แท่นนั้นหายไป
// mulberry32: เล็ก เร็ว กระจายตัวดีพอสำหรับวางแท่นและ spawn
export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (lo, hi) => lo + next() * (hi - lo),
    int: (lo, hi) => Math.floor(lo + next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
  };
}

// แปลงชื่อ (เช่น "desert") เป็น seed ตัวเลข — biome เดียวกันได้แมพหน้าตาเดิมเสมอ
export function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
