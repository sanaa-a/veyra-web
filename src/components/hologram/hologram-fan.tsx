import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { whatsappUrl } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * A Three.js Veyra fan, on a loop: it rests, spins up until the blades vanish, shows each 3D exhibit,
 * ends on "Book a demo" and winds down to start again.
 * Three.js loads in the browser only; the server renders an empty stage in its place.
 */
export function HologramFan({ className }: { className?: string }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [callToAction, setCallToAction] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let dispose: (() => void) | undefined
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    Promise.all([import('three'), import('./fan-scene')])
      .then(([THREE, { mountFan }]) => {
        if (cancelled) return
        dispose = mountFan(THREE, canvas, { reducedMotion, onCallToAction: setCallToAction }).dispose
      })
      .catch(() => {
        // No WebGL: the stage stays empty and the page still works.
      })

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  return (
    <figure className={cn('relative m-0', className)}>
      <canvas ref={canvasRef} role="img" aria-label={t('common.fanLabel')} className="size-full" />
      {/* The show's last beat: plain white words over the spinning fan, linking to WhatsApp. */}
      <a
        href={whatsappUrl(t('common.waMessage'))}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={callToAction ? 0 : -1}
        aria-hidden={!callToAction}
        className={cn(
          'font-display absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(1.75rem,7vw,6.5rem)] whitespace-nowrap text-white uppercase transition-opacity duration-700',
          callToAction ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {t('home.bookDemo')}
      </a>
    </figure>
  )
}
