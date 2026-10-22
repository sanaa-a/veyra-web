import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/common/brand-icons'
import { whatsappUrl } from '@/config/site'

type ContactButtonProps = Omit<ComponentProps<typeof Button>, 'asChild' | 'children'> & {
  /** Pre-filled WhatsApp message. Defaults to the general enquiry. */
  message?: string
  /** Button text. Defaults to "Chat on WhatsApp". Pass null for an icon-only button. */
  label?: ReactNode | null
}

/** Every call to action on the site opens a WhatsApp chat with a pre-filled message, and looks like it: WhatsApp green with its icon. */
export function ContactButton({ message, label, variant = 'whatsapp', 'aria-label': ariaLabel, ...props }: ContactButtonProps) {
  const { t } = useTranslation()
  const text = label === undefined ? t('common.whatsapp') : label
  return (
    <Button asChild variant={variant} {...props}>
      <a href={whatsappUrl(message ?? t('common.waMessage'))} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel ?? (text ? undefined : t('common.contact'))}>
        <WhatsAppIcon />
        {text}
      </a>
    </Button>
  )
}
