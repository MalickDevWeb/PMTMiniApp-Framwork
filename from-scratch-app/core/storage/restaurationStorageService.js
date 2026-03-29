const { clesStorage } = require('./clesStorage')

function creerRestaurationStorageService(options = {}) {
  const etat = options.etat
  const sessionService = options.sessionService
  const sessionStorageService = options.sessionStorageService
  const profilStorageService = options.profilStorageService
  const logger = options.logger || console

  function peutEcrireEtat() {
    return !!(etat && typeof etat.set === 'function')
  }

  async function restaurerToken() {
    if (sessionService && typeof sessionService.restaurerToken === 'function') {
      return sessionService.restaurerToken()
    }

    if (!peutEcrireEtat()) return false
    if (!sessionStorageService || typeof sessionStorageService.lireToken !== 'function') {
      return false
    }

    const token = await sessionStorageService.lireToken('')
    if (typeof token !== 'string' || !token.trim()) {
      return false
    }

    return etat.set(clesStorage.SESSION_TOKEN, token.trim())
  }

  async function restaurerNom() {
    if (!peutEcrireEtat()) return false
    if (!profilStorageService || typeof profilStorageService.lireNom !== 'function') {
      return false
    }

    const nom = await profilStorageService.lireNom('')
    if (typeof nom !== 'string' || !nom.trim()) {
      return false
    }

    return etat.set(clesStorage.UTILISATEUR_NOM, nom.trim())
  }

  async function restaurer() {
    const resultats = await Promise.allSettled([
      restaurerToken(),
      restaurerNom(),
    ])

    if (resultats[0].status === 'rejected' && typeof logger.error === 'function') {
      logger.error('[restaurationStorageService] restaurerToken fail:', resultats[0].reason)
    }

    if (resultats[1].status === 'rejected' && typeof logger.error === 'function') {
      logger.error('[restaurationStorageService] restaurerNom fail:', resultats[1].reason)
    }

    return {
      token: resultats[0].status === 'fulfilled' ? resultats[0].value : false,
      nom: resultats[1].status === 'fulfilled' ? resultats[1].value : false,
    }
  }

  return {
    restaurer,
    restaurerToken,
    restaurerNom,
  }
}

module.exports = {
  creerRestaurationStorageService,
}
