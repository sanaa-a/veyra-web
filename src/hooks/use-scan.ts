import { useEffect, useRef } from 'react'

/**
 * Plays the portrait scan (see `.scan` in app.css) the first time the element comes into view,
 * once its photo has loaded, so the line never sweeps over an empty frame.
 * The photo is only hidden once this hook has run, so without JavaScript it simply shows.
 */
export function useScan<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.classList.add('scan-ready')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const photo = element.querySelector('img')
        const loaded = photo ? photo.decode().catch(() => undefined) : Promise.resolve()
        loaded.then(() => element.classList.add('is-scanned'))
      },
      { rootMargin: '0px 0px -5% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
