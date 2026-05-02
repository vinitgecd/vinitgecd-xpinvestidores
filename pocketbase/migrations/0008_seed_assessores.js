migrate(
  (app) => {
    const assessoresCol = app.findCollectionByNameOrId('assessores')

    const assessores = [
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

    for (const data of assessores) {
      let user
      try {
        user = app.findAuthRecordByEmail('users', data.email)
      } catch (_) {
        continue
      }

      try {
        app.findFirstRecordByData('assessores', 'user_id', user.id)
      } catch (_) {
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
    // down migration
  },
)
