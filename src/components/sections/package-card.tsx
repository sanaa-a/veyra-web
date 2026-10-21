import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { ContactButton } from '@/components/common/contact-button'
import type { PackageId } from '@/content/packages'
import { cn } from '@/lib/utils'

/** A package as a spec column. The featured one is printed in reverse, white on black becoming black on white. */
export function PackageCard({ id, featured = false }: { id: PackageId; featured?: boolean }) {
  const { t } = useTranslation()
  const name = t(`packages.items.${id}.name`)
  const features = t(`packages.items.${id}.features`, { returnObjects: true })

  return (
    <article className={cn('flex min-w-0 flex-col gap-8 border p-7 sm:p-8', featured ? 'border-foreground bg-foreground text-background' : 'bg-card')}>
      <div className="grid gap-3">
        {featured && <Badge className="border-background/30 text-background">{t('common.popular')}</Badge>}
        <h3 className="font-display text-3xl">{name}</h3>
        <span className={cn('label-mono', featured && 'text-background/60')}>{t(`packages.items.${id}.duration`)}</span>
      </div>
      <ul className={cn('grid flex-1 content-start border-t', featured ? 'border-background/15' : 'border-border')}>
        {features.map((feature) => (
          <li key={feature} className={cn('border-b py-3', featured ? 'border-background/15' : 'border-border')}>
            {feature}
          </li>
        ))}
      </ul>
      <ContactButton
        variant={featured ? 'default' : 'outline'}
        label={t('common.getQuote')}
        message={t('common.waPackage', { name })}
        className={cn('w-full', featured && 'bg-background text-foreground hover:bg-veyra-violet')}
      />
    </article>
  )
}
