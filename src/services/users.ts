import pb from '@/lib/pocketbase/client'

export const createUser = (data: any) => pb.collection('users').create(data)
export const deleteUser = (id: string) => pb.collection('users').delete(id)

export const deleteAdvisor = async (assessorId: string): Promise<void> => {
  try {
    await pb.send('/backend/v1/delete-advisor', {
      method: 'POST',
      body: { assessorId },
    })
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao excluir assessor')
  }
}
