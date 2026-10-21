import type * as THREE_NS from 'three'

type Three = typeof THREE_NS

const BLADES = 4
const LEDS_PER_BLADE = 28
export const FAN_RADIUS = 1

/**
 * The physical fan: a hub and four slim blades, each carrying a strip of LEDs.
 * It is what a visitor sees before the fan starts, and it fades out as the blades reach full speed,
 * the way real blades vanish once they spin fast enough.
 */
export function createFan(THREE: Three) {
  const group = new THREE.Group()
  const rotor = new THREE.Group()
  group.add(rotor)

  const plastic = new THREE.MeshStandardMaterial({ color: 0x17171c, roughness: 0.55, metalness: 0.25, transparent: true })
  const metal = new THREE.MeshStandardMaterial({ color: 0x2a2a31, roughness: 0.3, metalness: 0.9, transparent: true })
  const ledOff = new THREE.Color(0x26262e)
  const ledOn = new THREE.Color(0xffffff)
  const ledMaterial = new THREE.MeshBasicMaterial({ color: ledOff.clone(), transparent: true, toneMapped: false })

  // A blade: narrow at the tip, wider at the root, with rounded ends.
  const bladeShape = new THREE.Shape()
  const root = 0.085
  const tip = 0.055
  const start = 0.1
  bladeShape.moveTo(start, -root / 2)
  bladeShape.lineTo(FAN_RADIUS - tip / 2, -tip / 2)
  bladeShape.absarc(FAN_RADIUS - tip / 2, 0, tip / 2, -Math.PI / 2, Math.PI / 2, false)
  bladeShape.lineTo(start, root / 2)
  bladeShape.lineTo(start, -root / 2)
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.018, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2 })

  const ledGeometry = new THREE.BoxGeometry(0.018, 0.012, 0.008)
  const leds = new THREE.InstancedMesh(ledGeometry, ledMaterial, BLADES * LEDS_PER_BLADE)
  const matrix = new THREE.Matrix4()

  for (let b = 0; b < BLADES; b++) {
    const angle = (b / BLADES) * Math.PI * 2
    const blade = new THREE.Mesh(bladeGeometry, plastic)
    blade.rotation.z = angle
    rotor.add(blade)
    for (let i = 0; i < LEDS_PER_BLADE; i++) {
      const r = 0.16 + (i / (LEDS_PER_BLADE - 1)) * (FAN_RADIUS - 0.2)
      matrix.makeRotationZ(angle).setPosition(Math.cos(angle) * r, Math.sin(angle) * r, 0.026)
      leds.setMatrixAt(b * LEDS_PER_BLADE + i, matrix)
    }
  }
  rotor.add(leds)

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.08, 48), metal)
  hub.rotation.x = Math.PI / 2
  hub.position.z = 0.01
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 24), plastic)
  cap.rotation.x = Math.PI / 2
  cap.position.z = 0.06
  // The motor drum behind the hub and the bolts on its face only show in the close-up.
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.26, 48), metal)
  motor.rotation.x = Math.PI / 2
  motor.position.z = -0.16
  const bolts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 12), metal, 6)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    matrix.makeRotationX(Math.PI / 2).setPosition(Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0.055)
    bolts.setMatrixAt(i, matrix)
  }
  group.add(hub, cap, motor, bolts)

  /** opacity 1 = solid fan, 0 = invisible; leds 0 = off, 1 = full white. */
  function update({ angle, opacity, leds: ledLevel }: { angle: number; opacity: number; leds: number }) {
    rotor.rotation.z = angle
    plastic.opacity = opacity
    metal.opacity = 0.35 + 0.65 * opacity
    ledMaterial.opacity = opacity
    ledMaterial.color.copy(ledOff).lerp(ledOn, ledLevel)
    group.visible = opacity > 0.01
  }

  return { group, update }
}
