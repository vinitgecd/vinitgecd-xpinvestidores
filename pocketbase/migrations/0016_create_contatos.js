migrate(
  (app) => {
    const collection = new Collection({
      name: 'contatos',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        {
          name: 'tipo',
          type: 'select',
          required: true,
          values: ['whatsapp', 'email', 'telefone'],
          maxSelect: 1,
        },
        { name: 'valor', type: 'text', required: true },
        { name: 'descricao', type: 'text', max: 200 },
        { name: 'ativo', type: 'bool', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_contatos_tipo ON contatos (tipo)',
        'CREATE INDEX idx_contatos_ativo ON contatos (ativo)',
        'CREATE INDEX idx_contatos_updated ON contatos (updated DESC)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('contatos')
    app.delete(collection)
  },
)
