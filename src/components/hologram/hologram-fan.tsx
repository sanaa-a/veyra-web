import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * A Three.js simulation of a Veyra hologram fan drawing the logo.
 * Three.js loads only in the browser, after the page is interactive; the server renders the static logo in its place.
 */
export function HologramFan({ className }: { className?: string }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cleanup: (() => void) | undefined
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    Promise.all([import('three'), import('./fan-scene')])
      .then(([THREE, { mountFan }]) => {
        if (cancelled) return
        cleanup = mountFan(THREE, canvas, { reducedMotion })
        setReady(true)
      })
      .catch(() => {
        // No WebGL: the static logo stays in place.
      })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-[520px]', className)}>
      <div className="glow-orb absolute -inset-[6%] rounded-full opacity-80" aria-hidden />
      <div className="absolute inset-0 rounded-full border shadow-[inset_0_0_60px_rgb(92_116_228/0.18)]" aria-hidden />
      <img
        src="/logo.png"
        alt=""
        className={cn('absolute inset-[30%] m-auto w-2/5 transition-opacity duration-700', ready && 'opacity-0')}
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t('common.fanLabel')}
        className={cn('relative size-full transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0')}
      />
      <span className="absolute bottom-[4%] left-1/2 -translate-x-1/2 rounded-full border bg-card px-3 py-1.5 text-xs whitespace-nowrap text-muted-foreground">
        {t('home.fanTag')}
      </span>
    </div>
  )
}
