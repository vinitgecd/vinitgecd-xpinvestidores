import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getAllAssessores, Assessor } from '@/services/assessores'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/hooks/use-realtime'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import pb from '@/lib/pocketbase/client'
import { RefreshCw, Users, ShieldAlert, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [assessores, setAssessores] = useState<Assessor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const data = await getAllAssessores()
      setAssessores(data)
      setError('')
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData()
    }
  }, [user])

  useRealtime('assessores', () => {
    if (user?.role === 'admin') loadData()
  })

  if (authLoading) return <div className="p-8">Carregando...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Você não tem permissão para acessar esta página.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Gerenciamento de assessores cadastrados.</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Assessor</th>
                  <th className="px-6 py-4">Especialidade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {assessores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Nenhum assessor encontrado.
                    </td>
                  </tr>
                ) : (
                  assessores.map((assessor) => {
                    const avatarUrl = assessor.foto_perfil
                      ? pb.files.getUrl(assessor, assessor.foto_perfil)
                      : `https://img.usecurling.com/ppl/thumbnail?seed=${assessor.id}`

                    return (
                      <tr key={assessor.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-200">
                            <AvatarImage src={avatarUrl} alt={assessor.nome} />
                            <AvatarFallback>{assessor.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{assessor.nome}</span>
                            <span className="text-xs text-gray-500 font-normal">
                              {assessor.whatsapp}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {assessor.especialidades || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={assessor.ativo ? 'default' : 'secondary'}
                            className={
                              assessor.ativo ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
                            }
                          >
                            {assessor.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(assessor.created).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
