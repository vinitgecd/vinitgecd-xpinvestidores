import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createUser } from '@/services/users'
import { createAssessor, updateAssessor, Assessor } from '@/services/assessores'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { ScrollArea } from '@/components/ui/scroll-area'

const fields = [
  { id: 'nome', label: 'Nome Completo', req: true },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'formacao_academica', label: 'Formação Acadêmica' },
  { id: 'experiencia_profissional', label: 'Experiência' },
  { id: 'certificacoes', label: 'Certificações' },
  { id: 'whatsapp', label: 'WhatsApp' },
]

export function AssessorFormDialog({
  open,
  onOpenChange,
  assessor,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  assessor: Assessor | null
  onSuccess: () => void
}) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({ ativo: true })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (assessor) {
        setFormData({ ...assessor })
      } else {
        setFormData({ ativo: true, email: '', password: '' })
      }
      setErrors({})
    }
  }, [open, assessor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      let dataToSave = { ...formData }
      if (!assessor) {
        const user = await createUser({
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.password,
          role: 'assessor',
          name: formData.nome,
        })
        dataToSave.user_id = user.id
      }
      delete dataToSave.email
      delete dataToSave.password

      if (assessor) {
        await updateAssessor(assessor.id, dataToSave)
        if (dataToSave.whatsapp !== undefined) {
          try {
            await pb.collection('users').update(assessor.user_id, { whatsapp: dataToSave.whatsapp })
          } catch (e) {
            console.error('Failed to update user whatsapp', e)
          }
        }
        toast({ title: 'Assessor atualizado!' })
      } else {
        const newAssessor = await createAssessor(dataToSave)
        if (dataToSave.whatsapp !== undefined && newAssessor.user_id) {
          try {
            await pb
              .collection('users')
              .update(newAssessor.user_id, { whatsapp: dataToSave.whatsapp })
          } catch (e) {
            console.error('Failed to update user whatsapp', e)
          }
        }
        toast({ title: 'Assessor criado!' })
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      const fieldErrs = extractFieldErrors(err)
      if (Object.keys(fieldErrs).length > 0) setErrors(fieldErrs)
      else toast({ variant: 'destructive', title: 'Erro', description: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle>{assessor ? 'Editar Assessor' : 'Novo Assessor'}</DialogTitle>
            <DialogDescription>
              {assessor
                ? 'Altere os dados do assessor.'
                : 'Crie um novo usuário e perfil de assessor.'}
            </DialogDescription>
          </DialogHeader>
        </div>
        <ScrollArea className="flex-1 px-6">
          <form id="assessor-form" onSubmit={handleSubmit} className="space-y-4 pb-6">
            {!assessor && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Senha *</Label>
                  <Input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.id} className="space-y-2">
                  <Label>
                    {f.label} {f.req && '*'}
                  </Label>
                  <Input
                    value={formData[f.id] || ''}
                    onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                    required={f.req}
                  />
                  {errors[f.id] && <p className="text-sm text-red-500">{errors[f.id]}</p>}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(v) => setFormData({ ...formData, ativo: v })}
              />
              <Label>Assessor Ativo</Label>
            </div>
          </form>
        </ScrollArea>
        <div className="p-6 pt-4 border-t flex justify-end gap-2 bg-gray-50 rounded-b-lg">
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancelar
          </Button>
          <Button type="submit" form="assessor-form" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
