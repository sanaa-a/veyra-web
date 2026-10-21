import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type FeatureRowProps = {
  icon: LucideIcon
  title: string
  body: string
  className?: string
  children?: ReactNode
}

/** One item in a ruled list: icon, title and text. Used for "how it works" and the services. */
export function FeatureRow({ icon: Icon, title, body, className, children }: FeatureRowProps) {
  return (
    <article className={cn('group grid min-w-0 content-start gap-4 border-t pt-6 transition-colors hover:border-foreground', className)}>
      <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-veyra-violet" strokeWidth={1.5} aria-hidden />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="max-w-[46ch] text-muted-foreground">{body}</p>
      {children}
    </article>
  )
}
