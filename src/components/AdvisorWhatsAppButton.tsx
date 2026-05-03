import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { redirectToWhatsApp, unformatPhone } from '@/utils/whatsapp'
import { toast } from 'sonner'

interface AdvisorWhatsAppButtonProps {
  advisorId: string
  advisorPhone?: string
  advisorName: string
}

export function AdvisorWhatsAppButton({
  advisorId,
  advisorPhone,
  advisorName,
}: AdvisorWhatsAppButtonProps) {
  const handleClick = useCallback(() => {
    if (advisorPhone) {
      try {
        const rawDigits = unformatPhone(advisorPhone)
        redirectToWhatsApp(rawDigits, `Olá! Gostaria de falar com ${advisorName}`)
      } catch (e: any) {
        toast.error('Número inválido')
      }
    }
  }, [advisorPhone, advisorName])

  if (!advisorPhone) {
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
          <p>WhatsApp não configurado para este assessor</p>
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
