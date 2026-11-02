import type { CSSProperties } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter((word) => !/^(al|el)$/i.test(word))
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
}

/** Browser-only: whether the visitor asked their system for less motion. */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Browser-only: whether the main pointer is a mouse or trackpad rather than a finger. */
export const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches

/** Staggers an element marked `data-reveal` after the ones before it (see app.css). */
export const revealOrder = (index: number) => ({ '--reveal-index': index }) as CSSProperties
