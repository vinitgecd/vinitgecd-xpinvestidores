import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { AlertCircle, RefreshCw, Briefcase, GraduationCap, Award } from 'lucide-react'
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

export default function Index() {
  const { user } = useAuth()
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'success'>('loading')
  const [advisors, setAdvisors] = useState<Assessor[]>([])

  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 })

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

  if (user?.role === 'admin') {
    return <Navigate to="/admin/painel-de-controle" replace />
  }

  const parseList = (str: string) =>
    str
      ? str
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

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

        <div className="container relative z-10 mx-auto px-4 lg:px-8 flex flex-col items-center text-center justify-center h-full">
          <div className="text-white space-y-8 animate-fade-in-up max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#4da2ff] drop-shadow-sm leading-tight">
              Argentum,
              <br />o seu melhor futuro.
            </h1>
            <div className="w-32 h-1 bg-[#4da2ff] mx-auto rounded-full"></div>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl font-medium">
              A Argentum Investimentos possui uma equipe qualificada e uma assessoria diferenciada
              para fazer o seu dinheiro render mais. Descubra os nossos assessores e escolha o
              especialista certo para alinhar aos seus interesses.
            </p>
            <div className="pt-8">
              <Button
                onClick={() => {
                  document.getElementById('assessores')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-[#007bff] hover:bg-[#0056b3] text-white px-8 py-7 text-lg md:text-xl font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Conhecer nossos assessores
              </Button>
            </div>
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
