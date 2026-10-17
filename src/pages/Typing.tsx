import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { TYPING_SECONDS } from '../config'
import { RECOMMENDED, SNIPPETS, TYPING_LANGS } from '../data/snippets'
import { calcScore, shuffle } from '../logic'
import { supabase } from '../supabase'

type Run = { correct: number; wrong: number }

export default function Typing() {
  const [nick, setNick] = useState('')
  const [phase, setPhase] = useState<'nick' | 'play' | 'done'>('nick')
  const [run, setRun] = useState<Run>({ correct: 0, wrong: 0 })
  const [lang, setLang] = useState(RECOMMENDED)

  if (phase === 'play')
    return (
      <Game
        lang={lang}
        onEnd={(r) => {
          setRun(r)
          setPhase('done')
        }}
      />
    )
  if (phase === 'done')
    return (
      <Result
        nick={nick.trim()}
        lang={lang}
        run={run}
        onAgain={() => setPhase('play')}
        onNext={() => {
          setNick('')
          setPhase('nick')
        }}
      />
    )
  return (
    <main className="page">
      <p className="eyebrow rise">Hız testi</p>
      <h1 className="display rise" style={{ animationDelay: '60ms' }}>
        {TYPING_SECONDS} saniye.
        <br />
        Ne kadar kod?
      </h1>
      <p className="lede rise" style={{ animationDelay: '120ms' }}>
        Dilini seç, ekrandaki satırı aynen yaz, bitince yenisi gelir. Süre ilk tuşla başlar.
      </p>
      <div className="langs rise" style={{ animationDelay: '150ms' }} role="radiogroup" aria-label="Dil">
        {TYPING_LANGS.map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={lang === l}
            className={`lang${lang === l ? ' on' : ''}`}
            onClick={() => setLang(l)}
          >
            {l}
            <small>{l === RECOMMENDED ? 'Önerilen · 15 satır' : `${SNIPPETS[l].length} satır`}</small>
          </button>
        ))}
      </div>
      <form
        className="nick rise"
        style={{ animationDelay: '180ms' }}
        onSubmit={(e) => {
          e.preventDefault()
          if (nick.trim()) setPhase('play')
        }}
      >
        <input
          className="field"
          autoFocus
          maxLength={20}
          placeholder="Takma adın"
          aria-label="Takma ad"
          autoComplete="off"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
        <button className="btn" disabled={!nick.trim()}>
          Başla
        </button>
      </form>
    </main>
  )
}

function matchLength(typed: string, target: string) {
  let n = 0
  while (n < typed.length && typed[n] === target[n]) n++
  return n
}

function Game({ lang, onEnd }: { lang: string; onEnd: (r: Run) => void }) {
  const [lines] = useState(() => shuffle(SNIPPETS[lang]))
  const [li, setLi] = useState(0)
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(0)

  const target = lines[li % lines.length]
  const correct = done + matchLength(typed, target)
  const left = start === null ? TYPING_SECONDS : Math.max(0, TYPING_SECONDS - (now - start) / 1000)

  useEffect(() => {
    if (start === null) return
    const t = setInterval(() => setNow(performance.now()), 100)
    return () => clearInterval(t)
  }, [start])

  useEffect(() => {
    if (left === 0) onEnd({ correct, wrong })
  }, [left])

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (left === 0) return
    const v = e.target.value
    if (start === null) {
      const t = performance.now()
      setStart(t)
      setNow(t)
    }
    if (v.length > typed.length && v.at(-1) !== target[v.length - 1]) setWrong((w) => w + 1)
    if (v === target) {
      setDone((d) => d + target.length)
      setLi((i) => i + 1)
      setTyped('')
    } else setTyped(v)
  }

  const secs = Math.ceil(left)
  return (
    <main className="page">
      <div className="hud">
        <div>
          <p className="eyebrow">Hız testi · {lang}</p>
          <h1 className="title">{start === null ? 'İlk tuşla süre başlar.' : 'Devam et.'}</h1>
        </div>
        <div className={`timer num${secs <= 5 ? ' low' : ''}`}>{secs}</div>
      </div>
      <div className="progress" aria-hidden="true">
        <div style={{ transform: `scaleX(${1 - left / TYPING_SECONDS})` }} />
      </div>
      <label className="typer">
        <input
          autoFocus
          value={typed}
          onChange={onChange}
          onPaste={(e) => e.preventDefault()}
          maxLength={target.length}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={`Şu satırı yaz: ${target}`}
        />
        <div className="line" aria-hidden="true">
          {[...target].map((ch, i) => (
            <span
              key={i}
              className={
                i < typed.length ? (typed[i] === ch ? 'ok' : 'bad') : i === typed.length ? 'todo caret' : 'todo'
              }
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="next" aria-hidden="true">
          {lines[(li + 1) % lines.length]}
        </div>
      </label>
      <p className="stats num">
        {correct} doğru · {wrong} hata
      </p>
    </main>
  )
}

function Result({
  nick,
  lang,
  run,
  onAgain,
  onNext,
}: {
  nick: string
  lang: string
  run: Run
  onAgain: () => void
  onNext: () => void
}) {
  const score = calcScore(run.correct, run.wrong)
  const [status, setStatus] = useState<'sending' | 'saved' | 'error' | 'offline'>(supabase ? 'sending' : 'offline')
  const [rank, setRank] = useState(0)
  const sent = useRef(false)

  async function save() {
    const db = supabase
    if (!db) return
    setStatus('sending')
    const { error } = await db.from('scores').insert({ nick, score, lang })
    if (error) return setStatus('error')
    const { count } = await db
      .from('leaderboard')
      .select('nick', { count: 'exact', head: true })
      .gt('score', score)
      .neq('nick', nick)
    setRank((count ?? 0) + 1)
    setStatus('saved')
  }

  useEffect(() => {
    if (sent.current) return // StrictMode effect'i iki kez çalıştırır; skor bir kez yazılsın.
    sent.current = true
    save()
  }, [])

  return (
    <div className="stage">
      <div>
        <p className="eyebrow rise">{nick}</p>
        <p className="big num rise" style={{ animationDelay: '80ms' }}>
          {score}
        </p>
        <p className="lede rise" style={{ animationDelay: '160ms' }}>
          puan · {lang} · {run.correct} doğru karakter, {run.wrong} hata
        </p>
        <p className="status rise" style={{ animationDelay: '240ms' }}>
          {status === 'sending' && 'Kaydediliyor…'}
          {status === 'saved' && (rank <= 10 ? `${rank}. sıradasın. Büyük ekrana bak.` : `${rank}. sıradasın.`)}
          {status === 'offline' && 'Bağlantı yok, skor kaydedilmedi.'}
          {status === 'error' && (
            <>
              Skor kaydedilemedi.{' '}
              <button className="btn ghost" onClick={save}>
                Tekrar dene
              </button>
            </>
          )}
        </p>
        <div className="row rise" style={{ animationDelay: '320ms' }}>
          {/* autoFocus yok: süre biterken basılan boşluk tuşu oyunu yeniden başlatmasın. */}
          <button className="btn" onClick={onAgain}>
            Tekrar oyna
          </button>
          <button className="btn ghost" onClick={onNext}>
            Sıradaki oyuncu ›
          </button>
        </div>
      </div>
    </div>
  )
}
