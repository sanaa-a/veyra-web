import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ContactButton } from '@/components/common/contact-button'
import { Container } from '@/components/common/container'
import { HologramFan } from '@/components/hologram/hologram-fan'
import { FeatureRow } from '@/components/sections/feature-row'
import { Section, SectionHeading } from '@/components/sections/section'
import { HOW_IT_WORKS, STEPS } from '@/content/home'
import { pageHead } from '@/lib/seo'
import { cn } from '@/lib/utils'

const FACT_TONES = ['border-veyra-blue/40 text-veyra-blue', 'border-veyra-violet/40 text-veyra-violet', 'border-veyra-purple/40 text-veyra-purple']

export const Route = createFileRoute('/{-$locale}/')({
  head: pageHead('home'),
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()
  return (
    <>
      {/* The first screen is the show alone, running up under the header; the words start below it. */}
      <section className="relative isolate -mt-[3.75rem] h-svh min-h-[30rem] overflow-hidden bg-[radial-gradient(ellipse_at_center,#1c1230_0%,var(--background)_70%)]">
        <HologramFan className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="glow-violet relative">
        <Container className="grid gap-10 py-16 sm:py-24 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end md:gap-14">
          <div className="grid gap-5">
            <span className="label-mono">{t('home.eyebrow')}</span>
            <h1 className="font-display text-5xl leading-[0.98] sm:text-7xl">
              {t('home.titleStart')} <span className="text-gradient">{t('home.titleAccent')}</span>
            </h1>
          </div>
          <div className="grid gap-6">
            <p className="text-lg text-muted-foreground">{t('home.lead')}</p>
            <ul className="flex flex-wrap gap-2">
              {t('home.facts', { returnObjects: true }).map((fact, index) => (
                <li key={fact} className={cn('rounded-full border px-3 py-1 text-sm', FACT_TONES[index % FACT_TONES.length])}>
                  {fact}
                </li>
              ))}
            </ul>
            <ContactButton size="lg" className="justify-self-start" />
          </div>
        </Container>
      </section>

      <Section id="how" glow="blue" className="scroll-mt-16">
        <SectionHeading eyebrow={t('home.how.eyebrow')} title={t('home.how.title')} lead={t('home.how.lead')} />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {HOW_IT_WORKS.map(({ id, icon }, index) => (
            <FeatureRow key={id} index={index} icon={icon} title={t(`home.how.items.${id}.title`)} body={t(`home.how.items.${id}.body`)} />
          ))}
        </div>
      </Section>

      <Section glow="purple">
        <SectionHeading eyebrow={t('home.steps.eyebrow')} title={t('home.steps.title')} />
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((id, index) => (
            <li key={id} className="grid min-w-0 content-start gap-3 border-t pt-6">
              <span className="text-gradient font-display text-5xl">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="text-xl font-semibold">{t(`home.steps.items.${id}.title`)}</h3>
              <p className="text-muted-foreground">{t(`home.steps.items.${id}.body`)}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
