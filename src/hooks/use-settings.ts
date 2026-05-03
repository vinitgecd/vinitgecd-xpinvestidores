import { useState, useEffect, useMemo, useCallback } from 'react'
import { getSiteSettings, SiteSetting } from '@/services/settings'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export function useSettings() {
  const [settingsRecords, setSettingsRecords] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const records = await getSiteSettings()
      setSettingsRecords(records)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useRealtime('site_settings', (e) => {
    if (e.action === 'create') {
      setSettingsRecords((prev) => [...prev, e.record as unknown as SiteSetting])
    } else if (e.action === 'update') {
      setSettingsRecords((prev) =>
        prev.map((r) => (r.id === e.record.id ? (e.record as unknown as SiteSetting) : r)),
      )
    } else if (e.action === 'delete') {
      setSettingsRecords((prev) => prev.filter((r) => r.id !== e.record.id))
    }
  })

  const settingsMap = useMemo(() => {
    const map: Record<string, SiteSetting> = {}
    settingsRecords.forEach((r) => {
      map[r.setting_key] = r
    })
    return map
  }, [settingsRecords])

  const getValue = useCallback(
    (key: string, defaultValue: any) => {
      const record = settingsMap[key]
      if (!record) return defaultValue
      if (record.setting_value !== null && record.setting_value !== undefined) {
        return record.setting_value
      }
      return defaultValue
    },
    [settingsMap],
  )

  const getFileUrl = useCallback(
    (key: string) => {
      const record = settingsMap[key]
      if (!record || !record.setting_file) return null
      return pb.files.getURL(record as any, record.setting_file)
    },
    [settingsMap],
  )

  return { settingsMap, getValue, getFileUrl, loading }
}
