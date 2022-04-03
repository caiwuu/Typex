import { HSLToRGB, RGBToHSL, round } from '../../core/share/utils'
export function rgbToCoordinates(R, G, B) {
  const rgbMap = { R, G, B }
  const [H, S, L] = RGBToHSL(R, G, B)
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
  console.log(round(x, 2), round(y, 2))
}
export const toRGBArray = (rgbStr) => rgbStr.match(/\d+/g).map(Number)
