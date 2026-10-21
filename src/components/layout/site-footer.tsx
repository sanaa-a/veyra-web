import { Mail } from 'lucide-react'
import { InstagramIcon } from '@/components/common/brand-icons'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/common/container'
import { PageLink } from '@/components/common/locale-link'
import { Logo } from '@/components/common/logo'
import { SITE } from '@/config/site'
import { SITE_PAGES } from '@/config/pages'
import { ContactButton } from '@/components/common/contact-button'

export function SiteFooter() {
  const { t } = useTranslation()
  return (
    <footer className="border-t pt-8 pb-24 text-sm text-muted-foreground">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <PageLink page={SITE_PAGES[0]} aria-label="Veyra">
          <Logo />
        </PageLink>
        <div className="flex flex-wrap items-center gap-5">
          <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
            <InstagramIcon className="size-4" aria-hidden />
            <bdi>@{SITE.instagram}</bdi>
          </a>
          <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-foreground">
            <Mail className="size-4" aria-hidden />
            <bdi>{SITE.email}</bdi>
          </a>
        </div>
        <span>{t('common.copyright', { year: 2026 })}</span>
      </Container>
    </footer>
  )
}

/** The closing call to action, shown above the footer on every page. */
export function CtaBand() {
  const { t } = useTranslation()
  return (
    <section className="border-t">
      <Container className="grid gap-10 py-20 sm:py-28 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-end">
        <h2 className="font-display text-4xl leading-[1.02] sm:text-6xl">{t('cta.title')}</h2>
        <div className="grid gap-5">
          <p className="text-muted-foreground">{t('cta.body')}</p>
          <ContactButton size="lg" className="justify-self-start" />
        </div>
      </Container>
    </section>
  )
}

/** The floating WhatsApp button in the bottom corner of every page. */
export function WhatsAppFab() {
  return (
    <ContactButton
      variant="whatsapp"
      size="icon"
      label={null}
      className="fixed end-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 size-13 rounded-full shadow-lg shadow-black/50 [&_svg:not([class*='size-'])]:size-6"
    />
  )
}
