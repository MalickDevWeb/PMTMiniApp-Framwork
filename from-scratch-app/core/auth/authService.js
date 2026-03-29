const { creerActionsAuthCommunes } = require('./auth.shared')
const { creerAuthApiService } = require('./authApiService')
const { creerAuthLocalService } = require('./authLocalService')

function creerAuthService(options = {}) {
  const strategie = options.strategie === 'api' ? 'api' : 'local'
  const actions = creerActionsAuthCommunes(options)

  const serviceStrategie = strategie === 'api'
    ? creerAuthApiService({
      ...options,
      actions,
    })
    : creerAuthLocalService({
      ...options,
      actions,
    })

  return {
    strategie,
    login: serviceStrategie.login,
    restaurer: serviceStrategie.restaurer,
    logout: serviceStrategie.logout,
    estConnecte: serviceStrategie.estConnecte,
    ouvrirSession: serviceStrategie.ouvrirSession,
    hydraterDepuisApi: serviceStrategie.hydraterDepuisApi,
    restaurerDepuisApi: serviceStrategie.restaurerDepuisApi,
    deconnecter: serviceStrategie.deconnecter,
  }
}

module.exports = {
  creerAuthService,
}
