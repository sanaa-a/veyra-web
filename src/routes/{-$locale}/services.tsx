import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ContactButton } from '@/components/common/contact-button'
import { FeatureRow } from '@/components/sections/feature-row'
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
    <Section glow="blue">
      <SectionHeading as="h1" title={t('services.title')} lead={t('services.lead')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ id, icon }, index) => (
          <FeatureRow key={id} index={index} icon={icon} title={t(`services.items.${id}.title`)} body={t(`services.items.${id}.body`)} />
        ))}
      </div>
      <FeatureRow
        icon={FEATURED_SERVICE.icon}
        title={t(`services.items.${featured}.title`)}
        body={t(`services.items.${featured}.body`)}
        index={1}
        className="mt-5 border-veyra-violet/40 bg-[linear-gradient(120deg,rgb(92_116_228/0.16),rgb(158_84_253/0.12))] md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-x-8 [&>p]:md:max-w-[60ch]"
      >
        <ContactButton className="justify-self-start" />
      </FeatureRow>
    </Section>
  )
}
