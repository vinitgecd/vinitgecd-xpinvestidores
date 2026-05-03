import { useState, useEffect, useCallback } from 'react'
import {
  getContatos,
  Contato,
  updateAdvisorWhatsApp as updateAdvisorWhatsAppService,
} from '@/services/contatos'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'
import { unformatPhone } from '@/utils/whatsapp'

export function useContatos() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getContatos()
      setContatos(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar os contatos')
      toast.error('Não foi possível carregar os contatos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('contatos', () => {
    loadData()
  })

  const getWhatsAppUrl = useCallback(() => {
    const whatsappContato = contatos.find((c) => c.tipo === 'whatsapp' && c.ativo)
    if (!whatsappContato) {
      throw new Error('WhatsApp não configurado')
    }
    return whatsappContato.valor
  }, [contatos])

  const hasWhatsApp = !!contatos.find((c) => c.tipo === 'whatsapp' && c.ativo)

  const updateAdvisorWhatsApp = async (userId: string, phone: string) => {
    const digits = unformatPhone(phone)
    if (digits && digits.length !== 11) {
      throw new Error('Número de telefone inválido. Use formato (XX) XXXXX-XXXX')
    }
    return updateAdvisorWhatsAppService(userId, digits)
  }

  return { contatos, loading, error, getWhatsAppUrl, hasWhatsApp, updateAdvisorWhatsApp }
}
