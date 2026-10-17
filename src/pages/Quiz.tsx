import { useEffect, useMemo, useRef, useState } from 'react'
import { COMMUNITY, SOCIALS } from '../config'
import { ORDER, QUESTIONS, TYPES, type TypeKey } from '../data/personality'
import { pickType, shuffle } from '../logic'
import { supabase } from '../supabase'

export default function Quiz() {
  const [answers, setAnswers] = useState<TypeKey[]>([])
  const questions = useMemo(() => QUESTIONS.map((q) => ({ ...q, options: shuffle(q.options) })), [])
  const step = answers.length

  const tally: Partial<Record<TypeKey, number>> = {}
  for (const a of answers) tally[a] = (tally[a] ?? 0) + 1
  const result = step >= questions.length ? pickType(tally, ORDER) : null

  // Sonuç sitesindeki dağılım için her bitirilen testi bir kez kaydet.
  // Hata yutulur: kayıt tutulamazsa oyuncunun kartı yine görünmeli.
  const saved = useRef(false)
  useEffect(() => {
    if (!result) {
      saved.current = false
      return
    }
    if (saved.current || !supabase) return
    saved.current = true
    supabase
      .from('quiz_results')
      .insert({ type: result })
      .then(() => {})
  }, [result])

  if (step < questions.length) {
    const q = questions[step]
    return (
      <main className="page narrow">
        <div className="steps" aria-hidden="true">
          <div style={{ transform: `scaleX(${step / questions.length})` }} />
        </div>
        <div key={step}>
          <p className="eyebrow rise">
            Hangi yazılımcısın? · {step + 1}/{questions.length}
          </p>
          <h1 className="title rise" style={{ animationDelay: '60ms' }}>
            {q.q}
          </h1>
          <div className="options">
            {q.options.map((o, i) => (
              <button
                key={o.text}
                className="option rise"
                style={{ animationDelay: `${120 + i * 60}ms` }}
                onClick={() => setAnswers([...answers, o.type])}
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  const type = TYPES[result!]

  async function share() {
    try {
      await navigator.share({
        title: COMMUNITY,
        text: `Yazılımcı tipim: ${type.name}. Seninki ne?`,
        url: `${location.origin}/#/test`,
      })
    } catch {
      // kullanıcı paylaşımdan vazgeçti
    }
  }

  return (
    <main className="page narrow">
      <p className="eyebrow rise">Sonucun</p>
      <article className="card dark rise" style={{ animationDelay: '80ms' }}>
        <div className="glyph" aria-hidden="true">
          {type.mark}
        </div>
        <p className="label">Yazılımcı tipin</p>
        <h1 className="title">{type.name}</h1>
        <p className="desc">{type.desc}</p>
        <div className="tags">
          {type.tools.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <p className="sign">
          <span className="brand">
            <img className="logo" src="/logo-mark.svg" alt="" />
            {COMMUNITY}
          </span>
          <span>{SOCIALS[0]?.handle}</span>
        </p>
      </article>
      <section className="follow rise" style={{ animationDelay: '160ms' }}>
        <h2>Bizi takip et</h2>
        <p className="muted">Etkinlik ve duyurularımızı kaçırma.</p>
        <div className="socials">
          {SOCIALS.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
              {s.name}
              <span>{s.handle}</span>
            </a>
          ))}
        </div>
      </section>
      <div className="row rise" style={{ animationDelay: '220ms' }}>
        {'share' in navigator && (
          <button className="btn" onClick={share}>
            Paylaş
          </button>
        )}
        <button className="btn ghost" onClick={() => setAnswers([])}>
          Testi tekrar çöz
        </button>
      </div>
    </main>
  )
}
