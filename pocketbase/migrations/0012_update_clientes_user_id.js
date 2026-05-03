migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    const field = col.fields.getByName('user_id')
    if (field) {
      field.required = false
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    const field = col.fields.getByName('user_id')
    if (field) {
      field.required = true
      app.save(col)
    }
  },
)
