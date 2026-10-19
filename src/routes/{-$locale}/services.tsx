import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ContactButton } from '@/components/common/contact-button'
import { FeatureCard } from '@/components/sections/feature-card'
import { Section, SectionHeading } from '@/components/sections/section'
import { FEATURED_SERVICE, SERVICES } from '@/content/services'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/services')({
  head: pageHead('services'),
  component: ServicesPage,
})

function ServicesPage() {
  const { t } = useTranslation()
  const featured = FEATURED_SERVICE.id
  return (
    <Section>
      <SectionHeading as="h1" eyebrow={t('services.eyebrow')} title={t('services.title')} lead={t('services.lead')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ id, icon }) => (
          <FeatureCard key={id} tone="solid" icon={icon} title={t(`services.items.${id}.title`)} body={t(`services.items.${id}.body`)} />
        ))}
        <FeatureCard
          tone="solid"
          icon={FEATURED_SERVICE.icon}
          title={t(`services.items.${featured}.title`)}
          body={t(`services.items.${featured}.body`)}
          className="bg-[linear-gradient(120deg,rgb(123_173_255/0.1),rgb(158_84_253/0.14))] sm:col-span-2 lg:col-span-1"
        >
          <ContactButton variant="outline" className="mt-auto self-start" />
        </FeatureCard>
      </div>
    </Section>
  )
}
