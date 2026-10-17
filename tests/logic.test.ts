import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bestPerNick, calcScore, clock, pickType, secs, shuffle } from '../src/logic.ts'

test('bestPerNick: her isimden ilk (en iyi) satır kalır', () => {
  const rows = [
    { nick: 'Ali', ms: 1 },
    { nick: 'Ece', ms: 2 },
    { nick: 'ali', ms: 3 },
  ]
  assert.deepEqual(bestPerNick(rows), [rows[0], rows[1]])
})

test('calcScore: adil ve veritabanı aralığında', () => {
  assert.equal(calcScore(0, 0), 0)
  assert.ok(calcScore(120, 0) > calcScore(60, 0), 'daha çok doğru, daha çok puan')
  assert.ok(calcScore(120, 10) <= calcScore(120, 0), 'hata puanı artırmaz')
  for (const [c, w] of [[0, 50], [300, 0], [150, 40]]) {
    const s = calcScore(c, w)
    assert.ok(Number.isInteger(s) && s >= 0 && s <= 600, `0–600 dışında: ${s}`)
  }
})

test('pickType: en yüksek kazanır, eşitlikte sıra belirler', () => {
  assert.equal(pickType({ a: 1, b: 3 }, ['a', 'b']), 'b')
  assert.equal(pickType({ a: 2, b: 2 }, ['a', 'b']), 'a')
  assert.equal(pickType({}, ['a', 'b']), 'a')
})

test('shuffle: aynı elemanlar, kaynak bozulmaz', () => {
  const src = [1, 2, 3, 4, 5]
  assert.deepEqual([...shuffle(src)].sort(), src)
  assert.deepEqual(src, [1, 2, 3, 4, 5])
})

test('clock ve secs', () => {
  assert.equal(clock(150), '2:30')
  assert.equal(clock(9), '0:09')
  assert.equal(secs(48230), '48,2 sn')
  assert.equal(secs(5000), '5,0 sn')
})
