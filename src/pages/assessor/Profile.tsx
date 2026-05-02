import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getAssessorByUserId, updateAssessor, Assessor } from '@/services/assessores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldAlert, Save, CheckCircle2 } from 'lucide-react'

export default function AssessorProfile() {
  const { user, loading: authLoading } = useAuth()
  const [assessor, setAssessor] = useState<Assessor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    especialidades: '',
    habilidades: '',
    formacao_academica: '',
    experiencia_profissional: '',
    certificacoes: '',
    whatsapp: '',
  })

  useEffect(() => {
    if (user?.role === 'assessor') {
      const loadData = async () => {
        try {
          const data = await getAssessorByUserId(user.id)
          setAssessor(data)
          setFormData({
            nome: data.nome || '',
            especialidades: data.especialidades || '',
            habilidades: data.habilidades || '',
            formacao_academica: data.formacao_academica || '',
            experiencia_profissional: data.experiencia_profissional || '',
            certificacoes: data.certificacoes || '',
            whatsapp: data.whatsapp || '',
          })
        } catch (err: any) {
          setError('Perfil de assessor não encontrado. Contate o administrador.')
        } finally {
          setLoading(false)
        }
      }
      loadData()
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assessor) return

    setSaving(true)
    setError('')
    setSuccessMsg('')

    try {
      const updated = await updateAssessor(assessor.id, formData)
      setAssessor(updated)
      setSuccessMsg('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.')
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
          <AlertDescription>Página restrita a assessores.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003366]">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">
          Gerencie suas informações profissionais exibidas na página principal.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ) : error && !assessor ? (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Card className="border-t-4 border-t-[#FF6B35]">
          <CardHeader>
            <CardTitle>Informações Públicas</CardTitle>
            <CardDescription>
              Estes dados serão visíveis para todos os visitantes do site.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMsg && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>{successMsg}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="5511999999999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidades">Resumo da Especialidade</Label>
                <Input
                  id="especialidades"
                  name="especialidades"
                  value={formData.especialidades}
                  onChange={handleChange}
                  placeholder="Ex: Especialista em Renda Fixa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="formacao_academica">Formação Acadêmica</Label>
                  <Input
                    id="formacao_academica"
                    name="formacao_academica"
                    value={formData.formacao_academica}
                    onChange={handleChange}
                    placeholder="Ex: Economia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experiencia_profissional">Tempo de Experiência</Label>
                  <Input
                    id="experiencia_profissional"
                    name="experiencia_profissional"
                    value={formData.experiencia_profissional}
                    onChange={handleChange}
                    placeholder="Ex: 10 anos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="habilidades">Habilidades (separadas por vírgula)</Label>
                <Textarea
                  id="habilidades"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleChange}
                  placeholder="Ex: Gestão de Risco, Alocação de Ativos, Day Trade"
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificacoes">Certificações (separadas por vírgula)</Label>
                <Input
                  id="certificacoes"
                  name="certificacoes"
                  value={formData.certificacoes}
                  onChange={handleChange}
                  placeholder="Ex: CEA, CNPI, CFP"
                />
              </div>
            </CardContent>
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#003366] hover:bg-[#002244] text-white gap-2"
              >
                {saving ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
