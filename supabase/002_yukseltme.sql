-- Mevcut veritabanını yükseltir (schema.sql ile kurulmuş, 15 Ekim sürümü). Supabase SQL Editor'de bir kez çalıştır.
-- 1) Hatayı bul liderlik tablosu  2) Tüm anketler havuza (active = havuzda mı?)  3) Kişilik testi sonuçları

create table public.solves (
  id bigint generated always as identity primary key,
  nick text not null check (char_length(trim(nick)) between 1 and 20),
  lang text not null check (char_length(lang) between 1 and 20),
  ms int not null check (ms between 1000 and 150000),
  created_at timestamptz not null default now()
);

create view public.solve_board with (security_invoker = true) as
  select distinct on (lower(nick)) nick, lang, ms, created_at
  from public.solves
  order by lower(nick), ms, created_at;

alter table public.solves enable row level security;
create policy "okuma" on public.solves for select to anon, authenticated using (true);
create policy "çözüm ekleme" on public.solves for insert to anon, authenticated with check (true);
grant select, insert on public.solves to anon, authenticated;
grant select on public.solve_board to anon, authenticated;
alter publication supabase_realtime add table public.solves;

alter table public.polls alter column active set default true;
update public.polls set active = true;

-- 3) Kişilik testi sonuçları (sonuç sitesindeki dağılım için)
create table public.quiz_results (
  id bigint generated always as identity primary key,
  type text not null check (char_length(type) between 1 and 20),
  created_at timestamptz not null default now()
);

create view public.quiz_stats with (security_invoker = true) as
  select type, count(*)::int as n from public.quiz_results group by type;

alter table public.quiz_results enable row level security;
create policy "okuma" on public.quiz_results for select to anon, authenticated using (true);
create policy "sonuç ekleme" on public.quiz_results for insert to anon, authenticated with check (true);
grant select, insert on public.quiz_results to anon, authenticated;
grant select on public.quiz_stats to anon, authenticated;
alter publication supabase_realtime add table public.quiz_results;
