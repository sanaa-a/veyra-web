import { SITE } from '@/config/site'
import { SITE_PAGES, type PageKey } from '@/config/pages'
import { getI18n } from '@/i18n'
import { DEFAULT_LOCALE, LOCALES, isLocale, localizedPath, type Locale } from '@/i18n/locales'

/** The picture shown when a page is shared in WhatsApp, LinkedIn and the like. */
const OG_IMAGE = { url: `${SITE.url}/og-image.jpg`, width: 1200, height: 630 }

/** Who Veyra is, as structured data for search engines (schema.org), on every page. */
export const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  email: SITE.email,
  sameAs: [SITE.instagram, SITE.linkedin],
  address: { '@type': 'PostalAddress', addressLocality: 'Muscat', addressCountry: 'OM' },
  areaServed: 'OM',
}

/**
 * Builds a route's <head>: translated title and description, canonical URL,
 * hreflang links for every language, and Open Graph tags.
 */
export function pageHead(key: PageKey) {
  const page = SITE_PAGES.find((p) => p.key === key)!
  return ({ params }: { params: { locale?: string } }) => {
    const locale: Locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
    const { t } = getI18n(locale)
    const url = (l: Locale) => SITE.url + localizedPath(l, page.path)
    const title = t(`meta.${key}.title`)
    const description = t(`meta.${key}.description`)

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url(locale) },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: locale === 'ar' ? 'ar_OM' : 'en_US' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:image', content: OG_IMAGE.url },
        { property: 'og:image:width', content: String(OG_IMAGE.width) },
        { property: 'og:image:height', content: String(OG_IMAGE.height) },
        { property: 'og:image:alt', content: title },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      links: [
        { rel: 'canonical', href: url(locale) },
        ...LOCALES.map((l) => ({ rel: 'alternate', hrefLang: l, href: url(l) })),
        { rel: 'alternate', hrefLang: 'x-default', href: url(DEFAULT_LOCALE) },
      ],
    }
  }
}
