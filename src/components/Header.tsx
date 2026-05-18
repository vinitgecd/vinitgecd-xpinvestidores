import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

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
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="/#argentum"
            className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
          >
            A Argentum
          </a>
          <a
            href="/#solucoes"
            className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
          >
            Soluções
          </a>
          <a
            href="/#assessores"
            className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
          >
            Assessores
          </a>
          <a
            href="/#contato"
            className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
          >
            Fale conosco
          </a>

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              <Link
                to={user.role === 'admin' ? '/clientes' : '/meus-clientes'}
                className="text-sm font-medium text-white/90 hover:text-[#4da2ff] transition-colors"
              >
                Dashboard
              </Link>
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
      </div>
    </header>
  )
}
