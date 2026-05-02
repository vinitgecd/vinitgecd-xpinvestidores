migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('users')
    const assessoresCol = app.findCollectionByNameOrId('assessores')

    // 1. Database Cleanup
    app.truncateCollection(assessoresCol)
    app.truncateCollection(usersCol)

    // Update password field constraint to safely allow the 7-character password ('joao123')
    const passwordField = usersCol.fields.getByName('password')
    if (passwordField) {
      passwordField.min = 7
      app.save(usersCol)
    }

    // 2. Create Admin User
    const admin = new Record(usersCol)
    admin.setEmail('admin@xp.com')
    admin.setPassword('admin123')
    admin.setVerified(true)
    admin.set('role', 'admin')
    admin.set('name', 'Admin XP')
    app.save(admin)

    // 3. Define Assessores Data
    const assessoresData = [
      {
        email: 'joao@xp.com',
        password: 'joao123',
        role: 'assessor',
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
        password: 'carlos123',
        role: 'assessor',
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
        password: 'marina123',
        role: 'assessor',
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

    // 4. Create Authentication Records for Assessores
    for (const data of assessoresData) {
      const user = new Record(usersCol)
      user.setEmail(data.email)
      user.setPassword(data.password)
      user.setVerified(true)
      user.set('role', data.role)
      user.set('name', data.nome)
      app.save(user)
    }

    // 5. Create Profile Records with Accurate user_id Relations
    for (const data of assessoresData) {
      const userRecord = app.findFirstRecordByData('users', 'email', data.email)

      const assessor = new Record(assessoresCol)
      assessor.set('user_id', userRecord.id)
      assessor.set('nome', data.nome)
      assessor.set('especialidades', data.especialidades)
      assessor.set('habilidades', data.habilidades)
      assessor.set('formacao_academica', data.formacao_academica)
      assessor.set('experiencia_profissional', data.experiencia_profissional)
      assessor.set('certificacoes', data.certificacoes)
      assessor.set('whatsapp', data.whatsapp)
      assessor.set('ativo', data.ativo)

      app.save(assessor)
    }
  },
  (app) => {
    const usersCol = app.findCollectionByNameOrId('users')
    const assessoresCol = app.findCollectionByNameOrId('assessores')

    // Revert seeding by truncating the collections again
    app.truncateCollection(assessoresCol)
    app.truncateCollection(usersCol)
  },
)
