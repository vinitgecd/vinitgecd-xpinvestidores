migrate(
  (app) => {
    app.db().newQuery('DELETE FROM assessores').execute()
    app.db().newQuery('DELETE FROM users').execute()
  },
  (app) => {
    // down migration
  },
)
