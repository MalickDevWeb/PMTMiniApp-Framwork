const {
  cleValide,
  creerNoopUnsubscribe,
  initialiserNoyauEtat,
  lireListenersExistants,
  lireListenersParCle,
  normaliserLogger,
} = require('./shared')

function gestionnaireEtat(noyau = {}, options = {}) {
  const noyauEtat = initialiserNoyauEtat(noyau)
  const logger = normaliserLogger(options.logger)

  function notifier(cle, valeur) {
    const callbacks = lireListenersExistants(noyauEtat, cle).slice()
    callbacks.forEach((callback) => {
      try {
        callback(valeur)
      } catch (error) {
        logger.error('[gestionnaireEtat] callback error:', error)
      }
    })
  }

  function set(cle, valeur) {
    if (!cleValide(cle)) {
      logger.warn('[gestionnaireEtat] set: cle invalide', cle)
      return false
    }

    noyauEtat.state[cle] = valeur
    notifier(cle, valeur)
    return true
  }

  function get(cle, valeurParDefaut = '') {
    if (!cleValide(cle)) {
      logger.warn('[gestionnaireEtat] get: cle invalide', cle)
      return valeurParDefaut
    }

    return cle in noyauEtat.state ? noyauEtat.state[cle] : valeurParDefaut
  }

  function onState(cle, callback) {
    if (!cleValide(cle)) {
      logger.warn('[gestionnaireEtat] onState: cle invalide', cle)
      return creerNoopUnsubscribe()
    }

    if (typeof callback !== 'function') {
      logger.warn('[gestionnaireEtat] onState: callback invalide')
      return creerNoopUnsubscribe()
    }

    const callbacks = lireListenersParCle(noyauEtat, cle)
    callbacks.push(callback)

    let actif = true
    return () => {
      if (!actif) return

      actif = false
      const listenersRestants = lireListenersExistants(noyauEtat, cle).filter((cb) => cb !== callback)
      if (listenersRestants.length === 0) {
        delete noyauEtat.listeners[cle]
        return
      }

      noyauEtat.listeners[cle] = listenersRestants
    }
  }

  function remove(cle) {
    if (!cleValide(cle)) {
      logger.warn('[gestionnaireEtat] remove: cle invalide', cle)
      return false
    }

    if (!(cle in noyauEtat.state)) return false

    delete noyauEtat.state[cle]
    notifier(cle, undefined)
    return true
  }

  return { set, get, onState, remove }
}

module.exports = {
  gestionnaireEtat,
}
