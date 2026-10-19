import type { LucideIcon } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FeatureCardProps = {
  icon: LucideIcon
  title: string
  body: string
  /** "solid" puts the icon on the brand gradient; "soft" keeps it quiet. */
  tone?: 'solid' | 'soft'
  className?: string
  children?: React.ReactNode
}

export function FeatureCard({ icon: Icon, title, body, tone = 'soft', className, children }: FeatureCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/55',
        className,
      )}
    >
      <div className="glow-orb pointer-events-none absolute -end-16 -top-16 size-44 opacity-50 transition-opacity group-hover:opacity-100" />
      <div
        className={cn(
          'grid size-12 place-items-center rounded-[14px]',
          tone === 'solid' ? 'bg-veyra-gradient text-primary-foreground' : 'bg-secondary text-veyra-blue',
        )}
      >
        <Icon className="size-6" aria-hidden />
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{body}</CardDescription>
      {children}
    </Card>
  )
}
