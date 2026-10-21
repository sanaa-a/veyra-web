import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Each row takes the next brand colour in turn, so a list reads as blue, violet, purple, blue... */
const TONES = [
  'text-veyra-blue bg-veyra-blue/10 border-veyra-blue/30 group-hover:bg-veyra-blue/20',
  'text-veyra-violet bg-veyra-violet/10 border-veyra-violet/30 group-hover:bg-veyra-violet/20',
  'text-veyra-purple bg-veyra-purple/10 border-veyra-purple/30 group-hover:bg-veyra-purple/20',
]
const RULES = ['hover:border-veyra-blue', 'hover:border-veyra-violet', 'hover:border-veyra-purple']

type FeatureRowProps = {
  /** Position in its list; picks the colour. */
  index?: number
  icon: LucideIcon
  title: string
  body: string
  className?: string
  children?: ReactNode
}

/** One item in a ruled list: icon, title and text. Used for "how it works" and the services. */
export function FeatureRow({ icon: Icon, title, body, index = 0, className, children }: FeatureRowProps) {
  const tone = index % TONES.length
  return (
    <article className={cn('group grid min-w-0 content-start gap-4 border-t pt-6 transition-colors', RULES[tone], className)}>
      <span className={cn('grid size-11 place-items-center rounded-sm border transition-colors', TONES[tone])}>
        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
      </span>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="max-w-[46ch] text-muted-foreground">{body}</p>
      {children}
    </article>
  )
}
