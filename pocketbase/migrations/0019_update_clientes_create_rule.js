migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    // Allow public creation of leads
    col.createRule = ''
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')
    // Revert back to authenticated only
    col.createRule = "@request.auth.id != ''"
    app.save(col)
  },
)
