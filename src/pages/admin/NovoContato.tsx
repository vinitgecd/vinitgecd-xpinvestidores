import { useNavigate, Navigate, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createContato } from '@/services/contatos'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

const contatoSchema = z
  .object({
    tipo: z.enum(['whatsapp', 'email', 'telefone']),
    valor: z.string().min(1, 'Valor é obrigatório'),
    descricao: z.string().max(200, 'Máximo 200 caracteres').optional(),
    ativo: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'whatsapp') {
      const digits = data.valor.replace(/\D/g, '')
      if (digits.length < 10 || digits.length > 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Formato inválido. Use (XX) XXXXX-XXXX',
          path: ['valor'],
        })
      }
    }
  })

type ContatoFormValues = z.infer<typeof contatoSchema>

export default function NovoContato() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const form = useForm<ContatoFormValues>({
    resolver: zodResolver(contatoSchema),
    defaultValues: {
      tipo: 'whatsapp',
      valor: '',
      descricao: '',
      ativo: true,
    },
  })

  if (loading) return null
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  const onSubmit = async (data: ContatoFormValues) => {
    try {
      await createContato(data)
      toast.success('Contato adicionado com sucesso!')
      navigate('/contatos')
    } catch {
      toast.error('Erro ao salvar contato')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/contatos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Novo Contato</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (Número ou E-mail)</FormLabel>
                    <FormControl>
                      <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Breve descrição (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Salvar Contato
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
