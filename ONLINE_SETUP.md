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

---

# 🔐 ระบบบัญชี + จำ Login ข้ามเครื่อง (Cross-Device Save)

เปิดให้ผู้เล่น **เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน หรือ Google** แล้วเซฟทั้งหมด (ตัวละคร ไอเทม เงิน สกิล ฯลฯ)
จะถูกเก็บบนคลาวด์ **เล่นเครื่องไหนก็โหลดตัวเดิมกลับมาได้** (ต่อยอดจาก Supabase เดิม)

## 1) สร้างตาราง `saves` + เปิด RLS (วาง SQL)
เปิด **SQL Editor → New query** วาง SQL นี้ทั้งหมด → **Run**

```sql
-- เซฟเต็ม (ผูกกับบัญชีผู้ใช้ Auth)
create table if not exists public.saves (
  uid   uuid primary key references auth.users(id) on delete cascade,
  data  jsonb not null,               -- ก้อนเซฟทั้งหมด (เหมือน slot ใน localStorage)
  ts    bigint,                        -- เวลาอัปเดตล่าสุด (newest-wins)
  updated_at timestamptz default now()
);

alter table public.saves enable row level security;

-- ผู้ใช้เห็น/แก้ได้เฉพาะแถวของตัวเอง (uid = auth.uid())
create policy "saves_select_own" on public.saves for select using (auth.uid() = uid);
create policy "saves_insert_own" on public.saves for insert with check (auth.uid() = uid);
create policy "saves_update_own" on public.saves for update using (auth.uid() = uid) with check (auth.uid() = uid);
```

## 2) เปิดระบบ Auth
1. เมนู **Authentication → Providers → Email** → เปิด (Enable)
2. **ปิด "Confirm email"** (Authentication → Providers → Email → เอาติ๊ก *Confirm email* ออก)
   เพื่อให้สมัครแล้วเข้าเล่นได้ทันที (ถ้าเปิดไว้ ผู้เล่นต้องกดยืนยันในอีเมลก่อน)
3. ใส่ค่าใน `ONLINE_CONFIG` (บนสุดของไฟล์เกม) — ใช้ url + anonKey **เดียวกับระบบเพื่อน**:
```js
const ONLINE_CONFIG = {
  url: "https://xxxx.supabase.co",
  anonKey: "eyJhbGciOi...",
};
```

## 3) (ตัวเลือก) เข้าสู่ระบบด้วย Google
1. **Authentication → Providers → Google** → เปิด แล้วใส่ **Client ID/Secret** จาก Google Cloud Console
2. ใน Google Cloud → OAuth consent + Credentials → **Authorized redirect URI** ใส่:
   `https://xxxx.supabase.co/auth/v1/callback`
3. ใน Supabase → **Authentication → URL Configuration → Redirect URLs** เพิ่ม URL ของเว็บเกมคุณ
   (เช่น `https://your-game-site/` — เกมจะส่งผู้เล่นกลับมาที่หน้านี้พร้อม token)

## ใช้งานในเกม
ที่ **หน้าเลือกช่องบันทึก (Title)** จะมีปุ่ม **🔐 เข้าสู่ระบบ / บันทึกข้ามเครื่อง**
- **สมัครใหม่ / เข้าสู่ระบบ** ด้วยอีเมล+รหัสผ่าน (หรือปุ่ม Google)
- เข้าสู่ระบบแล้ว: เซฟจะ **อัปโหลดขึ้นคลาวด์อัตโนมัติทุกครั้งที่เกมเซฟ** (จำกัด 1 ครั้ง/15 วินาที)
- บนเครื่องใหม่: แค่เข้าสู่ระบบบัญชีเดิม → เกม **ดึงเซฟล่าสุดจากคลาวด์มาลงช่อง 1** ให้อัตโนมัติ
- ปุ่ม **ซิงค์** = ดันเซฟขึ้นคลาวด์เดี๋ยวนั้น · ปุ่ม **ออก** = ออกจากระบบ

> เซฟจะถูกป้องกันด้วย **Row-Level Security** — ผู้เล่นอ่าน/เขียนได้เฉพาะบัญชีตัวเอง (anon key ฝัง client ได้อย่างปลอดภัย)
> ระบบเลือกเซฟด้วย **newest-wins** (เวลาล่าสุดชนะ) — ถ้าเครื่อง A เพิ่งเซฟ แล้วเข้า B ระบบจะโหลดของ A ให้

## ถ้าไม่ตั้งค่า
ไม่กรอก `ONLINE_CONFIG` = ปุ่มเข้าสู่ระบบจะแจ้งว่ายังไม่ได้ตั้งค่า และเกมยังเซฟลงเครื่อง (localStorage) ตามปกติ

---

# 🟢 ระบบเพื่อนออนไลน์ + แชท (Presence + Chat)

เพิ่ม: เห็น **เพื่อนออนไลน์อยู่ตอนนี้** (จุดเขียว) + **แชทโลก** แบบเรียลไทม์ (poll ทุก ~3.5 วิ)
ทำงานบน Supabase REST — ต้องมีตาราง `players` (โปรไฟล์/สถานะออนไลน์) และ `messages` (แชท)

## รัน SQL นี้ (SQL Editor → New query → Run)
```sql
-- 1) players : โปรไฟล์สาธารณะ + last-seen (ใช้ทำ leaderboard/friends/สถานะออนไลน์)
create table if not exists public.players (
  pid text primary key, n text, c text, lv int default 1,
  atk int default 0, def int default 0, hp int default 0, crit int default 0,
  w text, cu jsonb default '{}'::jsonb, ng int default 0, rank int default 1000, ts bigint
);
alter table public.players enable row level security;
create policy "players_read"   on public.players for select using (true);
create policy "players_insert" on public.players for insert with check (true);
create policy "players_update" on public.players for update using (true);

-- 2) messages : แชท (เขียนได้เฉพาะเป็นตัวเอง, อ่านได้เมื่อ login)
create table if not exists public.messages (
  id   bigint generated always as identity primary key,
  room text not null default 'global',
  uid  uuid not null references auth.users(id) on delete cascade,
  n text, c text, lv int, body text not null, ts bigint
);
alter table public.messages enable row level security;
create policy "msg_read"       on public.messages for select using (auth.uid() is not null);
create policy "msg_insert_own" on public.messages for insert with check (auth.uid() = uid);
create index if not exists messages_room_id on public.messages (room, id);
```

## ใช้งานในเกม
- **สถานะออนไลน์:** ขณะล็อกอิน เกมจะอัปเดต last-seen (`players.ts`) ทุก ~25 วิ → เพื่อนที่ last-seen < 60 วิ = ออนไลน์ (จุดเขียว) · ปุ่ม 💬 มีตัวเลขจำนวนเพื่อนออนไลน์
- **แชทโลก:** ปุ่ม 💬 (มุมซ้ายล่างตอนอยู่ในโลกกว้าง + ล็อกอินแล้ว) → พิมพ์คุยกับทุกคนที่ออนไลน์ (poll ทุก ~3.5 วิ)

> `players` เปิดอ่าน/เขียนสาธารณะ (ข้อมูลโปรไฟล์ไม่ลับ) · `messages` เขียนได้เฉพาะบัญชีตัวเอง (RLS `auth.uid() = uid`) อ่านได้เมื่อล็อกอิน

---

# 🤝 เพื่อนแบบสองทางอัตโนมัติ (Mutual Friends)

เมื่อฝ่ายใดเพิ่มเพื่อนด้วย ID → **ทั้งสองฝ่ายเป็นเพื่อนกันเองอัตโนมัติ** (ไม่ต้องเพิ่มกลับ)
เก็บความสัมพันธ์บนตาราง `friends` (2 แถวต่อ 1 คู่: a→b และ b→a) แล้วแต่ละคน sync รายชื่อเพื่อนจากเซิร์ฟเวอร์

## รัน SQL นี้
```sql
create table if not exists public.friends (
  a text not null,   -- เจ้าของรายการ (pid)
  b text not null,   -- เพื่อน (pid)
  ts bigint,
  primary key (a, b)
);
alter table public.friends enable row level security;
create policy "friends_read"   on public.friends for select using (true);
create policy "friends_insert" on public.friends for insert with check (true);
```

## ทำงานยังไง
- A เพิ่ม B ด้วย ID → เกมเขียน 2 แถว: (A→B) และ (B→A)
- เกมของ B จะ **sync รายชื่อเพื่อนจากเซิร์ฟเวอร์** (ตอนเปิดหน้าเพื่อน + heartbeat ทุก 25 วิ) → เห็น A เป็นเพื่อนเองอัตโนมัติ พร้อมพลังล่าสุด
