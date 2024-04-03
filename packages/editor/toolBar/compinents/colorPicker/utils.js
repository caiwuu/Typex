export function HSLToRGB (h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)].map((ele) => round(ele))
}
export function round (n, decimals = 0) {
  // return Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)
  return n
}

export function RGBToHSL (r, g, b) {
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
export function rgbToCoordinates (H, R, G, B) {
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
export function coordinatesToRgb (H, px, py) {
  px = px < 0 ? 0 : px > 1 ? 1 : px
  py = py < 0 ? 0 : py > 1 ? 1 : py
  const [PR, PG, PB] = HSLToRGB(H, 100, 50)
  const R = ((255 - PR) * px + PR) * py
  const G = ((255 - PG) * px + PG) * py
  const B = ((255 - PB) * px + PB) * py
  return [round(R), round(G), round(B)]
}

export function hexToRgba (hexColor) {
  hexColor = hexColor.replace(/^#/, '');
  const bigint = parseInt(hexColor, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b, 1];  // 默认 alpha 值为 255
}

export function rgbaToHex (rgbaColor) {
  const [r, g, b] = rgbaColor;
  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return `#${hex}`;
}

export const toRGBArray = (rgbStr) => rgbStr.match(/[\d||\.]+/g).map(Number)
