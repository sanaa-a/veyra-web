import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import { ContactButton } from '@/components/common/contact-button'
import type { PackageId } from '@/content/packages'
import { cn } from '@/lib/utils'

export function PackageCard({ id, featured = false }: { id: PackageId; featured?: boolean }) {
  const { t } = useTranslation()
  const name = t(`packages.items.${id}.name`)
  const features = t(`packages.items.${id}.features`, { returnObjects: true })

  return (
    <Card
      className={cn(
        'gap-5 p-8',
        featured &&
          'border-[1.5px] border-transparent [background:linear-gradient(var(--card),var(--card))_padding-box,linear-gradient(120deg,var(--veyra-blue),var(--veyra-violet),var(--veyra-purple))_border-box] shadow-[0_20px_60px_-30px_rgb(131_111_253/0.8)]',
      )}
    >
      {featured && <Badge>{t('common.popular')}</Badge>}
      <div className="grid gap-1.5">
        <CardTitle>{name}</CardTitle>
        <span className="text-sm text-muted-foreground">{t(`packages.items.${id}.duration`)}</span>
      </div>
      <ul className="grid flex-1 content-start gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="mt-1 size-4 shrink-0 text-veyra-blue" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <ContactButton
        variant={featured ? 'default' : 'outline'}
        label={t('common.getQuote')}
        message={t('common.waPackage', { name })}
        className="w-full"
      />
    </Card>
  )
}
