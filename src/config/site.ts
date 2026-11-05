export const SITE = {
  name: 'Veyra',
  url: 'https://veyraom.app',
  /** WhatsApp number in international format, digits only. */
  whatsapp: '96892453593',
  email: 'vey.ra@outlook.com',
  instagram: 'https://www.instagram.com/veyra_om',
  linkedin: 'https://www.linkedin.com/company/veyra-hologram',
} as const

export function whatsappUrl(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}
