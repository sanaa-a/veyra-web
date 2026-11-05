import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

/** Belt speed in pixels per second, the same in every language whatever the length of the text. */
const SPEED = 50

/**
 * A conveyor belt of the places Veyra is used, as label and highlighted value pairs.
 * The list is drawn twice so the loop is seamless; screen readers get it once.
 */
export function UsesTicker() {
  const { t } = useTranslation()
  const uses = t('home.uses', { returnObjects: true })
  const trackRef = useBeltSpeed<HTMLDivElement>()

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pe-12" aria-hidden={hidden || undefined}>
      {uses.map(({ label, value }) => (
        <li key={label} className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-sm font-medium tracking-[0.12em] text-foreground uppercase rtl:tracking-normal">{label}:</span>
          <span className="rounded-md bg-veyra-blue px-2.5 py-1 text-sm font-semibold tracking-wide text-background uppercase rtl:tracking-normal">{value}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-label={t('home.usesLabel')} className="overflow-hidden border-y bg-card/40 py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div ref={trackRef} className="flex w-max animate-[ticker_var(--ticker-duration,40s)_linear_infinite] motion-reduce:animate-none rtl:[animation-direction:reverse]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}

/** Sets the loop's duration from the width of one copy of the list, so the belt moves at SPEED. */
function useBeltSpeed<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const track = ref.current
    const row = track?.firstElementChild
    if (!track || !row) return
    const observer = new ResizeObserver(() => {
      track.style.setProperty('--ticker-duration', `${row.getBoundingClientRect().width / SPEED}s`)
    })
    observer.observe(row)
    return () => observer.disconnect()
  }, [])
  return ref
}
