import { Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'
import { Skeleton } from '@/components/ui/skeleton'

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
      <footer id="contato" className="bg-[#003366] text-white py-[40px] px-[20px] text-center">
        <div className="container mx-auto max-w-6xl flex flex-col items-center">
          <Skeleton className="h-8 w-48 bg-white/20 mb-4" />
          <Skeleton className="h-4 w-64 bg-white/20 mb-8" />
          <div className="flex gap-8 mb-8">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-6 w-32 bg-white/20" />
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
    <footer id="contato" className="bg-[#003366] text-white py-[40px] px-[20px] text-center">
      <div className="container mx-auto max-w-6xl flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4">{companyName}</h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-md mb-8">
          Especialistas dedicados a potencializar seus investimentos com a segurança, transparência
          e expertise que você confia.
        </p>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-8 text-sm">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-[#FF6B35]" />
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="hover:text-[#FF6B35] transition-colors"
            >
              {phone}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-[#FF6B35]" />
            <a href={`mailto:${email}`} className="hover:text-[#FF6B35] transition-colors">
              {email}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-left">
            <MapPin className="h-5 w-5 flex-shrink-0 text-[#FF6B35]" />
            <span>{address}</span>
          </div>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex space-x-4 mb-8">
            {socialLinks.map((link: { platform: string; url: string }, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-[#FF6B35] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                aria-label={link.platform}
              >
                {renderIcon(link.platform)}
                <span className="sr-only">{link.platform}</span>
              </a>
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-white/20 text-xs text-white/60 max-w-3xl w-full whitespace-pre-line">
          {copyright}
        </div>
      </div>
    </footer>
  )
}
