import { useEffect, useRef } from 'react'

/**
 * Plays the portrait scan (see `.scan` in app.css) the first time the element comes into view.
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
        element.classList.add('is-scanned')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
