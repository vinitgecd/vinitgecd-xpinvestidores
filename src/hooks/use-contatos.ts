import { useState, useEffect } from 'react'
import { getContatos, Contato } from '@/services/contatos'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'

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

  const whatsapp = contatos.find((c) => c.tipo === 'whatsapp' && c.ativo)

  return { contatos, loading, error, whatsapp }
}
