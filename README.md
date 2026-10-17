# SAÜ Bilgisayar Topluluğu — Stant Uygulaması

Topluluk standı için tek bir web uygulamasında dört etkinlik ve canlı bir büyük ekran.

| Site | Adres | İçerik |
|---|---|---|
| Oyunlar | **https://saubt.vercel.app** | Aşağıdaki tablodaki tüm sayfalar |
| Sonuçlar | **https://saubt-leaderboard.vercel.app** | 4 etkinliğin tüm sıralama ve sonuçları, canlı (salt okunur) |

İki site aynı koddan yayınlanır. Sonuç sitesinin Vercel projesinde `VITE_SITE=board` tanımlıdır; bu değişken uygulamanın oyunlar yerine sonuç ekranını açmasını sağlar (`src/main.tsx`, `src/pages/Board.tsx`).

| Adres | Nerede açılır | Ne yapar |
|---|---|---|
| `/#/` | her yerde | Dört etkinliğin menüsü |
| `/#/meydan` | stant laptopu | **Hatayı bul:** Oyuncu 16 dilden birini (ya da "Karışık") seçer. 3 soru, 2:30 süre, hata hakkı yok. Hepsini bilen kazanır ve ödülü görevliden alır. Adını yazarsa süresiyle "En hızlı çözenler" tablosuna girer. |
| `/#/refleks` | stant laptopu | **Hız testi:** Oyuncu dilini seçer (Python, JavaScript, Java, C, C#, Go; kod bilmeyenlere Python önerilir). 30 saniye boyunca ekrandaki kod satırlarını yazarsın. Skor büyük ekrana düşer. |
| `/#/anket` | katılımcının telefonu | **Anket:** Herkese aynı 15 soru aynı sırayla sorulur (havuzdaki `active` anketler, id sırasıyla). Her oydan sonra canlı yüzdeler görünür. Ana sayfaya dönünce seçimler sıfırlanır, anket yeniden çözülebilir. |
| `/#/test` | katılımcının telefonu | **Hangi yazılımcısın?** Gündelik hayattan 8 soru, 8 yazılımcı tipi. Sonunda paylaşılabilir bir kart ve topluluğun hesapları çıkar. |
| `/#/ekran` | projeksiyon / TV | **Büyük ekran:** Solda 15 saniyede bir dönen iki tablo (Hız testi / Hatayı bul). Sağda en son oy alan anketin canlı sonuçları. |

## Stant günü kurulumu

1. **Projeksiyon bilgisayarı:** `/#/ekran` adresini aç ve F11 ile tam ekrana geç. Skorlar ve oylar kendiliğinden güncellenir. Bağlantı kısa süre koparsa sayfa en geç 30 saniyede bir kendini toparlar.
2. **Oyun laptopu:** `/#/meydan` veya `/#/refleks` aç. Her oyun bitince "Sıradaki oyuncu" ile başa dön.
3. **Telefonlar:** Büyük ekrandaki QR kodu siteyi açar. Katılımcılar menüden anket veya teste geçer.
4. **Ödül:** "Hatayı bul" oyununda 3/3 yapan kişi siyah tebrik ekranını görevliye gösterir.

Stant öncesi kontrol listesi:

- [ ] `src/config.ts` içindeki sosyal medya hesapları gerçek mi? Şu an `@hesap_adi` yazan bir yer tutucu var.
- [ ] Test skorları, çözüm süreleri ve oylar temizlendi mi? (Aşağıdaki [Yönetim](#yönetim) bölümüne bak.)
- [ ] Havuzda istemediğin anket kaldı mı?
- [ ] Laptopların interneti çıkmazsa diye yedek telefon hotspot'u hazır mı?

## Yönetim

Admin paneli yok. Her şey Supabase panelinden yapılıyor. Projenin adı `sau-stant`; erişim için proje sahibinden davet iste.

**Table Editor'den (kod gerekmez):**
- **Anket havuzu:** `polls` tablosunda `active = true` olan her anket havuzdadır. Anket sayfasında havuzdaki ilk 15 anket (id sırasıyla) herkese sorulur (`src/config.ts` → `POLL_COUNT`). Bir anketi çıkarmak için `active` alanını `false` yap.
- **Yeni anket:** `polls` tablosuna satır ekle. `options` alanına 2 ile 6 arasında seçenek yaz; yeni anket varsayılan olarak havuza girer.
- **Büyük ekran** her zaman en son oy alan anketi gösterir. Ekran zıplamasın diye bir anket en az 6 saniye ekranda kalır.
- **Uygunsuz takma ad:** `scores` tablosunda ilgili satırı sil.

**SQL Editor'den:**

```sql
-- 3 numaralı anketi havuzdan çıkar
update public.polls set active = false where id = 3;

-- Her iki liderlik tablosunu sıfırla (ör. her sabah)
truncate public.scores, public.solves;

-- Tüm oyları sıfırla
truncate public.votes;
```

Güvenlik: Sitedeki anahtar yalnızca **okuma ve ekleme** yapabilir. Ziyaretçiler skor, süre veya oy silemez ya da değiştiremez; havuz dışındaki bir ankete oy veremez. 600'ün üstündeki hız skorları ve 1 saniyenin altındaki çözüm süreleri veritabanında reddedilir.

**Mevcut veritabanını yükseltme:** Veritabanı 15 Ekim'deki ilk sürümle kurulduysa, Supabase SQL Editor'de `supabase/002_yukseltme.sql` dosyasını bir kez çalıştır. Bu dosya Hatayı Bul liderlik tablosunu ve kişilik testi sonuçları tablosunu ekler. Ardından `supabase/003_hiz_dili_sabit_anket.sql` dosyasını çalıştır: hız testine dil sütunu ekler ve havuzu herkese sorulan 15 ankete indirir. Sıfırdan kurulumda yalnızca `supabase/schema.sql` yeterli.

## İçerik ekleme

Kod bilmeden düzenlenebilen dosyalar:

| Dosya | İçerik |
|---|---|
| `src/data/challenges.ts` | "Hatayı bul" soruları (16 dil, 192 soru). Seçilen dilden rastgele 3 tanesi gelir; aynı oyuncu tekrar oynadığında farklı sorular görsün diye her dilde en az 12 soru olmalı. Yeni bir `lang` değeri yazınca dil seçim ekranına kendiliğinden eklenir. |
| `src/data/snippets.ts` | Hız testinde yazılan kod satırları |
| `src/data/personality.ts` | Kişilik testi soruları ve 8 yazılımcı tipi |
| `src/config.ts` | Topluluk adı, site adresi, sosyal hesaplar, süreler |
| `public/logo.svg`, `public/logo-mark.svg` | Logo (tam ve yazısız). `assets/1633640605349.jpg` referans alınarak düz geometriyle yeniden çizildi; yazı Montserrat Bold harf yolları. Koyu zeminde CSS ile beyaza döner. |
| `public/cursor.svg`, `public/cursor-light.svg`, `public/favicon.svg` | Fare imleci: açık zeminde siyah, koyu bölgelerde beyaz (CSS `--cursor`). Favicon sistem koyu temadaysa beyaza döner. |

Yeni bir "Hatayı bul" sorusu şöyle eklenir:

```ts
{
  kind: 'output',          // 'output' = "Ekrana ne yazdırır?", 'bug' = "Hata hangi satırda?"
  lang: 'Python',
  code: `print(2 ** 3)`,
  options: ['6', '8', '9', 'Hata'],
  answer: 1,               // doğru cevabın sırası, 0'dan başlar → '8'
  explain: '** üs alma işlecidir: 2³ = 8.',
},
```

Dikkat edilecekler:
- **Cevabı mutlaka kodu çalıştırarak doğrula.** Stantta yanlış cevap anahtarı çok kötü görünür.
- **Hız testi satırlarında** `` ^ ~ ` \ | `` karakterlerini kullanma. Türkçe Q klavyede bunlar AltGr gerektirir.
- **Kişilik testinde** her tip, sorular genelinde eşit sayıda seçenek olarak geçmeli. Şu an her tip tam 4 kez geçiyor; denge bozulursa bazı tipler daha sık çıkar.
- İçeriği düzenledikten sonra `npm test` çalıştır. Soru sayısını, cevap numaralarını, kodda olmayan satır seçeneklerini ve kişilik testinin dengesini kontrol eder.
- 34 hazır anket `polls` tablosunda duruyor ve hepsi havuzda. Anket metinleri koddan değil, Table Editor'den düzenlenir.

## Geliştirme

Gereksinim: **Node 24** (testler TypeScript'i Node'un kendisiyle çalıştırır).

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # src/logic.ts kontrolleri
npm run build    # tip kontrolü + üretim çıktısı (dist/)
npm run lint
```

Proje kökünde `.env.local` dosyası olmalı. Değerler Supabase'te **Project Settings → API Keys** altında:

```
VITE_SUPABASE_URL=https://<proje>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

Bu dosya yoksa site yine açılır. "Hatayı bul" ve kişilik testi internetsiz çalışır; skor tablosu ve anket "Bağlantı yok" gösterir.

**Telefonla yerelde denemek için:** `npm run dev -- --host` komutunu çalıştır. Terminalde çıkan ağ adresini, aynı Wi-Fi'daki telefondan aç.

### Nasıl çalışıyor

- **Tek sayfalık React uygulaması (Vite + TypeScript).** Sayfalar arası geçiş `#/...` adresleriyle yapılıyor; `src/main.tsx`.
- **Supabase'de üç tablo var:** `scores`, `polls`, `votes`. Şema, yetkiler ve örnek anketler `supabase/schema.sql` içinde.
- **Skor tablosu `leaderboard` görünümünden okunuyor.** Her takma adın en iyi skoru gösterilir; büyük/küçük harf fark etmez ("Ayşe" ile "ayşe" aynı kişi). Anket sonuçları `poll_results` görünümünden geliyor.
- **Canlı güncelleme Supabase Realtime ile.** Tabloya yeni satır eklenince ilgili sorgu yeniden çekiliyor; `src/live.ts`.
- **Hız testinin puan formülü:** `src/logic.ts` → `calcScore`.

```
src/
  main.tsx          adres → sayfa eşlemesi
  config.ts         ayarlar
  live.ts           canlı skor tablosu ve anket
  logic.ts          puanlama, karıştırma gibi saf fonksiyonlar
  styles.css        tüm görünüm
  pages/            Home, Challenge, Typing, Poll, Quiz, Screen
  data/             soru ve içerik dosyaları
supabase/schema.sql veritabanı kurulumu
tests/              npm test
```

## Yayınlama (Vercel)

Vercel'de iki proje var: `saubt` (oyunlar) ve `saubt-leaderboard` (sonuçlar). Proje klasörü `saubt`'a bağlıdır.

```bash
npx vercel login       # ilk seferde
npm run deploy         # oyun sitesini yayınla
npm run deploy:board   # sonuç sitesini yayınla (geçici olarak saubt-leaderboard'a bağlanıp geri döner)
```

- Supabase adresi ve publishable anahtar `.env.production` dosyasında; build sırasında okunur. Bu anahtar zaten tarayıcıya gittiği için gizli değildir. Asıl koruma veritabanındaki RLS kurallarıdır.
- Yerelde sonuç sitesi: `npm run dev:board` (`.env.board` içindeki `VITE_SITE=board` ile açılır).
- Site adresi değişirse `src/config.ts` → `SITE_URL` alanını güncelle ve QR'ı yeniden üret:
  ```bash
  npx qrcode -t svg -o public/qr.svg https://saubt.vercel.app
  ```

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| Büyük ekranda "Bağlantı yok" | `.env.local` eksik, ya da Vercel'de ortam değişkenleri tanımlı değil. |
| Skorlar ve oylar gelmiyor | İnterneti kontrol et. Yedek hotspot'a geç; ekran kendini 30 saniyede toparlar. |
| Supabase projesi "Paused" | Ücretsiz projeler 7 gün kullanılmazsa durur. Stanttan önceki gün panelden **Restore** et. |
| `localhost:5173` açılmıyor | `http://[::1]:5173` adresini dene ya da `npm run dev -- --host` kullan. |
| Telefonda tekrar oy verilebiliyor | Bilinçli bir tercih: Ana sayfaya dönünce anket sıfırlanır, böylece aynı telefon sırayla birden fazla kişiye uzatılabilir. |
| Anket sayfasında hep aynı soru çıkıyor | Havuzda tek anket kalmıştır. `polls` tablosunda `active` değerlerine bak; yükseltme dosyası çalıştırılmadıysa çalıştır. |
