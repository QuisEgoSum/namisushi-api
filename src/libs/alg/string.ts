

export function escapeStringRegexp(string: string): string {
  return string
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
}


const formatterOrder = [2, 0, 1, 1, 1, 2]

export function declinationOfNumericalNaming(number: number, names: [string, string, string]) {
  return names[
    (number % 100 > 4 && number % 100 < 20)
      ? 2
      : formatterOrder[number % 10 < 5 ? Math.abs(number) % 10 : 5]
    ]
}