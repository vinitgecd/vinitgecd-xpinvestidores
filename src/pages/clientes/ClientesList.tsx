import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useClientes } from '@/hooks/use-clientes'
import { getAllClientes, deleteCliente, updateCliente } from '@/services/clientes'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import { Users, DollarSign, Briefcase, Search, ArrowUpDown, Trash, Edit } from 'lucide-react'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.valor)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Número de Assessores</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assessores}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm h-11"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('nome')} className="-ml-4">
                  Nome <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort('valor_investido')}
                  className="-ml-4"
                >
                  Investimento <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Assessor</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('created')} className="-ml-4">
                  Data <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mb-4 text-muted/50" />
                    <p className="text-lg font-medium mb-2">Nenhum cliente encontrado</p>
                    {search && (
                      <Button variant="outline" onClick={() => setSearch('')}>
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.items?.map((c: any) => (
                <TableRow key={c.id} className="md:table-row">
                  <TableCell className="md:hidden">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-base">{c.nome}</span>
                      <span className="text-sm text-muted-foreground">{c.email}</span>
                      <span className="text-sm text-muted-foreground">{c.telefone}</span>
                      <span className="font-medium text-primary mt-1">
                        {formatMoney(c.valor_investido)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Assessor: {c.expand?.user_id?.name || 'N/A'}
                      </span>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditClient(c)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(c.id)}
                          className="flex-1 text-destructive border-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" /> Deletar
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">{c.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">{c.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{c.telefone}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    {formatMoney(c.valor_investido)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {c.expand?.user_id?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(c.created)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditClient(c)}
                        aria-label="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteId(c.id)}
                        aria-label="Deletar"
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

      {data?.totalPages > 1 && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <Button
            variant="outline"
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próximo
          </Button>
        </div>
      )}

      <Dialog open={!!editClient} onOpenChange={(o) => !o && setEditClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {editClient && <ClienteForm defaultValues={editClient} onSubmit={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente será removido permanentemente do banco de
              dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
