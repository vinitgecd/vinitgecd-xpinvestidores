routerAdd(
  'POST',
  '/backend/v1/delete-advisor',
  (e) => {
    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Sem permissão')
    }

    const body = e.requestInfo().body || {}
    const assessorId = body.assessorId

    if (!assessorId) {
      return e.badRequestError('Assessor não informado')
    }

    try {
      $app.runInTransaction((txApp) => {
        let assessor
        try {
          assessor = txApp.findRecordById('assessores', assessorId)
        } catch (_) {
          throw new Error('Assessor não encontrado')
        }

        const userId = assessor.getString('user_id')

        // Update clients to nullify the relation safely
        if (userId) {
          let clients = []
          try {
            clients = txApp.findRecordsByFilter('clientes', `user_id = '${userId}'`, '', 10000, 0)
          } catch (_) {}

          for (const client of clients) {
            client.set('user_id', '')
            txApp.save(client)
          }
        }

        // Delete assessor
        txApp.delete(assessor)

        // Delete user if it exists
        if (userId) {
          try {
            const user = txApp.findRecordById('users', userId)
            txApp.delete(user)
          } catch (_) {}
        }
      })

      return e.json(200, { success: true, message: 'Assessor deletado com sucesso' })
    } catch (err) {
      $app.logger().error('Erro ao excluir assessor', 'error', err.message)
      return e.badRequestError('Erro ao excluir assessor')
    }
  },
  $apis.requireAuth(),
)
