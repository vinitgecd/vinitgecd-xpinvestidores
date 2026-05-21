import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getAllAssessores, Assessor } from '@/services/assessores'
import { deleteAdvisor } from '@/services/users'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteAdvisorDialog } from '@/components/ConfirmDeleteAdvisorDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { RefreshCw, ShieldAlert, Plus, Edit, Trash2, User as UserIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AssessorFormDialog } from './AssessorFormDialog'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [assessores, setAssessores] = useState<Assessor[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAssessor, setEditingAssessor] = useState<Assessor | null>(null)

  const [advisorToDelete, setAdvisorToDelete] = useState<Assessor | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async () => {
    try {
      const data = await getAllAssessores()
      setAssessores(data)
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') loadData()
  }, [user])

  useRealtime('assessores', () => {
    if (user?.role === 'admin') loadData()
  })

  const handleDeleteClick = (assessor: Assessor) => {
    setAdvisorToDelete(assessor)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!advisorToDelete) return
    setIsDeleting(true)
    try {
      await deleteAdvisor(advisorToDelete.id)
      toast({ title: 'Sucesso', description: 'Assessor deletado com sucesso!' })
      setDeleteDialogOpen(false)
      loadData()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível deletar o assessor.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setAdvisorToDelete(null)
    setDeleteDialogOpen(false)
  }

  const openEdit = (a: Assessor) => {
    setEditingAssessor(a)
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingAssessor(null)
    setDialogOpen(true)
  }

  if (authLoading) return <div className="p-8">Carregando...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') {
    return (
      <div className="flex-1 w-full bg-gray-50 flex justify-center px-4 pt-32 pb-20">
        <Alert variant="destructive" className="max-w-md h-fit">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Você não tem permissão para acessar esta página.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full bg-gray-50">
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Dashboard Admin</h1>
            <p className="text-gray-500 mt-1">Gerenciamento de assessores cadastrados.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="gap-2 flex-1 sm:flex-none"
            >
              <RefreshCw className="h-4 w-4" /> Atualizar
            </Button>
            <Button
              onClick={openCreate}
              size="sm"
              className="bg-[#003366] text-white hover:bg-[#002244] gap-2 flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4" /> Novo Assessor
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Especialidade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
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
                  assessores.map((assessor) => (
                    <tr key={assessor.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{assessor.nome}</td>
                      <td className="px-6 py-4 text-gray-600">{assessor.especialidades || '-'}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={assessor.ativo ? 'default' : 'secondary'}
                          className={assessor.ativo ? 'bg-green-100 text-green-800' : ''}
                        >
                          {assessor.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/perfil-do-avaliador/${assessor.id}`} title="Ver Perfil">
                            <UserIcon className="h-4 w-4 text-green-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(assessor)}
                          title="Editar rápido"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(assessor)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <AssessorFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          assessor={editingAssessor}
          onSuccess={loadData}
        />
        <ConfirmDeleteAdvisorDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            if (!open && !isDeleting) handleCancelDelete()
          }}
          onConfirm={handleConfirmDelete}
          advisorName={advisorToDelete?.nome}
          isLoading={isDeleting}
        />
      </div>
    </div>
  )
}
