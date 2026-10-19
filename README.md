# Veyra website

Marketing site for Veyra (veyraom.app), in English and Arabic.

## Stack

- React 19 + TypeScript
- TanStack Start (TanStack Router, file-based routes) on Vite 7, with every page prerendered to static HTML at build time
- Tailwind CSS v4 + shadcn/ui (Button, Badge, Card, Dialog, Sheet, Dropdown Menu)
- i18next / react-i18next for English and Arabic, with right-to-left layout for Arabic
- Three.js for the hologram fan on the home page

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in dist/client
npm run typecheck
```

## URLs

| Page     | English     | Arabic         |
|----------|-------------|----------------|
| Home     | `/`         | `/ar`          |
| Services | `/services` | `/ar/services` |
| Packages | `/packages` | `/ar/packages` |
| About    | `/about`    | `/ar/about`    |

Each page has its own title, description, canonical URL and hreflang links. A sitemap is written to `dist/client/sitemap.xml`.

## Where things live

| What | File |
|------|------|
| WhatsApp number, email, Instagram | `src/config/site.ts` |
| Page list (nav, footer, prerender) | `src/config/pages.ts` |
| All text, both languages | `src/i18n/locales/en.json`, `src/i18n/locales/ar.json` |
| Services, packages, team order and icons | `src/content/*.ts` |
| Team photos | put files in `public/team/` and set `photo` in `src/content/team.ts` |
| Product video | put the file in `public/videos/` and set `VIDEO_SRC` in `src/components/sections/video-dialog.tsx` |
| Colours and fonts | `src/styles/app.css` |
| Hologram fan | `src/components/hologram/` |

To add a page: add it to `src/config/pages.ts`, create `src/routes/{-$locale}/<name>.tsx` using `pageHead('<name>')`, and add its `nav` and `meta` text to both locale files.

## Deploy

Hosted on Vercel. `vercel.json` tells Vercel to run `npm run build` and serve the static pages in `dist/client`, so importing the repo in Vercel needs no extra settings. Every push to `main` deploys to production; every other branch gets a preview URL.

The domain veyraom.app is registered at name.com and points to Vercel.
