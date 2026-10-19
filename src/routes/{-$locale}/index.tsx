import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ContactButton } from '@/components/common/contact-button'
import { Container } from '@/components/common/container'
import { HologramFan } from '@/components/hologram/hologram-fan'
import { FeatureCard } from '@/components/sections/feature-card'
import { Eyebrow, Section, SectionHeading } from '@/components/sections/section'
import { VideoDialog } from '@/components/sections/video-dialog'
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
      <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20">
        <div className="glow-orb pointer-events-none absolute inset-x-[-20%] -bottom-1/3 h-3/4" aria-hidden />
        <Container className="relative grid items-center gap-8 md:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="grid min-w-0 gap-6">
            <Eyebrow>{t('home.eyebrow')}</Eyebrow>
            <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('home.titleStart')} <span className="text-veyra-gradient">{t('home.titleAccent')}</span>
            </h1>
            <p className="max-w-[56ch] text-lg text-muted-foreground">{t('home.lead')}</p>
            <div className="flex flex-wrap gap-3">
              <ContactButton size="lg" />
              <Button variant="outline" size="lg" asChild>
                <a href="#how">{t('home.seeHow')}</a>
              </Button>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
              {t('home.facts', { returnObjects: true }).map((fact) => (
                <li key={fact} className="flex items-center gap-2 before:size-1.5 before:rounded-full before:bg-veyra-gradient">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <HologramFan className="max-md:order-first max-md:max-w-[400px]" />
        </Container>
      </section>

      <Section id="how" className="scroll-mt-20 border-t">
        <SectionHeading eyebrow={t('home.how.eyebrow')} title={t('home.how.title')} lead={t('home.how.lead')} />
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ id, icon }) => (
            <FeatureCard key={id} icon={icon} title={t(`home.how.items.${id}.title`)} body={t(`home.how.items.${id}.body`)} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={t('home.video.eyebrow')} title={t('home.video.title')} />
        <VideoDialog />
      </Section>

      <Section>
        <SectionHeading eyebrow={t('home.steps.eyebrow')} title={t('home.steps.title')} />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((id, index) => (
            <li key={id} className="grid min-w-0 content-start gap-2 border-t pt-5">
              <span className="font-display text-sm font-bold text-veyra-violet">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-lg font-medium">{t(`home.steps.items.${id}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`home.steps.items.${id}.body`)}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
