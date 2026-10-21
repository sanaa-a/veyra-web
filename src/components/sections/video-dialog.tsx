import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

/**
 * The product video. Until the real video exists, both the poster and the dialog show a placeholder.
 * To add it: put the file in /public (e.g. /videos/veyra-fan.mp4) and set VIDEO_SRC.
 */
const VIDEO_SRC: string | null = null

export function VideoDialog() {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger className="group relative grid aspect-video w-full max-w-full place-items-center overflow-hidden border bg-black text-center outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {!VIDEO_SRC && <span className="label-mono absolute start-4 top-4">{t('home.video.placeholder')}</span>}
        <span className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full border border-foreground/40 transition-colors group-hover:border-veyra-violet group-hover:bg-veyra-violet">
            <Play className="ms-1 size-5 fill-current rtl:-scale-x-100" aria-hidden />
          </span>
          <span className="text-lg font-semibold">{t('home.video.play')}</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="pe-10">{t('home.video.title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('home.video.placeholder')}</DialogDescription>
        {VIDEO_SRC ? (
          <video src={VIDEO_SRC} controls autoPlay playsInline className="aspect-video w-full rounded-lg bg-black" />
        ) : (
          <div className="grid aspect-video w-full place-items-center rounded-lg bg-secondary text-muted-foreground">
            {t('home.video.placeholder')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
