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
  data  jsonb not null,               -- ก้อนเซฟทั้งหมด { slots, ver, ts, activeSlot } — ver ใช้กันข้อมูลทับกันข้ามเครื่อง
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
  w text, cu jsonb default '{}'::jsonb, ng int default 0, rank int default 1000, t text, ts bigint
);
-- ถ้าเคยสร้างตารางเวอร์ชันเก่า ให้เพิ่มคอลัมน์ฉายา (ใช้โชว์ฉายาบนกระดานอันดับโลก):
alter table public.players add column if not exists t text;
alter table public.players enable row level security;
drop policy if exists "players_read"   on public.players;
drop policy if exists "players_insert" on public.players;
drop policy if exists "players_update" on public.players;
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

---

## ⚔️ Live PvP (ตาราง `duels`)

ระบบท้าดวลสดกับเพื่อน: ผู้ท้าสร้างแถว duel (พร้อม snapshot + seed) → ฝ่ายรับกด "รับคำท้า" (เขียน snapshot ตัวเอง + state=active) → ทั้งสองเครื่องรัน simulation แบบ deterministic จาก seed เดียวกัน จึงเห็นผลการต่อสู้ตรงกัน

รันใน Supabase → SQL Editor:

```sql
create table if not exists public.duels (
  id         bigint generated always as identity primary key,
  from_pid   text not null,
  to_pid     text not null,
  from_name  text,
  to_name    text,
  seed       bigint not null,
  a          jsonb,          -- challenger snapshot
  b          jsonb,          -- opponent snapshot (filled on accept)
  state      text not null default 'pending',  -- pending | active | declined
  ts         bigint not null
);
create index if not exists duels_to_idx   on public.duels (to_pid, state, ts desc);
create index if not exists duels_id_idx    on public.duels (id);

alter table public.duels enable row level security;

-- pid-based (not user-secured) like the players table → allow anon read/insert/update
create policy "duels read"   on public.duels for select using (true);
create policy "duels insert" on public.duels for insert with check (true);
create policy "duels update" on public.duels for update using (true) with check (true);
```

> หมายเหตุ: ตาราง `duels` ใช้สิทธิ์ anon เหมือน `players` (อ้างอิงด้วย pid ไม่ใช่ uid) — เหมาะกับการดวลเล่นสนุก ไม่ใช่ระบบจัดอันดับที่ต้องกันโกง

---

## 👹 World Boss ปาร์ตี้ (ตาราง `boss_raids` + ฟังก์ชัน RPC)

บอสโลกเป็นเรด "เลือดก้อนเดียวแชร์ทั้งปาร์ตี้" (async raid): เจ้าของสร้างปาร์ตี้ (แถว `boss_raids` เลือด 1,000,000 ต่อวัน) → เพื่อนออนไลน์กด "เข้าร่วม" → ทุกคนสู้บอสของตัวเองในรอบละ 60 วินาที ดาเมจที่ทำได้จะถูกส่งเข้าไปหักเลือดก้อนกลางบนคลาวด์ (ผ่าน RPC `boss_hit` แบบ atomic) เลือดที่เหลือจึงลดลงร่วมกัน เมื่อเลือดถึง 0 บอสตาย ระบบสุ่มผู้ได้ของตำนาน (โอกาส 20% · 1 คนในปาร์ตี้) ให้ที่ฝั่งเซิร์ฟเวอร์

รันใน Supabase → SQL Editor:

```sql
create table if not exists public.boss_raids (
  id       bigint generated always as identity primary key,
  host     text not null,
  day      text not null,                      -- daily key เช่น "2026-6-25"
  members  jsonb not null default '[]'::jsonb, -- [{pid,n,c,lv}, ...]
  ready    jsonb not null default '[]'::jsonb, -- [pid, ...] คนที่กด "พร้อม"
  scores   jsonb not null default '{}'::jsonb, -- {pid: ดาเมจสะสม} สำหรับกระดานคะแนน
  hp       bigint not null,
  maxhp    bigint not null,
  lv       int not null default 99,
  state    text not null default 'open',       -- open | cleared
  winner   text,                               -- pid ผู้ได้ของตำนาน (ถ้ามี)
  ts       bigint not null
);
create index if not exists boss_raids_host_idx on public.boss_raids (host, day, state, ts desc);
-- ถ้าเคยสร้างตารางเวอร์ชันเก่าไว้แล้ว ให้เพิ่มคอลัมน์ที่ขาด:
alter table public.boss_raids add column if not exists ready  jsonb not null default '[]'::jsonb;
alter table public.boss_raids add column if not exists scores jsonb not null default '{}'::jsonb;

alter table public.boss_raids enable row level security;
-- drop-then-create so the whole block is safe to re-run (create policy ไม่มี if not exists)
drop policy if exists "boss read"   on public.boss_raids;
drop policy if exists "boss insert" on public.boss_raids;
drop policy if exists "boss update" on public.boss_raids;
create policy "boss read"   on public.boss_raids for select using (true);
create policy "boss insert" on public.boss_raids for insert with check (true);
create policy "boss update" on public.boss_raids for update using (true) with check (true);

-- drop ก่อน create — จำเป็นเมื่อเปลี่ยน return type ของฟังก์ชัน (เช่น boss_hit เพิ่มคอลัมน์ scores)
drop function if exists public.boss_hit(bigint, bigint, text);
drop function if exists public.boss_ready(bigint, text);
drop function if exists public.boss_join(bigint, jsonb);

-- 🤝 เข้าร่วมปาร์ตี้ (เพิ่ม member แบบไม่ซ้ำ pid)
create or replace function public.boss_join(p_id bigint, p_member jsonb)
returns setof public.boss_raids
language plpgsql security definer as $$
begin
  update public.boss_raids
    set members = case
      when members @> jsonb_build_array(jsonb_build_object('pid', p_member->>'pid')) then members
      else members || jsonb_build_array(p_member)
    end
    where id = p_id and state = 'open';
  return query select * from public.boss_raids where id = p_id;
end; $$;

-- ✋ กด "พร้อม" (เพิ่ม pid ลงใน ready แบบไม่ซ้ำ)
create or replace function public.boss_ready(p_id bigint, p_pid text)
returns setof public.boss_raids
language plpgsql security definer as $$
begin
  update public.boss_raids
    set ready = case when ready ? p_pid then ready else ready || to_jsonb(p_pid) end
    where id = p_id;
  return query select * from public.boss_raids where id = p_id;
end; $$;

-- ⚔️ หักเลือดก้อนกลางแบบ atomic + สะสมคะแนนผู้ตี; เมื่อถึง 0 → cleared + สุ่มผู้ได้ของตำนาน (20%)
create or replace function public.boss_hit(p_id bigint, p_dmg bigint, p_winner text)
returns table(hp bigint, state text, winner text, scores jsonb)
language plpgsql security definer as $$
declare r public.boss_raids; new_hp bigint; wn text; new_scores jsonb;
begin
  select * into r from public.boss_raids where id = p_id for update;
  if not found then return; end if;
  if r.state = 'cleared' then
    return query select r.hp, r.state, r.winner, r.scores; return;
  end if;
  -- สะสมคะแนน (ดาเมจ) ของผู้ตี
  new_scores := coalesce(r.scores, '{}'::jsonb);
  if p_winner is not null then
    new_scores := jsonb_set(new_scores, array[p_winner],
      to_jsonb(coalesce((new_scores->>p_winner)::bigint, 0) + greatest(0, p_dmg)), true);
  end if;
  new_hp := greatest(0, r.hp - greatest(0, p_dmg));
  if new_hp <= 0 then
    if random() < 0.20 then
      select (m->>'pid') into wn from jsonb_array_elements(r.members) m order by random() limit 1;
    else
      wn := null;
    end if;
    update public.boss_raids set hp = 0, state = 'cleared', winner = wn, scores = new_scores where id = p_id;
    return query select 0::bigint, 'cleared'::text, wn, new_scores;
  else
    update public.boss_raids set hp = new_hp, scores = new_scores where id = p_id;
    return query select new_hp, 'open'::text, null::text, new_scores;
  end if;
end; $$;

grant execute on function public.boss_join(bigint, jsonb) to anon, authenticated;
grant execute on function public.boss_ready(bigint, text) to anon, authenticated;
grant execute on function public.boss_hit(bigint, bigint, text) to anon, authenticated;
```

> ทำงานยังไง: `boss_hit` ใช้ `for update` ล็อกแถวตอนหักเลือด จึงกันดาเมจชนกันเมื่อหลายคนตีพร้อมกัน และสะสมดาเมจของผู้ตีลง `scores` (กระดานคะแนน) · `boss_ready` เก็บคนที่กดพร้อม · ผู้ได้ของตำนานถูกสุ่มที่เซิร์ฟเวอร์ (ยุติธรรมกับทุกเครื่อง) · ตาราง `boss_raids` อ้างอิงด้วย pid เหมือน `players`/`duels` (เกมแคชชวล ไม่กันโกงระดับจริงจัง)
> หมายเหตุ: ถ้าเคยรัน `boss_hit` เวอร์ชันเก่า ให้รัน SQL นี้ทับได้เลย (create or replace) — โครงสร้างผลลัพธ์เพิ่มคอลัมน์ `scores`
>
> ถ้าไม่ตั้งค่า Supabase เกมจะเล่นบอสโลกแบบ **เดี่ยว (ออฟไลน์)** ได้ตามปกติ — เลือดบอสเก็บในเซฟเครื่องตัวเอง รีเซ็ตรายวัน ส่วนระบบปาร์ตี้เพื่อนจะเปิดใช้เมื่อเชื่อมต่อออนไลน์แล้ว

---

## 8) ตลาดออนไลน์ผู้เล่น (ซื้อขายพืชผลฟาร์ม & สัตว์เลี้ยง) — ตาราง `market` + RPC

ตลาดแบบ "ฝากขาย" (async escrow bazaar): ผู้ขายลงประกาศ → ของถูกยกออกจากคลัง/กล่องทันที (escrow ในเครื่อง) → ผู้เล่นอื่นซื้อด้วยทอง (RPC atomic กันซื้อซ้ำ) → ผู้ขายกลับมากด "เก็บทอง" ทีหลัง (ทองอยู่ในเซฟของแต่ละเครื่อง เกมแคชชวลจึงใช้กระเป๋าเงินฝั่งไคลเอนต์)

รันใน Supabase → SQL Editor:

```sql
create table if not exists public.market (
  id          bigint generated always as identity primary key,
  seller      text not null,                       -- pid ผู้ขาย
  seller_name text,
  kind        text not null,                       -- 'produce' | 'pet'
  item        jsonb not null,                      -- produce: {crop,name,emoji,qty} · pet: {sp,lv,exp,stage,plus,iv,name,emoji,tier}
  price       bigint not null,
  status      text not null default 'open',        -- open | sold | cancelled
  buyer       text,
  buyer_name  text,
  collected   boolean not null default false,      -- ผู้ขายเก็บทองแล้วหรือยัง
  sold_ts     bigint,
  ts          bigint not null
);
create index if not exists market_open_idx on public.market (status, ts desc);
create index if not exists market_seller_idx on public.market (seller, status, ts desc);

alter table public.market enable row level security;
drop policy if exists "market read"   on public.market;
drop policy if exists "market insert" on public.market;
drop policy if exists "market update" on public.market;
create policy "market read"   on public.market for select using (true);
create policy "market insert" on public.market for insert with check (true);
create policy "market update" on public.market for update using (true) with check (true);

-- 🛒 ซื้อแบบ atomic: เปลี่ยน open→sold เฉพาะตอนยังเปิดอยู่ แล้วคืนแถวเฉพาะเมื่อ "ผู้ซื้อคนนี้" คว้าได้ (กันซื้อชนกัน)
drop function if exists public.market_buy(bigint, text, text);
create or replace function public.market_buy(p_id bigint, p_buyer text, p_name text)
returns setof public.market
language plpgsql security definer as $$
begin
  update public.market
    set status = 'sold', buyer = p_buyer, buyer_name = p_name,
        sold_ts = (extract(epoch from now()) * 1000)::bigint
    where id = p_id and status = 'open';
  return query select * from public.market where id = p_id and buyer = p_buyer and status = 'sold';
end; $$;

grant execute on function public.market_buy(bigint, text, text) to anon, authenticated;
```

> ทำงานยังไง: `market_buy` ทำ `update ... where status='open'` เป็นคำสั่งเดียว (atomic) — ถ้ามีคนซื้อไปก่อน คำสั่งจะไม่แมตช์ และ query คืนค่าว่าง ไคลเอนต์จึงรู้ว่า "ช้าไป" และไม่หักทอง · การ "เก็บทอง" และ "ยกเลิก" ใช้ PATCH แบบมีเงื่อนไข (`collected=false` / `status=open`) จึงกันเก็บซ้ำ/ยกเลิกทับการขายได้ในตัว
>
> ถ้าไม่ตั้งค่า Supabase ปุ่ม 🌐 ตลาดออนไลน์ จะแจ้งว่ายังไม่ได้ตั้งค่า และส่วนอื่นของฟาร์ม (คลัง/ปลูก/เพาะพันธุ์) ยังเล่นออฟไลน์ได้ตามปกติ

---

## 9) ประกวดสัตว์เลี้ยง + กระดานอันดับ — ตาราง `contest` + RPC

กระดานอันดับรายวัน: ผู้เล่นส่งเพ็ตเข้าประกวด (คะแนนคิดจากพลังเพ็ต) → เก็บ "คะแนนสูงสุดต่อวัน" ต่อผู้เล่น แล้วจัดอันดับ

รันใน Supabase → SQL Editor:

```sql
create table if not exists public.contest (
  pid   text not null,
  day   text not null,                 -- คีย์รายวัน เช่น "c2026-8-1"
  name  text,
  pet   jsonb,                          -- {sp,emoji,name,lv,power}
  score bigint not null default 0,
  ts    bigint not null,
  primary key (pid, day)
);
create index if not exists contest_day_idx on public.contest (day, score desc);

alter table public.contest enable row level security;
drop policy if exists "contest read"   on public.contest;
drop policy if exists "contest insert" on public.contest;
drop policy if exists "contest update" on public.contest;
create policy "contest read"   on public.contest for select using (true);
create policy "contest insert" on public.contest for insert with check (true);
create policy "contest update" on public.contest for update using (true) with check (true);

-- 🏆 ส่งคะแนน: เก็บคะแนน "สูงสุด" ต่อ (pid, day) แบบ atomic
drop function if exists public.contest_submit(text, text, text, jsonb, bigint, bigint);
create or replace function public.contest_submit(p_pid text, p_day text, p_name text, p_pet jsonb, p_score bigint, p_ts bigint)
returns setof public.contest
language plpgsql security definer as $$
begin
  insert into public.contest(pid, day, name, pet, score, ts)
    values (p_pid, p_day, p_name, p_pet, p_score, p_ts)
  on conflict (pid, day) do update
    set name = excluded.name,
        pet  = case when excluded.score > public.contest.score then excluded.pet else public.contest.pet end,
        score = greatest(public.contest.score, excluded.score),
        ts = excluded.ts;
  return query select * from public.contest where pid = p_pid and day = p_day;
end; $$;

grant execute on function public.contest_submit(text, text, text, jsonb, bigint, bigint) to anon, authenticated;
```

> ทำงานยังไง: `contest_submit` ใช้ upsert (`on conflict (pid,day)`) + `greatest(...)` จึงเก็บเฉพาะคะแนนที่ดีที่สุดของแต่ละคนในวันนั้น · กระดานดึงด้วย `order=score.desc` · ถ้าไม่ตั้งค่าออนไลน์ ยังเล่นประกวดแบบรับรางวัลในเครื่องได้ แต่แท็บ 📊 อันดับ จะแจ้งให้ตั้งค่าก่อน
