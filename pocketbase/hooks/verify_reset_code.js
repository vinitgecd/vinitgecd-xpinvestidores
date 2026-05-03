routerAdd('POST', '/backend/v1/verify-reset-code', (e) => {
  const body = e.requestInfo().body || {}
  const email = body.email
  const code = body.code
  const newPassword = body.newPassword

  if (!email || !code || !newPassword || newPassword.length < 6) {
    return e.badRequestError('Dados inválidos. A nova senha deve ter pelo menos 6 caracteres.')
  }

  try {
    const user = $app.findAuthRecordByEmail('users', email)

    const now = new Date().toISOString().replace('T', ' ')

    const token = $app.findFirstRecordByFilter(
      'password_reset_tokens',
      'user_id = {:userId} && reset_code = {:code} && used = false && expires_at > {:now}',
      { userId: user.id, code: code, now: now },
    )

    // Update password
    user.setPassword(newPassword)
    $app.save(user)

    // Mark token as used
    token.set('used', true)
    $app.save(token)

    return e.json(200, { message: 'Senha alterada com sucesso!' })
  } catch (err) {
    return e.badRequestError('Codigo invalido ou expirado')
  }
})
