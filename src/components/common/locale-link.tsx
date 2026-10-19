import { Link, type LinkComponentProps, type RegisteredRouter } from '@tanstack/react-router'
import type { SitePage } from '@/config/pages'
import { toLocaleParam } from '@/i18n/locales'
import { useLocale } from '@/hooks/use-locale'

type PageLinkProps = Omit<LinkComponentProps<'a', RegisteredRouter, string, '/{-$locale}'>, 'to' | 'params' | 'from'> & { page: SitePage }

/** Links to one of the site's pages in the current language. */
export function PageLink({ page, ...props }: PageLinkProps) {
  const locale = useLocale()
  // Every page route sits under /{-$locale} and takes the same params, so one route type covers them all.
  const to = (page.path === '/' ? '/{-$locale}' : `/{-$locale}${page.path}`) as '/{-$locale}'
  return <Link to={to} params={{ locale: toLocaleParam(locale) }} {...props} />
}
