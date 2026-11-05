import { useEffect, useRef } from 'react'

/**
 * Plays the portrait scan (see `.scan` in app.css) every time the element comes well into view, scrolling
 * down or back up, once its photo has loaded, so the line never sweeps over an empty frame.
 * When the element leaves the screen completely, it is reset, ready to scan again.
 * The photo is only hidden once this hook has run, so without JavaScript it simply shows.
 */
export function useScan<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.classList.add('scan-ready')
    const photo = element.querySelector('img')
    let visible = false

    // Wait until most of the frame is on screen, so its fly-in is nearly done and the sweep is seen in full.
    const play = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.6 || visible) return
        visible = true
        const loaded = photo ? photo.decode().catch(() => undefined) : Promise.resolve()
        loaded.then(() => visible && element.classList.add('is-scanned'))
      },
      { threshold: 0.6 },
    )
    // Fully off screen: hide the photo again so the next visit scans it in afresh.
    const reset = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) return
      visible = false
      element.classList.remove('is-scanned')
    })
    play.observe(element)
    reset.observe(element)
    return () => {
      play.disconnect()
      reset.disconnect()
    }
  }, [])

  return ref
}
