import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contato" className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="text-2xl font-extrabold mb-4">
            XP <span className="text-accent">Investimentos</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Especialistas dedicados a potencializar seus investimentos com a segurança,
            transparência e expertise que você confia.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6 text-accent">Fale Conosco</h3>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-center space-x-3 hover:text-white transition-colors">
              <Phone className="h-5 w-5 text-accent" />
              <span>(11) 99999-9999</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-white transition-colors">
              <Mail className="h-5 w-5 text-accent" />
              <span>contato@assessoresxp.com.br</span>
            </li>
            <li className="flex items-start space-x-3 hover:text-white transition-colors">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-accent" />
              <span>
                Av. Brigadeiro Faria Lima, 3600
                <br />
                Itaim Bibi, São Paulo - SP
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6 text-accent">Redes Sociais</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="p-3 rounded-full bg-white/5 hover:bg-accent hover:text-black transition-all duration-300 transform hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="p-3 rounded-full bg-white/5 hover:bg-accent hover:text-black transition-all duration-300 transform hover:scale-110"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
        <p className="mb-3 max-w-4xl mx-auto">
          As informações apresentadas nesta página têm caráter meramente informativo e não
          constituem qualquer tipo de aconselhamento de investimentos. Rentabilidade passada não é
          garantia de rentabilidade futura.
        </p>
        <p>&copy; {new Date().getFullYear()} Assessores XP. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
