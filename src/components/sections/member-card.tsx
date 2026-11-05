import { useTranslation } from 'react-i18next'
import type { Member } from '@/content/team'
import { useScan } from '@/hooks/use-scan'
import { cn, initials, revealOrder } from '@/lib/utils'

/** A team member: a portrait (or their initials until a photo exists), then name, role and a line about them. */
export function MemberCard({ member, compact = false, index = 0 }: { member: Member; compact?: boolean; index?: number }) {
  const { t } = useTranslation()
  const name = t(`about.members.${member.id}.name`)
  const portraitRef = useScan<HTMLDivElement>()

  return (
    <article data-reveal style={revealOrder(index)} className={cn('group grid min-w-0 content-start gap-4', compact && 'grid-cols-[6.5rem_1fr] items-start gap-5 sm:grid-cols-[8rem_1fr]')}>
      {/* The portrait scans in under a purple line when it first comes into view, and grows a little on hover. */}
      <div
        ref={member.photo ? portraitRef : undefined}
        className={cn('relative grid aspect-[4/5] place-items-center overflow-hidden rounded-xl border bg-card transition-[transform,box-shadow,border-color] duration-500 ease-out group-hover:scale-[1.03] group-hover:border-veyra-violet/50 group-hover:shadow-[0_24px_60px_-24px_var(--veyra-purple)] bg-[radial-gradient(80%_70%_at_30%_10%,rgb(92_116_228/0.28),transparent_70%),radial-gradient(70%_60%_at_90%_100%,rgb(158_84_253/0.25),transparent_70%)]', !compact && 'max-w-full', member.photo && 'scan')}
      >
        {member.photo ? (
          <img src={member.photo} alt={name} width={800} height={1000} className="absolute inset-0 size-full origin-bottom object-cover transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
        ) : (
          <>
            <span className={cn('font-display text-gradient', compact ? 'text-3xl' : 'text-6xl')} aria-hidden>
              {initials(name)}
            </span>
            {!compact && <span className="absolute start-3 bottom-3 text-xs text-muted-foreground">{t('common.photoPlaceholder')}</span>}
          </>
        )}
      </div>
      <div className="grid content-start gap-1.5">
        <h3 className="text-lg font-semibold" dir="auto">{name}</h3>
        <span className="text-sm font-medium text-veyra-blue">{t(`about.members.${member.id}.role`)}</span>
        <p className="mt-1 text-sm text-muted-foreground">{t(`about.members.${member.id}.bio`)}</p>
      </div>
    </article>
  )
}
