import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useContatos } from '@/hooks/use-contatos'
import { getWhatsAppUrl } from '@/utils/whatsapp'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface WhatsAppButtonProps {
  variant?: 'button' | 'icon' | 'link'
  message?: string
  className?: string
}

export function WhatsAppButton({ variant = 'button', message, className }: WhatsAppButtonProps) {
  const { whatsapp, loading } = useContatos()

  const handleClick = () => {
    if (whatsapp) {
      window.open(getWhatsAppUrl(whatsapp.valor, message), '_blank', 'noopener,noreferrer')
    }
  }

  const disabled = !whatsapp || loading

  const renderContent = () => {
    if (variant === 'icon') {
      return (
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-full', className)}
          disabled={disabled}
          onClick={handleClick}
        >
          <MessageCircle className="h-5 w-5 text-green-500" />
        </Button>
      )
    }

    if (variant === 'link') {
      return (
        <button
          className={cn(
            'hover:text-green-500 transition-colors flex items-center gap-2',
            className,
          )}
          disabled={disabled}
          onClick={handleClick}
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </button>
      )
    }

    return (
      <Button
        className={cn('bg-green-600 hover:bg-green-700 text-white', className)}
        disabled={disabled}
        onClick={handleClick}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Falar no WhatsApp
      </Button>
    )
  }

  if (disabled && !loading) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block cursor-not-allowed">{renderContent()}</div>
        </TooltipTrigger>
        <TooltipContent>Número de WhatsApp não configurado</TooltipContent>
      </Tooltip>
    )
  }

  return renderContent()
}
