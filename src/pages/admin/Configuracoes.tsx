import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react'
import { Navigate } from 'react-router-dom'

import { useSettings } from '@/hooks/use-settings'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/use-auth'
import { updateSettingByKey, updateSettingFileByKey } from '@/services/settings'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'

// Validation Schemas
const headerSchema = z.object({
  companyName: z.string().min(1, 'Obrigatório').max(100, 'Máximo 100 caracteres'),
  whatsappNumber: z
    .string()
    .min(1, 'Obrigatório')
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 11
    }, 'Número de WhatsApp inválido'),
  whatsappIcon: z.boolean().default(true),
})

const footerSchema = z.object({
  address: z.string().min(1, 'Obrigatório').max(200, 'Máximo 200 caracteres'),
  phone: z.string().min(14, 'Obrigatório'),
  email: z.string().email('E-mail inválido'),
  copyright: z.string().max(400, 'Máximo 400 caracteres').optional().default(''),
  socialLinks: z.array(
    z.object({
      platform: z.string().min(1, 'Selecione uma plataforma'),
      url: z.string().url('URL inválida'),
    }),
  ),
})

export default function Configuracoes() {
  const { getValue, getFileUrl, loading, updateSetting } = useSettings()
  const { user, loading: authLoading } = useAuth()

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Configurações do Site</h1>
        <p className="text-slate-500 mt-2">
          Gerencie o cabeçalho, rodapé e as informações de contato do site.
        </p>
      </div>

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="header">Cabeçalho</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
          <HeaderSettings
            companyName={getValue('header_company_name', '')}
            logoUrl={getFileUrl('header_logo')}
            whatsappNumber={getValue('header_whatsapp_number', '')}
            whatsappIcon={getValue('header_whatsapp_icon', true)}
            userId={user?.id || ''}
            updateSetting={updateSetting}
          />
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <FooterSettings
            initialData={{
              address: getValue('footer_address', ''),
              phone: getValue('footer_phone', ''),
              email: getValue('footer_email', ''),
              copyright: getValue('footer_copyright', ''),
              socialLinks: getValue('footer_social_links', []),
            }}
            userId={user?.id || ''}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HeaderSettings({
  companyName,
  logoUrl,
  whatsappNumber,
  whatsappIcon,
  userId,
  updateSetting,
}: {
  companyName: string
  logoUrl: string | null
  whatsappNumber: string
  whatsappIcon: boolean
  userId: string
  updateSetting: (key: string, value: any, updatedBy: string) => Promise<void>
}) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof headerSchema>>({
    resolver: zodResolver(headerSchema),
    defaultValues: { companyName, whatsappNumber, whatsappIcon },
  })

  const watchName = form.watch('companyName')
  const watchPhone = form.watch('whatsappNumber')
  const watchIcon = form.watch('whatsappIcon')
  const lastSavedName = useRef(companyName)
  const lastSavedPhone = useRef(whatsappNumber)
  const lastSavedIcon = useRef(whatsappIcon)

  useEffect(() => {
    if (watchName === lastSavedName.current) return
    const timer = setTimeout(async () => {
      const isValid = await form.trigger('companyName')
      if (isValid) {
        lastSavedName.current = watchName
        try {
          await updateSetting('header_company_name', watchName, userId)
          toast.success('Nome da empresa atualizado com sucesso!')
        } catch {
          toast.error('Erro ao atualizar nome da empresa.')
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [watchName, form, userId, updateSetting])

  useEffect(() => {
    if (watchPhone === lastSavedPhone.current) return
    const timer = setTimeout(async () => {
      const isValid = await form.trigger('whatsappNumber')
      if (isValid) {
        lastSavedPhone.current = watchPhone
        try {
          await updateSetting('header_whatsapp_number', watchPhone, userId)
          toast.success('Número de WhatsApp atualizado com sucesso!')
        } catch {
          toast.error('Não foi possível atualizar o WhatsApp')
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [watchPhone, form, userId, updateSetting])

  useEffect(() => {
    if (watchIcon === lastSavedIcon.current) return
    const timer = setTimeout(async () => {
      const isValid = await form.trigger('whatsappIcon')
      if (isValid) {
        lastSavedIcon.current = watchIcon
        try {
          await updateSetting('header_whatsapp_icon', watchIcon, userId)
          toast.success('Ícone WhatsApp atualizado com sucesso!')
        } catch {
          toast.error('Não foi possível atualizar o WhatsApp')
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [watchIcon, form, userId, updateSetting])

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, onChange: (v: string) => void) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 11) value = value.slice(0, 11)
      if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`
      if (value.length > 10) value = `${value.slice(0, 10)}-${value.slice(10)}`
      onChange(value)
    },
    [],
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB.')
      return
    }

    setIsUploading(true)
    try {
      await updateSettingFileByKey('header_logo', file, userId)
      toast.success('Logo atualizado com sucesso!')
    } catch {
      toast.error('Erro ao fazer upload do logo.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveLogo = async () => {
    try {
      await updateSettingFileByKey('header_logo', null, userId)
      toast.success('Logo removido com sucesso!')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      toast.error('Erro ao remover logo.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo e Identidade</CardTitle>
        <CardDescription>Configure a marca que aparece no topo do site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Logo do Site</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-24 w-24 rounded-lg border-2 border-dashed flex items-center justify-center bg-slate-50 overflow-hidden relative">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  {isUploading ? 'Enviando...' : 'Fazer Upload'}
                </Button>
                {logoUrl && (
                  <Button type="button" variant="destructive" size="sm" onClick={handleRemoveLogo}>
                    Remover
                  </Button>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: XP Investimentos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(XX) XXXXX-XXXX"
                        onChange={(e) => handlePhoneChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whatsappIcon"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Exibir ícone WhatsApp no cabeçalho</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function FooterSettings({
  initialData,
  userId,
}: {
  initialData: z.infer<typeof footerSchema>
  userId: string
}) {
  const form = useForm<z.infer<typeof footerSchema>>({
    resolver: zodResolver(footerSchema),
    defaultValues: initialData,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socialLinks',
  })

  const watchAll = form.watch()
  const lastSaved = useRef(watchAll)

  useEffect(() => {
    if (JSON.stringify(watchAll) === JSON.stringify(lastSaved.current)) return

    const timer = setTimeout(async () => {
      const isValid = await form.trigger()
      if (!isValid) return

      const updates = []
      if (watchAll.address !== lastSaved.current.address) {
        updates.push(updateSettingByKey('footer_address', watchAll.address, userId))
      }
      if (watchAll.phone !== lastSaved.current.phone) {
        updates.push(updateSettingByKey('footer_phone', watchAll.phone, userId))
      }
      if (watchAll.email !== lastSaved.current.email) {
        updates.push(updateSettingByKey('footer_email', watchAll.email, userId))
      }
      if (watchAll.copyright !== lastSaved.current.copyright) {
        updates.push(updateSettingByKey('footer_copyright', watchAll.copyright, userId))
      }
      if (JSON.stringify(watchAll.socialLinks) !== JSON.stringify(lastSaved.current.socialLinks)) {
        updates.push(updateSettingByKey('footer_social_links', watchAll.socialLinks, userId))
      }

      if (updates.length > 0) {
        lastSaved.current = watchAll
        try {
          await Promise.all(updates)
          toast.success('Configurações do rodapé salvas com sucesso!')
        } catch {
          toast.error('Erro ao salvar as configurações do rodapé.')
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [watchAll, form, userId])

  // Simple mask for phone (XX) XXXXX-XXXX
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (v: string) => void,
  ) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    if (value.length > 10) value = `${value.slice(0, 10)}-${value.slice(10)}`
    onChange(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Contato</CardTitle>
        <CardDescription>Estes dados serão exibidos no rodapé de todas as páginas.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail de Contato</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="contato@empresa.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(11) 99999-9999"
                        onChange={(e) => handlePhoneChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Físico</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Av. Exemplo, 1000 - São Paulo, SP"
                      className="resize-none h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Redes Sociais</FormLabel>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col sm:flex-row items-start gap-3">
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-1/3">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Plataforma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1 w-full">
                          <FormControl>
                            <Input {...field} placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive mt-1 flex-shrink-0"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ platform: '', url: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </div>

            <FormField
              control={form.control}
              name="copyright"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto de Copyright e Disclaimers</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="© 2026 XP Investimentos..."
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
