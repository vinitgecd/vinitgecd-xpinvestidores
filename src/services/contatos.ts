import pb from '@/lib/pocketbase/client'

export interface Contato {
  id: string
  tipo: 'whatsapp' | 'email' | 'telefone'
  valor: string
  descricao?: string
  ativo: boolean
  created: string
  updated: string
}

export const getContatos = () =>
  pb.collection('contatos').getFullList<Contato>({ sort: '-created' })
export const getContatosByTipo = (tipo: string) =>
  pb.collection('contatos').getFullList<Contato>({ filter: `tipo = '${tipo}'`, sort: '-created' })
export const getWhatsAppContact = async () => {
  const records = await pb
    .collection('contatos')
    .getFullList<Contato>({ filter: `tipo = 'whatsapp' && ativo = true`, sort: '-created' })
  return records[0] || null
}
export const createContato = (data: Partial<Contato>) =>
  pb.collection('contatos').create<Contato>(data)
export const updateContato = (id: string, data: Partial<Contato>) =>
  pb.collection('contatos').update<Contato>(id, data)
export const deleteContato = (id: string) => pb.collection('contatos').delete(id)
