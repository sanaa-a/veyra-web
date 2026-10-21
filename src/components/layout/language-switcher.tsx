import { Link } from '@tanstack/react-router'
import { Check, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LOCALES, toLocaleParam, type Locale } from '@/i18n/locales'
import { useLocale } from '@/hooks/use-locale'

const LANGUAGE_NAMES: Record<Locale, string> = { en: 'English', ar: 'العربية' }

/** Switches language while staying on the same page (/about <-> /ar/about). */
export function LanguageSwitcher() {
  const { t } = useTranslation()
  const current = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t('nav.language')}>
          <Languages aria-hidden />
          <span lang={current === 'en' ? 'ar' : 'en'}>{LANGUAGE_NAMES[current === 'en' ? 'ar' : 'en']}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link to="." params={(prev) => ({ ...prev, locale: toLocaleParam(locale) })} lang={locale} hrefLang={locale}>
              <Check className={locale === current ? 'opacity-100' : 'opacity-0'} aria-hidden />
              {LANGUAGE_NAMES[locale]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
