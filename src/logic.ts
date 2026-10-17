// Saf fonksiyonlar. tests/logic.test.ts bunları denetler.

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Hız testi puanı. correct: doğru yazılan karakter, wrong: hatalı tuş vuruşu.
// Veritabanı 0–600 dışındaki skorları reddeder (supabase/schema.sql).
export function calcScore(correct: number, wrong: number): number {
  // TODO(sen): hataya ne kadar ceza verilmeli? Geçici kural: her hata bir doğruyu siler.
  return Math.max(0, correct - wrong)
}

// En çok puanı alan tip kazanır; eşitlikte `order` içinde önce gelen.
export function pickType<K extends string>(tally: Partial<Record<K, number>>, order: readonly K[]): K {
  return order.reduce((best, k) => ((tally[k] ?? 0) > (tally[best] ?? 0) ? k : best), order[0])
}

// Satırlar en iyiden kötüye sıralı gelmeli; her takma adın (büyük/küçük harf fark etmez) ilk satırı kalır.
export function bestPerNick<T extends { nick: string }>(rows: readonly T[]): T[] {
  const seen = new Set<string>()
  return rows.filter((r) => {
    const key = r.nick.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 48230 → "48,2 sn"
export function secs(ms: number): string {
  return `${(ms / 1000).toFixed(1).replace('.', ',')} sn`
}

export function clock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
