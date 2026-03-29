const { sessionStorageConfig } = require('./sessionStorage.config')

function creerNoopUnsubscribe() {
  return () => {}
}

function creerSessionService(options = {}) {
  const etat = options.etat
  const sessionStorageService = options.sessionStorageService
  const logger = options.logger || console

  function lireEtatDisponible() {
    return !!(etat && typeof etat.get === 'function')
  }

  function ecrireEtatDisponible() {
    return !!(etat && typeof etat.set === 'function')
  }

  function supprimerEtatDisponible() {
    return !!(etat && typeof etat.remove === 'function')
  }

  function observerEtatDisponible() {
    return !!(etat && typeof etat.onState === 'function')
  }

  function storageDisponible(nomMethode) {
    return !!(sessionStorageService && typeof sessionStorageService[nomMethode] === 'function')
  }

  function normaliserToken(token) {
    return typeof token === 'string' ? token.trim() : ''
  }

  function lireToken(valeurParDefaut = sessionStorageConfig.valeurParDefaut) {
    if (!lireEtatDisponible()) return valeurParDefaut

    const token = normaliserToken(etat.get(sessionStorageConfig.cle, valeurParDefaut))
    return token || valeurParDefaut
  }

  function lireTokenStrict(valeurParDefaut = sessionStorageConfig.valeurParDefaut) {
    const token = lireToken(valeurParDefaut)
    if (typeof token === 'string' && token.trim()) {
      return token.trim()
    }

    throw new Error('token session absent dans l etat')
  }

  function lireTokenDepuisStorage(valeurParDefaut = sessionStorageConfig.valeurParDefaut) {
    if (!storageDisponible('lireToken')) {
      return Promise.resolve(valeurParDefaut)
    }

    return sessionStorageService.lireToken(valeurParDefaut)
  }

  function lireTokenDepuisStorageStrict(valeurParDefaut = sessionStorageConfig.valeurParDefaut) {
    if (!storageDisponible('lireTokenStrict')) {
      return Promise.reject(new Error('sessionStorageService indisponible'))
    }

    return sessionStorageService.lireTokenStrict(valeurParDefaut)
  }

  async function sauvegarderToken(token, optionsEcriture = {}) {
    const tokenNettoye = normaliserToken(token)
    if (!tokenNettoye) return false
    if (!ecrireEtatDisponible() || !storageDisponible('sauvegarderToken')) {
      return false
    }

    const okStorage = await sessionStorageService.sauvegarderToken(tokenNettoye, optionsEcriture)
    if (!okStorage) return false

    const okEtat = etat.set(sessionStorageConfig.cle, tokenNettoye)
    if (okEtat) return true

    if (typeof logger.error === 'function') {
      logger.error('[sessionService] sauvegarderToken: echec synchronisation etat')
    }

    await sessionStorageService.supprimerToken()
    return false
  }

  async function supprimerToken() {
    if (!storageDisponible('supprimerToken')) {
      return false
    }

    const okStorage = await sessionStorageService.supprimerToken()
    if (!okStorage) return false

    if (supprimerEtatDisponible()) {
      const etatSupprime = etat.remove(sessionStorageConfig.cle)
      if (etatSupprime) return true
      return lireToken(sessionStorageConfig.valeurParDefaut) === sessionStorageConfig.valeurParDefaut
    }

    return true
  }

  async function restaurerToken() {
    if (!ecrireEtatDisponible() || !storageDisponible('lireToken')) {
      return false
    }

    const token = normaliserToken(await sessionStorageService.lireToken(sessionStorageConfig.valeurParDefaut))
    if (!token) return false

    return etat.set(sessionStorageConfig.cle, token)
  }

  function onTokenChange(callback) {
    if (!observerEtatDisponible()) return creerNoopUnsubscribe()
    return etat.onState(sessionStorageConfig.cle, callback)
  }

  function estConnecte() {
    return lireToken(sessionStorageConfig.valeurParDefaut) !== sessionStorageConfig.valeurParDefaut
  }

  return {
    lireToken,
    lireTokenStrict,
    lireTokenDepuisStorage,
    lireTokenDepuisStorageStrict,
    sauvegarderToken,
    supprimerToken,
    restaurerToken,
    onTokenChange,
    estConnecte,
  }
}

module.exports = {
  creerSessionService,
}
