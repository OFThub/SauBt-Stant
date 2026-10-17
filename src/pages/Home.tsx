import { COMMUNITY, POLL_COUNT } from '../config'
import { LANGS } from '../data/challenges'
import { QUESTIONS } from '../data/personality'

const TILES = [
  {
    href: '#/meydan',
    meta: 'Laptop · 2 dk',
    title: 'Hatayı bul',
    text: `${LANGS.length} dilden birini seç. Üç soru, iki buçuk dakika; hepsini bilene ödül var.`,
    glyph: '!=',
  },
  {
    href: '#/refleks',
    meta: 'Laptop · 30 sn',
    title: 'Hız testi',
    text: 'Yarım dakikada ne kadar kod yazabilirsin? En iyiler büyük ekranda.',
    glyph: '>_',
    dark: true,
  },
  {
    href: '#/anket',
    meta: 'Telefon · 10 sn',
    title: 'Anket',
    text: `${POLL_COUNT} tartışmalı soru. Her oydan sonra herkesin ne dediğini gör.`,
    glyph: 'A/B',
    dark: true,
  },
  {
    href: '#/test',
    meta: 'Telefon · 1 dk',
    title: 'Hangi yazılımcısın?',
    text: `${QUESTIONS.length} soru. Sonunda seni anlatan bir kart.`,
    glyph: '</>',
  },
]

export default function Home() {
  return (
    <main className="page">
      <img className="hero-logo rise" src="/logo.svg" alt="BT Bilgisayar Topluluğu" />
      <p className="eyebrow rise">{COMMUNITY}</p>
      <h1 className="display rise" style={{ animationDelay: '60ms' }}>
        Klavyenin başına geç.
      </h1>
      <p className="lede rise" style={{ animationDelay: '120ms' }}>
        Hatayı bul, hızını ölç, fikrini söyle. Sonunda hangi yazılımcı olduğunu öğren.
      </p>
      <div className="grid">
        {TILES.map((t, i) => (
          <a
            key={t.href}
            href={t.href}
            className={`tile rise${t.dark ? ' dark' : ''}`}
            style={{ animationDelay: `${200 + i * 80}ms` }}
          >
            <span className="meta">{t.meta}</span>
            <h2>{t.title}</h2>
            <p>{t.text}</p>
            <span className="glyph" aria-hidden="true">
              {t.glyph}
            </span>
            <span className="go">Başla ›</span>
          </a>
        ))}
      </div>
    </main>
  )
}
