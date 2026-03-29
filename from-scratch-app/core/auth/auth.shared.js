const { estObjetSimple, normaliserLogger } = require('../gestion-etats/shared')

function normaliserToken(token) {
  return typeof token === 'string' ? token.trim() : ''
}

function normaliserOptionsSession(payload = {}) {
  const optionsSession = {}

  if (Number.isFinite(payload.dureeExpirationMs) && payload.dureeExpirationMs > 0) {
    optionsSession.dureeExpirationMs = payload.dureeExpirationMs
  } else if (Number.isFinite(payload.expireAt) && payload.expireAt > 0) {
    optionsSession.expireAt = payload.expireAt
  } else if (Number.isFinite(payload.expiresInSeconds) && payload.expiresInSeconds > 0) {
    optionsSession.dureeExpirationMs = payload.expiresInSeconds * 1000
  }

  return optionsSession
}

function dependancesDisponibles(options = {}) {
  const sessionService = options.sessionService
  const utilisateurService = options.utilisateurService
  const compteService = options.compteService

  return !!(
    sessionService
    && typeof sessionService.sauvegarderToken === 'function'
    && typeof sessionService.supprimerToken === 'function'
    && typeof sessionService.estConnecte === 'function'
    && utilisateurService
    && typeof utilisateurService.hydraterUtilisateur === 'function'
    && typeof utilisateurService.supprimerUtilisateur === 'function'
    && compteService
    && typeof compteService.hydraterCompte === 'function'
    && typeof compteService.supprimerCompte === 'function'
  )
}

function creerActionsAuthCommunes(options = {}) {
  const sessionService = options.sessionService
  const utilisateurService = options.utilisateurService
  const compteService = options.compteService
  const logger = normaliserLogger(options.logger)

  async function ouvrirSessionLocale(payload = {}) {
    if (!dependancesDisponibles(options) || !estObjetSimple(payload)) return false

    const token = normaliserToken(payload.token)
    if (!token) return false

    const okToken = await sessionService.sauvegarderToken(token, normaliserOptionsSession(payload))
    if (!okToken) return false

    let okHydratation = true

    if (estObjetSimple(payload.utilisateur)) {
      okHydratation = utilisateurService.hydraterUtilisateur(payload.utilisateur) && okHydratation
    }

    if (estObjetSimple(payload.compte)) {
      okHydratation = compteService.hydraterCompte(payload.compte) && okHydratation
    }

    if (okHydratation) return true

    logger.error('[auth] ouvrirSessionLocale: echec hydratation utilisateur/compte')

    await sessionService.supprimerToken()
    utilisateurService.supprimerUtilisateur()
    compteService.supprimerCompte()
    return false
  }

  function hydraterDepuisPayload(payload = {}) {
    if (!dependancesDisponibles(options) || !estObjetSimple(payload)) return false

    let ok = true

    if (estObjetSimple(payload.utilisateur)) {
      ok = utilisateurService.hydraterUtilisateur(payload.utilisateur) && ok
    }

    if (estObjetSimple(payload.compte)) {
      ok = compteService.hydraterCompte(payload.compte) && ok
    }

    return ok
  }

  async function fermerSessionLocale() {
    if (!dependancesDisponibles(options)) return false

    const okToken = await sessionService.supprimerToken()
    const okUtilisateur = utilisateurService.supprimerUtilisateur()
    const okCompte = compteService.supprimerCompte()

    return !!(okToken || okUtilisateur || okCompte)
  }

  function estConnecte() {
    if (!sessionService || typeof sessionService.estConnecte !== 'function') return false
    return sessionService.estConnecte()
  }

  return {
    ouvrirSessionLocale,
    hydraterDepuisPayload,
    fermerSessionLocale,
    estConnecte,
    logger,
  }
}

module.exports = {
  creerActionsAuthCommunes,
  dependancesDisponibles,
  estObjetSimple,
  normaliserOptionsSession,
  normaliserToken,
}
