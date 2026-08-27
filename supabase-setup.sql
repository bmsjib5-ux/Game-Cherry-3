-- 🍒 Cherry Adventure — สร้างตารางออนไลน์ทั้งหมดในไฟล์เดียว (v358)
-- วิธีใช้: Supabase Dashboard → SQL Editor → New query → วางทั้งไฟล์ → Run
-- รันซ้ำได้ปลอดภัย: ตาราง = create if not exists · นโยบาย = drop แล้วสร้างใหม่
-- ครอบคลุม: players · saves · messages · friends · duels · boss_raids ·
--            market · contest · party_member · homes · guilds · guild_members

-- เซฟเต็ม (ผูกกับบัญชีผู้ใช้ Auth)
create table if not exists public.saves (
  uid   uuid primary key references auth.users(id) on delete cascade,
  data  jsonb not null,               -- ก้อนเซฟทั้งหมด { slots, ver, ts, activeSlot } — ver ใช้กันข้อมูลทับกันข้ามเครื่อง
  ts    bigint,                        -- เวลาอัปเดตล่าสุด (newest-wins)
  updated_at timestamptz default now()
);

alter table public.saves enable row level security;

-- ผู้ใช้เห็น/แก้ได้เฉพาะแถวของตัวเอง (uid = auth.uid())
drop policy if exists "saves_select_own" on public.saves;
create policy "saves_select_own" on public.saves for select using (auth.uid() = uid);
drop policy if exists "saves_insert_own" on public.saves;
create policy "saves_insert_own" on public.saves for insert with check (auth.uid() = uid);
drop policy if exists "saves_update_own" on public.saves;
create policy "saves_update_own" on public.saves for update using (auth.uid() = uid) with check (auth.uid() = uid);

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
drop policy if exists "players_read" on public.players;
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
drop policy if exists "msg_read" on public.messages;
create policy "msg_read"       on public.messages for select using (auth.uid() is not null);
drop policy if exists "msg_insert_own" on public.messages;
create policy "msg_insert_own" on public.messages for insert with check (auth.uid() = uid);
create index if not exists messages_room_id on public.messages (room, id);

create table if not exists public.friends (
  a text not null,   -- เจ้าของรายการ (pid)
  b text not null,   -- เพื่อน (pid)
  ts bigint,
  primary key (a, b)
);
alter table public.friends enable row level security;
drop policy if exists "friends_read" on public.friends;
create policy "friends_read"   on public.friends for select using (true);
drop policy if exists "friends_insert" on public.friends;
create policy "friends_insert" on public.friends for insert with check (true);

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
drop policy if exists "duels read" on public.duels;
create policy "duels read"   on public.duels for select using (true);
drop policy if exists "duels insert" on public.duels;
create policy "duels insert" on public.duels for insert with check (true);
drop policy if exists "duels update" on public.duels;
create policy "duels update" on public.duels for update using (true) with check (true);

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
drop policy if exists "boss read" on public.boss_raids;
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
drop policy if exists "market read" on public.market;
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
drop policy if exists "contest read" on public.contest;
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

-- 🤝 สมาชิกปาร์ตี้: แต่ละคนอัปเดตแถวของตัวเอง (เลเวล/ออนไลน์ล่าสุด/XP ที่แบ่งสะสม)
create table if not exists public.party_member (
  party text not null,
  pid   text not null,
  n     text,
  c     text,
  lv    integer default 1,
  seen  bigint default 0,
  xpg   bigint default 0,
  t     timestamptz default now(),
  primary key (party, pid)
);
create index if not exists party_member_party_idx on public.party_member (party, seen desc);

alter table public.party_member enable row level security;
drop policy if exists "party read"   on public.party_member;
drop policy if exists "party insert" on public.party_member;
drop policy if exists "party update" on public.party_member;
drop policy if exists "party delete" on public.party_member;
drop policy if exists "party read" on public.party_member;
create policy "party read"   on public.party_member for select using (true);
create policy "party insert" on public.party_member for insert with check (true);
create policy "party update" on public.party_member for update using (true) with check (true);
create policy "party delete" on public.party_member for delete using (true);

-- 🏠 ผังบ้านของผู้เล่น (เฟอร์นิเจอร์ที่วาง) — เพื่อนดึงไปดูตอนกดเยี่ยมบ้าน
create table if not exists public.homes (
  pid   text primary key,
  n     text,
  furni jsonb default '[]'::jsonb,
  t     bigint default 0
);

alter table public.homes enable row level security;
drop policy if exists "homes read"   on public.homes;
drop policy if exists "homes insert" on public.homes;
drop policy if exists "homes update" on public.homes;
drop policy if exists "homes read" on public.homes;
create policy "homes read"   on public.homes for select using (true);
create policy "homes insert" on public.homes for insert with check (true);
create policy "homes update" on public.homes for update using (true) with check (true);

-- 🏰 กิลด์
create table if not exists public.guilds (
  gid        text primary key,        -- รหัสกิลด์ (G______)
  name       text not null,           -- ชื่อกิลด์
  emoji      text default '🏰',
  leader     text,                    -- pid ของหัวหน้ากิลด์
  notice     text default '',         -- ประกาศกิลด์
  exp        bigint default 0,        -- คลังสะสม (ใช้คิดเลเวลกิลด์)
  bank_gold  bigint default 0,        -- ทองในคลัง
  boss_id    text,                    -- บอสกิลด์สัปดาห์นี้
  boss_hp    bigint default 0,        -- เลือดคงเหลือ (กองกลาง)
  boss_max   bigint default 0,
  boss_week  text,                    -- สัปดาห์ของบอสตัวนี้ (YYYY-Wnn)
  updated_at timestamptz default now()
);
alter table public.guilds enable row level security;
drop policy if exists "guild read" on public.guilds;
create policy "guild read"   on public.guilds for select using (true);
drop policy if exists "guild insert" on public.guilds;
create policy "guild insert" on public.guilds for insert with check (true);
drop policy if exists "guild update" on public.guilds;
create policy "guild update" on public.guilds for update using (true) with check (true);

-- 👥 สมาชิกกิลด์
create table if not exists public.guild_members (
  gid        text not null,
  pid        text not null,
  n          text,                    -- ชื่อผู้เล่น
  lv         int  default 1,
  cls        text,                    -- อาชีพ
  contrib    bigint default 0,        -- แต้มสมทบสะสม (ทองที่บริจาค)
  boss_dmg   bigint default 0,        -- ดาเมจบอสกิลด์สัปดาห์นี้
  boss_tries int default 0,           -- จำนวนครั้งที่ฟาดสัปดาห์นี้
  boss_week  text,
  role       text default 'member',   -- leader / member
  joined_at  timestamptz default now(),
  primary key (gid, pid)
);
alter table public.guild_members enable row level security;
drop policy if exists "gm read" on public.guild_members;
create policy "gm read"   on public.guild_members for select using (true);
drop policy if exists "gm insert" on public.guild_members;
create policy "gm insert" on public.guild_members for insert with check (true);
drop policy if exists "gm update" on public.guild_members;
create policy "gm update" on public.guild_members for update using (true) with check (true);
drop policy if exists "gm delete" on public.guild_members;
create policy "gm delete" on public.guild_members for delete using (true);
create index if not exists guild_members_gid_idx on public.guild_members (gid);
