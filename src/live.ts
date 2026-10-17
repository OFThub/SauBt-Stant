import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

export type Entry = { nick: string; score: number; lang: string; created_at: string }
export type Solve = { nick: string; lang: string; ms: number; created_at: string }
export type Poll = { id: number; question: string; options: string[] }

let channelCount = 0

// load() açılışta, tablolarda her değişiklikte ve 30 sn'de bir çalışır (kopan realtime'a karşı yedek).
// ponytail: her olayda sorgu baştan çekilir; stant ölçeğinde sorun değil, binlerce eşzamanlı kullanıcıda sayaç tablosuna geç.
function useLive(tables: string[], load: () => void, deps: unknown[] = []) {
  useEffect(() => {
    const db = supabase
    if (!db) return
    load()
    const channel = db.channel(`live-${++channelCount}`)
    for (const table of tables) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => load())
    }
    channel.subscribe()
    const timer = setInterval(load, 30_000)
    return () => {
      clearInterval(timer)
      db.removeChannel(channel)
    }
  }, deps)
}

// Hız testi: en yüksek puan önde
export function useLeaderboard(limit = 10) {
  const [rows, setRows] = useState<Entry[]>([])
  useLive(['scores'], async () => {
    const { data, error } = await supabase!
      .from('leaderboard')
      .select('nick, score, lang, created_at')
      .order('score', { ascending: false })
      .order('created_at')
      .limit(limit)
    if (!error) setRows(data)
  })
  return rows
}

// Sonuç sitesi: tüm hız testi skorları (en yüksekten); dil filtresi ve kişi başı tekilleştirme istemcide.
export function useScores(limit = 1000) {
  const [rows, setRows] = useState<Entry[]>([])
  useLive(['scores'], async () => {
    const { data, error } = await supabase!
      .from('scores')
      .select('nick, score, lang, created_at')
      .order('score', { ascending: false })
      .order('created_at')
      .limit(limit)
    if (!error) setRows(data)
  })
  return rows
}

// Hatayı bul: en kısa süre önde
export function useSolveBoard(limit = 10) {
  const [rows, setRows] = useState<Solve[]>([])
  useLive(['solves'], async () => {
    const { data, error } = await supabase!
      .from('solve_board')
      .select('nick, lang, ms, created_at')
      .order('ms')
      .order('created_at')
      .limit(limit)
    if (!error) setRows(data)
  })
  return rows
}

// Havuzdaki (active) tüm anketler; null = henüz yüklenmedi
export function usePolls() {
  const [polls, setPolls] = useState<Poll[] | null>(null)
  useLive(['polls'], async () => {
    const { data, error } = await supabase!.from('polls').select('id, question, options').eq('active', true).order('id')
    if (!error) setPolls(data)
  })
  return polls
}

async function countsFor(poll: Poll): Promise<number[] | null> {
  const { data, error } = await supabase!.from('poll_results').select('option_idx, n').eq('poll_id', poll.id)
  if (error) return null
  const counts = poll.options.map(() => 0)
  for (const r of data) counts[r.option_idx] = r.n
  return counts
}

// Tek anketin canlı oy sayıları. reload: oy verdikten hemen sonra realtime'ı beklemeden tazelemek için.
export function usePollCounts(poll: Poll | null) {
  const [state, setState] = useState<{ id: number; counts: number[] } | null>(null)
  const load = async () => {
    if (!poll) return
    const counts = await countsFor(poll)
    if (counts) setState({ id: poll.id, counts })
  }
  useLive(['votes'], load, [poll?.id])
  const counts = poll && state?.id === poll.id ? state.counts : (poll?.options.map(() => 0) ?? [])
  return { counts, reload: load }
}

// Büyük ekran: en son oy alan anketi gösterir; ekran zıplamasın diye bir anket en az 6 sn kalır.
export function useFeaturedPoll() {
  const [state, setState] = useState<{ poll: Poll | null; counts: number[] }>({ poll: null, counts: [] })
  const shown = useRef<{ id: number | null; at: number }>({ id: null, at: 0 })
  useLive(['polls', 'votes'], async () => {
    const db = supabase!
    const { data: last, error } = await db
      .from('votes')
      .select('poll_id')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) return
    const wanted = last?.poll_id ?? null
    const canSwitch = shown.current.id === null || Date.now() - shown.current.at > 6000
    const id = canSwitch && wanted !== null ? wanted : shown.current.id

    const pool = db.from('polls').select('id, question, options').eq('active', true)
    let { data: poll } = id === null ? await pool.order('id').limit(1).maybeSingle() : await pool.eq('id', id).maybeSingle()
    if (!poll && id !== null) ({ data: poll } = await db.from('polls').select('id, question, options').eq('active', true).order('id').limit(1).maybeSingle())
    if (!poll) return setState({ poll: null, counts: [] })

    const counts = await countsFor(poll)
    if (!counts) return
    if (poll.id !== shown.current.id) shown.current = { id: poll.id, at: Date.now() }
    setState({ poll, counts })
  })
  return state
}

// ── Sonuç sitesi ──────────────────────────────────────────

// Tüm çözümler (en hızlıdan); dil filtresi ve kişi başı tekilleştirme istemcide yapılır.
// ponytail: 1000 satır tavanı; stant için fazlasıyla yeter, aşılırsa sayfalama ekle.
export function useSolves(limit = 1000) {
  const [rows, setRows] = useState<Solve[]>([])
  useLive(['solves'], async () => {
    const { data, error } = await supabase!
      .from('solves')
      .select('nick, lang, ms, created_at')
      .order('ms')
      .order('created_at')
      .limit(limit)
    if (!error) setRows(data)
  })
  return rows
}

export type PollStat = Poll & { active: boolean; counts: number[]; total: number }

// Tüm anketler ve oy dağılımları (havuz dışındakiler dahil)
export function usePollStats() {
  const [rows, setRows] = useState<PollStat[]>([])
  useLive(['polls', 'votes'], async () => {
    const db = supabase!
    const [p, r] = await Promise.all([
      db.from('polls').select('id, question, options, active').order('id'),
      db.from('poll_results').select('poll_id, option_idx, n'),
    ])
    if (p.error || r.error) return
    setRows(
      p.data.map((poll) => {
        const counts: number[] = poll.options.map(() => 0)
        for (const x of r.data) if (x.poll_id === poll.id) counts[x.option_idx] = x.n
        return { ...poll, counts, total: counts.reduce((a, b) => a + b, 0) }
      }),
    )
  })
  return rows
}

// Kişilik testi: tip başına kaç kişi
export function useQuizStats() {
  const [rows, setRows] = useState<{ type: string; n: number }[]>([])
  useLive(['quiz_results'], async () => {
    const { data, error } = await supabase!.from('quiz_stats').select('type, n')
    if (!error) setRows(data)
  })
  return rows
}
