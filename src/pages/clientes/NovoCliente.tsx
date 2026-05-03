import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createCliente } from '@/services/clientes'
import { useAuth } from '@/hooks/use-auth'
import { ClienteForm } from '@/components/clientes/ClienteForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export default function NovoCliente() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Wait for user to be loaded
  if (!user) return null

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await createCliente({
        ...values,
        user_id: user.id,
        status: 'Confirmado',
      })
      toast.success('Cliente registrado com sucesso!')

      if (user.role === 'admin') {
        navigate('/clientes')
      } else {
        navigate('/assessor/profile')
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Novo Cliente</CardTitle>
          <CardDescription>
            Cadastre as informações e o valor investido do novo cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
