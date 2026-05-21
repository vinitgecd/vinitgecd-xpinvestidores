import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckCircle, Edit, Trash2, XCircle } from 'lucide-react'

import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

export default function AssessoresList() {
  const [assessores, setAssessores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadAssessores = async () => {
    try {
      const records = await pb.collection('assessores').getFullList({
        sort: '-created',
        expand: 'user_id',
      })
      setAssessores(records)
    } catch (error) {
      toast.error('Erro ao carregar assessores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssessores()
  }, [])

  useRealtime('assessores', () => {
    loadAssessores()
  })

  const handleDelete = async (id: string) => {
    try {
      await pb.collection('assessores').delete(id)
      toast.success('Assessor excluído com sucesso')
    } catch (error) {
      toast.error('Erro ao excluir assessor')
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await pb.collection('assessores').update(id, { ativo: !currentStatus })
      toast.success(`Status alterado para ${!currentStatus ? 'Ativo' : 'Inativo'}`)
    } catch (error) {
      toast.error('Erro ao alterar status')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assessores</h1>
          <p className="text-slate-500 mt-2">
            Gerencie os assessores de investimentos da plataforma.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum assessor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              assessores.map((assessor) => (
                <TableRow key={assessor.id}>
                  <TableCell className="font-medium">{assessor.nome}</TableCell>
                  <TableCell>{assessor.especialidades || '-'}</TableCell>
                  <TableCell>{assessor.whatsapp || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(assessor.id, assessor.ativo)}
                      className={assessor.ativo ? 'text-green-600' : 'text-red-600'}
                    >
                      {assessor.ativo ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" /> Ativo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" /> Inativo
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/perfil-do-avaliador/${assessor.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Assessor?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O assessor será permanentemente
                              removido do sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(assessor.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
