-- Hız testine dil + herkese aynı 15 anket. Supabase SQL Editor'de bir kez çalıştır (002'den sonra).

-- 1) Hız testi skorları hangi dilde yazıldı (eski skorlar Python sayılır)
alter table public.scores add column lang text not null default 'Python' check (char_length(lang) between 1 and 20);

create or replace view public.leaderboard with (security_invoker = true) as
  select distinct on (lower(nick)) nick, score, created_at, lang
  from public.scores
  order by lower(nick), score desc, created_at;

-- 2) Ankette yalnızca bu 15 soru (id sırasıyla herkese aynı) aktif
update public.polls set active = (id in (1, 2, 3, 4, 5, 6, 8, 9, 15, 16, 18, 21, 23, 26, 30));
