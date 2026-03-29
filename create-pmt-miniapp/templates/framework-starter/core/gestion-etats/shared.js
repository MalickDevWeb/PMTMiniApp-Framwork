function estObjetSimple(valeur) {
  return Object.prototype.toString.call(valeur) === '[object Object]'
}

function cleValide(cle) {
  return typeof cle === 'string' && cle.trim().length > 0
}

function creerNoopUnsubscribe() {
  return () => {}
}

function creerNoopLogger() {
  return {
    warn() {},
    error() {},
  }
}

function normaliserLogger(logger) {
  if (!estObjetSimple(logger)) return console

  const loggerNormalise = {
    ...creerNoopLogger(),
  }

  if (typeof logger.warn === 'function') {
    loggerNormalise.warn = logger.warn.bind(logger)
  }

  if (typeof logger.error === 'function') {
    loggerNormalise.error = logger.error.bind(logger)
  }

  return loggerNormalise
}

function initialiserNoyauEtat(noyau = {}) {
  const noyauValide = estObjetSimple(noyau) ? noyau : {}

  if (!estObjetSimple(noyauValide.state)) {
    noyauValide.state = {}
  }

  if (!estObjetSimple(noyauValide.listeners)) {
    noyauValide.listeners = {}
  }

  return noyauValide
}

function lireListenersParCle(noyau, cle) {
  if (!Array.isArray(noyau.listeners[cle])) {
    noyau.listeners[cle] = []
  }

  return noyau.listeners[cle]
}

function lireListenersExistants(noyau, cle) {
  return Array.isArray(noyau.listeners[cle]) ? noyau.listeners[cle] : []
}

module.exports = {
  cleValide,
  creerNoopUnsubscribe,
  creerNoopLogger,
  estObjetSimple,
  initialiserNoyauEtat,
  lireListenersExistants,
  lireListenersParCle,
  normaliserLogger,
}
