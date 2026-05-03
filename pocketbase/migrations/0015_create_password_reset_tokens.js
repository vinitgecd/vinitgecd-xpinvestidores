migrate(
  (app) => {
    const collection = new Collection({
      name: 'password_reset_tokens',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'reset_code', type: 'text', required: true },
        { name: 'expires_at', type: 'date', required: true },
        { name: 'used', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_pwd_reset_code ON password_reset_tokens (reset_code)',
        'CREATE INDEX idx_pwd_reset_user ON password_reset_tokens (user_id)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('password_reset_tokens')
    app.delete(collection)
  },
)
