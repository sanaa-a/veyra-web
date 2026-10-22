import type { ComponentProps, ReactNode } from 'react'
import { Container } from '@/components/common/container'
import { cn } from '@/lib/utils'

const GLOWS = { blue: 'glow-blue', violet: 'glow-violet', purple: 'glow-purple' } as const

/** A full-width band of the page, opened by a hairline rule, optionally lit from one side in a brand colour. */
export function Section({ className, children, glow, ...props }: ComponentProps<'section'> & { glow?: keyof typeof GLOWS }) {
  return (
    <section className={cn('border-t py-16 sm:py-24 lg:py-28', glow && GLOWS[glow], className)} {...props}>
      <Container>{children}</Container>
    </section>
  )
}

type SectionHeadingProps = {
  title: ReactNode
  lead?: ReactNode
  /** The page's main heading uses h1; every other section uses h2. */
  as?: 'h1' | 'h2'
  className?: string
}

/** A section's heading and optional lead paragraph. */
export function SectionHeading({ title, lead, as: Heading = 'h2', className }: SectionHeadingProps) {
  return (
    <div data-reveal className={cn('mb-12 grid max-w-3xl gap-5 lg:mb-16', className)}>
      <Heading className={cn('font-display leading-[1.05]', Heading === 'h1' ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl')}>{title}</Heading>
      {lead && <p className="max-w-[60ch] text-lg text-muted-foreground">{lead}</p>}
    </div>
  )
}
