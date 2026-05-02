import pb from '@/lib/pocketbase/client'

export interface Assessor {
  id: string
  user_id: string
  nome: string
  foto_perfil: string
  especialidades: string
  habilidades: string
  formacao_academica: string
  experiencia_profissional: string
  certificacoes: string
  whatsapp: string
  ativo: boolean
  created: string
  updated: string
}

export const getAssessores = () =>
  pb.collection('assessores').getFullList<Assessor>({ filter: 'ativo = true', sort: 'created' })
export const getAllAssessores = () =>
  pb.collection('assessores').getFullList<Assessor>({ sort: 'created', expand: 'user_id' })
export const getAssessorByUserId = (userId: string) =>
  pb.collection('assessores').getFirstListItem<Assessor>(`user_id = "${userId}"`)
export const updateAssessor = (id: string, data: Partial<Assessor>) =>
  pb.collection('assessores').update<Assessor>(id, data)
export const createAssessor = (data: Partial<Assessor>) =>
  pb.collection('assessores').create<Assessor>(data)
export const deleteAssessor = (id: string) => pb.collection('assessores').delete(id)
