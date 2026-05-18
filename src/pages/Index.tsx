import { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw, Briefcase, GraduationCap, Award, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { getAssessores, Assessor } from '@/services/assessores'
import pb from '@/lib/pocketbase/client'
import { AdvisorWhatsAppButton } from '@/components/AdvisorWhatsAppButton'
import { WhatsAppButton } from '@/components/WhatsAppButton'

import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCliente } from '@/services/clientes'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const leadSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Celular inválido'),
  faixa_valor: z.string().min(1, 'Selecione uma faixa de valor'),
})

type LeadFormValues = z.infer<typeof leadSchema>

export default function Index() {
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'success'>('loading')
  const [advisors, setAdvisors] = useState<Assessor[]>([])

  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      faixa_valor: '',
    },
  })

  const loadData = async () => {
    setStatus('loading')
    try {
      const data = await getAssessores()
      setAdvisors(data)
      setStatus(data.length === 0 ? 'empty' : 'success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const parseList = (str: string) =>
    str
      ? str
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  const onSubmit = async (data: LeadFormValues) => {
    try {
      let valor_investido = 0
      if (data.faixa_valor === '50k') valor_investido = 50000
      else if (data.faixa_valor === '100k') valor_investido = 100000
      else if (data.faixa_valor === '300k') valor_investido = 300000
      else if (data.faixa_valor === '500k') valor_investido = 500000

      await createCliente({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        valor_investido: valor_investido,
        status: 'Novo Lead',
      })

      toast.success('Solicitação enviada com sucesso! Em breve um assessor entrará em contato.', {
        icon: <Check className="w-5 h-5 text-green-500" />,
      })
      reset()
    } catch (err) {
      toast.error('Ocorreu um erro ao enviar sua solicitação. Tente novamente.')
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col w-full bg-[#0a0a0a] min-h-screen">
      {/* Hero Section */}
      <section
        id="argentum"
        className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/1600/900?q=modern%20office%20view&color=black&dpr=2"
            alt="Office view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="text-white space-y-6 animate-fade-in-up md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#4da2ff] drop-shadow-sm leading-tight">
              Argentum,
              <br />o seu melhor futuro.
            </h1>
            <div className="w-24 h-1 bg-[#4da2ff]"></div>
            <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl font-medium">
              A Argentum Investimentos possui uma equipe qualificada e uma assessoria diferenciada
              para fazer o seu dinheiro render mais. Com proximidade, transparência e uma ampla
              variedade de produtos do mercado financeiro, conseguimos atuar de forma imparcial e
              oferecer soluções alinhadas aos interesses e perfil de cada investidor.
            </p>
          </div>

          {/* Right content - Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-xl shadow-2xl animate-fade-in-up flex flex-col w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="text-center mb-6">
              <p className="text-[#4da2ff] font-semibold text-sm mb-1 tracking-wider uppercase">
                Comece agora
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Abra sua conta grátis
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-white/80 text-xs font-medium">
                  Nome*
                </Label>
                <Input
                  id="nome"
                  className="bg-white text-black border-0 h-11 focus-visible:ring-[#4da2ff]"
                  {...register('nome')}
                />
                {errors.nome && <p className="text-red-400 text-xs">{errors.nome.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/80 text-xs font-medium">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-white text-black border-0 h-11 focus-visible:ring-[#4da2ff]"
                  {...register('email')}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-white/80 text-xs font-medium">
                  Celular*
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-lg leading-none" aria-hidden="true">
                      🇧🇷
                    </span>
                  </div>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    className="bg-white text-black border-0 h-11 pl-10 focus-visible:ring-[#4da2ff]"
                    {...register('telefone')}
                  />
                </div>
                {errors.telefone && (
                  <p className="text-red-400 text-xs">{errors.telefone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="faixa_valor" className="text-white/80 text-xs font-medium">
                  Faixa de valor para investimentos*
                </Label>
                <Controller
                  control={control}
                  name="faixa_valor"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white text-black border-0 w-full h-11 focus:ring-[#4da2ff]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50k">Até R$ 50.000</SelectItem>
                        <SelectItem value="100k">R$ 50.001 a R$ 100.000</SelectItem>
                        <SelectItem value="300k">R$ 100.001 a R$ 300.000</SelectItem>
                        <SelectItem value="500k">Acima de R$ 300.000</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.faixa_valor && (
                  <p className="text-red-400 text-xs">{errors.faixa_valor.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white py-6 text-base font-bold mt-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'Abrir conta'
                )}
              </Button>
              <p className="text-[10px] text-white/50 text-center mt-4">
                Prometemos não utilizar suas informações de contato para enviar qualquer tipo de
                SPAM.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Assessores Section */}
      <section
        id="assessores"
        className="py-24 bg-[#0a0a0a] text-white px-4 lg:px-8 border-t border-white/5 relative z-10"
      >
        <div className="container mx-auto" ref={sectionRef}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Nossos Assessores
            </h2>
            <div className="w-16 h-1 bg-[#4da2ff] mx-auto mb-6"></div>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Especialistas prontos para te ajudar a tomar as melhores decisões para o seu
              patrimônio com a segurança XP.
            </p>
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden bg-[#111111] border-white/5">
                  <CardHeader className="text-center p-6 relative">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4 bg-white/10" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 mx-auto bg-white/10" />
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-0">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full bg-white/10" />
                      <Skeleton className="h-4 w-full bg-white/10" />
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="bg-red-500/10 p-4 rounded-full mb-6 text-red-400">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Ocorreu um erro ao carregar os dados.</h3>
              <p className="text-white/60 mb-8">
                Não foi possível conectar ao servidor no momento. Tente novamente mais tarde.
              </p>
              <Button
                onClick={loadData}
                variant="outline"
                className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Empty State */}
          {status === 'empty' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="bg-white/5 p-6 rounded-full mb-6 border border-white/10">
                <Briefcase className="h-12 w-12 text-white/40" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Nenhum assessor disponível</h3>
              <p className="text-white/60 max-w-md">
                No momento, não temos assessores listados. Por favor, volte mais tarde ou entre em
                contato diretamente pelo nosso canal de atendimento.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advisors.map((advisor, index) => {
                const avatarUrl = advisor.foto_perfil
                  ? pb.files.getUrl(advisor, advisor.foto_perfil)
                  : `https://img.usecurling.com/ppl/large?seed=${advisor.id}`

                const certs = parseList(advisor.certificacoes)
                const habilidades = parseList(advisor.habilidades)

                return (
                  <Card
                    key={advisor.id}
                    className={cn(
                      'flex flex-col bg-[#111111] border-white/5 transition-all duration-300 ease-in-out relative',
                      'shadow-lg hover:shadow-xl hover:-translate-y-2 group',
                      isInView ? 'animate-fade-in opacity-100' : 'opacity-0',
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <AdvisorWhatsAppButton
                        advisorId={advisor.user_id}
                        advisorName={advisor.nome}
                        advisorPhone={advisor.whatsapp}
                      />
                    </div>
                    <CardHeader className="text-center p-6 pb-4">
                      <Avatar className="h-24 w-24 border-2 border-[#4da2ff] mx-auto shadow-md mb-5 group-hover:scale-105 transition-transform duration-300">
                        <AvatarImage src={avatarUrl} alt={advisor.nome} className="object-cover" />
                        <AvatarFallback className="text-xl font-bold bg-[#222] text-white">
                          {advisor.nome.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {advisor.nome}
                      </h3>
                      <p className="text-[#4da2ff] font-medium text-sm mt-1">
                        {advisor.especialidades}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 pt-2 space-y-5">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-white/70">
                          <div className="bg-white/5 p-1.5 rounded-md text-[#4da2ff]">
                            <GraduationCap className="h-4 w-4 shrink-0" />
                          </div>
                          <span>
                            Formado em{' '}
                            <strong className="font-semibold text-white/90">
                              {advisor.formacao_academica}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                          <div className="bg-white/5 p-1.5 rounded-md text-[#4da2ff]">
                            <Briefcase className="h-4 w-4 shrink-0" />
                          </div>
                          <span>
                            <strong className="font-semibold text-white/90">
                              {advisor.experiencia_profissional}
                            </strong>{' '}
                            de experiência
                          </span>
                        </div>
                        {certs.length > 0 && (
                          <div className="flex items-start gap-3 text-white/70">
                            <div className="bg-white/5 p-1.5 rounded-md text-[#4da2ff]">
                              <Award className="h-4 w-4 shrink-0" />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-0.5">
                              {certs.map((cert) => (
                                <Badge
                                  key={cert}
                                  variant="outline"
                                  className="px-2 py-0 h-5 text-[10px] border-[#4da2ff]/30 font-bold bg-[#4da2ff]/10 text-[#4da2ff]"
                                >
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {habilidades.length > 0 && (
                        <div className="space-y-3 pt-5 border-t border-white/5">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            Habilidades
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {habilidades.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-xs font-medium border border-white/5 transition-colors duration-300"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Centered CTA */}
          {status === 'success' && (
            <div className="mt-16 flex justify-center animate-fade-in-slow">
              <WhatsAppButton
                className="font-bold rounded-lg px-8 py-6 h-auto text-base gap-3 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl bg-green-600 hover:bg-green-700 text-white"
                message="Olá! Gostaria de falar com um atendente sobre meus investimentos."
                label="Falar com Atendimento Geral"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
