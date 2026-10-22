import { useEffect, useRef } from 'react'

/**
 * A soft purple light that follows the pointer across the page.
 * Mouse and trackpad only; touch screens and reduced motion get nothing. It hides over anything marked data-no-glow (the hero show).
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
      const hidden = event.target instanceof Element && event.target.closest('[data-no-glow]') !== null
      frame = requestAnimationFrame(() => {
        glow.style.opacity = hidden ? '0' : '1'
        if (hidden) return
        glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
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
        className="absolute -top-[9rem] -left-[9rem] size-[18rem] rounded-full opacity-0 mix-blend-screen transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgb(158 84 253 / 0.32) 0%, rgb(131 111 253 / 0.14) 35%, transparent 70%)' }}
      />
    </div>
  )
}
