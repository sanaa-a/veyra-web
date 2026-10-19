import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/common/brand-icons'
import { whatsappUrl } from '@/config/site'

type ContactButtonProps = Omit<ComponentProps<typeof Button>, 'asChild' | 'children'> & {
  /** Pre-filled WhatsApp message. Defaults to the general enquiry. */
  message?: string
  /** Button text. Defaults to "Contact us". Pass null for an icon-only button. */
  label?: ReactNode | null
}

/** Every call to action on the site opens a WhatsApp chat with a pre-filled message. */
export function ContactButton({ message, label, ...props }: ContactButtonProps) {
  const { t } = useTranslation()
  const text = label === undefined ? t('common.contact') : label
  return (
    <Button asChild {...props}>
      <a href={whatsappUrl(message ?? t('common.waMessage'))} target="_blank" rel="noopener noreferrer" aria-label={text ? undefined : t('common.contact')}>
        <WhatsAppIcon />
        {text}
      </a>
    </Button>
  )
}
