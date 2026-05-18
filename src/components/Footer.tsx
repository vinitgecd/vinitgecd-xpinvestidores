import { Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'
import { Skeleton } from '@/components/ui/skeleton'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export function Footer() {
  const { getValue, loading } = useSettings()

  const companyName = getValue('header_company_name', 'XP Investimentos')
  const address = getValue('footer_address', 'Av. Brigadeiro Faria Lima, 3600 - SP')
  const phone = getValue('footer_phone', '(11) 99999-9999')
  const email = getValue('footer_email', 'contato@assessoresxp.com.br')
  const socialLinks = getValue('footer_social_links', [])
  const copyright = getValue('footer_copyright', '')

  if (loading) {
    return (
      <footer
        id="contato"
        className="bg-[#111111] text-white py-[60px] px-[20px] text-center border-t border-white/5"
      >
        <div className="container mx-auto max-w-6xl flex flex-col items-center">
          <Skeleton className="h-8 w-48 bg-white/10 mb-4" />
          <Skeleton className="h-4 w-64 bg-white/10 mb-8" />
          <div className="flex gap-8 mb-8">
            <Skeleton className="h-6 w-32 bg-white/10" />
            <Skeleton className="h-6 w-32 bg-white/10" />
            <Skeleton className="h-6 w-32 bg-white/10" />
          </div>
        </div>
      </footer>
    )
  }

  const renderIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />
      case 'instagram':
        return <Instagram className="h-5 w-5" />
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <footer
      id="contato"
      className="bg-[#111111] text-white py-[60px] px-[20px] text-center border-t border-white/5 relative z-10 pb-24 md:pb-[60px]"
    >
      <div className="container mx-auto max-w-6xl flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M4 20L10 4L16 20M10 4L16 12L22 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-xl font-bold tracking-tighter">Argentum</h3>
        </div>

        <p className="text-white/60 text-sm leading-relaxed max-w-md mb-10">
          Especialistas dedicados a potencializar seus investimentos com a segurança, transparência
          e expertise que você confia.
        </p>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-10 text-sm items-center justify-center">
          <div className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#4da2ff]/20 transition-colors">
              <Phone className="h-4 w-4 text-[#4da2ff]" />
            </div>
            <a href={`tel:${phone.replace(/\D/g, '')}`}>{phone}</a>
          </div>
          <div className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#4da2ff]/20 transition-colors">
              <Mail className="h-4 w-4 text-[#4da2ff]" />
            </div>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors group text-left">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#4da2ff]/20 transition-colors">
              <MapPin className="h-4 w-4 flex-shrink-0 text-[#4da2ff]" />
            </div>
            <span>{address}</span>
          </div>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex space-x-4 mb-10">
            {socialLinks.map((link: { platform: string; url: string }, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 text-white/80 hover:bg-[#4da2ff] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                aria-label={link.platform}
              >
                {renderIcon(link.platform)}
                <span className="sr-only">{link.platform}</span>
              </a>
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-white/10 text-xs text-white/40 max-w-3xl w-full whitespace-pre-line">
          {copyright || '© 2026 Argentum Investimentos. Todos os direitos reservados.'}
        </div>
      </div>
    </footer>
  )
}
