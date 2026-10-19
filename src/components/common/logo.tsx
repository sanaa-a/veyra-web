import { cn } from '@/lib/utils'

export function Logo({ className, withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img src="/logo.png" alt="" width={34} height={26} className="h-auto w-8.5" />
      {withWord && <span className="font-display text-base font-bold tracking-[0.22em]">VEYRA</span>}
    </span>
  )
}
