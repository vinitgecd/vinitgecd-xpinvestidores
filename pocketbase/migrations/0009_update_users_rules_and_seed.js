migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.listRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    users.viewRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    users.updateRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    users.deleteRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    app.save(users)

    const seedUsers = [
      { email: 'admin@xp.com', role: 'admin', name: 'Admin XP', pass: 'admin1234' },
      {
        email: 'joao@xp.com',
        role: 'assessor',
        name: 'João Silva',
        pass: 'joao1234',
        esp: 'Renda Fixa e Variável',
      },
      {
        email: 'carlos@xp.com',
        role: 'assessor',
        name: 'Carlos Santos',
        pass: 'carlos1234',
        esp: 'Fundos Imobiliários',
      },
      {
        email: 'marina@xp.com',
        role: 'assessor',
        name: 'Marina Costa',
        pass: 'marina1234',
        esp: 'Câmbio e Proteção Patrimonial',
      },
    ]

    const assessoresCol = app.findCollectionByNameOrId('assessores')

    for (const u of seedUsers) {
      let userRec
      try {
        userRec = app.findAuthRecordByEmail('users', u.email)
      } catch (_) {
        userRec = new Record(users)
        userRec.setEmail(u.email)
        userRec.setPassword(u.pass)
        userRec.setVerified(true)
        userRec.set('role', u.role)
        userRec.set('name', u.name)
        app.save(userRec)
      }

      if (u.role === 'assessor') {
        try {
          app.findFirstRecordByData('assessores', 'user_id', userRec.id)
        } catch (_) {
          const assRec = new Record(assessoresCol)
          assRec.set('user_id', userRec.id)
          assRec.set('nome', u.name)
          assRec.set('especialidades', u.esp)
          assRec.set('ativo', true)
          app.save(assRec)
        }
      }
    }
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'
    app.save(users)
  },
)
