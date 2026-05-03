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
import { AlertTriangle, Loader2 } from 'lucide-react'

interface ConfirmDeleteAdvisorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  advisorName?: string
  isLoading?: boolean
}

export function ConfirmDeleteAdvisorDialog({
  open,
  onOpenChange,
  onConfirm,
  advisorName,
  isLoading,
}: ConfirmDeleteAdvisorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        onEscapeKeyDown={(e: any) => {
          if (isLoading) e.preventDefault()
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 font-bold text-xl">
            <AlertTriangle className="h-5 w-5" />
            Excluir Assessor?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-700 mt-4 space-y-4 text-left">
            <span className="block">
              Tem certeza que deseja excluir <strong>{advisorName}</strong>? Os clientes registrados
              por este assessor serão mantidos, mas a associação com o assessor será removida.
            </span>
            <span className="block bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm font-medium">
              Aviso: Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel disabled={isLoading} onClick={() => onOpenChange(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Assessor'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
