import { useState, useEffect } from 'react'
import {
  MessageCircle,
  AlertCircle,
  RefreshCw,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react'
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

  const parseList = (str: string) =>
    str
      ? str
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  return (
    <div className="flex flex-col w-full text-[#333333]">
      {/* Hero Section */}
      <section
        id="home"
        className="relative flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#0055A4] text-white py-[60px] md:py-[100px] lg:py-[140px] px-[20px] md:px-[40px] lg:px-[60px]"
      >
        <div className="relative z-10 container mx-auto text-center flex flex-col items-center animate-fade-in-slow">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
            Nossos Assessores
          </h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Especialistas dedicados a potencializar seus investimentos com a segurança e expertise
            da XP.
          </p>
        </div>
      </section>

      {/* Advisors Section */}
      <section
        id="assessores"
        className="py-[60px] md:py-[80px] lg:py-[100px] bg-[#F5F5F5] px-[20px] md:px-[40px] lg:px-[60px]"
      >
        <div className="container mx-auto" ref={sectionRef}>
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden shadow-sm border-0">
                    <CardHeader className="text-center p-[24px] relative">
                      <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4 relative z-10" />
                      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </CardHeader>
                    <CardContent className="space-y-6 p-[24px] pt-0">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="bg-red-100 p-4 rounded-full mb-6 text-red-600">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Ocorreu um erro ao carregar os dados.</h3>
              <p className="text-[#333333]/80 mb-8">
                Não foi possível conectar ao servidor no momento. Tente novamente mais tarde.
              </p>
              <Button onClick={loadData} variant="outline" className="gap-2 rounded-lg px-6">
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Empty State */}
          {status === 'empty' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="bg-white p-6 rounded-full mb-6 shadow-sm">
                <Briefcase className="h-12 w-12 text-[#333333]" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-[#333333]">
                Nenhum assessor disponível
              </h3>
              <p className="text-[#333333]/80 max-w-md">
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
                      'flex flex-col bg-white border-0 transition-all duration-300 ease-in-out relative',
                      'shadow-none border-b-4 border-b-[#FF6B35]',
                      'md:shadow-sm md:hover:shadow-xl md:hover:-translate-y-2 md:border-b-0 md:border-t-4 md:border-t-[#FF6B35]',
                      isInView ? 'animate-fade-in opacity-100' : 'opacity-0',
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <AdvisorWhatsAppButton
                        advisorId={advisor.user_id}
                        advisorName={advisor.nome}
                      />
                    </div>
                    <CardHeader className="text-center p-[24px]">
                      <Avatar className="h-24 w-24 border-2 border-[#FF6B35] mx-auto shadow-sm mb-4">
                        <AvatarImage src={avatarUrl} alt={advisor.nome} className="object-cover" />
                        <AvatarFallback className="text-xl font-bold bg-[#F5F5F5] text-[#333333]">
                          {advisor.nome.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold text-[#333333]">{advisor.nome}</h3>
                      <p className="text-[#FF6B35] font-medium text-sm mt-1">
                        {advisor.especialidades}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 p-[24px] pt-0 space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-[#333333]">
                          <GraduationCap className="h-4 w-4 shrink-0 text-[#003366]" />
                          <span>
                            Formado em{' '}
                            <strong className="font-semibold">{advisor.formacao_academica}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[#333333]">
                          <Briefcase className="h-4 w-4 shrink-0 text-[#003366]" />
                          <span>
                            <strong className="font-semibold">
                              {advisor.experiencia_profissional}
                            </strong>{' '}
                            de experiência
                          </span>
                        </div>
                        {certs.length > 0 && (
                          <div className="flex items-center gap-3 text-[#333333]">
                            <Award className="h-4 w-4 shrink-0 text-[#003366]" />
                            <div className="flex flex-wrap gap-2">
                              {certs.map((cert) => (
                                <Badge
                                  key={cert}
                                  variant="outline"
                                  className="px-1.5 py-0 h-5 text-[10px] border-[#003366]/20 font-bold bg-[#F5F5F5] text-[#333333]"
                                >
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {habilidades.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-[#F5F5F5]">
                          <p className="text-xs font-bold text-[#333333]/60 uppercase tracking-wider">
                            Habilidades
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {habilidades.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5] text-xs font-medium border-0 transition-colors duration-300 ease-in-out"
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
            <div className="mt-[40px] flex justify-center animate-fade-in-slow">
              <WhatsAppButton
                className="bg-[#25D366] hover:bg-[#128C7E] font-bold rounded-[8px] px-[32px] py-[12px] h-auto text-base gap-2 transition-all duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-lg text-white"
                message="Olá, gostaria de falar com um assessor sobre meus investimentos."
                label="Falar com Atendimento Geral"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
