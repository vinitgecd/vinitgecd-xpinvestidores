import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useClientes } from '@/hooks/use-clientes'
import { getAllClientes, deleteCliente, updateCliente } from '@/services/clientes'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import { Users, DollarSign, Briefcase, Search, TrendingUp, TrendingDown } from 'lucide-react'

import { Input } from '@/components/ui/input'
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
import { ClienteForm } from '@/components/clientes/ClienteForm'
import { ClienteTable } from '@/components/clientes/ClienteTable'

export default function ClientesList() {
  const { user, loading: userLoading } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [sort, setSort] = useState('-created')

  const filter = debouncedSearch
    ? `nome ~ "${debouncedSearch}" || email ~ "${debouncedSearch}" || telefone ~ "${debouncedSearch}"`
    : ''

  const { data, loading, refetch } = useClientes(filter, sort, page, 20)
  const [stats, setStats] = useState({ total: 0, valor: 0, assessores: 0 })
  const [editClient, setEditClient] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === 'admin') {
      getAllClientes()
        .then((res) => {
          const assessores = new Set(res.map((c) => c.user_id))
          const total = res.reduce((acc, c) => acc + (c.valor_investido || 0), 0)
          setStats({ total: res.length, valor: total, assessores: assessores.size })
        })
        .catch(console.error)
    }
  }, [data, user])

  if (userLoading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />

  const formatMoney = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const toggleSort = (col: string) => setSort(sort === col ? `-${col}` : col)

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

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 animate-fade-in transition-all duration-300 ease-in-out font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-transparent shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Total de Clientes
                </p>
                <h3 className="text-3xl font-bold">{stats.total}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center text-info">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +5.2%
              </span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-transparent shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Total Investido
                </p>
                <h3 className="text-3xl font-bold">{formatMoney(stats.valor)}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +12.5%
              </span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-transparent shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Assessores Ativos
                </p>
                <h3 className="text-3xl font-bold">{stats.assessores}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-destructive font-medium flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" /> -1.0%
              </span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-secondary/30 p-4 rounded-xl flex flex-wrap items-center gap-4 border border-border/50">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 transition-all duration-200 focus-visible:ring-primary focus-visible:ring-2 w-full bg-background min-h-[44px]"
          />
        </div>
      </div>

      <ClienteTable
        data={data?.items || []}
        loading={loading}
        onEdit={setEditClient}
        onDelete={setDeleteId}
        onSort={toggleSort}
        hideAssessorColumn={false}
      />

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <Button
            variant="outline"
            className="h-11 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>

          <div className="flex items-center space-x-1 hidden sm:flex">
            {Array.from({ length: data.totalPages }).map((_, i) => {
              const p = i + 1
              return (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'ghost'}
                  className={`h-11 w-11 p-0 transition-transform hover:scale-[1.05] active:scale-[0.95] ${
                    page === p ? 'bg-primary text-primary-foreground font-bold shadow-sm' : ''
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            className="h-11 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próximo
          </Button>
        </div>
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
            <AlertDialogTitle className="animate-shake text-destructive text-xl font-bold">
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
