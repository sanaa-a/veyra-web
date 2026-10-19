import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import { I18nextProvider } from 'react-i18next'
import { CtaBand, SiteFooter, WhatsAppFab } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { getI18n } from '@/i18n'
import { DEFAULT_LOCALE, isLocale } from '@/i18n/locales'
import { useLocale } from '@/hooks/use-locale'

/** Shared layout for every page, in every language. English has no prefix; /en/* is not a valid URL. */
export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    if (params.locale !== undefined && (!isLocale(params.locale) || params.locale === DEFAULT_LOCALE)) throw notFound()
  },
  component: LocaleLayout,
})

function LocaleLayout() {
  const locale = useLocale()
  return (
    <I18nextProvider i18n={getI18n(locale)}>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <CtaBand />
      <SiteFooter />
      <WhatsAppFab />
    </I18nextProvider>
  )
}
