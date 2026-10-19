import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Centered content column with a safe-area-aware side gutter. */
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] sm:px-6', className)}
      {...props}
    />
  )
}
