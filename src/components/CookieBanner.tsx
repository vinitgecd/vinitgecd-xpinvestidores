import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1A1A1A] border-t border-white/10 p-4 z-50 flex flex-col sm:flex-row items-center justify-between shadow-2xl animate-fade-in-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left text-xs md:text-sm text-gray-300">
          A Argentum Investimentos utiliza cookies para aprimorar sua experiência em nossos sites.
          Para saber mais informações basta conferir nossa Política de Cookies.
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#17a2b8] hover:text-[#17a2b8]/80 hover:bg-transparent text-xs p-0"
          >
            Política de Cookies
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#17a2b8] text-white hover:bg-[#138496] hover:text-white border-0 text-xs px-6"
            onClick={() => {
              localStorage.setItem('cookieConsent', 'true')
              setShow(false)
            }}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
