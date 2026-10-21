import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { ContactButton } from '@/components/common/contact-button'
import type { PackageId } from '@/content/packages'
import { cn } from '@/lib/utils'

/** A package as a spec column. The featured one is lit in the brand gradient. */
export function PackageCard({ id, featured = false }: { id: PackageId; featured?: boolean }) {
  const { t } = useTranslation()
  const name = t(`packages.items.${id}.name`)
  const features = t(`packages.items.${id}.features`, { returnObjects: true })

  return (
    <article className={cn('flex min-w-0 flex-col gap-8 border p-7 sm:p-8', featured ? 'border-transparent bg-[linear-gradient(150deg,#5c74e4,#836ffd_55%,#9e54fd)] text-white shadow-[0_30px_80px_-30px_var(--veyra-violet)]' : 'bg-card')}>
      <div className="grid gap-3">
        {featured && <Badge className="border-white/40 text-white">{t('common.popular')}</Badge>}
        <h3 className="font-display text-3xl">{name}</h3>
        <span className={cn('label-mono', featured && 'text-white/75')}>{t(`packages.items.${id}.duration`)}</span>
      </div>
      <ul className={cn('grid flex-1 content-start border-t', featured ? 'border-white/20' : 'border-border')}>
        {features.map((feature) => (
          <li key={feature} className={cn('border-b py-3', featured ? 'border-white/20' : 'border-border')}>
            {feature}
          </li>
        ))}
      </ul>
      <ContactButton
        variant={featured ? 'light' : 'outline'}
        label={t('common.getQuote')}
        message={t('common.waPackage', { name })}
        className="w-full"
      />
    </article>
  )
}
