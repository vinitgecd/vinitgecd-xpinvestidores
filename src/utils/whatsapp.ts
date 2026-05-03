export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
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

export function getWhatsAppUrl(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const device = detectDevice()
  const baseUrl = device === 'mobile' ? 'https://wa.me/' : 'https://web.whatsapp.com/send'

  if (device === 'mobile') {
    return `${baseUrl}${formattedPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  } else {
    return `${baseUrl}?phone=${formattedPhone}${message ? `&text=${encodeURIComponent(message)}` : ''}`
  }
}
