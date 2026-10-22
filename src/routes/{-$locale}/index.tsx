import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContactButton } from '@/components/common/contact-button'
import { Container } from '@/components/common/container'
import { HologramFan } from '@/components/hologram/hologram-fan'
import { FeatureRow } from '@/components/sections/feature-row'
import { UsesTicker } from '@/components/sections/uses-ticker'
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
      {/* The first screen is the show alone, running up under the header; the words start below it. */}
      <section data-no-glow className="relative isolate -mt-[3.75rem] h-svh min-h-[30rem] overflow-hidden bg-[radial-gradient(ellipse_at_center,#1c1230_0%,var(--background)_70%)]">
        <HologramFan className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <UsesTicker />

      <section className="glow-violet relative">
        <Container className="grid justify-items-center gap-8 py-20 text-center sm:py-28">
          <h1 data-reveal className="font-display text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            {t('home.titleStart')} <span className="text-veyra-blue">{t('home.titleAccent')}</span>
          </h1>
          <p data-reveal className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t('home.lead')}
          </p>
          <ul data-reveal className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {t('home.facts', { returnObjects: true }).map((fact) => (
              <li key={fact} className="flex items-center gap-2.5">
                <Check className="size-4.5 shrink-0 text-veyra-blue" aria-hidden />
                {fact}
              </li>
            ))}
          </ul>
          <ContactButton data-reveal size="lg" />
        </Container>
      </section>

      <Section id="how" glow="blue" className="scroll-mt-16">
        <SectionHeading title={t('home.how.title')} lead={t('home.how.lead')} />
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ id, icon }, index) => (
            <FeatureRow key={id} index={index} icon={icon} title={t(`home.how.items.${id}.title`)} body={t(`home.how.items.${id}.body`)} />
          ))}
        </div>
      </Section>

      <Section glow="purple">
        <SectionHeading title={t('home.steps.title')} />
        {/* A timeline: numbered stops joined by a line that runs across on wide screens. */}
        <ol className="relative grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:before:absolute lg:before:inset-x-0 lg:before:top-5 lg:before:h-px lg:before:bg-[linear-gradient(90deg,var(--veyra-blue),var(--veyra-purple))] lg:before:opacity-50">
          {STEPS.map((id, index) => (
            <li key={id} data-reveal style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties} className="relative grid min-w-0 content-start gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-veyra-blue/60 bg-background font-mono text-sm text-veyra-blue">{index + 1}</span>
              <h3 className="text-2xl font-semibold">{t(`home.steps.items.${id}.title`)}</h3>
              <p className="text-muted-foreground">{t(`home.steps.items.${id}.body`)}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
