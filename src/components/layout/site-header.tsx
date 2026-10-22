import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Container } from '@/components/common/container'
import { ContactButton } from '@/components/common/contact-button'
import { PageLink } from '@/components/common/locale-link'
import { Logo } from '@/components/common/logo'
import { SITE_PAGES } from '@/config/pages'
import { dirOf } from '@/i18n/locales'
import { useLocale } from '@/hooks/use-locale'
import { LanguageSwitcher } from './language-switcher'
import { SiteNav } from './site-nav'

export function SiteHeader() {
  const { t } = useTranslation()
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-40 border-b bg-background/85 backdrop-blur-md">
      <Container className="flex items-center gap-3 py-3 md:gap-5">
        <PageLink page={SITE_PAGES[0]} aria-label="Veyra">
          <Logo />
        </PageLink>
        <SiteNav className="ms-auto hidden gap-1 md:flex" />
        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <LanguageSwitcher />
          <ContactButton size="sm" label={t('common.whatsappShort')} className="hidden sm:inline-flex" />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-9 md:hidden" aria-label={t('nav.menu')}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side={dirOf(locale) === 'rtl' ? 'left' : 'right'}>
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <SiteNav className="mt-4 grid gap-1" linkClassName="border-b px-0 py-4 font-display text-2xl text-foreground" onNavigate={() => setMenuOpen(false)} />
              <ContactButton size="lg" className="mt-auto" />
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
