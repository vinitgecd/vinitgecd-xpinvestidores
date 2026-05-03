import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useClientes } from '@/hooks/use-clientes'
import { getAllClientes, deleteCliente, updateCliente } from '@/services/clientes'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import {
  Users,
  DollarSign,
  Briefcase,
  Search,
  ArrowUpDown,
  Trash,
  Edit,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')
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
    <div className="container mx-auto py-8 px-4 space-y-8 animate-fade-in transition-all duration-300 ease-in-out">
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
            className="pl-10 h-11 transition-all duration-200 focus-visible:ring-primary focus-visible:ring-2 w-full bg-background"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wide">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort('nome')}
                  className="-ml-4 h-8 text-xs font-semibold uppercase tracking-wide"
                >
                  Nome <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Email</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Telefone
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort('valor_investido')}
                  className="-ml-4 h-8 text-xs font-semibold uppercase tracking-wide"
                >
                  Investimento <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Assessor
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort('created')}
                  className="-ml-4 h-8 text-xs font-semibold uppercase tracking-wide"
                >
                  Data <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-10 w-full animate-pulse rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data?.items?.map((c: any) => (
                <TableRow key={c.id} className="hover:bg-accent/30 transition-colors duration-200">
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.telefone}</TableCell>
                  <TableCell className="font-bold text-success">
                    {formatMoney(c.valor_investido)}
                  </TableCell>
                  <TableCell>{c.expand?.user_id?.name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(c.created)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditClient(c)}
                        className="transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                        onClick={() => setDeleteId(c.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full animate-pulse rounded-xl" />
          ))
        ) : data?.items?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border">
            Nenhum cliente encontrado.
          </div>
        ) : (
          data?.items?.map((c: any) => (
            <Card
              key={c.id}
              className="transition-all duration-200 hover:shadow-md border-border/50"
            >
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h4 className="text-base font-bold">{c.nome}</h4>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditClient(c)}
                      className="h-8 w-8 transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(c.id)}
                      className="h-8 w-8 text-destructive transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Telefone
                    </span>
                    <span className="font-medium">{c.telefone}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Assessor
                    </span>
                    <span className="font-medium">{c.expand?.user_id?.name || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Investimento
                  </span>
                  <span className="text-success font-bold text-xl">
                    {formatMoney(c.valor_investido)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <Button
            variant="outline"
            className="h-10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
                  className={`h-10 w-10 p-0 transition-transform hover:scale-[1.05] active:scale-[0.95] ${
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
            className="h-10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
            <AlertDialogCancel className="h-11 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground h-11 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sim, deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
