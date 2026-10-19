import { SITE } from '@/config/site'
import { SITE_PAGES, type PageKey } from '@/config/pages'
import { getI18n } from '@/i18n'
import { DEFAULT_LOCALE, LOCALES, isLocale, localizedPath, type Locale } from '@/i18n/locales'

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
        { property: 'og:image', content: `${SITE.url}/logo.png` },
      ],
      links: [
        { rel: 'canonical', href: url(locale) },
        ...LOCALES.map((l) => ({ rel: 'alternate', hrefLang: l, href: url(l) })),
        { rel: 'alternate', hrefLang: 'x-default', href: url(DEFAULT_LOCALE) },
      ],
    }
  }
}
