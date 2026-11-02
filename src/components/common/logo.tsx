import { cn } from '@/lib/utils'

/** The VEYRA wordmark: Archivo SemiBold at its widest, drawn as a path so the page needs no wide font file for five letters. */
const WORDMARK = 'M346 0 18 -687H188L367 -299Q379 -274 391 -245.5Q403 -217 414 -191.0Q425 -165 432 -147H440Q447 -164 457.5 -189.5Q468 -215 480.5 -243.5Q493 -272 505 -298L685 -687H846L518 0Z M1281 0V-687H1976.0V-560H1433.0V-413H1916.0V-286H1433.0V-127H1984.0V0Z M2724 0V-278L2388 -687H2571.0L2799 -400H2809.0L3040 -687H3213.0L2876 -278V0Z M3648 0V-687H4192.0Q4265 -687 4311.5 -657.5Q4358 -628 4381 -579.5Q4404 -531 4404 -472Q4404 -411 4372.5 -357.5Q4341 -304 4275 -274L4421 0H4250.0L4124 -245H3800.0V0ZM3800 -371H4150.0Q4197 -371 4222.5 -398.5Q4248 -426 4248 -469Q4248 -498 4237 -518.5Q4226 -539 4204 -549.5Q4182 -560 4150 -560H3800.0Z M4815 0 5159 -687H5331.0L5675 0H5508.0L5443 -133H5036.0L4971 0ZM5096 -256H5383.0L5303 -424Q5298 -435 5288.5 -456.5Q5279 -478 5269.5 -500.5Q5260 -523 5252.5 -539.5Q5245 -556 5244 -557H5236.0Q5227 -537 5215.5 -511.0Q5204 -485 5193.5 -461.0Q5183 -437 5176 -423Z'

export function Logo({ className, withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img src="/logo-orb.webp" alt="" width={96} height={65} className="h-auto w-11" />
      {withWord && (
        <svg viewBox="0 -690 5699 692" className="h-[10.4px] w-auto fill-current" aria-hidden>
          <path d={WORDMARK} />
        </svg>
      )}
    </span>
  )
}
