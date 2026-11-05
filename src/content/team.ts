import type en from '@/i18n/locales/en.json'

export type Member = {
  id: keyof typeof en.about.members
  /** Path under /public, e.g. '/team/fatma.webp' (background removed, 4:5, 800x1000). Leave out to show initials. */
  photo?: string
}

export const TEAM: Member[] = [
  { id: 'fatma', photo: '/team/fatma.webp' },
  { id: 'anaum', photo: '/team/anaum.webp' },
  { id: 'anas', photo: '/team/anas.webp' },
  { id: 'ibtisam', photo: '/team/ibtisam.webp' },
  { id: 'ahmed', photo: '/team/ahmed.webp' },
  { id: 'abdulaziz', photo: '/team/abdulaziz.webp' },
]

export const ADVISORS: Member[] = [{ id: 'hussain', photo: '/team/hussain.webp' }, { id: 'mohammed', photo: '/team/mohammed.webp' }]
