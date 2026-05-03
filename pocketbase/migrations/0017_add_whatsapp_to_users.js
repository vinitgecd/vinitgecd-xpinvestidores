migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('whatsapp')) {
      col.fields.add(new TextField({ name: 'whatsapp' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (col.fields.getByName('whatsapp')) {
      col.fields.removeByName('whatsapp')
    }
    app.save(col)
  },
)
