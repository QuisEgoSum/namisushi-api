import {v4} from 'uuid'


function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = h << 13 | h >>> 19
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

function xoshiro128ss(a: number, b: number, c: number, d: number) {
  return function() {
    const t = b << 9
    let r = a * 5
    r = (r << 7 | r >>> 25) * 9
    c ^= a
    d ^= b
    b ^= c
    a ^= d
    c ^= t
    d = d << 11 | d >>> 21
    return (r >>> 0) / 4294967296
  }
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function() {
    a >>>= 0
    b >>>= 0
    c >>>= 0
    d >>>= 0
    let t = (a + b) | 0
    a = b ^ b >>> 9
    b = c + (c << 3) | 0
    c = (c << 21 | c >>> 11)
    d = d + 1 | 0
    t = t + d | 0
    c = c + t | 0
    return (t >>> 0) / 4294967296
  }
}

function random() {
  return () => {
    let str = Math.abs(Math.round(Math.random() * 1000000 - 0.5)).toString()
    if (str.length < 6) {
      str = '0'.repeat(6 - str.length) + str
    }
    return str
  }
}

function initGenerator(generator: () => number) {
  for (let i = 0; i < 20; i++) {
    generator()
  }
  return () => {
    let str = (generator() * 1000000).toFixed(0)
    if (str.length < 6) {
      str = '0'.repeat(6 - str.length) + str
    }
    return str
  }
}

function createGenerator1() {
  const seed = xmur3(v4())
  const generator = xoshiro128ss(seed(), seed(), seed(), seed())
  return initGenerator(generator)
}

function createGenerator2() {
  const seed = xmur3(v4())
  const generator = sfc32(seed(), seed(), seed(), seed())
  return initGenerator(generator)
}

function createGenerator3() {
  return random()
}

it('Otp', function() {
  const name: Record<number, string> = {
    [0]: 'xoshiro128ss',
    [1]: 'sfc32',
    [2]: 'Math.random'
  }
  const attempts = 10000
  const r = 10000
  const cgs = [createGenerator1, createGenerator2, createGenerator3]
  const result = [0, 0, 0]
  for (let q = 0; q < cgs.length; q++) {
    const cg = cgs[q]
    for (let i = 0; i < r; i++) {
      const g = cg()
      const set = new Set()
      let n = 0
      for (let a = 0; a < attempts; a++) {
        const code = g()
        if (set.has(code)) {
          n++
        }
        set.add(code)
      }
      result[q] += n / attempts * 100
    }
  }
  console.table(result.map((s, i) => ({
    ['name']: name[i],
    ['%']: (s / r).toFixed(5)
  })))
})