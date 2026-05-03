import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageCircle } from 'lucide-react'
import { redirectToWhatsApp } from '@/utils/whatsapp'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { getValue, getFileUrl, loading } = useSettings()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  const logoUrl = getFileUrl('header_logo')
  const companyName = getValue('header_company_name', 'XP Investimentos')
  const whatsappNumber = getValue('header_whatsapp_number', '')
  const whatsappIcon = getValue('header_whatsapp_icon', true)

  const handleWhatsAppClick = () => {
    if (whatsappNumber) {
      redirectToWhatsApp(whatsappNumber, 'Olá! Gostaria de falar com um atendente.')
    }
  }

  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : logoUrl ? (
            <img src={logoUrl} alt={companyName} className="h-8 w-auto object-contain" />
          ) : (
            <span className="font-bold text-xl tracking-tight">{companyName}</span>
          )}
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/clientes"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clientes
                  </Link>
                  <Link
                    to="/configuracoes"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Configurações
                  </Link>
                  <Link
                    to="/contatos"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contatos
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/meus-clientes"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Meus Clientes
                  </Link>
                  <Link
                    to="/assessor/profile"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/novo-cliente"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Novo Cliente
                  </Link>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
          {whatsappIcon && (
            <div className="border-l pl-4 ml-2">
              {!whatsappNumber ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block cursor-not-allowed">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full opacity-50"
                        disabled
                      >
                        <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número de WhatsApp não configurado</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={handleWhatsAppClick}
                    >
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Falar com atendimento</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
