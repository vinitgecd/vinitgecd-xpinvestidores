migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')
    const defaults = [
      { key: 'header_logo', value: null },
      { key: 'header_company_name', value: 'XP Investimentos' },
      { key: 'footer_address', value: 'Av. Brigadeiro Faria Lima, 3600 - SP' },
      { key: 'footer_phone', value: '(11) 99999-9999' },
      { key: 'footer_email', value: 'contato@assessoresxp.com.br' },
      {
        key: 'footer_social_links',
        value: [
          { platform: 'linkedin', url: 'https://linkedin.com' },
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'whatsapp', url: 'https://wa.me/5511999999999' },
        ],
      },
      {
        key: 'footer_copyright',
        value:
          'As informações apresentadas nesta página têm caráter meramente informativo e não constituem qualquer tipo de aconselhamento de investimentos. Rentabilidade passada não é garantia de rentabilidade futura.\n\n© 2026 XP Investimentos. Todos os direitos reservados.',
      },
    ]

    for (const item of defaults) {
      try {
        app.findFirstRecordByData('site_settings', 'setting_key', item.key)
      } catch (_) {
        const record = new Record(col)
        record.set('setting_key', item.key)
        record.set('setting_value', item.value)
        app.save(record)
      }
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')
    const defaults = [
      'header_logo',
      'header_company_name',
      'footer_address',
      'footer_phone',
      'footer_email',
      'footer_social_links',
      'footer_copyright',
    ]
    for (const key of defaults) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'setting_key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
