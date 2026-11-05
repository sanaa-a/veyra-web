import type en from '@/i18n/locales/en.json'

export type Member = {
  id: keyof typeof en.about.members
  /** Path under /public, e.g. '/team/fatma.webp' (background removed, 4:5, 800x1000, plus a 480x600 copy named '<id>-480.webp'). Leave out to show initials. */
  photo?: string
  /** Also has a sharper 1200x1500 copy named '<id>-1200.webp', for high-density phone screens. */
  hd?: boolean
}

export const TEAM: Member[] = [
  { id: 'fatma', photo: '/team/fatma.webp?v=9', hd: true },
  { id: 'anaum', photo: '/team/anaum.webp' },
  { id: 'anas', photo: '/team/anas.webp?v=3' },
  { id: 'ibtisam', photo: '/team/ibtisam.webp' },
  { id: 'ahmed', photo: '/team/ahmed.webp' },
  { id: 'abdulaziz', photo: '/team/abdulaziz.webp' },
]

export const ADVISORS: Member[] = [{ id: 'hussain', photo: '/team/hussain.webp' }, { id: 'mohammed', photo: '/team/mohammed.webp' }]
