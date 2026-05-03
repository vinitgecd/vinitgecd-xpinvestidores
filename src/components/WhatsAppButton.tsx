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
}

export function WhatsAppButton({
  variant = 'button',
  message,
  className,
  label,
}: WhatsAppButtonProps) {
  const { loading, getWhatsAppUrl, hasWhatsApp } = useContatos()

  const handleClick = useCallback(() => {
    try {
      const phone = getWhatsAppUrl()
      redirectToWhatsApp(phone, message)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }, [getWhatsAppUrl, message])

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
            <Loader2 className="h-5 w-5 text-green-500 animate-spin" />
          ) : (
            <MessageCircle className="h-5 w-5 text-green-500" />
          )}
        </Button>
      )
    }

    if (variant === 'link') {
      return (
        <button
          className={cn(
            'hover:text-green-500 transition-colors flex items-center gap-2 disabled:opacity-50',
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
        <TooltipContent>WhatsApp não configurado</TooltipContent>
      </Tooltip>
    )
  }

  return renderContent()
}
