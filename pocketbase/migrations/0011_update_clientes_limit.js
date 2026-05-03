migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    const field = col.fields.getByName('valor_investido')

    if (field) {
      field.min = 0
      field.max = 9999999.99
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    const field = col.fields.getByName('valor_investido')

    if (field) {
      field.min = 0
      field.max = 999999.99
      app.save(col)
    }
  },
)
