import { cn } from '@/lib/utils'

export function Logo({ className, withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img src="/logo-orb.png" alt="" width={192} height={130} className="h-auto w-11" />
      {withWord && <span className="text-[15px] font-semibold tracking-[0.32em] [font-stretch:125%]">VEYRA</span>}
    </span>
  )
}
