// 💾 เซฟลง localStorage — คีย์แยกจากเกม 3D เดิม เพื่อไม่ให้เซฟทับกัน
const KEY = 'cherry-maple-save-v1';

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;                     // เซฟเสียหรือโหมดส่วนตัวปิด storage — เริ่มใหม่เงียบ ๆ
  }
}

export function writeSave(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* ไม่มีอะไรต้องทำ */ }
}
