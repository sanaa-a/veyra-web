import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PackageCard } from '@/components/sections/package-card'
import { Section, SectionHeading } from '@/components/sections/section'
import { PACKAGES } from '@/content/packages'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/packages')({
  head: pageHead('packages'),
  component: PackagesPage,
})

function PackagesPage() {
  const { t } = useTranslation()
  return (
    <Section>
      <SectionHeading as="h1" eyebrow={t('packages.eyebrow')} title={t('packages.title')} lead={t('packages.lead')} />
      <div className="grid gap-5 md:grid-cols-3">
        {PACKAGES.map(({ id, featured }) => (
          <PackageCard key={id} id={id} featured={featured} />
        ))}
      </div>
      <p className="mt-7 text-muted-foreground">{t('packages.note')}</p>
    </Section>
  )
}
