/**
 * The Veyra mark (the V, its orbiting ring and the dot) as a 2D shape in the unit disc,
 * which is the area a hologram fan's blades sweep. Coordinates have y pointing up.
 */
const V_OUTLINE: [number, number][] = [
  [-0.66, 0.52], [-0.5, 0.6], [-0.02, -0.28], [0.44, 0.62], [0.66, 0.56], [0.1, -0.6], [-0.12, -0.6],
]

const RING_TILT = 0.35
const cosTilt = Math.cos(RING_TILT)
const sinTilt = Math.sin(RING_TILT)

function insidePolygon(x: number, y: number, polygon: [number, number][]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export type ShapePart = 'v' | 'ring' | 'dot' | null

export function logoPartAt(x: number, y: number): ShapePart {
  if (insidePolygon(x, y, V_OUTLINE)) return 'v'
  const dx = x - 0.62
  const dy = y - 0.12
  if (dx * dx + dy * dy < 0.008) return 'dot'
  const rx = x * cosTilt - y * sinTilt
  const ry = x * sinTilt + y * cosTilt
  const e = (rx * rx) / (0.86 * 0.86) + (ry * ry) / (0.3 * 0.3)
  return e > 0.8 && e < 1 ? 'ring' : null
}
