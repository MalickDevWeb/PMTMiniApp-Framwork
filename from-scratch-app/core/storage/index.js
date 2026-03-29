const { serviceStorage } = require('./serviceStorage')
const { creerSessionStorageService, creerSessionService } = require('./session/index')
const {
  definitionsStorageSimples,
  creerServicesStorageSimples,
  creerProfilStorageService,
} = require('./simples/index')
const { creerRestaurationStorageService } = require('./restaurationStorageService')
const { clesStorage } = require('./clesStorage')

module.exports = {
  clesStorage,
  definitionsStorageSimples,
  serviceStorage,
  creerSessionStorageService,
  creerSessionService,
  creerServicesStorageSimples,
  creerProfilStorageService,
  creerRestaurationStorageService,
}
