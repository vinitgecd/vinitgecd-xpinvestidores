import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '@/services/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
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

const changeSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export default function AlterarSenha() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [error, setError] = useState('')

  const form = useForm<z.infer<typeof changeSchema>>({
    resolver: zodResolver(changeSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  if (!user) {
    setTimeout(() => navigate('/login'), 0)
    return null
  }

  const onSubmit = async (values: z.infer<typeof changeSchema>) => {
    setError('')
    try {
      await changePassword(values.password)
      toast({
        title: 'Sucesso',
        description: 'Sua senha foi alterada com sucesso!',
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Não foi possível alterar a senha.')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-md mt-10">
      <Card className="w-full shadow-lg border-0 border-t-4 border-t-[#003366]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#003366]">
            Alterar Senha
          </CardTitle>
          <CardDescription className="text-gray-500">
            Atualize sua senha de acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#003366] hover:bg-[#002244] transition-colors"
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
