import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { LOCALES, toLocaleParam } from '@/i18n/locales'
import { useLocale } from '@/hooks/use-locale'

/**
 * An EN | AR switch: a thumb glides under the current language, and each side stays on the same page (/about <-> /ar/about).
 * It is always laid out left to right so EN sits on the left in both languages.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation()
  const current = useLocale()

  return (
    <nav dir="ltr" aria-label={t('nav.language')} className="relative grid h-9 grid-cols-2 rounded-full border p-0.5 font-mono text-xs tracking-[0.14em]">
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-0.5 start-0.5 w-[calc(50%-2px)] rounded-full bg-foreground transition-transform duration-300 ease-out motion-reduce:transition-none',
          current === 'ar' && 'translate-x-full',
        )}
      />
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          to="."
          params={(prev) => ({ ...prev, locale: toLocaleParam(locale) })}
          lang={locale}
          hrefLang={locale}
          aria-current={locale === current ? 'true' : undefined}
          className={cn(
            'relative grid w-11 place-items-center rounded-full uppercase transition-colors duration-300',
            locale === current ? 'text-background' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {locale}
        </Link>
      ))}
    </nav>
  )
}
