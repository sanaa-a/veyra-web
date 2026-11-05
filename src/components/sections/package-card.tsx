import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { ContactButton } from '@/components/common/contact-button'
import { Card } from '@/components/ui/card'
import type { PackageId } from '@/content/packages'
import { cn, revealOrder } from '@/lib/utils'

/** A package as a spec column. The featured one is lit in the brand gradient. */
export function PackageCard({ id, featured = false, index = 0 }: { id: PackageId; featured?: boolean; index?: number }) {
  const { t } = useTranslation()
  const name = t(`packages.items.${id}.name`)
  const features = t(`packages.items.${id}.features`, { returnObjects: true })

  return (
    <Card as="article" surface={featured ? 'lit' : 'solid'} lift data-reveal style={revealOrder(index)} className="flex flex-col gap-8 rounded-2xl p-7 sm:p-8">
      <div className="grid gap-3">
        {featured && <Badge className="border-white/40 text-white">{t('common.popular')}</Badge>}
        <h2 className="font-display text-3xl">{name}</h2>
        <span className={cn('text-sm text-muted-foreground', featured && 'text-white/80')}>{t(`packages.items.${id}.duration`)}</span>
      </div>
      <ul className={cn('grid flex-1 content-start border-t', featured && 'border-white/20 [&>li]:border-white/20')}>
        {features.map((feature) => (
          <li key={feature} className="border-b py-3">
            {feature}
          </li>
        ))}
      </ul>
      <ContactButton
        label={t('common.getQuote')}
        message={t('common.waPackage', { name })}
        className="w-full"
      />
    </Card>
  )
}
