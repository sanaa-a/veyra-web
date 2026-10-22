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
 * A DNA double helix for the classroom: two glossy backbones twisting round each other,
 * joined by base pairs that alternate between the brand blues and violets.
 */
function dnaHelix(THREE: Three): Exhibit {
  const object = new THREE.Group()
  const helix = new THREE.Group()

  const HEIGHT = 1.5
  const RADIUS = 0.3
  const TURNS = 2
  const PAIRS = 22
  const angleAt = (y: number) => ((y + HEIGHT / 2) / HEIGHT) * TURNS * Math.PI * 2

  // The two backbones are the same curve, half a turn apart.
  const strandCurve = (offset: number) =>
    new THREE.CatmullRomCurve3(
      Array.from({ length: 80 }, (_, i) => {
        const y = -HEIGHT / 2 + (i / 79) * HEIGHT
        const a = angleAt(y) + offset
        return new THREE.Vector3(Math.cos(a) * RADIUS, y, Math.sin(a) * RADIUS)
      }),
    )
  const strandMaterial = (color: number) =>
    new THREE.MeshPhysicalMaterial({ color, metalness: 0.1, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, emissive: color, emissiveIntensity: 0.06, envMapIntensity: 0.7 })
  helix.add(
    new THREE.Mesh(new THREE.TubeGeometry(strandCurve(0), 240, 0.035, 16), strandMaterial(0x5c74e4)),
    new THREE.Mesh(new THREE.TubeGeometry(strandCurve(Math.PI), 240, 0.035, 16), strandMaterial(PURPLE)),
  )

  // Each rung is two half-bars of different colours meeting in the middle, with a bead where it joins each backbone.
  const PAIR_COLOURS = [BLUE, VIOLET, PURPLE, 0x5c74e4]
  const halfBar = new THREE.CylinderGeometry(0.016, 0.016, RADIUS, 12)
  halfBar.translate(0, RADIUS / 2, 0)
  halfBar.rotateZ(-Math.PI / 2)
  const bead = new THREE.SphereGeometry(0.045, 20, 20)
  const pairMaterials = PAIR_COLOURS.map(
    (color) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1, emissive: color, emissiveIntensity: 0.12, envMapIntensity: 0.7 }),
  )
  for (let i = 0; i < PAIRS; i++) {
    const y = -HEIGHT / 2 + ((i + 0.5) / PAIRS) * HEIGHT
    const a = angleAt(y)
    const rung = new THREE.Group()
    rung.position.y = y
    rung.rotation.y = -a
    const left = new THREE.Mesh(halfBar, pairMaterials[i % 4])
    const right = new THREE.Mesh(halfBar, pairMaterials[(i + 2) % 4])
    right.rotation.y = Math.PI
    const beadA = new THREE.Mesh(bead, pairMaterials[i % 4])
    beadA.position.x = RADIUS
    const beadB = new THREE.Mesh(bead, pairMaterials[(i + 2) % 4])
    beadB.position.x = -RADIUS
    rung.add(left, right, beadA, beadB)
    helix.add(rung)
  }

  helix.rotation.z = 0.35
  object.add(helix)

  return {
    object,
    animate(time) {
      helix.rotation.y = time * 0.8
    },
  }
}

/** The show, in order. */
export function createExhibits(THREE: Three): Exhibit[] {
  return [veyraMark(THREE), earth(THREE), dnaHelix(THREE)]
}
