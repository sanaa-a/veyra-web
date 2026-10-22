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

/**
 * A DNA double helix in the style of a science-magazine render: two glossy blue backbones with a fine,
 * grainy surface, joined by slim rungs, spinning on its long axis. A fainter helix sits further back for depth.
 */
function dnaHelix(THREE: Three): Exhibit {
  const object = new THREE.Group()

  // A grainy bump texture, so the surface catches light like a real rendered model instead of smooth plastic.
  const grainCanvas = document.createElement('canvas')
  grainCanvas.width = grainCanvas.height = 128
  const grainContext = grainCanvas.getContext('2d')
  if (grainContext) {
    const pixels = grainContext.createImageData(128, 128)
    for (let i = 0; i < pixels.data.length; i += 4) {
      const v = 110 + Math.random() * 145
      pixels.data.set([v, v, v, 255], i)
    }
    grainContext.putImageData(pixels, 0, 0)
  }
  const grain = new THREE.CanvasTexture(grainCanvas)
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping
  grain.repeat.set(40, 2)

  const material = (opacity: number) =>
    new THREE.MeshPhysicalMaterial({
      color: 0x2466c8,
      emissive: 0x06205a,
      emissiveIntensity: 0.5,
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      bumpMap: grain,
      bumpScale: 0.6,
      envMapIntensity: 0.9,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity === 1,
    })

  const buildHelix = (opacity: number, length: number, radius: number) => {
    const helix = new THREE.Group()
    const TURNS = 1.6
    const angleAt = (y: number) => (y / length + 0.5) * TURNS * Math.PI * 2
    const strand = (offset: number) =>
      new THREE.CatmullRomCurve3(
        Array.from({ length: 90 }, (_, i) => {
          const y = -length / 2 + (i / 89) * length
          const a = angleAt(y) + offset
          return new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius)
        }),
      )
    const surface = material(opacity)
    helix.add(
      new THREE.Mesh(new THREE.TubeGeometry(strand(0), 260, radius * 0.17, 20), surface),
      new THREE.Mesh(new THREE.TubeGeometry(strand(Math.PI), 260, radius * 0.17, 20), surface),
    )
    // Rungs run straight across from one backbone to the other.
    const rung = new THREE.CylinderGeometry(radius * 0.045, radius * 0.045, radius * 2, 10)
    rung.rotateZ(Math.PI / 2)
    const RUNGS = 26
    for (let i = 0; i < RUNGS; i++) {
      const y = -length / 2 + ((i + 0.5) / RUNGS) * length
      const bar = new THREE.Mesh(rung, surface)
      bar.position.y = y
      bar.rotation.y = -angleAt(y)
      helix.add(bar)
    }
    return helix
  }

  const main = buildHelix(1, 1.75, 0.24)
  main.rotation.z = 0.62
  const back = [
    { helix: buildHelix(0.22, 2.6, 0.22), position: [-0.6, 0.25, -1.4], tilt: 0.3 },
  ]
  back.forEach(({ helix, position, tilt }) => {
    helix.position.set(position[0], position[1], position[2])
    helix.rotation.z = tilt
    object.add(helix)
  })
  object.add(main)

  return {
    object,
    animate(_time, shownFor) {
      main.rotation.y = shownFor * 0.9
      back.forEach(({ helix }, i) => (helix.rotation.y = shownFor * (0.5 + i * 0.2)))
    },
  }
}

/**
 * A material lit by a single distant sun and nothing else, for objects in space. The planet gets soft diffuse
 * shading with a dark night side; the rings are lit evenly but fall into the planet's shadow behind it.
 */
function sunlit(THREE: Three, map: THREE_NS.Texture, sun: THREE_NS.Vector3, kind: 'planet' | 'rings', planetRadius = 0) {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, sun: { value: sun }, planetRadius: { value: planetRadius } },
    transparent: kind === 'rings',
    depthWrite: kind === 'planet',
    side: kind === 'rings' ? THREE.DoubleSide : THREE.FrontSide,
    toneMapped: false,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vOffset;
      void main() {
        vUv = uv;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vOffset = world.xyz - (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: `
      uniform sampler2D map;
      uniform vec3 sun;
      uniform float planetRadius;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vOffset;
      void main() {
        vec4 colour = texture2D(map, vUv);
        ${
          kind === 'planet'
            ? 'float light = smoothstep(-0.08, 0.6, dot(normalize(vNormal), sun)) * 1.05 + 0.015;'
            : `float along = dot(vOffset, sun);
        float fromAxis = length(vOffset - along * sun);
        float light = (along < 0.0 && fromAxis < planetRadius) ? 0.06 : 0.95;`
        }
        gl_FragColor = vec4(colour.rgb * light, colour.a);
        #include <colorspace_fragment>
      }`,
  })
}

/** Seeded noise, so Saturn's cloud bands come out the same on every visit. */
const bandNoise = (x: number) => Math.sin(x * 12.9898) * 0.5 + Math.sin(x * 4.1414 + 1.3) * 0.3 + Math.sin(x * 31.7 + 0.4) * 0.2

/**
 * Saturn in its true colours: pale butterscotch cloud bands with a grey-blue pole, and rings laid out like
 * the real ones (faint C ring, bright B ring, the dark Cassini Division, the A ring with the Encke Gap),
 * tilted at Saturn's 26.7°.
 */
function saturn(THREE: Three): Exhibit {
  const object = new THREE.Group()
  const RADIUS = 0.36

  // Planet: a texture of latitude bands, drawn once.
  const planetCanvas = document.createElement('canvas')
  planetCanvas.width = 64
  planetCanvas.height = 512
  const planetContext = planetCanvas.getContext('2d')
  if (planetContext) {
    // Colours sampled from Cassini images: soft gold and tan belts, paler zones.
    const tones = [
      [214, 186, 136],
      [196, 160, 108],
      [226, 204, 160],
      [184, 146, 96],
      [208, 178, 126],
      [172, 134, 88],
    ]
    for (let y = 0; y < planetCanvas.height; y++) {
      const latitude = y / planetCanvas.height // 0 = north pole, 1 = south pole
      // Broad, smoothly blended bands: walk through the palette with a slow noise.
      const p = (((bandNoise(latitude * 3.2) + 1) / 2) * (tones.length - 1) + latitude * 2) % (tones.length - 1)
      const i = Math.floor(p)
      const f = p - i
      const fine = 1 + bandNoise(latitude * 40) * 0.035
      const rgb = tones[i].map((c, k) => Math.round((c + (tones[i + 1][k] - c) * f) * fine))
      // The poles shade to a cool grey-blue, strongest in the north.
      const polar = Math.max(0, 1 - Math.min(latitude, 1 - latitude) / (latitude < 0.5 ? 0.14 : 0.09))
      const pole = [126, 140, 150]
      const mixed = rgb.map((c, k) => Math.round(c + (pole[k] - c) * polar * 0.8))
      planetContext.fillStyle = `rgb(${mixed.join(',')})`
      planetContext.fillRect(0, y, planetCanvas.width, 1)
    }
  }
  const planetTexture = new THREE.CanvasTexture(planetCanvas)
  planetTexture.colorSpace = THREE.SRGBColorSpace
  // Lit only by the sun, with no studio fill, so it keeps its true colours and a real night side.
  const sunDirection = new THREE.Vector3(-1, 0.3, 0.4).normalize()
  const planet = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 96, 64), sunlit(THREE, planetTexture, sunDirection, 'planet'))

  // Rings, from 1.24 to 2.27 planet radii. The texture runs from the inner edge (left) to the outer edge (right).
  const INNER = 1.24
  const OUTER = 2.27
  const ringCanvas = document.createElement('canvas')
  ringCanvas.width = 1024
  ringCanvas.height = 1
  const ringContext = ringCanvas.getContext('2d')
  if (ringContext) {
    for (let x = 0; x < ringCanvas.width; x++) {
      const r = INNER + (x / ringCanvas.width) * (OUTER - INNER)
      let density = 0
      let colour = [205, 190, 160]
      if (r < 1.53) {
        density = 0.18 + 0.1 * ((r - INNER) / 0.29) // C ring: faint, greyish
        colour = [128, 116, 100]
      } else if (r < 1.95) {
        density = 0.85 + 0.12 * Math.sin(r * 60) // B ring: the brightest
        colour = [214, 192, 152]
      } else if (r < 2.03) {
        density = 0.06 // Cassini Division
      } else if (r < 2.27) {
        density = Math.abs(r - 2.214) < 0.008 ? 0.05 : 0.6 + 0.08 * Math.sin(r * 90) // A ring, with the Encke Gap
        colour = [184, 166, 136]
      }
      density *= 0.9 + 0.1 * Math.sin(x * 1.7) * Math.sin(x * 0.31)
      ringContext.fillStyle = `rgba(${colour.join(',')}, ${Math.max(0, Math.min(1, density))})`
      ringContext.fillRect(x, 0, 1, 1)
    }
  }
  const ringTexture = new THREE.CanvasTexture(ringCanvas)
  ringTexture.colorSpace = THREE.SRGBColorSpace
  const ringGeometry = new THREE.RingGeometry(RADIUS * INNER, RADIUS * OUTER, 256, 1)
  const position = ringGeometry.attributes.position
  const uv = ringGeometry.attributes.uv
  for (let i = 0; i < position.count; i++) {
    const r = Math.hypot(position.getX(i), position.getY(i)) / RADIUS
    uv.setXY(i, (r - INNER) / (OUTER - INNER), 0.5)
  }
  const rings = new THREE.Mesh(
    ringGeometry,
    sunlit(THREE, ringTexture, sunDirection, 'rings', RADIUS),
  )
  rings.rotation.x = -Math.PI / 2

  const body = new THREE.Group()
  body.add(planet, rings)
  body.rotation.set(0.42, 0, THREE.MathUtils.degToRad(-26.7)) // axial tilt, seen from slightly above the ring plane
  object.add(body)

  return {
    object,
    animate(_time, shownFor) {
      planet.rotation.y = shownFor * 0.25
      body.rotation.y = Math.sin(shownFor * 0.4) * 0.15
    },
  }
}

/** The show, in order. */
export function createExhibits(THREE: Three): Exhibit[] {
  return [veyraMark(THREE), dnaHelix(THREE), saturn(THREE)]
}
