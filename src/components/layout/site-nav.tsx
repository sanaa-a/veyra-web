import { useTranslation } from 'react-i18next'
import { PageLink } from '@/components/common/locale-link'
import { SITE_PAGES } from '@/config/pages'
import { cn } from '@/lib/utils'

/** The page links, shared by the desktop header, the mobile menu and the footer. */
export function SiteNav({ className, linkClassName, onNavigate }: { className?: string; linkClassName?: string; onNavigate?: () => void }) {
  const { t } = useTranslation()
  return (
    <nav className={className}>
      {SITE_PAGES.map((page) => (
        <PageLink
          key={page.key}
          page={page}
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          className={cn('px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground', linkClassName)}
          activeProps={{ className: 'text-foreground underline decoration-veyra-violet decoration-2 underline-offset-[10px]', 'aria-current': 'page' }}
        >
          {t(`nav.${page.key}`)}
        </PageLink>
      ))}
    </nav>
  )
}
