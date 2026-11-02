import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn, revealOrder } from '@/lib/utils'

const TONES = ['text-veyra-blue', 'text-veyra-violet', 'text-veyra-purple']

type FeatureRowProps = {
  /** Position in its list; picks the colour. */
  index?: number
  icon: LucideIcon
  title: string
  body: string
  /** h3 under a section heading; h2 when the cards sit straight under the page's h1. */
  headingLevel?: 'h2' | 'h3'
  className?: string
  children?: ReactNode
}

/** One feature as a card: icon, title and text. Used for "how it works" and the services. */
export function FeatureRow({ icon: Icon, title, body, index = 0, headingLevel: Heading = 'h3', className, children }: FeatureRowProps) {
  return (
    <article
      data-reveal
      style={revealOrder(index % 3)}
      className={cn(
        'group grid min-w-0 content-start gap-3 rounded-xl border bg-card/60 p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-veyra-blue/50 hover:bg-card sm:p-7',
        className,
      )}
    >
      <Icon className={cn('mb-2 size-7 transition-transform duration-300 group-hover:scale-110', TONES[index % TONES.length])} strokeWidth={1.6} aria-hidden />
      <Heading className="text-xl font-semibold sm:text-2xl">{title}</Heading>
      <p className="max-w-[46ch] text-muted-foreground">{body}</p>
      {children}
    </article>
  )
}
