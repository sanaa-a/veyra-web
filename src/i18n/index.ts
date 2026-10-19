import i18next, { type i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'
import type { Locale } from './locales'

export const resources = { en: { translation: en }, ar: { translation: ar } } as const

const instances = new Map<Locale, i18n>()

/**
 * One i18next instance per language, created once and reused.
 * A fixed instance per locale keeps server rendering free of races between requests in different languages.
 */
export function getI18n(locale: Locale): i18n {
  let instance = instances.get(locale)
  if (!instance) {
    instance = i18next.createInstance()
    instance.use(initReactI18next).init({
      lng: locale,
      fallbackLng: 'en',
      resources,
      initAsync: false,
      interpolation: { escapeValue: false },
    })
    instances.set(locale, instance)
  }
  return instance
}
