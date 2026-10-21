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

  const tags = t('home.tags', { returnObjects: true })

  return (
    <figure className={cn('relative m-0', className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t('common.fanLabel')}
        onClick={() => replayRef.current()}
        className="size-full cursor-pointer"
      />
      {/* What Veyra is used for, set around the hologram once it is live. */}
      <ul
        className={cn(
          'pointer-events-none absolute inset-0 m-0 hidden list-none p-0 transition-opacity duration-1000 md:block',
          phase === 'live' ? 'opacity-100' : 'opacity-0',
        )}
      >
        {tags.map((tag, i) => (
          <li
            key={tag}
            className={cn(
              'label-mono absolute tracking-[0.3em]',
              i < 2 ? 'top-[28%]' : 'top-[62%]',
              i % 2 === 0 ? 'start-[14%]' : 'end-[14%]',
            )}
          >
            {tag}
          </li>
        ))}
      </ul>
      <figcaption className="pointer-events-none absolute inset-x-0 top-[calc(3.75rem+1.25rem)] flex justify-center font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        <span className="flex items-center gap-2">
          <span className={cn('size-1.5 rounded-full bg-muted-foreground', phase === 'live' && 'bg-veyra-violet', phase === 'spinning' && 'animate-pulse bg-foreground')} />
          {phase ? t(`home.fanPhase.${phase}`) : t('home.fanPhase.still')}
        </span>
      </figcaption>
    </figure>
  )
}
