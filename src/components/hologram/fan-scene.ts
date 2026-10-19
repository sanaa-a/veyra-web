import type * as THREE_NS from 'three'
import { logoPartAt } from './logo-shape'

type Three = typeof THREE_NS

const BLADES = 4
const RINGS = 60
const BLADE_SPEED = 7 // radians per second, slowed down so the eye can follow the sweep
const BRAND = { blue: 0x7badff, violet: 0x836ffd, purple: 0x9e54fd, white: 0xeeedff }

const vertexShader = /* glsl */ `
  uniform float uAngle;
  uniform float uSize;
  uniform float uStatic;
  attribute float aTheta;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vBright;
  const float TAU = 6.28318530718;
  void main() {
    // Each LED is brightest just after a blade passes it, then fades: persistence of vision.
    float sector = TAU / ${BLADES}.0;
    float since = mod(uAngle - aTheta, sector) / sector;
    vBright = mix(0.62 + 0.6 * exp(-since * 6.0), 0.95, uStatic);
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (3.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vBright;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(vColor * vBright, a * vBright);
  }
`

/** Samples the logo on the polar grid of LEDs a real fan would have. */
function buildLeds(THREE: Three) {
  const positions: number[] = []
  const colors: number[] = []
  const thetas: number[] = []
  const blue = new THREE.Color(BRAND.blue)
  const violet = new THREE.Color(BRAND.violet)
  const purple = new THREE.Color(BRAND.purple)
  const white = new THREE.Color(BRAND.white)
  const color = new THREE.Color()

  for (let ring = 3; ring <= RINGS; ring++) {
    const r = ring / RINGS
    const steps = Math.round(300 * r)
    for (let s = 0; s < steps; s++) {
      const theta = (s / steps) * Math.PI * 2
      const x = r * Math.cos(theta)
      const y = r * Math.sin(theta)
      const part = logoPartAt(x, y)
      if (!part) continue
      const u = (x + 1) / 2
      if (part === 'dot') color.copy(white)
      else if (u < 0.5) color.copy(blue).lerp(violet, u * 2)
      else color.copy(violet).lerp(purple, (u - 0.5) * 2)
      positions.push(x, y, part === 'ring' ? 0.04 : 0)
      // The shader writes colors straight to the screen, so keep them in sRGB.
      color.convertLinearToSRGB()
      colors.push(color.r, color.g, color.b)
      thetas.push(theta)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('aTheta', new THREE.Float32BufferAttribute(thetas, 1))
  return geometry
}

function buildBlades(THREE: Three) {
  const points: number[] = []
  for (let b = 0; b < BLADES; b++) {
    const a = (b / BLADES) * Math.PI * 2
    points.push(0, 0, -0.01, Math.cos(a), Math.sin(a), -0.01)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xa9a8cf, transparent: true, opacity: 0.12 }))
}

function buildRim(THREE: Three) {
  const curve = new THREE.EllipseCurve(0, 0, 1.04, 1.04)
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(128))
  return new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: BRAND.violet, transparent: true, opacity: 0.25 }))
}

/** Mounts the hologram fan into a canvas. Returns a cleanup function. */
export function mountFan(THREE: Three, canvas: HTMLCanvasElement, { reducedMotion }: { reducedMotion: boolean }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20)
  camera.position.set(0, 0, 3.6)

  const fan = new THREE.Group()
  scene.add(fan)

  const material = new THREE.ShaderMaterial({
    uniforms: { uAngle: { value: 0 }, uSize: { value: 6 }, uStatic: { value: reducedMotion ? 1 : 0 } },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const leds = new THREE.Points(buildLeds(THREE), material)
  const blades = buildBlades(THREE)
  const rim = buildRim(THREE)
  const hub = new THREE.Mesh(new THREE.CircleGeometry(0.035, 24), new THREE.MeshBasicMaterial({ color: 0xa9a8cf, transparent: true, opacity: 0.4 }))
  fan.add(leds, blades, rim, hub)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    material.uniforms.uSize.value = Math.max(3.5, (w / 520) * 6) * renderer.getPixelRatio()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  let visible = true
  const intersectionObserver = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
  intersectionObserver.observe(canvas)

  const timer = new THREE.Timer()
  const render = () => {
    timer.update()
    const t = timer.getElapsed()
    if (!reducedMotion) {
      material.uniforms.uAngle.value = t * BLADE_SPEED
      blades.rotation.z = t * BLADE_SPEED
      // The whole fan turns gently so the floating image reads as 3D.
      fan.rotation.y = Math.sin(t * 0.5) * 0.55
      fan.rotation.x = Math.sin(t * 0.35) * 0.12
      fan.position.y = Math.sin(t * 0.8) * 0.03
    }
    renderer.render(scene, camera)
  }

  if (reducedMotion) render()
  else renderer.setAnimationLoop(() => visible && render())

  return () => {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    scene.traverse((object) => {
      const mesh = object as THREE_NS.Mesh
      mesh.geometry?.dispose()
      const mat = mesh.material as THREE_NS.Material | undefined
      mat?.dispose()
    })
    timer.dispose()
    renderer.dispose()
  }
}
