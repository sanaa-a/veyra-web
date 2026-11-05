import { Fragment, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from 'react'
import { cn } from '@/lib/utils'

const EFFECTS = {
  /** Words light up one by one as the text scrolls up the screen (see `.scroll-words` in app.css). */
  scroll: 'scroll-words',
  /** Words rise into place one after another when the page opens (see `.rise-words` in app.css). */
  rise: 'rise-words',
} as const

type SplitWordsProps = Omit<ComponentPropsWithoutRef<'p'>, 'children'> & {
  /** The text in runs; a run can carry its own classes, such as an accent colour. */
  parts: { text: string; className?: string }[]
  effect?: keyof typeof EFFECTS
  as?: ElementType
  className?: string
}

/** Text split into words, each numbered so CSS can play them in turn. */
export function SplitWords({ parts, effect = 'scroll', as: Tag = 'p', className, style, ...props }: SplitWordsProps) {
  const runs = parts.map((part) => ({ ...part, words: part.text.split(/\s+/).filter(Boolean) }))
  const total = runs.reduce((sum, run) => sum + run.words.length, 0)
  let index = 0

  return (
    <Tag className={cn(EFFECTS[effect], className)} style={{ ...style, '--words': total } as CSSProperties} {...props}>
      {runs.map((run, r) => (
        <span key={r} className={run.className}>
          {run.words.map((word, w) => (
            // The space sits outside the word, so it survives when a word is drawn as its own block.
            <Fragment key={w}>
              <span className="word" style={{ '--word': index++ } as CSSProperties}>
                {word}
              </span>
              {r < runs.length - 1 || w < run.words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}
