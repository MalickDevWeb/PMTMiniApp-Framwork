const {
  creerDefinitionApp,
  creerNoyauApp,
} = require('./core/app-bootstrap/index')

App(
  creerDefinitionApp({
    initialiserNoyau: creerNoyauApp,
  })
)
