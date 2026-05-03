import { useState, useCallback, useEffect, useMemo } from 'react'
import { getClientes, getClientesByCurrentUser } from '@/services/clientes'
import { useRealtime } from '@/hooks/use-realtime'

export function useClientes(filter = '', sort = '-created', page = 1, perPage = 20) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getClientes(page, perPage, filter, sort)
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filter, sort, page, perPage])

  useEffect(() => {
    load()
  }, [load])

  useRealtime('clientes', () => {
    load()
  })

  return { data, loading, refetch: load }
}

export function useMeusClientes() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getClientesByCurrentUser()
      setClients(res)
    } catch (err: any) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useRealtime('clientes', () => {
    load()
  })

  const stats = useMemo(() => {
    const total = clients.length
    const valorInvestido = clients.reduce((acc, c) => acc + (c.valor_investido || 0), 0)
    // clients are already sorted by '-created' from the service, so [0] is the latest
    const ultimaData = clients.length > 0 ? clients[0].created : null
    return { total, valorInvestido, ultimaData }
  }, [clients])

  return { clients, stats, loading, error, refetch: load }
}
