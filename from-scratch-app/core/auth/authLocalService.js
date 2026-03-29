function creerAuthLocalService(options = {}) {
  const actions = options.actions
  const sessionService = options.sessionService

  if (!actions) {
    throw new Error('actions auth communes requises')
  }

  async function login(payload = {}) {
    return actions.ouvrirSessionLocale(payload)
  }

  async function restaurer() {
    if (actions.estConnecte()) return true
    if (!sessionService || typeof sessionService.restaurerToken !== 'function') return false

    const ok = await sessionService.restaurerToken()
    if (!ok) return false

    return actions.estConnecte()
  }

  async function logout() {
    return actions.fermerSessionLocale()
  }

  async function restaurerDepuisApi() {
    return false
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
  creerAuthLocalService,
}
