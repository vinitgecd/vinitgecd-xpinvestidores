migrate(
  (app) => {
    // Delete all existing records from both collections
    try {
      app.db().newQuery('DELETE FROM assessores').execute()
    } catch (err) {
      console.log('Error deleting assessores:', err)
    }

    try {
      app.db().newQuery('DELETE FROM users').execute()
    } catch (err) {
      console.log('Error deleting users:', err)
    }

    const usersCol = app.findCollectionByNameOrId('users')
    const assessoresCol = app.findCollectionByNameOrId('assessores')

    // 1. Create users
    const usersData = [
      { email: 'admin@xp.com', password: 'Skip@Pass', role: 'admin', name: 'Admin' },
      { email: 'joao@xp.com', password: 'Skip@Pass', role: 'assessor', name: 'João Silva' },
      { email: 'carlos@xp.com', password: 'Skip@Pass', role: 'assessor', name: 'Carlos Oliveira' },
      { email: 'marina@xp.com', password: 'Skip@Pass', role: 'assessor', name: 'Marina Santos' },
    ]

    const createdUsers = {}

    for (const data of usersData) {
      const record = new Record(usersCol)
      record.setEmail(data.email)
      record.setPassword(data.password)
      record.setVerified(true)
      record.set('role', data.role)
      record.set('name', data.name)
      app.save(record)
      createdUsers[data.email] = record
    }

    // 2. Create assessores
    const assessoresData = [
      {
        email: 'joao@xp.com',
        nome: 'João Silva',
        especialidades: 'Renda Fixa, Títulos Públicos',
        habilidades: 'Análise de risco, Planejamento financeiro',
        formacao_academica: 'Administração de Empresas (USP)',
        experiencia_profissional: '10 anos no mercado de capitais',
        certificacoes: 'CPA-20, CPA-10',
        whatsapp: '(11) 98765-4321',
        ativo: true,
      },
      {
        email: 'carlos@xp.com',
        nome: 'Carlos Oliveira',
        especialidades: 'Ações, Fundos de Investimento',
        habilidades: 'Análise técnica, Gestão de carteira',
        formacao_academica: 'Economia (UFRJ)',
        experiencia_profissional: '8 anos em gestão de ativos',
        certificacoes: 'CPA-20, CNPI',
        whatsapp: '(21) 99876-5432',
        ativo: true,
      },
      {
        email: 'marina@xp.com',
        nome: 'Marina Santos',
        especialidades: 'Fundos Imobiliários, Renda Variável',
        habilidades: 'Análise fundamentalista, Diversificação',
        formacao_academica: 'Contabilidade (UFMG)',
        experiencia_profissional: '12 anos em investimentos',
        certificacoes: 'CPA-20, Especialista em FII',
        whatsapp: '(31) 97654-3210',
        ativo: true,
      },
    ]

    for (const data of assessoresData) {
      const user = createdUsers[data.email]
      if (user) {
        const record = new Record(assessoresCol)
        record.set('user_id', user.id)
        record.set('nome', data.nome)
        record.set('especialidades', data.especialidades)
        record.set('habilidades', data.habilidades)
        record.set('formacao_academica', data.formacao_academica)
        record.set('experiencia_profissional', data.experiencia_profissional)
        record.set('certificacoes', data.certificacoes)
        record.set('whatsapp', data.whatsapp)
        record.set('ativo', data.ativo)
        app.save(record)
      }
    }
  },
  (app) => {
    // Revert: delete these users and their profiles
    try {
      app.db().newQuery('DELETE FROM assessores').execute()
    } catch (err) {}

    try {
      app.db().newQuery('DELETE FROM users').execute()
    } catch (err) {}
  },
)
