import type { ComponentProps, ReactNode } from 'react'
import { Container } from '@/components/common/container'
import { SplitWords } from '@/components/sections/split-words'
import { cn, revealOrder } from '@/lib/utils'

const GLOWS = { blue: 'glow-blue', violet: 'glow-violet', purple: 'glow-purple' } as const

type SectionProps = ComponentProps<'section'> & {
  glow?: keyof typeof GLOWS
  /** Pin the section on large screens while its content flies in and out with the scroll (see `.scene` in app.css). */
  scene?: boolean
}

/** A full-width band of the page, opened by a hairline rule, optionally lit from one side in a brand colour. */
export function Section({ className, children, glow, scene = false, ...props }: SectionProps) {
  const lit = glow && GLOWS[glow]
  const content = <Container>{children}</Container>
  return (
    <section className={cn('border-t py-16 sm:py-24 lg:py-28', scene ? 'scene' : lit, className)} {...props}>
      {scene ? (
        <div className="scene-stage relative isolate">
          {/* A scene's light belongs to its stage: it holds still with the words and fades with them. */}
          <div aria-hidden className={cn('scene-glow absolute inset-0 -z-10', lit)} />
          {content}
        </div>
      ) : (
        content
      )}
    </section>
  )
}

type SectionHeadingProps = {
  title: string
  lead?: ReactNode
  /** The page's main heading uses h1; every other section uses h2. */
  as?: 'h1' | 'h2'
  className?: string
}

/**
 * A section's heading and optional lead paragraph, each sliding in on its own.
 * A page's h1 also rises in word by word as the page opens.
 */
export function SectionHeading({ title, lead, as: Heading = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 grid max-w-3xl gap-5 lg:mb-16', className)}>
      {Heading === 'h1' ? (
        <SplitWords as="h1" effect="rise" parts={[{ text: title }]} data-reveal className="font-display text-4xl leading-[1.05] sm:text-6xl" />
      ) : (
        <h2 data-reveal className="font-display text-3xl leading-[1.05] sm:text-5xl">
          {title}
        </h2>
      )}
      {lead && (
        <p data-reveal style={revealOrder(1)} className="max-w-[60ch] text-lg text-muted-foreground">
          {lead}
        </p>
      )}
    </div>
  )
}
