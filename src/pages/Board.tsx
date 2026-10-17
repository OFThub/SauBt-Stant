import { useEffect, useState } from 'react'
import { COMMUNITY } from '../config'
import { LANGS } from '../data/challenges'
import { ORDER, TYPES } from '../data/personality'
import { TYPING_LANGS } from '../data/snippets'
import { usePollStats, useQuizStats, useScores, useSolves } from '../live'
import { bestPerNick, secs } from '../logic'
import { supabase } from '../supabase'
import { Bars } from './Poll'

// Sonuç sitesi (VITE_SITE=board). Salt okunur: dört etkinliğin tüm sıralama ve sonuçları, canlı.
type Tab = 'hiz' | 'meydan' | 'anket' | 'test'
type Row = { key: string; nick: string; tag?: string; value: string }

const TABS: { id: Tab; label: string }[] = [
  { id: 'hiz', label: 'Hız testi' },
  { id: 'meydan', label: 'Hatayı bul' },
  { id: 'anket', label: 'Anket' },
  { id: 'test', label: 'Kişilik testi' },
]

export default function Board() {
  const [tab, setTab] = useState<Tab>('hiz')
  const [lang, setLang] = useState<string | null>(null)
  const [tlang, setTlang] = useState<string | null>(null)
  const allScores = useScores()
  const scores = bestPerNick(tlang ? allScores.filter((s) => s.lang === tlang) : allScores)
  const solves = useSolves()
  const polls = usePollStats()
  const quiz = useQuizStats()

  useEffect(() => {
    document.title = 'Sonuçlar · ' + COMMUNITY
  }, [])

  const solvers = bestPerNick(solves)
  const solveRows = lang ? bestPerNick(solves.filter((s) => s.lang === lang)) : solvers
  const asked = polls.filter((p) => p.active) // herkese sorulan sorular, soruluş sırasıyla
  const votes = asked.reduce((t, p) => t + p.total, 0)
  const typeCount = (k: string) => quiz.find((q) => q.type === k)?.n ?? 0
  const types = [...ORDER].sort((a, b) => typeCount(b) - typeCount(a))
  const tests = quiz.reduce((t, q) => t + q.n, 0)

  const totals: [Tab, number, string][] = [
    ['hiz', bestPerNick(allScores).length, 'hız testi oyuncusu'],
    ['meydan', solvers.length, 'hatasız çözen'],
    ['anket', votes, 'anket oyu'],
    ['test', tests, 'kişilik testi'],
  ]

  return (
    <>
      <nav className="board-nav">
        <b className="brand">
          <img className="logo" src="/logo-mark.svg" alt="" />
          Sonuçlar
        </b>
        <div className="seg" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? 'on' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="page">
        <p className="eyebrow rise">
          <span className={supabase ? 'live' : 'live off'}>{supabase ? 'Canlı' : 'Bağlantı yok'}</span>
          <span className="muted"> · {COMMUNITY}</span>
        </p>
        <h1 className="display rise" style={{ animationDelay: '60ms' }}>
          Sonuçlar.
        </h1>
        <div className="specs rise" style={{ animationDelay: '120ms' }}>
          {totals.map(([id, n, label]) => (
            <button key={id} className={tab === id ? 'on' : undefined} onClick={() => setTab(id)}>
              <b className="num">{n}</b>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <section className="tab-body rise" key={tab}>
          {tab === 'hiz' && (
            <>
              <h2 className="pick">Hız testi</h2>
              <p className="muted">30 saniyede doğru yazılan karakterlere göre, oyuncu başına en iyi skor.</p>
              <div className="chips">
                {[null, ...TYPING_LANGS].map((l) => (
                  <button key={l ?? 'hepsi'} className={tlang === l ? 'on' : undefined} onClick={() => setTlang(l)}>
                    {l ?? 'Tüm diller'}
                  </button>
                ))}
              </div>
              <Ranking
                rows={scores.map((r) => ({
                  key: r.nick,
                  nick: r.nick,
                  tag: tlang ? undefined : r.lang,
                  value: String(r.score),
                }))}
                empty={tlang ? `${tlang} dilinde henüz skor yok.` : 'Henüz skor yok.'}
              />
            </>
          )}

          {tab === 'meydan' && (
            <>
              <h2 className="pick">Hatayı bul</h2>
              <p className="muted">3/3 yapanlar, bitirme süresine göre. Oyuncu başına en iyi süre.</p>
              <div className="chips">
                {[null, ...LANGS].map((l) => (
                  <button key={l ?? 'hepsi'} className={lang === l ? 'on' : undefined} onClick={() => setLang(l)}>
                    {l ?? 'Tüm diller'}
                  </button>
                ))}
              </div>
              <Ranking
                rows={solveRows.map((r) => ({
                  key: r.nick,
                  nick: r.nick,
                  tag: lang ? undefined : r.lang,
                  value: secs(r.ms),
                }))}
                empty={lang ? `${lang} dilinde henüz hatasız çözen yok.` : 'Henüz hatasız çözen yok.'}
              />
            </>
          )}

          {tab === 'anket' && (
            <>
              <h2 className="pick">Anket</h2>
              <p className="muted">
                Herkese sorulan {asked.length} soru, soruluş sırasıyla.
              </p>
              {asked.length === 0 ? (
                <p className="lede">Havuzda anket yok.</p>
              ) : (
                <div className="cards">
                  {asked.map((p) => (
                    <article key={p.id}>
                      <h3>{p.question}</h3>
                      <p className="meta num">{p.total} oy</p>
                      <Bars options={p.options} counts={p.counts} detail />
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'test' && (
            <>
              <h2 className="pick">Kişilik testi</h2>
              <p className="muted">{tests} kişi testi bitirdi. Hangi yazılımcı tipi kaç kez çıktı?</p>
              <div className="cards one">
                <article>
                  <Bars options={types.map((k) => TYPES[k].name)} counts={types.map(typeCount)} detail />
                </article>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  )
}

// İlk üç kürsüde (birincisi siyah karo), kalanlar listede.
function Ranking({ rows, empty }: { rows: Row[]; empty: string }) {
  if (rows.length === 0) return <p className="lede">{empty}</p>
  const top = rows.slice(0, 3)
  const rest = rows.slice(3)
  return (
    <>
      <div className="podium">
        {top.map((r, i) => (
          <div key={r.key} className={i === 0 ? 'dark' : undefined}>
            <span className="place">{i + 1}.</span>
            <span className="who">{r.nick}</span>
            {r.tag && <span className="tag">{r.tag}</span>}
            <span className="val num">{r.value}</span>
          </div>
        ))}
      </div>
      {rest.length > 0 && (
        <section className="mini">
          <ol>
            {rest.map((r, i) => (
              <li key={r.key}>
                <span className="rank">{i + 4}</span>
                <span>
                  {r.nick}
                  {r.tag && <small>{r.tag}</small>}
                </span>
                <span className="pts">{r.value}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  )
}
