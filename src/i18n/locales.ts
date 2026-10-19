export const LOCALES = ['en', 'ar'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function dirOf(locale: Locale) {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

/** English lives at the root (/about); other languages get a prefix (/ar/about). */
export function toLocaleParam(locale: Locale) {
  return locale === DEFAULT_LOCALE ? undefined : locale
}

/** The URL of a page in a given language, e.g. ('ar', '/about') -> '/ar/about'. */
export function localizedPath(locale: Locale, path: string) {
  if (locale === DEFAULT_LOCALE) return path
  return `/${locale}${path === '/' ? '' : path}`
}
