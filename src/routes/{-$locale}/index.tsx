import { createFileRoute } from '@tanstack/react-router'
import { ArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContactButton } from '@/components/common/contact-button'
import { Container } from '@/components/common/container'
import { HologramFan } from '@/components/hologram/hologram-fan'
import { FeatureRow } from '@/components/sections/feature-row'
import { Section, SectionHeading } from '@/components/sections/section'
import { HOW_IT_WORKS, STEPS } from '@/content/home'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/')({
  head: pageHead('home'),
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()
  return (
    <>
      {/* The hero fills the whole first screen, running up under the header: the fan is the whole story until the visitor scrolls. */}
      <section className="relative isolate -mt-[3.75rem] flex min-h-svh flex-col overflow-hidden bg-[radial-gradient(ellipse_at_center,#1c1230_0%,var(--background)_70%)]">
        <HologramFan className="absolute inset-0 -z-10" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background/90 to-transparent" />
        <Container className="mt-auto grid gap-8 pb-8 sm:pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="grid max-w-xl gap-4">
            <span className="label-mono">{t('home.eyebrow')}</span>
            <h1 className="font-display text-4xl leading-[0.98] sm:text-6xl">
              {t('home.titleStart')} <span className="text-veyra-violet">{t('home.titleAccent')}</span>
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <ContactButton size="lg" />
            <a href="#how" className="label-mono inline-flex items-center gap-2 transition-colors hover:text-foreground">
              {t('home.scroll')}
              <ArrowDown className="size-3.5" aria-hidden />
            </a>
          </div>
        </Container>
      </section>

      <Section id="how" className="scroll-mt-16">
        <SectionHeading eyebrow={t('home.how.eyebrow')} title={t('home.how.title')} lead={t('home.how.lead')} />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {HOW_IT_WORKS.map(({ id, icon }) => (
            <FeatureRow key={id} icon={icon} title={t(`home.how.items.${id}.title`)} body={t(`home.how.items.${id}.body`)} />
          ))}
        </div>
        <p className="mt-14 max-w-[60ch] text-lg text-muted-foreground">{t('home.lead')}</p>
      </Section>


      <Section>
        <SectionHeading eyebrow={t('home.steps.eyebrow')} title={t('home.steps.title')} />
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((id, index) => (
            <li key={id} className="grid min-w-0 content-start gap-3 border-t pt-6">
              <span className="font-mono text-sm text-veyra-violet">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="text-xl font-semibold">{t(`home.steps.items.${id}.title`)}</h3>
              <p className="text-muted-foreground">{t(`home.steps.items.${id}.body`)}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
