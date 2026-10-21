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
            {t('footer.whatsapp')}
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
    <section className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#26206b,#5c74e4_38%,#836ffd_68%,#9e54fd)] text-white">
      {/* The fan's LED strips, as faint diagonal lines over the gradient. */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-20 [background-image:repeating-linear-gradient(115deg,transparent_0_38px,rgb(255_255_255/0.35)_38px_39px)]" />
      <Container className="grid gap-10 py-20 sm:py-28 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-end">
        <h2 className="font-display text-4xl leading-[1.02] sm:text-6xl">{t('cta.title')}</h2>
        <div className="grid gap-5">
          <p className="text-white/80">{t('cta.body')}</p>
          <ContactButton size="lg" variant="light" className="justify-self-start" />
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
