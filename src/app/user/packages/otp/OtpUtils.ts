import {v4} from 'uuid'


/**
 * @deprecated
 */
export class OtpUtils {
  private static xmur3(str: string) {
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

  private static xoshiro128ss(a: number, b: number, c: number, d: number) {
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

  /**
   * @deprecated
   */
  public static createRandomGenerator() {
    const seed = OtpUtils.xmur3(v4())
    const generator = OtpUtils.xoshiro128ss(seed(), seed(), seed(), seed())
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
}