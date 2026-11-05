import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/** The site's one panel: a rounded, hairline-bordered surface, in a few strengths of light. */
const cardVariants = cva('min-w-0 rounded-xl border', {
  variants: {
    surface: {
      /** A see-through panel over the section glow. */
      soft: 'bg-card/60',
      solid: 'bg-card',
      /** A faint wash of the brand colours, for the one item in a list that leads. */
      tint: 'border-veyra-violet/40 bg-veyra-tint',
      /** Fully lit in the brand gradient, for the pick we recommend. */
      lit: 'border-transparent bg-veyra-lit text-white shadow-[0_30px_80px_-30px_var(--veyra-violet)]',
      /** Night blue into purple, for the closing call to action. */
      night: 'border-veyra-violet/30 bg-veyra-night',
      /** A portrait frame: coloured light falling in from two corners. */
      portrait: 'bg-card bg-portrait',
    },
    /** Rises a little under the pointer. */
    lift: {
      true: 'transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1',
      false: '',
    },
  },
  defaultVariants: { surface: 'soft', lift: false },
})

type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants> & { as?: 'div' | 'article' }

function Card({ as: Tag = 'div', surface, lift, className, ...props }: CardProps) {
  return <Tag data-slot="card" className={cn(cardVariants({ surface, lift }), className)} {...props} />
}

export { Card, cardVariants }
