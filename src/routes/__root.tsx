/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Direction } from 'radix-ui'
import { dirOf } from '@/i18n/locales'
import { useLocale } from '@/hooks/use-locale'
import archivoLatin from '@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2?url'
import { ORGANIZATION } from '@/lib/seo'
import appCss from '@/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#0b0812' },
    ],
    links: [
      // The Latin text face is needed on every page, so fetch it alongside the stylesheet rather than after it.
      { rel: 'preload', href: archivoLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(ORGANIZATION) }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  const locale = useLocale()
  const dir = dirOf(locale)
  return (
    <html lang={locale} dir={dir} className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <Direction.Provider dir={dir}>{children}</Direction.Provider>
        <Scripts />
      </body>
    </html>
  )
}
