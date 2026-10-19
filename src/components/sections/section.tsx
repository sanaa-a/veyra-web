import type { ComponentProps, ReactNode } from 'react'
import { Container } from '@/components/common/container'
import { cn } from '@/lib/utils'

/** A full-width band of the page. Consecutive sections are divided by a hairline. */
export function Section({ className, children, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('py-14 sm:py-20 lg:py-24 [&+&]:border-t', className)} {...props}>
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

export function SectionHeading({ eyebrow, title, lead, as: Heading = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 grid max-w-3xl gap-3.5', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading
        className={cn(
          'font-display font-bold leading-[1.12] tracking-tight',
          Heading === 'h1' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl',
        )}
      >
        {title}
      </Heading>
      {lead && <p className="max-w-[60ch] text-lg text-muted-foreground">{lead}</p>}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('text-xs font-medium tracking-[0.16em] text-veyra-blue uppercase rtl:text-sm rtl:tracking-normal', className)}>
      {children}
    </span>
  )
}
