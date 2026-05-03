import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset, verifyResetCode } from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const emailSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

const codeSchema = z
  .object({
    code: z.string().length(6, 'O código deve ter exatamente 6 dígitos'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export default function EsqueceuSenha() {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  })

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setError('')
    try {
      await requestPasswordReset(values.email)
      setEmail(values.email)
      setStep('code')
      toast({
        title: 'Código enviado',
        description: 'Se o e-mail existir, você receberá um código em breve.',
      })
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar código.')
    }
  }

  const onCodeSubmit = async (values: z.infer<typeof codeSchema>) => {
    setError('')
    try {
      await verifyResetCode(email, values.code, values.password)
      setStep('success')
    } catch (err: any) {
      setError(err?.message || 'Código inválido ou expirado.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#F5F5F5] px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-0 border-t-4 border-t-[#003366]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#003366]">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-gray-500">
            {step === 'email' && 'Informe seu e-mail para receber o código.'}
            {step === 'code' && 'Informe o código recebido e a nova senha.'}
            {step === 'success' && 'Tudo certo com a sua conta!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nome@xp.com"
                          className="focus-visible:ring-[#003366]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#003366] hover:bg-[#002244] transition-colors"
                  disabled={emailForm.formState.isSubmitting}
                >
                  {emailForm.formState.isSubmitting ? 'Enviando...' : 'Enviar Código'}
                </Button>
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-[#003366] hover:underline">
                    Voltar para o Login
                  </Link>
                </div>
              </form>
            </Form>
          )}

          {step === 'code' && (
            <Form {...codeForm}>
              <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                <FormField
                  control={codeForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Código de 6 dígitos</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000000"
                          maxLength={6}
                          autoFocus
                          className="text-center tracking-widest text-lg font-mono focus-visible:ring-[#003366]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={codeForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          className="focus-visible:ring-[#003366]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={codeForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          className="focus-visible:ring-[#003366]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#003366] hover:bg-[#002244] transition-colors"
                  disabled={codeForm.formState.isSubmitting}
                >
                  {codeForm.formState.isSubmitting ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </form>
            </Form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-gray-700">Senha alterada com sucesso!</p>
              <Button
                asChild
                className="w-full bg-[#003366] hover:bg-[#002244] transition-colors mt-4"
              >
                <Link to="/login">Ir para o Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
