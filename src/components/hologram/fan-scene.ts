import type * as THREE_NS from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createFan, FAN_RADIUS } from './fan-model'
import { createExhibits } from './exhibits'

type Three = typeof THREE_NS

export type FanPhase = 'still' | 'spinning' | 'live'

/** The show, in seconds from start: the fan rests, tests its LEDs, spins up, and the image locks in. */
const TIMELINE = {
  ledTest: [0.7, 1.05],
  spinStart: 1.4,
  spinUp: 2.4,
  exhibitSeconds: 7,
  switchFlicker: 0.4,
} as const
const MAX_SPEED = 42 // radians per second on screen

/** The camera opens on a close-up of the hub and a blade, then pulls back as the fan spins up. */
const CLOSE_UP = { position: [0.62, -0.4, 0.8], target: [0.32, 0.04, 0] } as const
const FAN_FILL = 0.92 // share of the screen's shorter side the fan covers once the camera settles

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** A stable, jittery on/off pattern, like LEDs hunting for sync. */
const flicker = (t: number, density: number) => Math.sin(t * 97.3) * Math.sin(t * 41.9 + 1.7) > 1 - 2 * density

type MountOptions = { reducedMotion: boolean; onPhase?: (phase: FanPhase) => void }

/** Mounts the hologram fan into a canvas. Returns controls for replaying the show and a cleanup function. */
export function mountFan(THREE: Three, canvas: HTMLCanvasElement, { reducedMotion, onPhase }: MountOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // Transparent, so the page's own violet-black shows behind the fan.
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = environment

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50)
  const closePosition = new THREE.Vector3(...CLOSE_UP.position)
  const closeTarget = new THREE.Vector3(...CLOSE_UP.target)
  const wide = new THREE.Vector3()
  const target = new THREE.Vector3()
  const origin = new THREE.Vector3()

  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-2, 2.5, 3)
  const rim = new THREE.DirectionalLight(0x9e8cff, 1.2)
  rim.position.set(2.5, -1, -1)
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15))

  const fan = createFan(THREE)
  scene.add(fan.group)

  const stage = new THREE.Group()
  const exhibits = createExhibits(THREE)
  exhibits.forEach((exhibit) => {
    exhibit.object.visible = false
    stage.add(exhibit.object)
  })
  scene.add(stage)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Back off far enough that the fan covers FAN_FILL of the shorter side of the screen.
    const visiblePerUnit = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(1, camera.aspect)
    wide.set(0, 0, (2 * FAN_RADIUS) / (visiblePerUnit * FAN_FILL))
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  // The hologram leans gently towards the pointer.
  const pointer = new THREE.Vector2()
  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  let visible = true
  const intersectionObserver = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
  intersectionObserver.observe(canvas)

  const clock = () => performance.now() / 1000
  let startedAt = clock()
  let lastFrame = startedAt
  let angle = 0
  let lastPhase: FanPhase | null = null
  const setPhase = (phase: FanPhase) => {
    if (phase !== lastPhase) onPhase?.((lastPhase = phase))
  }

  const render = () => {
    const now = clock()
    const dt = Math.min(now - lastFrame, 0.05)
    lastFrame = now
    const t = reducedMotion ? 1e3 : now - startedAt

    // Blade speed ramps up with an ease-in, like a motor taking load.
    const spin = smoothstep(TIMELINE.spinStart, TIMELINE.spinStart + TIMELINE.spinUp, t)
    angle -= spin * spin * MAX_SPEED * dt
    const ledTest = t > TIMELINE.ledTest[0] && t < TIMELINE.ledTest[1] ? 1 : 0
    fan.update({ angle, opacity: 1 - smoothstep(0.3, 0.8, spin), leds: Math.max(ledTest, spin * 0.6) })

    // Which exhibit is showing, and whether it is flickering in.
    const liveSince = t - (TIMELINE.spinStart + TIMELINE.spinUp * 0.7)
    let showing = -1
    let on = false
    if (liveSince >= 0) {
      showing = Math.floor(liveSince / TIMELINE.exhibitSeconds) % exhibits.length
      const intoExhibit = liveSince % TIMELINE.exhibitSeconds
      on = intoExhibit > TIMELINE.switchFlicker || flicker(now, intoExhibit / TIMELINE.switchFlicker)
    }
    exhibits.forEach((exhibit, i) => {
      exhibit.object.visible = i === showing && on
      if (i === showing) exhibit.animate(reducedMotion ? 0.6 : now)
    })

    const pullBack = smoothstep(0, TIMELINE.spinStart + TIMELINE.spinUp, t)
    camera.position.lerpVectors(closePosition, wide, pullBack)
    camera.lookAt(target.lerpVectors(closeTarget, origin, pullBack))

    stage.rotation.y += (pointer.x * 0.35 - stage.rotation.y) * 0.05
    stage.rotation.x += (pointer.y * 0.2 - stage.rotation.x) * 0.05

    setPhase(spin === 0 ? 'still' : liveSince < TIMELINE.switchFlicker ? 'spinning' : 'live')
    renderer.render(scene, camera)
  }

  const replay = () => {
    startedAt = clock()
  }

  if (reducedMotion) render()
  else renderer.setAnimationLoop(() => visible && !document.hidden && render())

  return {
    replay,
    dispose() {
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      scene.traverse((object) => {
        const mesh = object as THREE_NS.Mesh
        mesh.geometry?.dispose()
        const material = mesh.material as THREE_NS.Material | THREE_NS.Material[] | undefined
        ;(Array.isArray(material) ? material : material ? [material] : []).forEach((m) => m.dispose())
      })
      environment.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
