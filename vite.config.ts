import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { SITE_PAGES } from './src/config/pages'
import { LOCALES, localizedPath } from './src/i18n/locales'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Every page is rendered to static HTML at build time, so the site can be hosted on any static host.
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      pages: LOCALES.flatMap((locale) =>
        SITE_PAGES.map((page) => ({ path: localizedPath(locale, page.path) })),
      ),
      sitemap: { enabled: true, host: 'https://veyraom.app' },
    }),
    viteReact(),
  ],
})

