import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * A Three.js Veyra fan, on a loop: it rests, spins up until the blades vanish, shows each 3D exhibit,
 * ends on "Book a demo" and winds down to start again.
 * Three.js loads in the browser only; the server renders an empty stage in its place.
 */
export function HologramFan({ className }: { className?: string }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const demoText = t('home.bookDemo')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let dispose: (() => void) | undefined
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    Promise.all([import('three'), import('./fan-scene')])
      .then(([THREE, { mountFan }]) => {
        if (cancelled) return
        dispose = mountFan(THREE, canvas, { reducedMotion, demoText }).dispose
      })
      .catch(() => {
        // No WebGL: the stage stays empty and the page still works.
      })

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [demoText])

  return (
    <figure className={cn('relative m-0', className)}>
      <canvas ref={canvasRef} role="img" aria-label={t('common.fanLabel')} className="size-full" />
    </figure>
  )
}
