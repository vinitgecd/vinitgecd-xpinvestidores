import pb from '@/lib/pocketbase/client'

export interface Cliente {
  id: string
  user_id: string
  nome: string
  email: string
  telefone: string
  valor_investido: number
  status: string
  created: string
  updated: string
  expand?: {
    user_id?: { id: string; name: string; email: string; role: string }
  }
}

export const getClientes = async (page = 1, perPage = 20, filter = '', sort = '-created') => {
  return pb.collection('clientes').getList<Cliente>(page, perPage, {
    filter,
    sort,
    expand: 'user_id',
  })
}

export const getAllClientes = async () => {
  return pb.collection('clientes').getFullList<Cliente>({ expand: 'user_id' })
}

export const getClientesByCurrentUser = async () => {
  const userId = pb.authStore.record?.id
  if (!userId) throw new Error('Usuário não autenticado')
  return pb.collection('clientes').getFullList<Cliente>({
    filter: `user_id = "${userId}"`,
    sort: '-created',
    expand: 'user_id',
  })
}

export const createCliente = async (data: Partial<Cliente>) => {
  return pb.collection('clientes').create<Cliente>(data)
}

export const updateCliente = async (id: string, data: Partial<Cliente>) => {
  return pb.collection('clientes').update<Cliente>(id, data)
}

export const deleteCliente = async (id: string) => {
  return pb.collection('clientes').delete(id)
}
