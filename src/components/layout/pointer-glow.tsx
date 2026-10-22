import { useEffect, useRef } from 'react'

/**
 * A soft purple light that follows the pointer across the page.
 * Mouse and trackpad only; touch screens and reduced motion get nothing.
 */
export function PointerGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        glow.style.opacity = '1'
      })
    }
    const onLeave = () => {
      glow.style.opacity = '0'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute -top-[18rem] -left-[18rem] size-[36rem] rounded-full opacity-0 mix-blend-screen transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgb(158 84 253 / 0.32) 0%, rgb(131 111 253 / 0.14) 35%, transparent 70%)' }}
      />
    </div>
  )
}
