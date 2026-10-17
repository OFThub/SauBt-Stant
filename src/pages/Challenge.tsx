import { useEffect, useState, type FormEvent } from 'react'
import { CHALLENGE_COUNT, CHALLENGE_SECONDS } from '../config'
import { CHALLENGES, LANGS, type Challenge as Question } from '../data/challenges'
import { useSolveBoard } from '../live'
import { clock, secs, shuffle } from '../logic'
import { supabase } from '../supabase'

type Phase = 'intro' | 'play' | 'win' | 'lose'

export default function Challenge() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [lang, setLang] = useState<string | null>(null) // null = karışık
  const [set, setSet] = useState<Question[]>([])
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [startedAt, setStartedAt] = useState(0)
  const [now, setNow] = useState(0)
  const [doneMs, setDoneMs] = useState(0)
  const best = useSolveBoard(5)

  const elapsed = Math.floor((now - startedAt) / 1000)
  const left = Math.max(0, CHALLENGE_SECONDS - elapsed)

  useEffect(() => {
    if (phase !== 'play') return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'play' && left === 0) setPhase('lose')
  }, [phase, left])

  function start(pick: string | null) {
    const t = Date.now()
    setLang(pick)
    setSet(shuffle(CHALLENGES.filter((c) => pick === null || c.lang === pick)).slice(0, CHALLENGE_COUNT))
    setStep(0)
    setPicked(null)
    setStartedAt(t)
    setNow(t)
    setPhase('play')
  }

  function answer(i: number) {
    setNow(Date.now())
    if (i !== set[step].answer) {
      setPicked(i)
      setPhase('lose')
    } else if (step + 1 < set.length) setStep(step + 1)
    else {
      setDoneMs(Date.now() - startedAt)
      setPhase('win')
    }
  }

  if (phase === 'intro')
    return (
      <main className="page">
        <p className="eyebrow rise">Kod meydan okuması</p>
        <h1 className="display rise" style={{ animationDelay: '60ms' }}>
          Hatayı bul.
        </h1>
        <p className="lede rise" style={{ animationDelay: '120ms' }}>
          Çıktıyı tahmin et, hatalı satırı yakala. Hepsini doğru bilene ödül var.
        </p>
        <div className="specs rise" style={{ animationDelay: '180ms' }}>
          <div>
            <b>{CHALLENGE_COUNT}</b>
            <span>soru</span>
          </div>
          <div>
            <b className="num">{clock(CHALLENGE_SECONDS)}</b>
            <span>süre</span>
          </div>
          <div>
            <b>0</b>
            <span>hata hakkı</span>
          </div>
        </div>
        <h2 className="pick rise" style={{ animationDelay: '240ms' }}>
          Dilini seç.
        </h2>
        <div className="langs">
          {[null, ...LANGS].map((l, i) => (
            <button
              key={l ?? 'karisik'}
              className={`lang rise${l === null ? ' mixed' : ''}`}
              style={{ animationDelay: `${280 + i * 25}ms` }}
              onClick={() => start(l)}
            >
              {l ?? 'Karışık'}
              <small>{l === null ? `${LANGS.length} dil` : `${CHALLENGES.filter((c) => c.lang === l).length} soru`}</small>
            </button>
          ))}
        </div>
        {best.length > 0 && (
          <section className="mini">
            <h2 className="pick">En hızlı çözenler</h2>
            <ol>
              {best.map((r, i) => (
                <li key={`${r.nick}-${r.ms}`}>
                  <span className="rank">{i + 1}</span>
                  <span>
                    {r.nick}
                    <small>{r.lang}</small>
                  </span>
                  <span className="pts">{secs(r.ms)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    )

  if (phase === 'win')
    return <Win ms={doneMs} total={set.length} lang={lang ?? 'Karışık'} onNext={() => setPhase('intro')} />

  const q = set[step]
  const over = phase === 'lose'
  const prompt = q.prompt ?? (q.kind === 'bug' ? 'Hata hangi satırda?' : 'Ekrana ne yazdırır?')
  return (
    <main className="page">
      <div className="hud">
        <div>
          <p className="eyebrow">
            Soru {step + 1}/{set.length} · {q.lang}
          </p>
          <h1 className="title">{over ? (picked === null ? 'Süre doldu.' : 'Bu sefer olmadı.') : prompt}</h1>
        </div>
        <div className={`timer num${left <= 10 ? ' low' : ''}`}>{clock(left)}</div>
      </div>
      <div className="code rise" key={step}>
        <ol>
          {q.code.split('\n').map((line, i) => (
            <li key={i}>{line || ' '}</li>
          ))}
        </ol>
      </div>
      <div className="choices">
        {q.options.map((o, i) => (
          <button
            key={i}
            className={`choice${over && i === q.answer ? ' right' : ''}${over && i === picked ? ' wrong' : ''}`}
            disabled={over}
            onClick={() => answer(i)}
          >
            {o}
          </button>
        ))}
      </div>
      {over && (
        <>
          <p className="explain rise">{q.explain}</p>
          <div className="row rise">
            <button className="btn" onClick={() => start(lang)} autoFocus>
              Tekrar dene
            </button>
            <button className="btn ghost" onClick={() => setPhase('intro')}>
              Sıradaki oyuncu ›
            </button>
          </div>
        </>
      )}
    </main>
  )
}

// 3/3 yapan oyuncu: süresini görür, isterse adını yazıp tabloya girer.
function Win({ ms, total, lang, onNext }: { ms: number; total: number; lang: string; onNext: () => void }) {
  const [nick, setNick] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'saved' | 'error'>('idle')
  const [rank, setRank] = useState(0)

  async function save(e: FormEvent) {
    e.preventDefault()
    const name = nick.trim()
    const db = supabase
    if (!name || !db) return
    setStatus('sending')
    const { error } = await db.from('solves').insert({ nick: name, lang, ms })
    if (error) return setStatus('error')
    const { count } = await db
      .from('solve_board')
      .select('nick', { count: 'exact', head: true })
      .lt('ms', ms)
      .neq('nick', name)
    setRank((count ?? 0) + 1)
    setStatus('saved')
  }

  return (
    <div className="stage">
      <div>
        <p className="eyebrow rise">Kod meydan okuması · {lang}</p>
        <p className="big num rise" style={{ animationDelay: '80ms' }}>
          {total}/{total}
        </p>
        <p className="lede rise" style={{ animationDelay: '160ms' }}>
          Hepsini {secs(ms)} içinde bildin. Görevliye göster, ödülünü al.
        </p>
        {status === 'saved' ? (
          <p className="status rise">{rank <= 10 ? `${rank}. sıradasın. Büyük ekrana bak.` : `${rank}. sıradasın.`}</p>
        ) : (
          supabase && (
            <form className="nick rise" style={{ animationDelay: '240ms' }} onSubmit={save}>
              <input
                className="field"
                autoFocus
                maxLength={20}
                placeholder="Tabloya adını yaz"
                aria-label="Takma ad"
                autoComplete="off"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
              <button className="btn" disabled={!nick.trim() || status === 'sending'}>
                Kaydet
              </button>
            </form>
          )
        )}
        {status === 'error' && <p className="error">Kaydedilemedi, tekrar dene.</p>}
        <div className="row rise" style={{ animationDelay: '320ms' }}>
          <button className="btn ghost" onClick={onNext}>
            Sıradaki oyuncu ›
          </button>
        </div>
      </div>
    </div>
  )
}
