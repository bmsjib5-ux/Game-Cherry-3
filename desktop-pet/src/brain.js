// ═══════════════════════════════════════════════════════════════════════════
// brain.js — สมองของ pet: สถานะ พฤติกรรม และฟิสิกส์ (ไม่พึ่ง Electron เลย)
//
// แยกออกจาก main.js เพราะสองเหตุผล:
//   1. ทดสอบได้จริง — ฉีด rng ที่กำหนดผลได้เข้าไป แล้วเดินเวลาเองทีละสเต็ป
//      จึงตรวจได้ว่าทุกท่าเกิดขึ้น เด้งขอบจอถูก และร่วงลงพื้นถูก โดยไม่ต้องเปิดหน้าต่าง
//   2. main.js เหลือหน้าที่เดียวคือคุยกับ OS (หน้าต่าง/ถาดระบบ/IPC/ไฟล์เซฟ)
//
// เวลาในนี้นับจาก dt ที่ส่งเข้ามาเท่านั้น ไม่เรียก Date.now()
// ทำให้ผลลัพธ์ซ้ำได้เป๊ะเมื่อป้อน dt ชุดเดิม
// ═══════════════════════════════════════════════════════════════════════════

const WALK_SPEED = 58;           // px ต่อวินาที
const GRAVITY = 2200;
const JUMP_VY = -640;

// ตารางพฤติกรรม: อยู่ในท่านี้นานเท่าไร (ms) แล้วมีโอกาสไปท่าไหนต่อ (ตัวเลข = น้ำหนัก)
const BEHAVIOR = {
  idle:  { min: 1400, max: 4200, next: [['walk', 7], ['jump', 2], ['idle', 2], ['sleep', 2]] },
  walk:  { min: 2200, max: 6500, next: [['idle', 5], ['walk', 2], ['jump', 1]] },
  sleep: { min: 9000, max: 22000, next: [['idle', 1]] },
};
const AIRBORNE = new Set(['jump', 'fall']);

class PetBrain {
  constructor({ rng = Math.random, width = 190, height = 210 } = {}) {
    this.rng = rng;
    this.w = width;
    this.h = height;
    this.clock = 0;
    this.state = 'idle';
    this.facing = 1;
    this.vy = 0;
    this.until = 0;
    this.dragging = false;
    this.paused = false;
    this.x = 0;
    this.y = 0;
    this.bounds = { minX: 0, maxX: 0, floorTop: 0 };
  }

  setBounds(b) {
    this.bounds = b;
    this.x = Math.min(b.maxX, Math.max(b.minX, this.x));
    if (!AIRBORNE.has(this.state) && !this.dragging) this.y = b.floorTop;
  }

  reset(x) {
    this.x = x !== undefined ? x : this.bounds.minX;
    this.y = this.bounds.floorTop;
    this.enter('idle');
  }

  pick(pairs) {
    const total = pairs.reduce((a, [, w]) => a + w, 0);
    let r = this.rng() * total;
    for (const [v, w] of pairs) {
      r -= w;
      if (r <= 0) return v;
    }
    return pairs[0][0];
  }

  enter(state) {
    this.state = state;
    const spec = BEHAVIOR[state];
    this.until = spec ? this.clock + spec.min + this.rng() * (spec.max - spec.min) : 0;
    if (state === 'jump') this.vy = JUMP_VY;
    this.changed = true;
  }

  setPaused(p) {
    this.paused = p;
    if (p && !AIRBORNE.has(this.state)) this.enter('idle');
  }

  poke() {
    if (!AIRBORNE.has(this.state) && !this.dragging) this.enter('jump');
  }

  beginDrag(cx, cy) {
    this.grabDX = cx - this.x;
    this.grabDY = cy - this.y;
    this.dragging = true;
    this.enter('drag');
  }

  dragTo(cx, cy) {
    if (!this.dragging) return;
    this.x = cx - this.grabDX;
    this.y = cy - this.grabDY;
  }

  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    this.vy = 0;
    this.enter('fall');            // ปล่อยแล้วร่วงลงพื้นเอง
  }

  // เดินเวลาไปข้างหน้า dtMs — คืน true ถ้าสถานะเปลี่ยน (main จะได้ส่งไป renderer)
  step(dtMs) {
    this.changed = false;
    this.clock += dtMs;
    const dt = dtMs / 1000;
    const b = this.bounds;

    if (this.dragging) return this.changed;

    if (AIRBORNE.has(this.state)) {
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      // กระโดดแล้วยังเคลื่อนไปข้างหน้า ให้ดูเป็นการกระโดดข้ามไม่ใช่กระโดดอยู่กับที่
      this.x += this.facing * WALK_SPEED * 0.8 * dt;
      if (this.y >= b.floorTop) {
        this.y = b.floorTop;
        this.vy = 0;
        this.enter(this.pick([['idle', 3], ['walk', 4]]));
      }
    } else if (this.state === 'walk' && !this.paused) {
      this.x += this.facing * WALK_SPEED * dt;
    }

    // ชนขอบจอแล้วหันกลับ
    if (this.x <= b.minX) { this.x = b.minX; if (this.facing !== 1) { this.facing = 1; this.changed = true; } }
    else if (this.x >= b.maxX) { this.x = b.maxX; if (this.facing !== -1) { this.facing = -1; this.changed = true; } }

    // ถ้าความละเอียดจอหรือทาสก์บาร์เปลี่ยน ให้กลับมายืนบนพื้นใหม่
    if (!AIRBORNE.has(this.state) && this.y !== b.floorTop) this.y = b.floorTop;

    if (!this.paused && !AIRBORNE.has(this.state) && this.until && this.clock > this.until) {
      const next = this.pick(BEHAVIOR[this.state].next);
      // เริ่มเดินรอบใหม่ ให้สุ่มทิศใหม่ด้วย
      if (next === 'walk') {
        const f = this.rng() < 0.5 ? -1 : 1;
        if (f !== this.facing) { this.facing = f; this.changed = true; }
      }
      this.enter(next);
    }

    return this.changed;
  }
}

module.exports = { PetBrain, BEHAVIOR, AIRBORNE, WALK_SPEED, GRAVITY, JUMP_VY };
