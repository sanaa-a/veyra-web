import type { CSSProperties, ElementType } from 'react'
import { cn } from '@/lib/utils'

type ScrollWordsProps = {
  /** The text in runs; a run can carry its own classes, such as an accent colour. */
  parts: { text: string; className?: string }[]
  as?: ElementType
  className?: string
}

/** Text whose words light up one by one as it scrolls up the screen (see `.scroll-words` in app.css). */
export function ScrollWords({ parts, as: Tag = 'p', className }: ScrollWordsProps) {
  const runs = parts.map((part) => ({ ...part, words: part.text.split(/\s+/).filter(Boolean) }))
  const total = runs.reduce((sum, run) => sum + run.words.length, 0)
  let index = 0

  return (
    <Tag className={cn('scroll-words', className)} style={{ '--words': total } as CSSProperties}>
      {runs.map((run, r) => (
        <span key={r} className={run.className}>
          {run.words.map((word, w) => (
            <span key={w} className="word" style={{ '--word': index++ } as CSSProperties}>
              {word}
              {r < runs.length - 1 || w < run.words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
