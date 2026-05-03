import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '@/services/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ShieldCheck } from 'lucide-react'
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
import { cn } from '@/lib/utils'

const changeSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

const calculateStrength = (pass: string) => {
  let score = 0
  if (!pass) return 0
  if (pass.length > 5) score += 1
  if (pass.length > 8) score += 1
  if (/[A-Z]/.test(pass)) score += 1
  if (/[0-9]/.test(pass)) score += 1
  if (/[^A-Za-z0-9]/.test(pass)) score += 1
  return Math.min(score, 4)
}

export default function AlterarSenha() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [error, setError] = useState('')

  const form = useForm<z.infer<typeof changeSchema>>({
    resolver: zodResolver(changeSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const pwd = form.watch('password')
  const strength = useMemo(() => calculateStrength(pwd), [pwd])
  const strengthText =
    strength <= 1 ? 'Fraca' : strength === 2 ? 'Razoável' : strength === 3 ? 'Boa' : 'Forte'
  const strengthColor =
    strength === 0
      ? 'bg-secondary'
      : strength <= 1
        ? 'bg-destructive'
        : strength === 2
          ? 'bg-warning'
          : 'bg-success'
  const strengthProgress =
    strength === 0 ? 0 : strength <= 1 ? 25 : strength === 2 ? 50 : strength === 3 ? 75 : 100

  if (!user) {
    setTimeout(() => navigate('/login'), 0)
    return null
  }

  const onSubmit = async (values: z.infer<typeof changeSchema>) => {
    setError('')
    try {
      await changePassword(values.password)
      toast({ title: 'Sucesso', description: 'Sua senha foi alterada com sucesso!' })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Não foi possível alterar a senha.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-secondary/40 px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md shadow-sm border-border p-2 md:p-6 bg-card rounded-lg relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Alterar Senha
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              Crie uma nova senha segura para sua conta.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 animate-slide-in-right"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Nova Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        className="h-12 md:h-11"
                        {...field}
                      />
                    </FormControl>
                    {pwd && (
                      <div className="pt-1.5 space-y-2 animate-fade-in">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-muted-foreground">Força da senha</span>
                          <span
                            className={cn(
                              strength <= 1
                                ? 'text-destructive'
                                : strength === 2
                                  ? 'text-warning'
                                  : 'text-success',
                            )}
                          >
                            {strengthText}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all duration-500 ease-out',
                              strengthColor,
                            )}
                            style={{ width: `${strengthProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Confirmar Nova Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        className="h-12 md:h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto h-12 md:h-11 text-primary hover:bg-primary/5 hover:underline font-semibold transition-all duration-200"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-12 md:h-11 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
