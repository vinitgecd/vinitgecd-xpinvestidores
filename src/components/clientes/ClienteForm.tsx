import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato inválido. Use (XX) XXXXX-XXXX'),
  valor_investido: z.coerce
    .number()
    .min(0, 'Valor não pode ser negativo')
    .max(9999999.99, 'Valor maximo permitido: R$ 9.999.999,99'),
})

export function ClienteForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: any
  onSubmit: (v: any) => void
  loading?: boolean
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { nome: '', email: '', telefone: '', valor_investido: 0 },
  })

  const maskPhone = (val: string) => {
    let v = val.replace(/\D/g, '')
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    if (v.length > 7) v = v.replace(/(\d{4,5})(\d{4})$/, '$1-$2')
    return v
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                Nome Completo
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do cliente"
                  className="h-11 transition-all duration-200 focus-visible:ring-primary focus-visible:ring-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold uppercase tracking-wide">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="cliente@exemplo.com"
                  className="h-11 transition-all duration-200 focus-visible:ring-primary focus-visible:ring-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                Telefone
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="(11) 99999-9999"
                  value={value}
                  onChange={(e) => onChange(maskPhone(e.target.value))}
                  className="h-11 transition-all duration-200 focus-visible:ring-primary focus-visible:ring-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor_investido"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                Valor Investido (R$)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="R$ 0,00"
                  value={formatCurrency(Number(value))}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '')
                    onChange(Number(digits) / 100)
                  }}
                  className="h-11 text-right transition-all duration-200 focus-visible:ring-primary focus-visible:ring-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
            </>
          ) : (
            'Salvar Cliente'
          )}
        </Button>
      </form>
    </Form>
  )
}
