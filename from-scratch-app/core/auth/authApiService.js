const { estObjetSimple } = require('./auth.shared')

function normaliserApiClient(apiClient = {}) {
  return {
    login: typeof apiClient.login === 'function' ? apiClient.login.bind(apiClient) : null,
    sessionCourante: typeof apiClient.sessionCourante === 'function'
      ? apiClient.sessionCourante.bind(apiClient)
      : null,
    logout: typeof apiClient.logout === 'function' ? apiClient.logout.bind(apiClient) : null,
  }
}

function creerAuthApiService(options = {}) {
  const actions = options.actions
  const sessionService = options.sessionService
  const apiClient = normaliserApiClient(options.apiClient)
  const logger = options.logger || console

  if (!actions) {
    throw new Error('actions auth communes requises')
  }

  async function login(payload = {}) {
    if (!apiClient.login) return false

    try {
      const reponse = await apiClient.login(payload)
      if (!estObjetSimple(reponse)) return false

      return actions.ouvrirSessionLocale(reponse)
    } catch (error) {
      if (typeof logger.error === 'function') {
        logger.error('[authApiService] login fail:', error)
      }

      return false
    }
  }

  async function restaurer() {
    if (!actions.estConnecte()) {
      if (!sessionService || typeof sessionService.restaurerToken !== 'function') {
        return false
      }

      const okRestaurationLocale = await sessionService.restaurerToken()
      if (!okRestaurationLocale || !actions.estConnecte()) return false
    }

    if (!apiClient.sessionCourante) return true

    try {
      const reponse = await apiClient.sessionCourante({
        token: sessionService.lireToken(''),
      })

      if (!estObjetSimple(reponse)) return false

      return actions.hydraterDepuisPayload(reponse)
    } catch (error) {
      if (typeof logger.error === 'function') {
        logger.error('[authApiService] restaurer fail:', error)
      }

      return false
    }
  }

  async function logout() {
    if (apiClient.logout && actions.estConnecte()) {
      try {
        await apiClient.logout({
          token: sessionService.lireToken(''),
        })
      } catch (error) {
        if (typeof logger.warn === 'function') {
          logger.warn('[authApiService] logout distant fail:', error)
        }
      }
    }

    return actions.fermerSessionLocale()
  }

  async function restaurerDepuisApi(chargerSessionCourante) {
    if (typeof chargerSessionCourante !== 'function') return restaurer()
    if (!actions.estConnecte()) return false

    try {
      const reponse = await chargerSessionCourante({
        token: sessionService.lireToken(''),
      })

      if (!estObjetSimple(reponse)) return false

      return actions.hydraterDepuisPayload(reponse)
    } catch (error) {
      if (typeof logger.error === 'function') {
        logger.error('[authApiService] restaurerDepuisApi fail:', error)
      }

      return false
    }
  }

  return {
    login,
    restaurer,
    logout,
    estConnecte: actions.estConnecte,
    ouvrirSession: actions.ouvrirSessionLocale,
    hydraterDepuisApi: actions.hydraterDepuisPayload,
    restaurerDepuisApi,
    deconnecter: logout,
  }
}

module.exports = {
  creerAuthApiService,
}
