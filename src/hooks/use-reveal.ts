import { useEffect } from 'react'

/**
 * Fades elements marked `data-reveal` up into place as they scroll into view, including ones a page
 * navigation adds later (the new page renders after the route changes, so we watch the DOM for them).
 * The hidden starting state only applies once this has run (see `.reveal-ready` in app.css), so without
 * JavaScript, or with reduced motion, everything is simply visible.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    root.classList.add('reveal-ready')
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    const observeNew = () =>
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((element) => observer.observe(element))
    observeNew()
    const mutations = new MutationObserver(observeNew)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      mutations.disconnect()
      observer.disconnect()
    }
  }, [])
}
