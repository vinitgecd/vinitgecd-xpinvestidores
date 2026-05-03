import pb from '@/lib/pocketbase/client'

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: any
  setting_file: string
  updated_by: string
}

export const getSiteSettings = async (): Promise<SiteSetting[]> => {
  try {
    return await pb.collection('site_settings').getFullList()
  } catch (error) {
    throw new Error('Não foi possível carregar as configurações.')
  }
}

export const updateSettingByKey = async (key: string, value: any, updatedBy: string) => {
  try {
    const record = await pb.collection('site_settings').getFirstListItem(`setting_key="${key}"`)
    return await pb.collection('site_settings').update(record.id, {
      setting_value: value,
      updated_by: updatedBy,
    })
  } catch (error: any) {
    console.error(error)
    throw new Error('Erro ao atualizar configuração.')
  }
}

export const updateSettingFileByKey = async (key: string, file: File | null, updatedBy: string) => {
  try {
    const record = await pb.collection('site_settings').getFirstListItem(`setting_key="${key}"`)
    const formData = new FormData()
    if (file) {
      formData.append('setting_file', file)
    } else {
      formData.append('setting_file', '')
    }
    formData.append('updated_by', updatedBy)
    return await pb.collection('site_settings').update(record.id, formData)
  } catch (error: any) {
    console.error(error)
    throw new Error('Erro ao atualizar arquivo de configuração.')
  }
}
