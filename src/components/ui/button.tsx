import * as React from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,background-color,border-color,transform,box-shadow] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: 'bg-veyra text-white shadow-[0_10px_30px_-12px_var(--veyra-violet)] hover:-translate-y-0.5 hover:brightness-110',
        light: 'bg-white text-background hover:bg-white/85',
        outline: 'border border-input bg-transparent text-foreground hover:border-veyra-blue hover:text-veyra-blue',
        ghost: 'text-muted-foreground hover:text-foreground',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3.5',
        lg: 'h-13 px-7 text-base',
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
