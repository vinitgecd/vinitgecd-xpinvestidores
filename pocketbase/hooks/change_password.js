routerAdd(
  'POST',
  '/backend/v1/change-password',
  (e) => {
    const authRecord = e.auth
    if (!authRecord) {
      return e.unauthorizedError('Não autorizado.')
    }

    const body = e.requestInfo().body || {}
    const newPassword = body.newPassword

    if (!newPassword || newPassword.length < 6) {
      return e.badRequestError('A nova senha deve ter pelo menos 6 caracteres.')
    }

    authRecord.setPassword(newPassword)
    $app.save(authRecord)

    return e.json(200, { message: 'Senha alterada com sucesso!' })
  },
  $apis.requireAuth(),
)
