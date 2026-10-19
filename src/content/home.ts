import { Eye, Lightbulb, RotateCw, type LucideIcon } from 'lucide-react'
import type en from '@/i18n/locales/en.json'

type HowId = keyof typeof en.home.how.items
type StepId = keyof typeof en.home.steps.items

export const HOW_IT_WORKS: { id: HowId; icon: LucideIcon }[] = [
  { id: 'spin', icon: RotateCw },
  { id: 'light', icon: Lightbulb },
  { id: 'see', icon: Eye },
]

/** The order matters: this is the real sequence of working with Veyra. */
export const STEPS: StepId[] = ['message', 'design', 'setup', 'run']
