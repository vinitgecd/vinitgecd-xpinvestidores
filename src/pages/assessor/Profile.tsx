import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getAssessorByUserId, updateAssessor, Assessor } from '@/services/assessores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldAlert, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const fields = [
  { id: 'nome', label: 'Nome Completo', req: true },
  { id: 'whatsapp', label: 'WhatsApp (com DDD)' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'formacao_academica', label: 'Formação Acadêmica' },
  { id: 'experiencia_profissional', label: 'Experiência Profissional' },
  { id: 'habilidades', label: 'Habilidades (separadas por vírgula)' },
  { id: 'certificacoes', label: 'Certificações (separadas por vírgula)' },
]

export default function AssessorProfile() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [assessor, setAssessor] = useState<Assessor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user?.role === 'assessor') {
      getAssessorByUserId(user.id)
        .then((data) => {
          setAssessor(data)
          const initial = fields.reduce(
            (acc, f) => ({ ...acc, [f.id]: (data as any)[f.id] || '' }),
            {},
          )
          setFormData(initial)
        })
        .catch(() => toast({ variant: 'destructive', title: 'Erro ao carregar perfil' }))
        .finally(() => setLoading(false))
    }
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assessor) return
    setSaving(true)
    setErrors({})
    try {
      const updated = await updateAssessor(assessor.id, formData)
      setAssessor(updated)
      toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso!' })
    } catch (err: any) {
      const fieldErrs = extractFieldErrors(err)
      if (Object.keys(fieldErrs).length > 0) setErrors(fieldErrs)
      else toast({ variant: 'destructive', title: 'Erro', description: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <div className="p-8">Carregando...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'assessor') {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Página restrita.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003366]">Meu Perfil</h1>
      </div>
      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-t-4 border-t-[#FF6B35]">
          <CardHeader>
            <CardTitle>Informações Públicas</CardTitle>
            <CardDescription>Estes dados serão visíveis para todos.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((f) => (
                <div
                  key={f.id}
                  className={`space-y-2 ${f.id === 'habilidades' || f.id === 'certificacoes' ? 'md:col-span-2' : ''}`}
                >
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input
                    id={f.id}
                    value={formData[f.id] || ''}
                    onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                    required={f.req}
                  />
                  {errors[f.id] && <p className="text-sm text-red-500">{errors[f.id]}</p>}
                </div>
              ))}
            </CardContent>
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#003366] hover:bg-[#002244] text-white gap-2"
              >
                <Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
