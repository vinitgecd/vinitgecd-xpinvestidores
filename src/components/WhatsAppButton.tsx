import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'
import { useContatos } from '@/hooks/use-contatos'
import { redirectToWhatsApp } from '@/utils/whatsapp'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface WhatsAppButtonProps {
  variant?: 'button' | 'icon' | 'link'
  message?: string
  className?: string
  label?: string
  tooltip?: string
}

export function WhatsAppButton({
  variant = 'button',
  message,
  className,
  label,
  tooltip,
}: WhatsAppButtonProps) {
  const { loading, getWhatsAppUrl, hasWhatsApp } = useContatos()

  const handleClick = useCallback(() => {
    if (!hasWhatsApp) {
      toast.error('Número de WhatsApp não configurado')
      return
    }
    try {
      const phone = getWhatsAppUrl()
      redirectToWhatsApp(phone, message)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao conectar')
      }
    }
  }, [getWhatsAppUrl, message, hasWhatsApp])

  const disabled = !hasWhatsApp || loading

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
          {loading ? (
            <Loader2 className="h-5 w-5 text-[#25D366] animate-spin" />
          ) : (
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
          )}
        </Button>
      )
    }

    if (variant === 'link') {
      return (
        <button
          className={cn(
            'hover:text-[#25D366] transition-colors flex items-center gap-2 disabled:opacity-50',
            className,
          )}
          disabled={disabled}
          onClick={handleClick}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          <span>{label || 'WhatsApp'}</span>
        </button>
      )
    }

    return (
      <Button
        className={cn('bg-[#25D366] hover:bg-[#128C7E] text-white', className)}
        disabled={disabled}
        onClick={handleClick}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <MessageCircle className="mr-2 h-4 w-4" />
        )}
        {label || 'Falar no WhatsApp'}
      </Button>
    )
  }

  if (!hasWhatsApp && !loading) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block cursor-not-allowed">{renderContent()}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Número de WhatsApp não configurado</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  if (tooltip && !disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">{renderContent()}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return renderContent()
}
