migrate(
  (app) => {
    const collection = new Collection({
      name: 'clientes',
      type: 'base',
      listRule: "@request.auth.role = 'admin' || @request.auth.id = user_id",
      viewRule: "@request.auth.role = 'admin' || @request.auth.id = user_id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.role = 'admin' || @request.auth.id = user_id",
      deleteRule: "@request.auth.role = 'admin' || @request.auth.id = user_id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'nome', type: 'text', required: true, max: 100 },
        { name: 'email', type: 'email', required: true },
        { name: 'telefone', type: 'text', required: true },
        { name: 'valor_investido', type: 'number', required: true, min: 0, max: 999999.99 },
        { name: 'status', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_clientes_user_id_email ON clientes (user_id, email)',
        'CREATE INDEX idx_clientes_created ON clientes (created DESC)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('clientes')
    app.delete(collection)
  },
)
