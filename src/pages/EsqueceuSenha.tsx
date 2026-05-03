import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset, verifyResetCode } from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, KeyRound, ArrowLeft, Check } from 'lucide-react'
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'

const emailSchema = z.object({ email: z.string().email('E-mail inválido') })
const codeSchema = z
  .object({
    code: z.string().length(6, 'O código deve ter 6 dígitos'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não coincidem',
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

  const pwd = codeForm.watch('password')
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

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setError('')
    try {
      await requestPasswordReset(values.email)
      setEmail(values.email)
      setStep('code')
      toast({ title: 'Código enviado', description: 'Verifique seu e-mail.' })
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

  const stepIdx = step === 'email' ? 0 : step === 'code' ? 1 : 2

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-secondary/40 px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md shadow-sm border-border p-2 md:p-6 bg-card rounded-lg relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Recuperar Senha
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              {step === 'email' && 'Informe seu e-mail para receber o código de 6 dígitos.'}
              {step === 'code' && 'Insira o código recebido e crie sua nova senha.'}
              {step === 'success' && 'Sua senha foi redefinida com sucesso!'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-10 relative px-2">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-secondary -z-10 -translate-y-1/2" />
            <div
              className="absolute left-0 top-1/2 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out"
              style={{ width: `${(stepIdx / 2) * 100}%` }}
            />
            {['Email', 'Código', 'Sucesso'].map((s, i) => (
              <div
                key={s}
                className="flex flex-col items-center gap-2 z-10"
                aria-label={`Step: ${s}`}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    i < stepIdx
                      ? 'bg-success text-success-foreground shadow-sm'
                      : i === stepIdx
                        ? 'bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20'
                        : 'bg-card text-muted-foreground border-2 border-secondary',
                  )}
                >
                  {i < stepIdx ? <Check className="w-4 h-4" /> : i + 1}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-5 animate-slide-in-right"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        E-mail cadastrado
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="nome@xp.com" className="h-12 md:h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 md:h-11 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={emailForm.formState.isSubmitting}
                >
                  {emailForm.formState.isSubmitting ? 'Enviando...' : 'Enviar Código'}
                </Button>
                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Login
                  </Link>
                </div>
              </form>
            </Form>
          )}

          {step === 'code' && (
            <Form {...codeForm}>
              <form
                onSubmit={codeForm.handleSubmit(onCodeSubmit)}
                className="space-y-6 animate-slide-in-right"
              >
                <FormField
                  control={codeForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground self-start">
                        Código de 6 dígitos
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field} autoFocus>
                          <InputOTPGroup>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className="h-12 w-10 sm:w-12 sm:h-14 text-lg font-mono font-bold text-foreground"
                                aria-label={`Digit ${i + 1}`}
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-5">
                  <FormField
                    control={codeForm.control}
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
                    control={codeForm.control}
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
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 md:h-11 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={codeForm.formState.isSubmitting}
                >
                  {codeForm.formState.isSubmitting ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </form>
            </Form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-8 py-6 animate-slide-in-right">
              <div className="w-24 h-24 bg-success/15 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <p className="text-center text-foreground font-bold text-xl">
                Pronto! Sua senha foi alterada.
              </p>
              <Button
                asChild
                className="w-full h-12 md:h-11 bg-success hover:bg-success/90 text-success-foreground hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to="/login">Acessar minha conta</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
