import type en from '@/i18n/locales/en.json'

export type Member = {
  id: keyof typeof en.about.members
  /** Path under /public, e.g. '/team/fatma.jpg'. Leave out to show initials. */
  photo?: string
}

export const TEAM: Member[] = [
  { id: 'fatma' },
  { id: 'anaum' },
  { id: 'anas' },
  { id: 'ibtisam' },
  { id: 'ahmed' },
  { id: 'abdulaziz' },
]

export const ADVISORS: Member[] = [{ id: 'hussain' }, { id: 'mohammed' }]
