import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Sobre', href: '#assessores' },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-[20px] md:px-[40px] lg:px-[60px]">
        <a
          href="#home"
          onClick={(e) => handleScroll(e, '#home')}
          className="flex items-center space-x-2"
        >
          <span className="text-xl font-bold tracking-tight text-[#003366]">XP Investimentos</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="transition-colors duration-300 ease-in-out hover:text-[#FF6B35] font-semibold text-[#333333]"
            >
              {link.name}
            </a>
          ))}
          {user ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="text-[#003366] border-[#003366]"
                onClick={() =>
                  navigate(user.role === 'admin' ? '/admin/dashboard' : '/assessor/profile')
                }
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  signOut()
                  navigate('/')
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Sair
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="text-[#003366] border-[#003366]"
              onClick={() => navigate('/login')}
            >
              Área do Assessor
            </Button>
          )}
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-[#003366]">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-white border-l">
            <SheetTitle className="text-left mb-6 font-bold text-[#003366]">
              XP Investimentos
            </SheetTitle>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-lg font-medium text-[#333333] hover:text-[#FF6B35] transition-colors duration-300 ease-in-out"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-6 border-t flex flex-col space-y-4">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full text-[#003366] border-[#003366]"
                      onClick={() => {
                        setIsOpen(false)
                        navigate(user.role === 'admin' ? '/admin/dashboard' : '/assessor/profile')
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                        navigate('/')
                      }}
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-[#003366] border-[#003366]"
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/login')
                    }}
                  >
                    Área do Assessor
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
