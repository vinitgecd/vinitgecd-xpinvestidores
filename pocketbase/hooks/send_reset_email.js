routerAdd('POST', '/backend/v1/send-password-reset-email', (e) => {
  const body = e.requestInfo().body || {}
  const email = body.email
  if (!email) {
    return e.badRequestError('Email is required')
  }

  try {
    const user = $app.findAuthRecordByEmail('users', email)

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Expiration date (10 mins from now)
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString().replace('T', ' ')

    const tokens = $app.findCollectionByNameOrId('password_reset_tokens')
    const record = new Record(tokens)
    record.set('user_id', user.id)
    record.set('reset_code', code)
    record.set('expires_at', expiresAt)
    record.set('used', false)

    $app.save(record)

    $app.logger().info('Password reset code generated', 'email', email, 'code', code)

    const resendKey = $secrets.get('RESEND_API_KEY')
    if (resendKey) {
      $http.send({
        url: 'https://api.resend.com/emails',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + resendKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@resend.dev',
          to: email,
          subject: 'Codigo de recuperacao de senha',
          html: `<p>Olá,</p><p>Seu código de recuperação de senha é: <strong>${code}</strong></p><p>Este código expira em 10 minutos.</p>`,
        }),
        timeout: 10,
      })
    }
  } catch (err) {
    $app
      .logger()
      .info(
        'Password reset requested for non-existent email or error occurred',
        'email',
        email,
        'error',
        String(err),
      )
  }

  // Security: return success even if user doesn't exist to prevent email enumeration
  return e.json(200, { message: 'Se o email existe, voce recebera um codigo' })
})
