import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CHALLENGE_COUNT } from '../src/config.ts'
import { CHALLENGES } from '../src/data/challenges.ts'
import { ORDER, QUESTIONS, TYPES } from '../src/data/personality.ts'

test('meydan okuma: her dilde yeterli soru, geçerli cevaplar', () => {
  const perLang = new Map<string, number>()
  for (const c of CHALLENGES) {
    const where = `${c.lang}: ${c.code.split('\n')[0]}`
    perLang.set(c.lang, (perLang.get(c.lang) ?? 0) + 1)
    assert.ok(c.answer >= 0 && c.answer < c.options.length, `${where} → answer aralık dışı`)
    assert.equal(new Set(c.options).size, c.options.length, `${where} → aynı seçenek iki kez`)
    const lines = c.code.split('\n').length
    for (const o of c.options) {
      const m = /^(\d+)\. satır$/.exec(o)
      if (m) assert.ok(Number(m[1]) <= lines, `${where} → "${o}" kodda yok`)
    }
  }
  // Tekrar oynayan aynı soruları görmesin diye her dilde en az 12 soru.
  for (const [lang, n] of perLang) assert.ok(n >= Math.max(12, CHALLENGE_COUNT), `${lang}: sadece ${n} soru`)
})

test('kişilik testi: her tip eşit sayıda seçenekte geçer', () => {
  const seen = Object.fromEntries(ORDER.map((k) => [k, 0]))
  for (const q of QUESTIONS) for (const o of q.options) seen[o.type]++
  assert.equal(new Set(Object.values(seen)).size, 1, JSON.stringify(seen))
  assert.deepEqual(Object.keys(TYPES).sort(), [...ORDER].sort())
})
