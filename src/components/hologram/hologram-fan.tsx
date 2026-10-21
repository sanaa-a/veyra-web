import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { FanPhase } from './fan-scene'

/**
 * A Three.js Veyra fan. It rests, spins up until the blades vanish, and a solid 3D object locks into the air.
 * Three.js loads in the browser only; the server renders an empty black stage in its place.
 * Clicking the fan plays the show again.
 */
export function HologramFan({ className }: { className?: string }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const replayRef = useRef<() => void>(() => {})
  const [phase, setPhase] = useState<FanPhase | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let dispose: (() => void) | undefined
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    Promise.all([import('three'), import('./fan-scene')])
      .then(([THREE, { mountFan }]) => {
        if (cancelled) return
        const fan = mountFan(THREE, canvas, { reducedMotion, onPhase: setPhase })
        replayRef.current = fan.replay
        dispose = fan.dispose
      })
      .catch(() => {
        // No WebGL: the stage stays black and the page still works.
      })

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  return (
    <figure className={cn('relative m-0 aspect-square w-full', className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t('common.fanLabel')}
        onClick={() => replayRef.current()}
        className="size-full cursor-pointer [mask-image:radial-gradient(circle_at_center,#000_43%,transparent_45.5%)]"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 top-[3%] flex justify-center font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        <span className="flex items-center gap-2">
          <span className={cn('size-1.5 rounded-full bg-muted-foreground', phase === 'live' && 'bg-veyra-violet', phase === 'spinning' && 'animate-pulse bg-foreground')} />
          {phase ? t(`home.fanPhase.${phase}`) : t('home.fanPhase.still')}
        </span>
      </figcaption>
    </figure>
  )
}
