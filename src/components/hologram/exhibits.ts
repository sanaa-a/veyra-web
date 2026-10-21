import type * as THREE_NS from 'three'
import { V_OUTLINE } from './logo-shape'

type Three = typeof THREE_NS

export type Exhibit = {
  object: THREE_NS.Object3D
  /** Called every frame while the exhibit is on show. */
  animate: (time: number) => void
}

const BLUE = 0x7badff
const VIOLET = 0x836ffd
const PURPLE = 0x9e54fd

/** The Veyra mark as a solid, polished object with its orbit ring and a travelling dot. */
function veyraMark(THREE: Three): Exhibit {
  const object = new THREE.Group()

  const shape = new THREE.Shape(V_OUTLINE.map(([x, y]) => new THREE.Vector2(x, y)))
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.03, bevelSegments: 6, curveSegments: 1 })
  geometry.center()

  // Blue on the left fading to purple on the right, like the printed logo.
  const position = geometry.attributes.position
  const colors = new Float32Array(position.count * 3)
  const color = new THREE.Color()
  const blue = new THREE.Color(BLUE)
  const violet = new THREE.Color(VIOLET)
  const purple = new THREE.Color(PURPLE)
  for (let i = 0; i < position.count; i++) {
    const u = THREE.MathUtils.clamp((position.getX(i) + 0.66) / 1.32, 0, 1)
    if (u < 0.5) color.copy(blue).lerp(violet, u * 2)
    else color.copy(violet).lerp(purple, (u - 0.5) * 2)
    colors.set([color.r, color.g, color.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const v = new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.75,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.55,
      iridescenceIOR: 1.6,
      envMapIntensity: 1.6,
    }),
  )
  v.scale.setScalar(0.78)
  object.add(v)

  const orbit = new THREE.Group()
  orbit.rotation.set(1.18, 0.2, -0.35)
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.008, 12, 160),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(VIOLET).multiplyScalar(2.2), toneMapped: false }),
  )
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 24, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff).multiplyScalar(1.6), toneMapped: false }))
  orbit.add(ring, dot)
  object.add(orbit)

  return {
    object,
    animate(time) {
      v.rotation.y = Math.sin(time * 0.6) * 0.9
      v.rotation.x = Math.sin(time * 0.4) * 0.12
      const a = time * 1.4
      dot.position.set(Math.cos(a) * 0.74, Math.sin(a) * 0.74, 0)
    },
  }
}

/** A glass perfume bottle with violet liquid and a brushed-gold cap: the kind of product a brand puts on a Veyra fan. */
function perfumeBottle(THREE: Three): Exhibit {
  const object = new THREE.Group()

  const profile = [
    [0, -0.5], [0.27, -0.5], [0.31, -0.47], [0.33, -0.4], [0.34, -0.1], [0.32, 0.12],
    [0.26, 0.24], [0.14, 0.31], [0.09, 0.34], [0.09, 0.42], [0, 0.42],
  ].map(([x, y]) => new THREE.Vector2(x, y))

  const glass = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 96),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 0.5,
      ior: 1.5,
      clearcoat: 1,
      envMapIntensity: 1.4,
    }),
  )

  const liquidProfile = profile.slice(0, 6).map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.92 - 0.01))
  liquidProfile.push(new THREE.Vector2(0, liquidProfile[liquidProfile.length - 1].y))
  const liquid = new THREE.Mesh(
    new THREE.LatheGeometry(liquidProfile, 96),
    // Opaque, so the glass around it can refract it.
    new THREE.MeshPhysicalMaterial({ color: PURPLE, emissive: VIOLET, emissiveIntensity: 0.25, roughness: 0.15, clearcoat: 1, envMapIntensity: 1 }),
  )

  const gold = new THREE.MeshPhysicalMaterial({ color: 0xb08d57, metalness: 1, roughness: 0.32, envMapIntensity: 0.9 })
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.05, 64), gold)
  collar.position.y = 0.43
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.26, 64), gold)
  cap.position.y = 0.58

  const bottle = new THREE.Group()
  bottle.add(liquid, glass, collar, cap)
  bottle.position.y = -0.04
  bottle.scale.setScalar(0.98)
  object.add(bottle)

  return {
    object,
    animate(time) {
      bottle.rotation.y = time * 0.7
      bottle.rotation.z = Math.sin(time * 0.5) * 0.06
    },
  }
}

/** An Omani dallah in polished brass: a local object people recognise from across the room. */
function dallah(THREE: Three): Exhibit {
  const object = new THREE.Group()
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xc9a25e, metalness: 1, roughness: 0.22, clearcoat: 0.6, envMapIntensity: 1.3 })

  // Wide foot, round belly, pinched waist, then the tall flared lid and its finial.
  const profile = [
    [0, -0.52], [0.3, -0.52], [0.32, -0.49], [0.3, -0.45], [0.36, -0.36], [0.38, -0.24], [0.33, -0.1],
    [0.2, 0.0], [0.15, 0.06], [0.16, 0.12], [0.22, 0.16], [0.2, 0.2], [0.13, 0.3], [0.1, 0.4],
    [0.12, 0.44], [0.05, 0.47], [0.045, 0.56], [0.07, 0.6], [0.03, 0.66], [0, 0.68],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), brass)

  // The beak-shaped spout rises from the belly; the handle loops round the other side.
  const spout = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CubicBezierCurve3(new THREE.Vector3(0.3, -0.18, 0), new THREE.Vector3(0.48, -0.08, 0), new THREE.Vector3(0.44, 0.2, 0), new THREE.Vector3(0.62, 0.38, 0)),
      48, 0.032, 16,
    ),
    brass,
  )
  const handle = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CubicBezierCurve3(new THREE.Vector3(-0.14, 0.32, 0), new THREE.Vector3(-0.5, 0.36, 0), new THREE.Vector3(-0.52, -0.16, 0), new THREE.Vector3(-0.34, -0.26, 0)),
      48, 0.022, 12,
    ),
    brass,
  )

  const pot = new THREE.Group()
  pot.add(body, spout, handle)
  pot.scale.setScalar(1.05)
  object.add(pot)

  return {
    object,
    animate(time) {
      pot.rotation.y = time * 0.6
      pot.rotation.z = Math.sin(time * 0.5) * 0.05
    },
  }
}

/**
 * The closing line, as solid lettering. It is drawn with the page's own fonts (so Arabic is shaped properly)
 * and given depth by stacking the letters slice by slice, darker towards the back.
 */
function bookDemo(THREE: Three, text: string): Exhibit {
  const object = new THREE.Group()
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  // Two stacked lines fill the round fan better than one long one.
  const words = text.toUpperCase().split(' ')
  const split = Math.ceil(words.length / 2)
  const lines = [words.slice(0, split).join(' '), words.slice(split).join(' ')].filter(Boolean)

  const draw = () => {
    const context = canvas.getContext('2d')
    if (!context) return
    const rtl = document.documentElement.dir === 'rtl'
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.font = rtl ? '700 230px "IBM Plex Sans Arabic", sans-serif' : '800 230px "Archivo", sans-serif'
    if ('fontStretch' in context) context.fontStretch = 'expanded'
    context.direction = rtl ? 'rtl' : 'ltr'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0.15, '#7badff')
    gradient.addColorStop(0.5, '#836ffd')
    gradient.addColorStop(0.85, '#c48bff')
    context.fillStyle = gradient
    const lineHeight = 270
    lines.forEach((line, i) => {
      const y = canvas.height / 2 + (i - (lines.length - 1) / 2) * lineHeight
      context.fillText(line, canvas.width / 2, y, canvas.width * 0.94)
    })
    texture.needsUpdate = true
  }
  draw()
  document.fonts?.ready.then(draw)

  const plane = new THREE.PlaneGeometry(1.75, 1.75)
  const LAYERS = 18
  const DEPTH = 0.14
  for (let i = 0; i < LAYERS; i++) {
    const front = i === LAYERS - 1
    const shade = front ? 1 : 0.18 + 0.32 * (i / LAYERS)
    const layer = new THREE.Mesh(
      plane,
      new THREE.MeshBasicMaterial({ map: texture, alphaTest: 0.5, color: new THREE.Color(shade, shade, shade), toneMapped: !front, side: THREE.DoubleSide }),
    )
    layer.position.z = (i / (LAYERS - 1) - 0.5) * DEPTH
    object.add(layer)
  }

  return {
    object,
    animate(time) {
      object.rotation.y = Math.sin(time * 0.7) * 0.32
      object.rotation.x = Math.sin(time * 0.45) * 0.08
    },
  }
}

/** The show, in order. The last exhibit is the call to action before the loop starts again. */
export function createExhibits(THREE: Three, { demoText }: { demoText: string }): Exhibit[] {
  return [veyraMark(THREE), perfumeBottle(THREE), dallah(THREE), bookDemo(THREE, demoText)]
}
