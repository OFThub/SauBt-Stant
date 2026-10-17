import { useEffect, useState } from 'react'
import { COMMUNITY, SITE_URL, SOCIALS } from '../config'
import { useFeaturedPoll, useLeaderboard, useSolveBoard } from '../live'
import { secs } from '../logic'
import { supabase } from '../supabase'
import { Bars } from './Poll'

const BOARD_SECONDS = 15 // sol panel iki tablo arasında bu aralıkla döner

// Projeksiyon / büyük ekran. Tam ekran için F11.
export default function Screen() {
  const typing = useLeaderboard(10)
  const solves = useSolveBoard(10)
  const { poll, counts } = useFeaturedPoll()
  const total = counts.reduce((a, b) => a + b, 0)
  const [board, setBoard] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setBoard((b) => 1 - b), BOARD_SECONDS * 1000)
    return () => clearInterval(t)
  }, [])

  const rows =
    board === 0
      ? typing.map((r) => ({ key: `${r.nick}-${r.score}`, nick: r.nick, tag: r.lang, value: String(r.score) }))
      : solves.map((r) => ({ key: `${r.nick}-${r.ms}`, nick: r.nick, tag: r.lang, value: secs(r.ms) }))

  return (
    <div className="screen">
      <header>
        <span className="brand">
          <img className="logo" src="/logo-mark.svg" alt="" />
          {COMMUNITY}
        </span>
        <span className={supabase ? 'live' : 'live off'}>{supabase ? 'Canlı' : 'Bağlantı yok'}</span>
      </header>
      <main>
        <section className="board rise" key={board}>
          <p className="eyebrow">
            <span className="dots" aria-hidden="true">
              <i className={board === 0 ? 'on' : ''} />
              <i className={board === 1 ? 'on' : ''} />
            </span>
            {board === 0 ? 'Hız testi' : 'Hatayı bul'}
          </p>
          <h2>{board === 0 ? 'En hızlı on kişi' : 'En hızlı çözenler'}</h2>
          {rows.length > 0 ? (
            <ol>
              {/* Değer değişince key değişir, satır yeniden girer ve kısa süre vurgulanır. */}
              {rows.map((r, i) => (
                <li key={r.key}>
                  <span className="rank">{i + 1}</span>
                  <span className="who">
                    {r.nick}
                    {r.tag && <small>{r.tag}</small>}
                  </span>
                  <span className="pts">{r.value}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty">İlk sıra boş. Sen dene.</p>
          )}
        </section>
        <section className="poll">
          <p className="eyebrow">Canlı anket</p>
          {poll ? (
            <div key={poll.id} className="rise">
              <h2>{poll.question}</h2>
              <Bars options={poll.options} counts={counts} />
              <p className="total num">{total} oy</p>
            </div>
          ) : (
            <h2 className="empty">Yeni anket birazdan.</h2>
          )}
        </section>
      </main>
      <footer>
        <img className="qr" src="/qr.svg" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div>
          <p className="join">Telefonunla katıl</p>
          <p className="url">{SITE_URL}</p>
        </div>
        <p className="handles">
          {SOCIALS.map((s) => (
            <span key={s.name}>{s.handle}</span>
          ))}
        </p>
        <img className="logo foot-logo" src="/logo.svg" alt="BT Bilgisayar Topluluğu" />
      </footer>
    </div>
  )
}
