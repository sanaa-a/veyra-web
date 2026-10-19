import * as React from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/60 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          'bg-veyra-gradient text-primary-foreground shadow-[0_6px_28px_-8px_rgb(131_111_253/0.7)] hover:-translate-y-0.5 hover:shadow-[0_10px_34px_-8px_rgb(131_111_253/0.9)]',
        outline: 'border border-border bg-transparent text-foreground hover:border-primary hover:bg-secondary/40',
        ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        whatsapp: 'bg-whatsapp text-white shadow-[0_10px_30px_-6px_rgb(37_211_102/0.6)] hover:scale-105',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
