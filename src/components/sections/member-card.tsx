import { useTranslation } from 'react-i18next'
import type { Member } from '@/content/team'
import { cn, initials } from '@/lib/utils'

/** A team member. Shows their photo when one is set, otherwise their initials on the brand glow. */
export function MemberCard({ member, compact = false }: { member: Member; compact?: boolean }) {
  const { t } = useTranslation()
  const name = t(`about.members.${member.id}.name`)

  return (
    <article
      className={cn(
        'grid min-w-0 overflow-hidden rounded-xl border bg-card transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/50',
        compact && 'grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr]',
      )}
    >
      <div
        className={cn(
          'relative grid place-items-center overflow-hidden bg-secondary bg-[radial-gradient(70%_70%_at_50%_120%,rgb(158_84_253/0.5),transparent_70%),radial-gradient(60%_60%_at_20%_0%,rgb(123_173_255/0.3),transparent_70%)]',
          compact ? 'min-h-32' : 'aspect-[16/9] sm:aspect-[4/3.4]',
        )}
      >
        {member.photo ? (
          <img src={member.photo} alt={name} className="absolute inset-0 size-full object-cover" loading="lazy" />
        ) : (
          <>
            <span className="font-display text-4xl font-bold tracking-wide text-foreground/90 sm:text-5xl" aria-hidden>
              {initials(name)}
            </span>
            <span className="absolute start-2.5 bottom-2.5 rounded-full bg-background/60 px-2 py-0.5 text-[0.7rem] text-muted-foreground">
              {t('common.photoPlaceholder')}
            </span>
          </>
        )}
      </div>
      <div className="grid content-start gap-1.5 px-5 pt-5 pb-6">
        <h3 className="font-display text-lg font-medium" dir="auto">{name}</h3>
        <span className="text-sm font-medium text-veyra-blue">{t(`about.members.${member.id}.role`)}</span>
        <p className="text-sm text-muted-foreground">{t(`about.members.${member.id}.bio`)}</p>
      </div>
    </article>
  )
}
