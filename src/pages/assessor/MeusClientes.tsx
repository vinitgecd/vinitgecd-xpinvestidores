import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Users, DollarSign, Calendar, Plus, AlertCircle } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useMeusClientes } from '@/hooks/use-clientes'
import { deleteCliente, updateCliente } from '@/services/clientes'

import { ClienteTable } from '@/components/clientes/ClienteTable'
import { ClienteForm } from '@/components/clientes/ClienteForm'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

export default function MeusClientes() {
  const { user, loading: userLoading } = useAuth()
  const { clients, stats, loading, error, refetch } = useMeusClientes()

  const [editClient, setEditClient] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (userLoading) return null
  if (!user || user.role !== 'assessor') return <Navigate to="/dashboard" replace />

  const formatMoney = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const formatDate = (d: string | null) => {
    if (!d) return '--/--/----'
    return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  const handleUpdate = async (values: any) => {
    try {
      await updateCliente(editClient.id, values)
      toast.success('Cliente atualizado com sucesso!')
      setEditClient(null)
      refetch()
    } catch {
      toast.error('Erro ao atualizar cliente')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCliente(deleteId)
      toast.success('Cliente deletado com sucesso!')
      setDeleteId(null)
      refetch()
    } catch {
      toast.error('Erro ao deletar cliente')
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center font-sans animate-fade-in">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar clientes</h2>
        <p className="text-muted-foreground mb-6">Ocorreu um problema ao buscar os seus dados.</p>
        <Button onClick={refetch} className="h-11 min-h-[44px]">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto pt-28 md:pt-32 pb-8 px-4 space-y-8 animate-fade-in transition-all duration-300 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Meus Clientes</h1>
        <Link to="/novo-cliente">
          <Button className="h-11 min-h-[44px] gap-2">
            <Plus className="h-5 w-5" /> Novo Cliente
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card rounded-lg border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Total de Clientes
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Valor Total Investido
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-32 mt-2" />
                ) : (
                  <p className="text-3xl font-bold mt-2 text-success">
                    {formatMoney(stats.valorInvestido)}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Data do Último Registro
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-24 mt-2" />
                ) : (
                  <p className="text-3xl font-bold mt-2">{formatDate(stats.ultimaData)}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!loading && clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed rounded-xl bg-secondary/20">
          <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Você ainda não registrou clientes</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Comece a construir sua carteira de clientes registrando o seu primeiro contato agora
            mesmo.
          </p>
          <Link to="/novo-cliente">
            <Button className="h-11 min-h-[44px] gap-2">
              <Plus className="h-5 w-5" /> Registrar Novo Cliente
            </Button>
          </Link>
        </div>
      ) : (
        <ClienteTable
          data={clients}
          loading={loading}
          hideAssessorColumn={true}
          onEdit={setEditClient}
          onDelete={setDeleteId}
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editClient} onOpenChange={(o) => !o && setEditClient(null)}>
        <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
          <div className="bg-card rounded-xl border border-border shadow-lg w-full">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-bold uppercase tracking-wide">
                Editar Cliente
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-4">
              {editClient && <ClienteForm defaultValues={editClient} onSubmit={handleUpdate} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive text-xl font-bold">
              Tem certeza?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente será removido permanentemente do banco de
              dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 min-h-[44px] transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground h-11 min-h-[44px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sim, deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
