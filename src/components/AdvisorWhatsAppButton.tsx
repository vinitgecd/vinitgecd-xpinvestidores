import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getAdvisorWhatsApp } from '@/services/contatos'
import { redirectToWhatsApp } from '@/utils/whatsapp'
import { toast } from 'sonner'

interface AdvisorWhatsAppButtonProps {
  advisorId: string
  advisorName: string
}

export function AdvisorWhatsAppButton({ advisorId, advisorName }: AdvisorWhatsAppButtonProps) {
  const [phone, setPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchPhone = async () => {
      setLoading(true)
      try {
        const p = await getAdvisorWhatsApp(advisorId)
        if (isMounted) {
          setPhone(p)
          setError(null)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'WhatsApp não configurado para este assessor')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchPhone()
    return () => {
      isMounted = false
    }
  }, [advisorId])

  const handleClick = useCallback(() => {
    if (phone) {
      try {
        redirectToWhatsApp(phone, `Olá! Gostaria de falar com ${advisorName}`)
      } catch (e: any) {
        toast.error('Número de WhatsApp inválido')
      }
    }
  }, [phone, advisorName])

  if (loading) {
    return (
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] opacity-50 cursor-not-allowed"
        disabled
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  if (error || !phone) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-gray-400 text-white cursor-not-allowed"
              disabled
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{error || 'WhatsApp não configurado para este assessor'}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full bg-[#25D366] text-white hover:bg-[#128C7E]"
          onClick={handleClick}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Falar com {advisorName} no WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  )
}
