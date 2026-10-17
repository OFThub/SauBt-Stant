-- SAÜ stant: skorlar, çözümler, anketler, oylar. Sıfırdan kurulumda bir kez çalıştırılır.
-- Günlük sıfırlama: truncate public.scores, public.solves;
-- polls.active = anket havuzunda mı? false yapılan anket telefonlarda ve büyük ekranda çıkmaz.

create table public.scores (
  id bigint generated always as identity primary key,
  nick text not null check (char_length(trim(nick)) between 1 and 20),
  score int not null check (score between 0 and 600),
  created_at timestamptz not null default now()
);

create table public.polls (
  id bigint generated always as identity primary key,
  question text not null,
  options text[] not null check (cardinality(options) between 2 and 6),
  active boolean not null default true
);

-- Hatayı bul: 3/3 yapanların süreleri
create table public.solves (
  id bigint generated always as identity primary key,
  nick text not null check (char_length(trim(nick)) between 1 and 20),
  lang text not null check (char_length(lang) between 1 and 20),
  ms int not null check (ms between 1000 and 150000),
  created_at timestamptz not null default now()
);

create table public.votes (
  id bigint generated always as identity primary key,
  poll_id bigint not null references public.polls on delete cascade,
  option_idx smallint not null check (option_idx between 0 and 5),
  created_at timestamptz not null default now()
);

-- Oyuncu başına en iyi skor.
create view public.leaderboard with (security_invoker = true) as
  select distinct on (lower(nick)) nick, score, created_at
  from public.scores
  order by lower(nick), score desc, created_at;

-- Kişilik testi sonuçları (sonuç sitesindeki dağılım için)
create table public.quiz_results (
  id bigint generated always as identity primary key,
  type text not null check (char_length(type) between 1 and 20),
  created_at timestamptz not null default now()
);

create view public.quiz_stats with (security_invoker = true) as
  select type, count(*)::int as n from public.quiz_results group by type;

-- Oyuncu başına en iyi (en kısa) süre.
create view public.solve_board with (security_invoker = true) as
  select distinct on (lower(nick)) nick, lang, ms, created_at
  from public.solves
  order by lower(nick), ms, created_at;

create view public.poll_results with (security_invoker = true) as
  select poll_id, option_idx, count(*)::int as n
  from public.votes
  group by poll_id, option_idx;

alter table public.scores enable row level security;
alter table public.polls enable row level security;
alter table public.votes enable row level security;
alter table public.solves enable row level security;
alter table public.quiz_results enable row level security;

-- Anonim kullanıcı sadece okur ve ekler; güncelleme/silme yok (onlar Table Editor'dan).
create policy "okuma" on public.scores for select to anon, authenticated using (true);
create policy "skor ekleme" on public.scores for insert to anon, authenticated with check (true);
create policy "okuma" on public.polls for select to anon, authenticated using (true);
create policy "okuma" on public.votes for select to anon, authenticated using (true);
create policy "aktif ankete oy" on public.votes for insert to anon, authenticated
  with check (exists (select 1 from public.polls p where p.id = poll_id and p.active));

create policy "okuma" on public.solves for select to anon, authenticated using (true);
create policy "çözüm ekleme" on public.solves for insert to anon, authenticated with check (true);

create policy "okuma" on public.quiz_results for select to anon, authenticated using (true);
create policy "sonuç ekleme" on public.quiz_results for insert to anon, authenticated with check (true);

grant select, insert on public.scores, public.votes, public.solves, public.quiz_results to anon, authenticated;
grant select on public.polls, public.leaderboard, public.poll_results, public.solve_board, public.quiz_stats to anon, authenticated;

alter publication supabase_realtime add table public.scores, public.polls, public.votes, public.solves, public.quiz_results;

insert into public.polls (question, options) values
  ('Python mu, Java mı?', array['Python', 'Java']),
  ('Tab mı, boşluk mu?', array['Tab', 'Boşluk']),
  ('Karanlık tema mı, açık tema mı?', array['Karanlık', 'Açık']),
  ('İlk öğrenilecek dil hangisi olmalı?', array['Python', 'C', 'JavaScript', 'Java']),
  ('Gece mi kodlarsın, sabah mı?', array['Gece', 'Sabah']),
  ('Vim mi, Emacs mi?', array['Vim', 'Emacs', 'Nano', 'VS Code yeter']),
  ('Değişken adlarını nasıl yazarsın?', array['camelCase', 'snake_case', 'PascalCase', 'kebab-case']),
  ('Hata ayıklarken ilk silahın?', array['print / console.log', 'Debugger', 'Lastik ördek', 'Silip baştan yazmak']),
  ('Git''te hangisi?', array['merge', 'rebase', 'squash', 'git push --force']),
  ('Commit mesajların genelde nasıl?', array['Conventional Commits', '"fix"', '"asdasd"', 'Paragraf paragraf']),
  ('Mikroservis mi, monolit mi?', array['Mikroservis', 'Monolit', 'Modüler monolit']),
  ('ORM mi, ham SQL mi?', array['ORM', 'Ham SQL', 'Duruma göre']),
  ('Statik tip mi, dinamik tip mi?', array['Statik', 'Dinamik', 'İkisi de yerinde']),
  ('Hangi paradigma?', array['Fonksiyonel', 'Nesne yönelimli', 'Prosedürel', 'Ne gerekirse']),
  ('En sevdiğin hata mesajı?', array['Segmentation fault', 'NullPointerException', 'undefined is not a function', 'Benim bilgisayarımda çalışıyordu']),
  ('Diziler 0''dan mı başlamalı, 1''den mi?', array['0', '1', 'Dile göre değişir']),
  ('JavaScript''te noktalı virgül?', array['Her zaman', 'Asla', 'Prettier karar versin']),
  ('Gece 3''te canlı sistem çöktü. İlk hamlen?', array['Geri al (rollback)', 'Hemen düzelt (hotfix)', 'Logları oku', 'Telefonu sessize al']),
  ('Hangi işletim sisteminde kod yazıyorsun?', array['Windows', 'macOS', 'Linux', 'WSL']),
  ('Linux dağıtımın?', array['Ubuntu', 'Arch', 'Fedora', 'Debian', 'Mint', 'Kullanmıyorum']),
  ('Klavye düzenin?', array['Türkçe Q', 'Türkçe F', 'İngilizce (US)']),
  ('Kod yazarken ne dinlersin?', array['Lo-fi', 'Rock / Metal', 'Sessizlik', 'Podcast', 'Film müziği']),
  ('Yapay zekâyla kod yazıyor musun?', array['Her gün', 'Bazen', 'Hiç', 'Sadece regex için']),
  ('Regex yazman gerekince?', array['Ezbere yazarım', 'regex101 açarım', 'Yapay zekâya sorarım', 'Başka yol ararım']),
  ('İlk "Merhaba Dünya"n hangi dildeydi?', array['C', 'Python', 'Java', 'C#', 'Scratch', 'Diğer']),
  ('HTML bir programlama dili mi?', array['Evet', 'Hayır', 'Bu soruyla kavga çıkar']),
  ('Excel bir programlama dili mi?', array['Evet', 'Hayır', 'LAMBDA''dan beri evet']),
  ('Seni en çok zorlayan ders?', array['Veri Yapıları', 'Ayrık Matematik', 'Algoritma Analizi', 'İşletim Sistemleri', 'Sayısal Analiz', 'Diferansiyel Denklemler']),
  ('Ders projeni nasıl saklıyorsun?', array['Git', 'Google Drive', 'proje_final_v3_son.zip']),
  ('Kod yazarken çay mı, kahve mi?', array['Çay', 'Kahve', 'Enerji içeceği', 'Su yeter']),
  ('Yorum satırı?', array['Kod kendini anlatır', 'Her fonksiyona yazarım', 'Sadece TODO']),
  ('En zarif sıralama algoritması?', array['Quicksort', 'Merge sort', 'Heap sort', 'Bogosort']),
  ('Mezun olunca nerede çalışmak istersin?', array['Kurumsal şirket', 'Girişim', 'Kendi girişimim', 'Akademi', 'Yurt dışı']),
  ('Stack Overflow''a en son ne zaman soru sordun?', array['Bu hafta', 'Yıllar önce', 'Hiç', 'Yapay zekâ çıktı çıkalı hiç']);
