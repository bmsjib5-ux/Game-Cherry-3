// 🎨 ยูทิลสีที่ใช้ร่วมกัน (รับ/คืนค่าเป็นเลขฐานสิบหก 0xRRGGBB แบบเดียวกับข้อมูลกลาง)

// คูณความสว่าง — k < 1 มืดลง, k > 1 สว่างขึ้น (ตัดที่ 255)
export function shade(hex, k) {
  const r = Math.min(255, Math.round(((hex >> 16) & 0xff) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 0xff) * k));
  const b = Math.min(255, Math.round((hex & 0xff) * k));
  return (r << 16) | (g << 8) | b;
}

// ความสว่างที่ตาคนรับรู้ (0–1) — ถ่วงน้ำหนักเขียวมากสุดตามการมองเห็นจริง
// ใช้ตัดสินว่าไบโอมนี้มืดหรือสว่าง เพื่อเลือกทิศการย้อมสีแท่นให้ตัดกับฉากหลัง
export function luma(hex) {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
