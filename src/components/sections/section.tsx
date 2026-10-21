import type { ComponentProps, ReactNode } from 'react'
import { Container } from '@/components/common/container'
import { cn } from '@/lib/utils'

/** A full-width band of the page, opened by a hairline rule. */
export function Section({ className, children, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('border-t py-16 sm:py-24 lg:py-28', className)} {...props}>
      <Container>{children}</Container>
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow: ReactNode
  title: ReactNode
  lead?: ReactNode
  /** The page's main heading uses h1; every other section uses h2. */
  as?: 'h1' | 'h2'
  className?: string
}

/** Label in the left column, heading and lead on the right: the grid every section hangs from. */
export function SectionHeading({ eyebrow, title, lead, as: Heading = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-10 lg:mb-16', className)}>
      <Eyebrow className="pt-2">{eyebrow}</Eyebrow>
      <div className="grid max-w-3xl gap-5">
        <Heading className={cn('font-display leading-[1.02]', Heading === 'h1' ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl')}>{title}</Heading>
        {lead && <p className="max-w-[58ch] text-lg text-muted-foreground">{lead}</p>}
      </div>
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('label-mono', className)}>{children}</span>
}
