import { useTranslation } from 'react-i18next'

/**
 * A slow conveyor belt of the places Veyra is used, as label and highlighted value pairs.
 * The list is drawn twice so the loop is seamless; screen readers get it once.
 */
export function UsesTicker() {
  const { t } = useTranslation()
  const uses = t('home.uses', { returnObjects: true })

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pe-12" aria-hidden={hidden || undefined}>
      {uses.map(({ label, value }) => (
        <li key={label} className="flex items-center gap-3 whitespace-nowrap">
          <span className="font-mono text-sm tracking-[0.12em] text-foreground uppercase rtl:font-sans rtl:tracking-normal">{label}:</span>
          <span className="rounded-md bg-veyra-blue px-2.5 py-1 font-mono text-sm font-medium text-background uppercase rtl:font-sans">{value}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-label={t('home.usesLabel')} className="group overflow-hidden border-y bg-card/40 py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-[ticker_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none rtl:[animation-direction:reverse]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}
