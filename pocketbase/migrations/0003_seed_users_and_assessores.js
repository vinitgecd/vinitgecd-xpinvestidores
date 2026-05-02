migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const assessores = app.findCollectionByNameOrId('assessores')

    const seedUsers = [
      { email: 'admin@xp.com', role: 'admin', name: 'Admin', pass: 'Skip@Pass', data: null },
      {
        email: 'joao@xp.com',
        role: 'assessor',
        name: 'João Silva',
        pass: 'Skip@Pass',
        data: {
          nome: 'João Silva',
          especialidades: 'Especialista em Renda Fixa',
          formacao_academica: 'Administração',
          experiencia_profissional: '10 anos',
          habilidades: 'Gestão de Risco, Alocação de Ativos',
          certificacoes: 'CEA',
          whatsapp: '5511999999999',
          ativo: true,
        },
      },
      {
        email: 'carlos@xp.com',
        role: 'assessor',
        name: 'Carlos Oliveira',
        pass: 'Skip@Pass',
        data: {
          nome: 'Carlos Oliveira',
          especialidades: 'Especialista em Ações',
          formacao_academica: 'Economia',
          experiencia_profissional: '8 anos',
          habilidades: 'Análise Fundamental, Day Trade',
          certificacoes: 'CNPI',
          whatsapp: '5511999999999',
          ativo: true,
        },
      },
      {
        email: 'marina@xp.com',
        role: 'assessor',
        name: 'Marina Santos',
        pass: 'Skip@Pass',
        data: {
          nome: 'Marina Santos',
          especialidades: 'Fundos Imobiliários',
          formacao_academica: 'Contabilidade',
          experiencia_profissional: '12 anos',
          habilidades: 'Planejamento Sucessório, Auditoria',
          certificacoes: 'CFP',
          whatsapp: '5511999999999',
          ativo: true,
        },
      },
    ]

    for (const u of seedUsers) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        const record = new Record(users)
        record.setEmail(u.email)
        record.setPassword(u.pass)
        record.setVerified(true)
        record.set('role', u.role)
        record.set('name', u.name)
        app.save(record)

        if (u.role === 'assessor' && u.data) {
          const assRecord = new Record(assessores)
          assRecord.set('user_id', record.id)
          assRecord.set('nome', u.data.nome)
          assRecord.set('especialidades', u.data.especialidades)
          assRecord.set('formacao_academica', u.data.formacao_academica)
          assRecord.set('experiencia_profissional', u.data.experiencia_profissional)
          assRecord.set('habilidades', u.data.habilidades)
          assRecord.set('certificacoes', u.data.certificacoes)
          assRecord.set('whatsapp', u.data.whatsapp)
          assRecord.set('ativo', u.data.ativo)
          app.save(assRecord)
        }
      }
    }
  },
  (app) => {
    try {
      const emails = ['admin@xp.com', 'joao@xp.com', 'carlos@xp.com', 'marina@xp.com']
      for (const email of emails) {
        const r = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(r)
      }
    } catch (_) {}
  },
)
