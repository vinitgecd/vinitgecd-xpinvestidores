import { useState, useCallback, useEffect } from 'react'
import { getClientes } from '@/services/clientes'
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
