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

export function createExhibits(THREE: Three): Exhibit[] {
  return [veyraMark(THREE), perfumeBottle(THREE)]
}
