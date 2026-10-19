export const SITE = {
  name: 'Veyra',
  url: 'https://veyraom.app',
  /** WhatsApp number in international format, digits only. Replace the placeholder before launch. */
  whatsapp: '96800000000',
  email: 'vey.ra@outlook.com',
  instagram: 'veyra_om',
} as const

export function whatsappUrl(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}
