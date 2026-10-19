import type en from '@/i18n/locales/en.json'

export type PackageId = keyof typeof en.packages.items

export const PACKAGES: { id: PackageId; featured?: boolean }[] = [
  { id: 'day' },
  { id: 'exhibition', featured: true },
  { id: 'campaign' },
]
