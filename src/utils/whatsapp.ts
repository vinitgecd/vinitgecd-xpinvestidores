export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('55')) {
    return digits
  }
  return `55${digits}`
}

export function detectDevice(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
  const isSmallScreen = window.innerWidth < 768
  return isMobileUa || isSmallScreen ? 'mobile' : 'desktop'
}

export function generateWhatsAppUrl(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export function generateWhatsAppWebUrl(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  return `https://web.whatsapp.com/send?phone=${formattedPhone}${message ? `&text=${encodeURIComponent(message)}` : ''}`
}

export function redirectToWhatsApp(phone: string, message?: string): void {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const device = detectDevice()

  const url =
    device === 'mobile'
      ? generateWhatsAppUrl(formattedPhone, message)
      : generateWhatsAppWebUrl(formattedPhone, message)

  window.open(url, '_blank', 'noopener,noreferrer')
}
