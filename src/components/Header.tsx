import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isHomePage = location.pathname === '/'

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/#')) return false
    return location.pathname.startsWith(path)
  }

  const getNavLinkClass = (path: string) =>
    cn(
      'text-sm font-medium transition-colors',
      isLinkActive(path) ? 'text-[#4da2ff]' : 'text-white/90 hover:text-[#4da2ff]',
    )

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header
      className={cn(
        'w-full fixed top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#111111]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent py-5',
      )}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-2xl tracking-tighter flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white transition-transform group-hover:scale-110"
              >
                <path
                  d="M4 20L10 4L16 20M10 4L16 12L22 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Argentum
            </span>
          </div>
          <div className="h-6 w-px bg-white/30 hidden sm:block"></div>
          <div className="bg-white text-black font-black px-2 py-0.5 rounded-sm text-sm tracking-tighter hidden sm:block">
            xp
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/admin/painel-de-controle"
                className={getNavLinkClass('/admin/painel-de-controle')}
              >
                Dashboard
              </Link>
              <Link to="/configuracoes" className={getNavLinkClass('/configuracoes')}>
                A Argentum
              </Link>
              <Link to="/admin/assessores" className={getNavLinkClass('/admin/assessores')}>
                Assessores
              </Link>
              <Link to="/clientes" className={getNavLinkClass('/clientes')}>
                Clientes
              </Link>
              <Link to="/contatos" className={getNavLinkClass('/contatos')}>
                Contatos
              </Link>
            </>
          ) : user?.role === 'assessor' ? (
            <>
              <Link to="/meus-clientes" className={getNavLinkClass('/meus-clientes')}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <a
                href="/#argentum"
                className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
              >
                A Argentum
              </a>
              <a
                href="/#assessores"
                className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
              >
                Assessores
              </a>
              {isHomePage && (
                <a
                  href="/#contato"
                  className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
                >
                  Fale conosco
                </a>
              )}
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              {(user.role === 'assessor' || user.role === 'admin') && (
                <Link to="/perfil-do-avaliador" className={getNavLinkClass('/perfil-do-avaliador')}>
                  Meu Perfil
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              <Link to="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Área do Assessor
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#111111]/95 backdrop-blur-md border-b border-white/10 shadow-xl py-4 flex flex-col items-center gap-4 animate-in slide-in-from-top-2">
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/admin/painel-de-controle"
                className={getNavLinkClass('/admin/painel-de-controle')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/configuracoes"
                className={getNavLinkClass('/configuracoes')}
                onClick={() => setMobileMenuOpen(false)}
              >
                A Argentum
              </Link>
              <Link
                to="/admin/assessores"
                className={getNavLinkClass('/admin/assessores')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Assessores
              </Link>
              <Link
                to="/clientes"
                className={getNavLinkClass('/clientes')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Clientes
              </Link>
              <Link
                to="/contatos"
                className={getNavLinkClass('/contatos')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contatos
              </Link>
            </>
          ) : user?.role === 'assessor' ? (
            <>
              <Link
                to="/meus-clientes"
                className={getNavLinkClass('/meus-clientes')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <a
                href="/#argentum"
                className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                A Argentum
              </a>
              <a
                href="/#assessores"
                className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assessores
              </a>
              {isHomePage && (
                <a
                  href="/#contato"
                  className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fale conosco
                </a>
              )}
            </>
          )}

          {user ? (
            <div className="flex flex-col items-center gap-4 mt-2 pt-4 border-t border-white/10 w-full">
              {(user.role === 'assessor' || user.role === 'admin') && (
                <Link
                  to="/perfil-do-avaliador"
                  className={getNavLinkClass('/perfil-do-avaliador')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white transition-colors min-w-[120px]"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-2 pt-4 border-t border-white/10 w-full">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Área do Assessor
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
