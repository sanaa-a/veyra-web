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
      <DialogTrigger className="group relative grid aspect-video w-full max-w-full place-items-center overflow-hidden rounded-xl border bg-card bg-[radial-gradient(60%_80%_at_30%_30%,rgb(123_173_255/0.18),transparent_60%),radial-gradient(60%_80%_at_75%_70%,rgb(158_84_253/0.22),transparent_60%)] text-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">
        <span className="grid gap-3.5 px-4">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-veyra-gradient text-primary-foreground shadow-[0_0_0_10px_rgb(131_111_253/0.14),0_0_0_22px_rgb(131_111_253/0.06)] transition-transform group-hover:scale-110">
            <Play className="size-7 fill-current ms-1 rtl:-scale-x-100" aria-hidden />
          </span>
          <span className="font-medium">{t('home.video.play')}</span>
          {!VIDEO_SRC && <span className="text-sm text-muted-foreground">{t('home.video.placeholder')}</span>}
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
