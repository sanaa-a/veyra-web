import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = ['text-veyra-blue', 'text-veyra-violet', 'text-veyra-purple']

type FeatureRowProps = {
  /** Position in its list; picks the colour. */
  index?: number
  icon: LucideIcon
  title: string
  body: string
  className?: string
  children?: ReactNode
}

/** One feature as a card: icon, title and text. Used for "how it works" and the services. */
export function FeatureRow({ icon: Icon, title, body, index = 0, className, children }: FeatureRowProps) {
  return (
    <article
      data-reveal
      style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}
      className={cn(
        'group grid min-w-0 content-start gap-3 rounded-xl border bg-card/60 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-veyra-blue/50 hover:bg-card sm:p-7',
        className,
      )}
    >
      <Icon className={cn('mb-2 size-7 transition-transform duration-300 group-hover:scale-110', TONES[index % TONES.length])} strokeWidth={1.6} aria-hidden />
      <h3 className="text-xl font-semibold sm:text-2xl">{title}</h3>
      <p className="max-w-[46ch] text-muted-foreground">{body}</p>
      {children}
    </article>
  )
}
