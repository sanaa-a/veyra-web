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
