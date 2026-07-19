# 🌐 ตั้งค่าระบบออนไลน์ (เล่นกับเพื่อนจริง)

เกม **Cherry Adventure** เล่นได้เต็มรูปแบบแบบ **ออฟไลน์ 100%** โดยไม่ต้องตั้งค่าอะไรเลย
ระบบเพื่อนแบบออฟไลน์ (ก็อป-วางรหัส `CHERRY1:...`) ใช้งานได้ทันที

ถ้าอยากได้ระบบ **ออนไลน์จริง** — เพิ่มเพื่อนด้วย ID สั้นๆ, สถิติเพื่อนอัปเดตอัตโนมัติข้ามเครื่อง,
และ **กระดานอันดับโลก (Global Leaderboard)** ที่แชร์กันทุกคน — ให้ทำตามขั้นตอนนี้ (ใช้ **Supabase** ฟรี ~5 นาที)

> ระบบออนไลน์นี้เป็นแบบ **asynchronous** (ไม่ใช่ co-op เรียลไทม์): แต่ละคนอัปโหลดโปรไฟล์ตัวเองขึ้นเซิร์ฟเวอร์กลาง
> แล้วสู้กับ "ผี" (ghost) ที่สร้างจาก **พลังล่าสุด** ของเพื่อน + ไต่กระดานอันดับโลกร่วมกัน

---

## ขั้นตอน

### 1) สร้างโปรเจกต์ Supabase (ฟรี)
1. ไปที่ <https://supabase.com> → **Sign in** → **New project**
2. ตั้งชื่อโปรเจกต์ + รหัสผ่าน database (จดไว้) → **Create new project** (รอ ~2 นาที)

### 2) สร้างตาราง `players` (วาง SQL)
เปิดเมนู **SQL Editor** → **New query** → วาง SQL ด้านล่างทั้งหมด → กด **Run**

```sql
-- ตารางเก็บโปรไฟล์ผู้เล่นสำหรับระบบเพื่อน/กระดานอันดับ
create table if not exists public.players (
  pid   text primary key,          -- ID ผู้เล่น (คีย์หลัก)
  n     text,                      -- ชื่อ
  c     text,                      -- อาชีพ (class)
  lv    int  default 1,            -- เลเวล
  atk   int  default 0,
  def   int  default 0,
  hp    int  default 0,
  crit  int  default 0,
  w     text,                      -- อาวุธที่สวม (id)
  cu    jsonb default '{}'::jsonb, -- หน้าตา (custom)
  ng    int  default 0,            -- New Game+
  rank  int  default 1000,         -- อันดับ PvP
  ts    bigint                     -- เวลาอัปเดตล่าสุด
);

-- เปิด Row Level Security แล้วอนุญาตให้ client (anon) อ่าน + upsert โปรไฟล์ได้
alter table public.players enable row level security;

create policy "public read"   on public.players for select using (true);
create policy "public insert" on public.players for insert with check (true);
create policy "public update" on public.players for update using (true) with check (true);
```

> หมายเหตุความปลอดภัย: policy ด้านบนเปิดให้ทุกคนอ่าน/เขียนได้ (เหมาะกับเกมแคชชวลที่ไม่มีข้อมูลลับ)
> ข้อมูลที่เก็บมีแค่สเตตัสตัวละคร ไม่มีข้อมูลส่วนตัว — ถ้าต้องการเข้มขึ้นค่อยเพิ่ม auth ภายหลังได้

### 3) คัดลอก URL + anon key
เมนู **Project Settings** (เฟือง) → **API**:
- **Project URL** — เช่น `https://abcdefgh.supabase.co`
- **anon public** key — คีย์ยาวๆ (ปลอดภัยที่จะฝังใน client เพราะถูกจำกัดด้วย RLS)

### 4) วางค่าลงในเกม
เปิดไฟล์ **`index.html`** หา `const ONLINE_CONFIG` (อยู่ช่วงต้นไฟล์) แล้วเติมค่า:

```js
const ONLINE_CONFIG = {
  url: "https://abcdefgh.supabase.co",   // ← Project URL ของคุณ
  anonKey: "eyJhbGciOi...",              // ← anon public key ของคุณ
};
```

บันทึกไฟล์ แล้ว deploy/รีเฟรช — เท่านี้ระบบออนไลน์ก็ทำงาน! 🎉

---

## ใช้งานในเกม
เปิดเมนู **👥 เพื่อน & สู้ผี** จะเห็นบล็อก **🌐 ออนไลน์**:
- **🪪 ID ของฉัน** — ส่งให้เพื่อน (เพื่อนเอาไปกด "➕ เพิ่ม")
- **➕ เพิ่มเพื่อนด้วย ID** — ใส่ ID เพื่อน → สู้ผีเขาได้ (ดึงพลัง **ล่าสุด** อัตโนมัติ)
- **🏆 โหลดกระดานอันดับโลก** — ดู Top 20 ผู้เล่นทั้งหมดที่เชื่อมเซิร์ฟเวอร์เดียวกัน

โปรไฟล์ของคุณจะถูกอัปโหลดอัตโนมัติทุกครั้งที่เกมเซฟ (จำกัดความถี่ไม่เกิน 1 ครั้ง/20 วินาที)

## ถ้าไม่ตั้งค่า
ปล่อย `url`/`anonKey` ว่างไว้ = เกมใช้ **ระบบเพื่อนออฟไลน์** (ก็อป-วางรหัส `CHERRY1:...`) เหมือนเดิมทุกอย่าง
ไม่มี error ใดๆ และไม่มีการเรียกเครือข่าย
