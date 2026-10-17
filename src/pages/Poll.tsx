import { useEffect, useState } from 'react'
import { POLL_COUNT } from '../config'
import { usePollCounts, usePolls, type Poll as PollT } from '../live'
import { supabase } from '../supabase'

export function Bars({
  options,
  counts,
  mine,
  detail,
}: {
  options: string[]
  counts: number[]
  mine?: number | null
  detail?: boolean // yüzdenin yanında ham sayıyı da göster (sonuç sitesi)
}) {
  const total = counts.reduce((a, b) => a + b, 0)
  const top = Math.max(...counts)
  return (
    <ul className="bars">
      {options.map((o, i) => {
        const share = total ? (counts[i] ?? 0) / total : 0
        return (
          <li key={i} className={total && counts[i] === top ? 'lead' : undefined}>
            <div className="bar-head">
              <span>
                {o}
                {i === mine && <small>Senin oyun</small>}
              </span>
              <span className="num">
                %{Math.round(share * 100)}
                {detail && <small>{counts[i] ?? 0}</small>}
              </span>
            </div>
            <div className="track">
              <div className="fill" style={{ transform: `scaleX(${share})` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <main className="page narrow">
      <p className="eyebrow">Anket</p>
      <h1 className="title">{title}</h1>
      <p className="lede">{text}</p>
    </main>
  )
}

// Herkese aynı sorular, aynı sırayla: havuzdaki (active) anketlerin ilk POLL_COUNT tanesi, id sırasıyla.
// Seçimler sadece bu sayfanın hafızasında;
// ana sayfaya dönünce sıfırlanır ve anket yeniden çözülebilir.
export default function Poll() {
  const polls = usePolls()
  const [round, setRound] = useState<PollT[] | null>(null)
  const [step, setStep] = useState(0)
  const [mine, setMine] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  const current = round?.[step] ?? null
  const { counts, reload } = usePollCounts(current)

  function newRound(pool: PollT[]) {
    setRound(pool.slice(0, POLL_COUNT))
    setStep(0)
    setMine(null)
  }

  useEffect(() => {
    if (polls && !round) newRound(polls)
  }, [polls])

  if (!supabase) return <Notice title="Anket şu an kapalı." text="Bağlantı kurulamadı." />
  if (!round) return <main className="page narrow" />
  if (round.length === 0) return <Notice title="Şu an açık anket yok." text="Biraz sonra tekrar dene." />

  if (!current)
    return (
      <main className="page narrow">
        <p className="eyebrow rise">Anket</p>
        <h1 className="display rise" style={{ animationDelay: '60ms' }}>
          Teşekkürler.
        </h1>
        <p className="lede rise" style={{ animationDelay: '120ms' }}>
          Oyların büyük ekranda. Arkadaşına uzat ya da yeni sorularla tekrar çöz.
        </p>
        <div className="row rise" style={{ animationDelay: '180ms' }}>
          <button className="btn" onClick={() => newRound(polls ?? round)}>
            Yeni sorular
          </button>
          <a className="btn ghost" href="#/">
            Ana sayfa ›
          </a>
        </div>
      </main>
    )

  async function vote(option: number) {
    setSending(true)
    setFailed(false)
    const { error } = await supabase!.from('votes').insert({ poll_id: current!.id, option_idx: option })
    setSending(false)
    if (error) return setFailed(true)
    setMine(option)
    reload()
  }

  const total = counts.reduce((a, b) => a + b, 0)
  const last = step + 1 === round.length
  return (
    <main className="page narrow">
      <div className="steps" aria-hidden="true">
        <div style={{ transform: `scaleX(${(step + (mine === null ? 0 : 1)) / round.length})` }} />
      </div>
      <div key={step}>
        <p className="eyebrow rise">
          Anket · {step + 1}/{round.length}
        </p>
        <h1 className="title rise" style={{ animationDelay: '60ms' }}>
          {current.question}
        </h1>
        {mine === null ? (
          <div className="options">
            {current.options.map((o, i) => (
              <button
                key={i}
                className="option rise"
                style={{ animationDelay: `${120 + i * 60}ms` }}
                disabled={sending}
                onClick={() => vote(i)}
              >
                {o}
              </button>
            ))}
          </div>
        ) : (
          <>
            <Bars options={current.options} counts={counts} mine={mine} />
            <p className="stats num">{total} oy · sonuçlar canlı</p>
            <div className="row">
              <button
                className="btn"
                autoFocus
                onClick={() => {
                  setStep(step + 1)
                  setMine(null)
                }}
              >
                {last ? 'Bitir' : 'Sonraki soru ›'}
              </button>
            </div>
          </>
        )}
      </div>
      {failed && <p className="error">Oy gönderilemedi. Bağlantını kontrol edip tekrar dene.</p>}
    </main>
  )
}
