migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')

    const settings = [
      { key: 'header_whatsapp_number', value: '' },
      { key: 'header_whatsapp_icon', value: true },
    ]

    for (const s of settings) {
      try {
        app.findFirstRecordByData('site_settings', 'setting_key', s.key)
      } catch (_) {
        const record = new Record(col)
        record.set('setting_key', s.key)
        record.set('setting_value', s.value)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const r1 = app.findFirstRecordByData('site_settings', 'setting_key', 'header_whatsapp_number')
      app.delete(r1)
    } catch (_) {}

    try {
      const r2 = app.findFirstRecordByData('site_settings', 'setting_key', 'header_whatsapp_icon')
      app.delete(r2)
    } catch (_) {}
  },
)
