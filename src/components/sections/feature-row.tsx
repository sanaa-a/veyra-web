import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, type cardVariants } from '@/components/ui/card'
import { cn, revealOrder } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

const TONES = ['text-veyra-blue', 'text-veyra-violet', 'text-veyra-purple']

type FeatureRowProps = {
  /** Position in its list; picks the colour. */
  index?: number
  icon: LucideIcon
  title: string
  body: string
  /** h3 under a section heading; h2 when the cards sit straight under the page's h1. */
  headingLevel?: 'h2' | 'h3'
  /** soft by default; tint marks the one that leads. */
  surface?: VariantProps<typeof cardVariants>['surface']
  className?: string
  children?: ReactNode
}

/** One feature as a card: icon, title and text. Used for "how it works" and the services. */
export function FeatureRow({ icon: Icon, title, body, index = 0, headingLevel: Heading = 'h3', surface = 'soft', className, children }: FeatureRowProps) {
  return (
    <Card
      as="article"
      surface={surface}
      lift
      data-reveal
      style={revealOrder(index % 3)}
      className={cn('group grid content-start gap-3 p-6 hover:border-veyra-blue/50 hover:bg-card sm:p-7', className)}
    >
      <Icon className={cn('mb-2 size-7 transition-transform duration-300 group-hover:scale-110', TONES[index % TONES.length])} strokeWidth={1.6} aria-hidden />
      <Heading className="text-xl font-semibold sm:text-2xl">{title}</Heading>
      <p className="max-w-[46ch] text-muted-foreground">{body}</p>
      {children}
    </Card>
  )
}
