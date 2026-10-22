import type { ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from '@/components/common/brand-icons'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/common/container'
import { PageLink } from '@/components/common/locale-link'
import { Logo } from '@/components/common/logo'
import { SITE, whatsappUrl } from '@/config/site'
import { SERVICES } from '@/content/services'
import { cn } from '@/lib/utils'
import { SITE_PAGES } from '@/config/pages'
import { ContactButton } from '@/components/common/contact-button'

const SOCIALS = [
  { name: 'Instagram', href: `https://instagram.com/${SITE.instagram}`, icon: InstagramIcon },
  { name: 'LinkedIn', href: SITE.linkedin, icon: LinkedInIcon },
] as const

const SERVICES_PAGE = SITE_PAGES.find((page) => page.key === 'services')!

/** Brand and contact details, the pages, the services, and a way to book a demo. */
export function SiteFooter() {
  const { t } = useTranslation()
  const linkClass = 'text-muted-foreground transition-colors hover:text-foreground'

  return (
    <footer className="pt-16 pb-16 text-sm">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 border-b pb-14 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div className="col-span-2 grid content-start gap-5 sm:col-span-1">
          <PageLink page={SITE_PAGES[0]} aria-label="Veyra" className="justify-self-start">
            <Logo />
          </PageLink>
          <a href={`mailto:${SITE.email}`} className={cn('inline-flex items-center gap-3', linkClass)}>
            <Mail className="size-4.5 text-veyra-blue" aria-hidden />
            <bdi>{SITE.email}</bdi>
          </a>
          <a href={whatsappUrl(t('common.waMessage'))} target="_blank" rel="noopener noreferrer" className={cn('inline-flex items-center gap-3', linkClass)}>
            <WhatsAppIcon className="size-4.5 text-whatsapp" />
            {t('common.whatsapp')}
          </a>
          <ul className="flex gap-2.5">
            {SOCIALS.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('footer.follow', { network: name })}
                  className="grid size-10 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-veyra-violet hover:bg-veyra-violet/15 hover:text-foreground"
                >
                  <Icon className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title={t('footer.pages')}>
          {SITE_PAGES.map((page) => (
            <li key={page.key}>
              <PageLink page={page} className={linkClass}>
                {t(`nav.${page.key}`)}
              </PageLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={t('footer.services')}>
          {SERVICES.map(({ id }) => (
            <li key={id}>
              <PageLink page={SERVICES_PAGE} className={linkClass}>
                {t(`services.items.${id}.title`)}
              </PageLink>
            </li>
          ))}
        </FooterColumn>

        <div className="col-span-2 grid content-start gap-4 sm:col-span-1">
          <h2 className="font-semibold">{t('footer.demoTitle')}</h2>
          <p className="max-w-[40ch] text-muted-foreground">{t('footer.demoBody')}</p>
          <ContactButton label={t('footer.demoTitle')} className="justify-self-start" />
        </div>
      </Container>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-4">
      <h2 className="font-semibold">{title}</h2>
      <ul className="grid gap-3">{children}</ul>
    </div>
  )
}

/** The closing call to action, shown above the footer on every page. */
export function CtaBand() {
  const { t } = useTranslation()
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div
          data-reveal
          className="relative isolate grid gap-8 overflow-hidden rounded-2xl border border-veyra-violet/30 bg-[linear-gradient(125deg,#1b1c4f,#33388f_45%,#4e2f8f)] p-8 sm:p-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end lg:p-16"
        >
          <div aria-hidden className="absolute -end-24 -top-24 -z-10 size-80 rounded-full bg-veyra-purple/30 blur-3xl" />
          <h2 className="font-display text-3xl leading-[1.05] sm:text-5xl">{t('cta.title')}</h2>
          <div className="grid gap-5">
            <p className="text-white/80">{t('cta.body')}</p>
            <ContactButton size="lg" className="justify-self-start" />
          </div>
        </div>
      </Container>
    </section>
  )
}

/** The floating WhatsApp button: a labelled pill on wider screens, the round icon on phones. */
export function WhatsAppFab() {
  const { t } = useTranslation()
  return (
    <ContactButton
      size="lg"
      label={<span className="hidden sm:inline">{t('common.whatsapp')}</span>}
      aria-label={t('common.whatsapp')}
      className="fixed end-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 size-14 px-0 sm:w-auto sm:px-6 [&_svg:not([class*='size-'])]:size-6"
    />
  )
}
