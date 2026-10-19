/** The site's pages, in navigation order. Used by the header, the footer and the prerender list. */
export const SITE_PAGES = [
  { path: '/', key: 'home' },
  { path: '/services', key: 'services' },
  { path: '/packages', key: 'packages' },
  { path: '/about', key: 'about' },
] as const

export type SitePage = (typeof SITE_PAGES)[number]
export type PageKey = SitePage['key']
