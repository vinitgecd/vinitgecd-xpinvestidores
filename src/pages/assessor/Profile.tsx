import { useEffect, useState, useRef } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  getAssessorByUserId,
  updateAssessor,
  getAssessorById,
  Assessor,
} from '@/services/assessores'
import pb from '@/lib/pocketbase/client'
import { formatPhoneInput, unformatPhone } from '@/utils/whatsapp'
import { updateAdvisorWhatsApp } from '@/services/contatos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldAlert, Save, Upload, Trash2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
  const { id: targetAssessorId } = useParams()
  const { toast } = useToast()
  const [assessor, setAssessor] = useState<Assessor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user?.role === 'assessor' || user?.role === 'admin') {
      const fetchPromise = targetAssessorId
        ? getAssessorById(targetAssessorId)
        : getAssessorByUserId(user.id)

      fetchPromise
        .then((data) => {
          setAssessor(data)
          const initial = fields.reduce((acc, f) => {
            const val = (data as any)[f.id] || ''
            return { ...acc, [f.id]: f.id === 'whatsapp' && val ? formatPhoneInput(val) : val }
          }, {})
          setFormData(initial)
          if (data.foto_perfil) {
            setPreviewUrl(pb.files.getURL(data, data.foto_perfil))
          }
        })
        .catch((err) => {
          if (err.status !== 404) {
            toast({ variant: 'destructive', title: 'Erro ao carregar perfil' })
          }
        })
        .finally(() => setLoading(false))
    } else if (user) {
      setLoading(false)
    }
  }, [user, toast, targetAssessorId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'A imagem deve ter no máximo 5MB.',
        })
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assessor) return
    setSaving(true)
    setErrors({})

    let whatsappUnformatted = ''
    if (formData.whatsapp) {
      whatsappUnformatted = unformatPhone(formData.whatsapp)
      if (whatsappUnformatted.length > 0 && whatsappUnformatted.length !== 11) {
        setErrors({ whatsapp: 'Número de telefone inválido. Use formato (XX) XXXXX-XXXX' })
        setSaving(false)
        return
      }
    }

    try {
      const payload = new FormData()

      Object.keys(formData).forEach((key) => {
        if (key === 'whatsapp') {
          payload.append(key, whatsappUnformatted)
        } else {
          payload.append(key, formData[key])
        }
      })

      if (selectedFile) {
        payload.append('foto_perfil', selectedFile)
      } else if (!previewUrl && assessor.foto_perfil) {
        payload.append('foto_perfil', '')
      }

      const updated = await updateAssessor(assessor.id, payload)
      if (whatsappUnformatted !== undefined && assessor.user_id) {
        try {
          await updateAdvisorWhatsApp(assessor.user_id, whatsappUnformatted)
        } catch (e: any) {
          console.error('Failed to update user whatsapp', e)
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: e.message || 'Erro ao conectar. Tente novamente',
          })
        }
      }
      setAssessor(updated)
      setSelectedFile(null)
      if (updated.foto_perfil) {
        setPreviewUrl(pb.files.getURL(updated, updated.foto_perfil))
      } else {
        setPreviewUrl(null)
      }
      toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso!' })
    } catch (err: any) {
      const fieldErrs = extractFieldErrors(err)
      if (Object.keys(fieldErrs).length > 0) setErrors(fieldErrs)
      else toast({ variant: 'destructive', title: 'Erro', description: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <div className="p-8 pt-24 text-center">Carregando...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'assessor' && user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-20 pt-32">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Página restrita a assessores e administradores.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!loading && !assessor) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <Alert variant="default" className="max-w-md mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Perfil não encontrado</AlertTitle>
          <AlertDescription>
            Nenhum perfil de assessor associado.
            {user.role === 'admin' && ' Como administrador, você pode não ter um perfil público.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#003366]">
          {targetAssessorId && user.role === 'admin' ? 'Editar Perfil do Assessor' : 'Meu Perfil'}
        </h1>
        {targetAssessorId && user.role === 'admin' && (
          <Button variant="outline" asChild>
            <Link to="/admin/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Dashboard
            </Link>
          </Button>
        )}
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
            <CardDescription>Estes dados serão visíveis para os clientes.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex flex-col gap-4 mb-4">
                <Label>Foto de Perfil</Label>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-2 border-gray-100">
                    <AvatarImage src={previewUrl || ''} className="object-cover" />
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary font-medium">
                      {formData.nome ? formData.nome.charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="foto_perfil"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Escolher Foto
                    </Label>
                    <Input
                      id="foto_perfil"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
                {errors.foto_perfil && <p className="text-sm text-red-500">{errors.foto_perfil}</p>}
              </div>

              {fields.map((f) => (
                <div
                  key={f.id}
                  className={`space-y-2 ${f.id === 'habilidades' || f.id === 'certificacoes' || f.id === 'experiencia_profissional' || f.id === 'formacao_academica' || f.id === 'especialidades' ? 'md:col-span-2' : ''}`}
                >
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input
                    id={f.id}
                    value={formData[f.id] || ''}
                    onChange={(e) => {
                      let val = e.target.value
                      if (f.id === 'whatsapp') {
                        val = formatPhoneInput(val)
                      }
                      setFormData({ ...formData, [f.id]: val })
                    }}
                    required={f.req}
                    maxLength={f.id === 'whatsapp' ? 18 : undefined}
                    placeholder={f.id === 'whatsapp' ? '(XX) XXXXX-XXXX' : undefined}
                    pattern={f.id === 'whatsapp' ? '[\\d\\s\\-\\(\\)\\+]+' : undefined}
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
