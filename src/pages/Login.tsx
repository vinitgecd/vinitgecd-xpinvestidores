import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    setTimeout(() => navigate('/dashboard'), 0)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setError('E-mail e senha são obrigatórios.')
      return
    }

    setIsSubmitting(true)

    const result = await signIn(trimmedEmail, trimmedPassword)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#F5F5F5] px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-0 border-t-4 border-t-[#003366]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#003366]">Login</CardTitle>
          <CardDescription className="text-gray-500">
            Entre com suas credenciais de assessor ou administrador.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#333333]">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@xp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-[#003366]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#333333]">
                  Senha
                </Label>
                <Link
                  to="/esqueceu-senha"
                  className="text-sm font-medium text-[#003366] hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-[#003366]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#003366] hover:bg-[#002244] text-white transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
