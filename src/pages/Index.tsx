import { useState, useEffect } from 'react'
import {
  ChevronDown,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

type Advisor = {
  id: string
  name: string
  specialty: string
  education: string
  experience: string
  skills: string[]
  certifications: string[]
  image: string
}

const MOCK_ADVISORS: Advisor[] = [
  {
    id: '1',
    name: 'João Silva',
    specialty: 'Especialista em Renda Fixa',
    education: 'Administração',
    experience: '10 anos',
    skills: ['Gestão de Risco', 'Alocação de Ativos'],
    certifications: ['CEA'],
    image: 'https://img.usecurling.com/ppl/large?gender=male&seed=1',
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    specialty: 'Especialista em Ações',
    education: 'Economia',
    experience: '8 anos',
    skills: ['Análise Fundamental', 'Day Trade'],
    certifications: ['CNPI'],
    image: 'https://img.usecurling.com/ppl/large?gender=male&seed=4',
  },
  {
    id: '3',
    name: 'Marina Santos',
    specialty: 'Fundos Imobiliários',
    education: 'Contabilidade',
    experience: '12 anos',
    skills: ['Planejamento Sucessório', 'Auditoria'],
    certifications: ['CFP'],
    image: 'https://img.usecurling.com/ppl/large?gender=female&seed=3',
  },
]

export default function Index() {
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'success'>('loading')
  const [advisors, setAdvisors] = useState<Advisor[]>([])

  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 })

  const loadData = () => {
    setStatus('loading')
    // Simulate API call for demonstration purposes
    setTimeout(() => {
      setAdvisors(MOCK_ADVISORS)
      setStatus('success')
    }, 1500)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleWhatsApp = (name: string) => {
    const text = encodeURIComponent(`Olá, gostaria de falar com ${name} sobre meus investimentos.`)
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank')
  }

  const scrollToAssessores = () => {
    document.getElementById('assessores')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[90vh] flex items-center justify-center bg-black text-white overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/1080?q=abstract%20dark%20finance')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center animate-fade-in-up">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1 text-sm text-accent border-accent/50 bg-accent/10 hover:bg-accent/20 transition-colors rounded-full"
          >
            Assessoria Premium
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6">
            Nossos <span className="text-accent drop-shadow-lg">Assessores</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Especialistas dedicados a potencializar seus investimentos com a segurança e expertise
            da XP.
          </p>
          <Button
            size="lg"
            className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-6 text-lg font-bold shadow-xl transition-transform hover:scale-105"
            onClick={scrollToAssessores}
          >
            Conheça a Equipe
          </Button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-10 p-4">
          <ChevronDown
            className="h-10 w-10 text-gray-400 hover:text-accent transition-colors"
            onClick={scrollToAssessores}
          />
        </div>
      </section>

      {/* Advisors Section */}
      <section id="assessores" className="py-24 bg-zinc-50 min-h-screen relative">
        <div className="container mx-auto px-4" ref={sectionRef}>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Especialistas à Sua Disposição
            </h2>
            <p className="text-muted-foreground text-lg">
              Profissionais altamente qualificados e certificados para guiar sua jornada financeira
              com excelência e personalização.
            </p>
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden shadow-sm border-0">
                  <CardHeader className="text-center pt-10 pb-4 relative">
                    <div className="absolute top-0 left-0 w-full h-24 bg-muted animate-pulse" />
                    <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4 relative z-10 border-4 border-background" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </CardHeader>
                  <CardContent className="space-y-6 px-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Skeleton className="h-12 w-full rounded-md" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="bg-red-100 p-4 rounded-full mb-6 text-red-600">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Ocorreu um erro ao carregar os dados.</h3>
              <p className="text-muted-foreground mb-8">
                Não foi possível conectar ao servidor no momento. Tente novamente mais tarde.
              </p>
              <Button
                onClick={loadData}
                variant="outline"
                className="gap-2 rounded-full px-6 border-gray-300"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Empty State */}
          {status === 'empty' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="bg-muted p-6 rounded-full mb-6">
                <Briefcase className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Nenhum assessor disponível</h3>
              <p className="text-muted-foreground max-w-md">
                No momento, não temos assessores listados. Por favor, volte mais tarde ou entre em
                contato diretamente pelo nosso canal de atendimento.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advisors.map((advisor, index) => (
                <Card
                  key={advisor.id}
                  className={cn(
                    'flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-border/40 bg-white',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="text-center pt-8 pb-4 relative">
                    <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-black to-zinc-900" />
                    <Avatar className="h-32 w-32 border-4 border-white mx-auto shadow-md relative z-10 mb-5">
                      <AvatarImage
                        src={advisor.image}
                        alt={advisor.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl font-bold bg-zinc-100 text-black">
                        {advisor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
                      {advisor.name}
                    </h3>
                    <p className="text-yellow-600 font-semibold mt-1.5">{advisor.specialty}</p>
                  </CardHeader>
                  <CardContent className="flex-1 px-8 py-4 space-y-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-zinc-600">
                        <GraduationCap className="h-4 w-4 shrink-0" />
                        <span>
                          Formado em <strong className="text-zinc-900">{advisor.education}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600">
                        <Briefcase className="h-4 w-4 shrink-0" />
                        <span>
                          <strong className="text-zinc-900">{advisor.experience}</strong> de
                          experiência
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600">
                        <Award className="h-4 w-4 shrink-0" />
                        <div className="flex gap-2">
                          Certificações:
                          {advisor.certifications.map((cert) => (
                            <Badge
                              key={cert}
                              variant="outline"
                              className="px-1.5 py-0 h-5 text-[10px] border-zinc-300 font-bold bg-zinc-50 text-zinc-800"
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Especialidades
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {advisor.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-medium border-0"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-4 mt-auto">
                    <Button
                      className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold gap-2 transition-all duration-300 shadow-md hover:shadow-lg h-12 text-base"
                      onClick={() => handleWhatsApp(advisor.name)}
                    >
                      <MessageCircle className="h-5 w-5" />
                      Contato via WhatsApp
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
