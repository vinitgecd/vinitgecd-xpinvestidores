migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('users')
    const users = [
      { email: 'admin@xp.com', pass: 'admin123', role: 'admin', name: 'Admin XP' },
      { email: 'joao@xp.com', pass: 'joao1234', role: 'assessor', name: 'João Silva' },
      { email: 'carlos@xp.com', pass: 'carlos1234', role: 'assessor', name: 'Carlos Oliveira' },
      { email: 'marina@xp.com', pass: 'marina1234', role: 'assessor', name: 'Marina Santos' },
    ]

    for (const u of users) {
      try {
        app.findAuthRecordByEmail('users', u.email)
      } catch (_) {
        const record = new Record(usersCol)
        record.setEmail(u.email)
        record.setPassword(u.pass)
        record.set('role', u.role)
        record.set('name', u.name)
        record.setVerified(true)
        app.save(record)
      }
    }
  },
  (app) => {
    // down migration
  },
)
