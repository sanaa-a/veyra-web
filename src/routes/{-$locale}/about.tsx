import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { MemberCard } from '@/components/sections/member-card'
import { Section, SectionHeading } from '@/components/sections/section'
import { ADVISORS, TEAM } from '@/content/team'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/about')({
  head: pageHead('about'),
  component: AboutPage,
})

const STATEMENTS = ['mission', 'vision'] as const

function AboutPage() {
  const { t } = useTranslation()
  return (
    <>
      <Section glow="violet">
        <SectionHeading as="h1" title={t('about.title')} />
        <div data-reveal className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div className="grid min-w-0 gap-4">
            <h2 className="text-2xl font-semibold">{t('about.who.title')}</h2>
            {t('about.who.body', { returnObjects: true }).map((paragraph) => (
              <p key={paragraph} className="max-w-[62ch] text-lg text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <div className="mt-2 flex flex-wrap gap-2.5">
              {t('about.badges', { returnObjects: true }).map((badge) => (
                <Badge key={badge} variant="outline" className="whitespace-normal">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid min-w-0 gap-8">
            {STATEMENTS.map((key) => (
              <div key={key} className="grid gap-3 rounded-xl border bg-card/60 p-6">
                <h3 className="font-semibold text-veyra-blue">{t(`about.${key}.title`)}</h3>
                <p className="text-lg">{t(`about.${key}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section glow="blue">
        <SectionHeading title={t('about.team.title')} lead={t('about.team.lead')} />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
        <h3 className="mt-20 mb-6 border-t pt-8 text-2xl font-semibold">{t('about.team.advisors')}</h3>
        <div className="grid gap-8 md:grid-cols-2">
          {ADVISORS.map((member) => (
            <MemberCard key={member.id} member={member} compact />
          ))}
        </div>
      </Section>
    </>
  )
}
