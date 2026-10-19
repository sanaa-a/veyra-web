import { useParams } from '@tanstack/react-router'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'

/** The current page's language, read from the optional /ar prefix in the URL. */
export function useLocale(): Locale {
  const { locale } = useParams({ strict: false })
  return isLocale(locale) ? locale : DEFAULT_LOCALE
}
