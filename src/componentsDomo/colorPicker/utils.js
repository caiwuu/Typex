export function HSLToRGB(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)].map((ele) => round(ele))
}
export function round(n, decimals = 0) {
  return Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)
}

export function RGBToHSL(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ].map((ele) => round(ele))
}
export function rgbToCoordinates(H, R, G, B) {
  const rgbMap = { R, G, B }
  const [PR, PG, PB] = HSLToRGB(H, 100, 50)
  let low, high, x, y
  ;[PR, PG, PB].forEach((i, index) => {
    if (i === 255) high = ['R', 'G', 'B'][index]
    if (i === 0) low = ['R', 'G', 'B'][index]
  })
  y = rgbMap[high] / 255
  if (rgbMap[low] === 0) {
    x = 0
  } else {
    x = rgbMap[low] / y / 255
  }
  return [round(x, 2), round(y, 2)]
}
export function coordinatesToRgb(H, px, py) {
  const [PR, PG, PB] = HSLToRGB(H, 100, 50)
  const R = ((255 - PR) * px + PR) * py
  const G = ((255 - PG) * px + PG) * py
  const B = ((255 - PB) * px + PB) * py
  return [round(R), round(G), round(B)]
}
export const toRGBArray = (rgbStr) => rgbStr.match(/[\d||\.]+/g).map(Number)
