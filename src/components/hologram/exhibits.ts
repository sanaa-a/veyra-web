import type * as THREE_NS from 'three'
import { V_OUTLINE } from './logo-shape'

type Three = typeof THREE_NS

export type Exhibit = {
  object: THREE_NS.Object3D
  /** Called every frame while the exhibit is on show, with the clock and the seconds since it appeared. */
  animate: (time: number, shownFor: number) => void
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

/** Oman's longitude on the globe, as the turn that brings it to face the viewer (see the note in `earth`). */
const OMAN_FACING = -2.57

/**
 * The Earth in its real colours, from NASA satellite imagery: land and sea with a normal map for relief,
 * glossy oceans, a drifting cloud layer and a thin blue edge of atmosphere. It turns so Oman passes the front.
 */
function earth(THREE: Three): Exhibit {
  const object = new THREE.Group()
  const loader = new THREE.TextureLoader()
  const load = (file: string, color = false) => {
    const texture = loader.load(`/textures/earth/${file}`)
    if (color) texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return texture
  }

  const RADIUS = 0.62
  const globe = new THREE.Group()
  globe.rotation.z = THREE.MathUtils.degToRad(-23.4) // the real axial tilt

  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, 96, 64),
    new THREE.MeshPhongMaterial({
      map: load('day.jpg', true),
      normalMap: load('normal.jpg'),
      normalScale: new THREE.Vector2(0.8, 0.8),
      specularMap: load('specular.jpg'),
      specular: new THREE.Color(0x333333),
      shininess: 18,
    }),
  )
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 1.012, 96, 64),
    new THREE.MeshLambertMaterial({ map: load('clouds.png', true), transparent: true, depthWrite: false, opacity: 0.9 }),
  )
  const spin = new THREE.Group()
  spin.add(surface, clouds)
  globe.add(spin)

  // Atmosphere: a faint blue rim that brightens towards the edge of the disc.
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 1.025, 64, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-viewPosition.xyz);
          gl_Position = projectionMatrix * viewPosition;
        }`,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.5);
          gl_FragColor = vec4(vec3(0.3, 0.55, 1.0) * rim * 0.6, 1.0);
        }`,
    }),
  )
  object.add(globe, atmosphere)

  return {
    object,
    // On a three.js sphere the map's centre line (longitude 0) starts facing away to the left; this turn,
    // worked out from Oman's longitude (57° E), brings Oman to the front halfway through the exhibit.
    animate(_time, shownFor) {
      spin.rotation.y = OMAN_FACING - 0.5 + shownFor * 0.17
      clouds.rotation.y = shownFor * 0.02
    },
  }
}

/**
 * A DNA double helix as chemists draw it: a space-filling model, every atom a sphere in the standard CPK colours
 * (grey carbon, red oxygen, blue nitrogen, orange phosphorus, white hydrogen), built to B-DNA proportions
 * with ten base pairs per turn and the narrow and wide grooves of the real molecule.
 */
function dnaHelix(THREE: Three): Exhibit {
  const object = new THREE.Group()
  const helix = new THREE.Group()

  const ANGSTROM = 0.029 // scene units per ångström: the 20 Å wide molecule becomes about 0.6 units
  const PAIRS = 15
  const TWIST = (Math.PI * 2) / 10 // ten base pairs per turn
  const RISE = 3.4 * ANGSTROM
  const GROOVE = 2.4 // radians between the two strands; less than half a turn makes the minor groove

  const ELEMENTS = {
    C: { color: 0x8c8c8c, radius: 1.7 },
    O: { color: 0xd8322a, radius: 1.52 },
    N: { color: 0x3653d0, radius: 1.55 },
    P: { color: 0xf08a1c, radius: 1.8 },
    H: { color: 0xf0f0f0, radius: 1.1 },
  } as const
  type Element = keyof typeof ELEMENTS
  const atoms: Record<Element, THREE_NS.Vector3[]> = { C: [], O: [], N: [], P: [], H: [] }

  // Places an atom given in cylindrical coordinates: radius and angle (around the helix axis) and height, in ångströms.
  const place = (element: Element, radius: number, angle: number, y: number) =>
    atoms[element].push(new THREE.Vector3(Math.cos(angle) * radius * ANGSTROM, y, Math.sin(angle) * radius * ANGSTROM))

  // A flat ring of atoms lying across the helix, centred at a given distance from the axis.
  const ring = (elements: Element[], centre: number, angle: number, y: number, size: number, turn = 0) => {
    const cx = Math.cos(angle) * centre
    const cz = Math.sin(angle) * centre
    elements.forEach((element, k) => {
      const a = angle + turn + (k / elements.length) * Math.PI * 2
      const x = cx + Math.cos(a) * size
      const z = cz + Math.sin(a) * size
      place(element, Math.hypot(x, z), Math.atan2(z, x), y)
    })
  }

  const nucleotide = (angle: number, y: number, purine: boolean, flip: number) => {
    // Phosphate group on the outside of the backbone.
    place('P', 9, angle, y)
    place('O', 10.3, angle + 0.12, y + 0.02)
    place('O', 10.3, angle - 0.12, y - 0.02)
    place('O', 8.6, angle + 0.17 * flip, y + RISE * 0.35)
    place('O', 8.4, angle - 0.15 * flip, y - RISE * 0.3)
    // Deoxyribose sugar, tucked towards the minor groove.
    ring(['C', 'C', 'O', 'C', 'C'], 7, angle + 0.38 * flip, y + RISE * 0.15 * flip, 1.25, 0.5)
    place('H', 7.6, angle + 0.62 * flip, y + RISE * 0.3)
    place('H', 5.7, angle + 0.3 * flip, y - RISE * 0.2)
    // The base reaching in towards the axis: one ring for a pyrimidine, two fused rings for a purine.
    ring(['N', 'C', 'N', 'C', 'C', 'C'], purine ? 2.4 : 3.2, angle + 0.25 * flip, y, 1.4, 0.3)
    if (purine) ring(['N', 'C', 'N', 'C', 'C'], 4.6, angle + 0.42 * flip, y, 1.2, 0.9)
    place('O', 1.0, angle + 0.6 * flip, y)
    place('H', 1.9, angle - 0.5 * flip, y + 0.01)
  }

  const HEIGHT = (PAIRS - 1) * RISE
  for (let i = 0; i < PAIRS; i++) {
    const y = -HEIGHT / 2 + i * RISE
    const angle = i * TWIST
    const purineFirst = (i * 7) % 3 !== 0 // a fixed, varied sequence of A/G against T/C
    nucleotide(angle, y, purineFirst, 1)
    nucleotide(angle + GROOVE, y, !purineFirst, -1)
  }

  const sphere = new THREE.SphereGeometry(1, 18, 14)
  const matrix = new THREE.Matrix4()
  const scale = new THREE.Vector3()
  const identity = new THREE.Quaternion()
  ;(Object.keys(ELEMENTS) as Element[]).forEach((element) => {
    const { color, radius } = ELEMENTS[element]
    const material = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.8 })
    const mesh = new THREE.InstancedMesh(sphere, material, atoms[element].length)
    scale.setScalar(radius * ANGSTROM * 0.95)
    atoms[element].forEach((position, k) => mesh.setMatrixAt(k, matrix.compose(position, identity, scale)))
    helix.add(mesh)
  })

  helix.rotation.z = 0.3
  object.add(helix)

  return {
    object,
    animate(time) {
      helix.rotation.y = time * 0.6
    },
  }
}

/** The show, in order. */
export function createExhibits(THREE: Three): Exhibit[] {
  return [veyraMark(THREE), earth(THREE), dnaHelix(THREE)]
}
