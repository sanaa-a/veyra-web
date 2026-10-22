import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

/**
 * Fades elements marked `data-reveal` up into place as they scroll into view. Runs again after each navigation.
 * The hidden starting state only applies once this has run (see `.reveal-ready` in app.css), so without
 * JavaScript, or with reduced motion, everything is simply visible.
 */
export function useReveal() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

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
    document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])
}
