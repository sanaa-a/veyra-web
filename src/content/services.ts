import { Building2, CalendarDays, GraduationCap, Megaphone, Package, UserRound, type LucideIcon } from 'lucide-react'
import type en from '@/i18n/locales/en.json'

export type ServiceId = keyof typeof en.services.items

export const SERVICES: { id: ServiceId; icon: LucideIcon }[] = [
  { id: 'events', icon: CalendarDays },
  { id: 'education', icon: GraduationCap },
  { id: 'advertising', icon: Megaphone },
  { id: 'launches', icon: Package },
  { id: 'lobbies', icon: Building2 },
]

/** Shown as a wide highlight under the grid: Veyra's own live-hologram technology. */
export const FEATURED_SERVICE: { id: ServiceId; icon: LucideIcon } = { id: 'live', icon: UserRound }
