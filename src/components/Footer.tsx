import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contato" className="bg-[#003366] text-white py-[40px] px-[20px] text-center">
      <div className="container mx-auto max-w-6xl flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4">XP Investimentos</h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-md mb-8">
          Especialistas dedicados a potencializar seus investimentos com a segurança, transparência
          e expertise que você confia.
        </p>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-8 text-sm">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-[#FF6B35]" />
            <span>(11) 99999-9999</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-[#FF6B35]" />
            <span>contato@assessoresxp.com.br</span>
          </div>
          <div className="flex items-center space-x-2 text-left">
            <MapPin className="h-5 w-5 flex-shrink-0 text-[#FF6B35]" />
            <span>Av. Brigadeiro Faria Lima, 3600 - SP</span>
          </div>
        </div>

        <div className="flex space-x-4 mb-8">
          <a
            href="#"
            className="p-3 rounded-full bg-white/10 hover:bg-[#FF6B35] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="#"
            className="p-3 rounded-full bg-white/10 hover:bg-[#FF6B35] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </a>
        </div>

        <div className="pt-8 border-t border-white/20 text-xs text-white/60 max-w-3xl w-full">
          <p className="mb-3">
            As informações apresentadas nesta página têm caráter meramente informativo e não
            constituem qualquer tipo de aconselhamento de investimentos. Rentabilidade passada não é
            garantia de rentabilidade futura.
          </p>
          <p>&copy; {new Date().getFullYear()} XP Investimentos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
