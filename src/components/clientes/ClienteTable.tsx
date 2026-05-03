import { Edit, Trash, ArrowUpDown } from 'lucide-react'
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

interface ClienteTableProps {
  data: any[]
  loading: boolean
  hideAssessorColumn?: boolean
  onEdit: (cliente: any) => void
  onDelete: (id: string) => void
  onSort?: (column: string) => void
}

export function ClienteTable({
  data,
  loading,
  hideAssessorColumn = false,
  onEdit,
  onDelete,
  onSort,
}: ClienteTableProps) {
  const formatMoney = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const formatDate = (d: string) => {
    if (!d) return 'N/A'
    return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  const SortableHeader = ({ column, label }: { column: string; label: string }) => {
    if (!onSort)
      return <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    return (
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="-ml-4 h-11 min-h-[44px] text-xs font-semibold uppercase tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {label} <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[20%]">
                <SortableHeader column="nome" label="Nome" />
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Email</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Telefone
              </TableHead>
              <TableHead>
                <SortableHeader column="valor_investido" label="Investimento" />
              </TableHead>
              {!hideAssessorColumn && (
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Assessor
                </TableHead>
              )}
              <TableHead>
                <SortableHeader column="created" label="Data" />
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
                  <TableCell colSpan={hideAssessorColumn ? 6 : 7}>
                    <Skeleton className="h-10 w-full animate-pulse rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={hideAssessorColumn ? 6 : 7}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data?.map((c: any) => (
                <TableRow key={c.id} className="hover:bg-accent/30 transition-colors duration-200">
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.telefone}</TableCell>
                  <TableCell className="font-bold text-success">
                    {formatMoney(c.valor_investido)}
                  </TableCell>
                  {!hideAssessorColumn && <TableCell>{c.expand?.user_id?.name || 'N/A'}</TableCell>}
                  <TableCell>{formatDate(c.created)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(c)}
                        className="h-11 w-11 transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 text-destructive transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                        onClick={() => onDelete(c.id)}
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
        ) : data?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border">
            Nenhum cliente encontrado.
          </div>
        ) : (
          data?.map((c: any) => (
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
                      onClick={() => onEdit(c)}
                      className="h-11 w-11 transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(c.id)}
                      className="h-11 w-11 text-destructive transition-transform duration-200 hover:scale-[1.05] active:scale-[0.95]"
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
                  {!hideAssessorColumn && (
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Assessor
                      </span>
                      <span className="font-medium">{c.expand?.user_id?.name || 'N/A'}</span>
                    </div>
                  )}
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
    </>
  )
}
