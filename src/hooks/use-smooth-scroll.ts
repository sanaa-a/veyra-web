import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import type Lenis from 'lenis'
import { hasFinePointer, prefersReducedMotion } from '@/lib/utils'

let lenis: Lenis | undefined

/**
 * Eases mouse-wheel and trackpad scrolling so the scroll-linked motion glides instead of stepping.
 * Touch screens already scroll smoothly and keep their native feel; reduced motion keeps plain scrolling.
 * Lenis loads after the page is up, so it never delays the first paint.
 */
export function useSmoothScroll() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    let cancelled = false
    import('lenis').then(({ default: Lenis }) => {
      if (!cancelled) lenis = new Lenis({ autoRaf: true, anchors: true })
    })
    return () => {
      cancelled = true
      lenis?.destroy()
      lenis = undefined
    }
  }, [])

  // A new page starts at the top, without gliding there from where the last one was left.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [pathname])
}
