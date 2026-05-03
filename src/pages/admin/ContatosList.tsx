import { Link, Navigate } from 'react-router-dom'
import { useContatos } from '@/hooks/use-contatos'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { deleteContato, updateContato } from '@/services/contatos'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function ContatosList() {
  const { user, loading: authLoading } = useAuth()
  const { contatos, loading: contatosLoading } = useContatos()

  if (authLoading) return null
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  const handleToggle = async (id: string, ativo: boolean) => {
    try {
      await updateContato(id, { ativo })
      toast.success('Status atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return
    try {
      await deleteContato(id)
      toast.success('Contato removido com sucesso!')
    } catch {
      toast.error('Erro ao remover contato')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Contatos</h1>
        <Link to="/contatos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Contato
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contatosLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : contatos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum contato cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                contatos.map((contato) => (
                  <TableRow key={contato.id}>
                    <TableCell>
                      <Badge variant={contato.tipo === 'whatsapp' ? 'default' : 'secondary'}>
                        {contato.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{contato.valor}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {contato.descricao}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={contato.ativo}
                        onCheckedChange={(c) => handleToggle(contato.id, c)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contato.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="block md:hidden divide-y">
          {contatos.map((contato) => (
            <div key={contato.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={contato.tipo === 'whatsapp' ? 'default' : 'secondary'}>
                  {contato.tipo}
                </Badge>
                <Switch
                  checked={contato.ativo}
                  onCheckedChange={(c) => handleToggle(contato.id, c)}
                />
              </div>
              <div>
                <p className="font-medium">{contato.valor}</p>
                {contato.descricao && (
                  <p className="text-sm text-muted-foreground">{contato.descricao}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(contato.id)}>
                  <Trash2 className="h-4 w-4 text-destructive mr-2" /> Excluir
                </Button>
              </div>
            </div>
          ))}
          {contatos.length === 0 && !contatosLoading && (
            <div className="p-8 text-center text-muted-foreground">Nenhum contato encontrado.</div>
          )}
        </div>
      </div>
    </div>
  )
}
