import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl tracking-tight">
          XP Landing
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
                </>
              ) : (
                <>
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
        </nav>
      </div>
    </header>
  )
}
