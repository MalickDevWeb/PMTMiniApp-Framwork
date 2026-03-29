const MARQUEUR_FORMAT_STORAGE = '__fromScratchStorage'
const VERSION_FORMAT_STORAGE = 1

function cleStorageValide(cle) {
  return typeof cle === 'string' && cle.trim().length > 0
}

function normaliserCleStorage(cle) {
  return cleStorageValide(cle) ? cle.trim() : ''
}

function estObjetSimple(valeur) {
  return !!valeur && typeof valeur === 'object' && !Array.isArray(valeur)
}

function normaliserListeClesStorage(cles = []) {
  if (!Array.isArray(cles)) return null

  const listeNettoyee = cles
    .filter((cle) => cleStorageValide(cle))
    .map((cle) => normaliserCleStorage(cle))

  if (listeNettoyee.length === 0) return null
  return new Set(listeNettoyee)
}

function cleStorageAutorisee(cle, ensembleClesAutorisees) {
  if (!ensembleClesAutorisees || ensembleClesAutorisees.size === 0) return true
  return ensembleClesAutorisees.has(normaliserCleStorage(cle))
}

function normaliserLogger(logger = console) {
  return {
    warn: typeof logger.warn === 'function' ? logger.warn.bind(logger) : () => {},
    error: typeof logger.error === 'function' ? logger.error.bind(logger) : () => {},
  }
}

function normaliserClientStorage(client) {
  return client && typeof client === 'object' ? client : null
}

function construireErreurStorage(message, details = {}) {
  const error = new Error(message)
  error.details = details
  return error
}

function methodeStorageDisponible(client, nomMethode) {
  return !!(client && typeof client[nomMethode] === 'function')
}

function erreurCleAbsente(error) {
  if (!error || typeof error.errMsg !== 'string') return false

  const message = error.errMsg.toLowerCase()
  return message.includes('data not found') || message.includes('not found')
}

function analyserExpirationStorage(options = {}) {
  if (!estObjetSimple(options)) {
    return { ok: true, expireAt: null }
  }

  if (Object.prototype.hasOwnProperty.call(options, 'expireAt')) {
    const expireAt = options.expireAt instanceof Date
      ? options.expireAt.getTime()
      : options.expireAt

    if (!Number.isFinite(expireAt) || expireAt <= 0) {
      return { ok: false, raison: 'expireAt invalide' }
    }

    return { ok: true, expireAt }
  }

  if (Object.prototype.hasOwnProperty.call(options, 'dureeExpirationMs')) {
    const dureeExpirationMs = options.dureeExpirationMs

    if (!Number.isFinite(dureeExpirationMs) || dureeExpirationMs <= 0) {
      return { ok: false, raison: 'dureeExpirationMs invalide' }
    }

    return { ok: true, expireAt: Date.now() + dureeExpirationMs }
  }

  if (Object.prototype.hasOwnProperty.call(options, 'ttlMs')) {
    const ttlMs = options.ttlMs

    if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
      return { ok: false, raison: 'ttlMs invalide' }
    }

    return { ok: true, expireAt: Date.now() + ttlMs }
  }

  return { ok: true, expireAt: null }
}

function construireEnveloppeStorage(valeur, options = {}) {
  const expiration = analyserExpirationStorage(options)
  if (!expiration.ok) return null

  return {
    [MARQUEUR_FORMAT_STORAGE]: true,
    version: VERSION_FORMAT_STORAGE,
    value: valeur,
    expireAt: expiration.expireAt,
    updatedAt: Date.now(),
  }
}

function estEnveloppeStorageVersionnee(donnee) {
  return estObjetSimple(donnee) && donnee[MARQUEUR_FORMAT_STORAGE] === true
}

function analyserDonneeStorage(donnee, now = Date.now()) {
  if (!estEnveloppeStorageVersionnee(donnee)) {
    return {
      statut: 'legacy',
      valeur: donnee,
    }
  }

  if (donnee.version !== VERSION_FORMAT_STORAGE) {
    return {
      statut: 'version-invalide',
      version: donnee.version,
    }
  }

  if (!Object.prototype.hasOwnProperty.call(donnee, 'value')) {
    return {
      statut: 'format-invalide',
    }
  }

  if (donnee.expireAt !== null && typeof donnee.expireAt !== 'undefined') {
    if (!Number.isFinite(donnee.expireAt) || donnee.expireAt <= 0) {
      return {
        statut: 'format-invalide',
      }
    }

    if (donnee.expireAt <= now) {
      return {
        statut: 'expire',
        valeur: donnee.value,
        expireAt: donnee.expireAt,
      }
    }
  }

  return {
    statut: 'ok',
    valeur: donnee.value,
    expireAt: typeof donnee.expireAt === 'number' ? donnee.expireAt : null,
    version: donnee.version,
    updatedAt: typeof donnee.updatedAt === 'number' ? donnee.updatedAt : null,
  }
}

module.exports = {
  MARQUEUR_FORMAT_STORAGE,
  VERSION_FORMAT_STORAGE,
  cleStorageValide,
  estObjetSimple,
  normaliserCleStorage,
  normaliserListeClesStorage,
  cleStorageAutorisee,
  normaliserClientStorage,
  normaliserLogger,
  construireErreurStorage,
  methodeStorageDisponible,
  erreurCleAbsente,
  analyserExpirationStorage,
  construireEnveloppeStorage,
  estEnveloppeStorageVersionnee,
  analyserDonneeStorage,
}
