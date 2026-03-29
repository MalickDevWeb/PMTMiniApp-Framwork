function estObjetSimple(valeur) {
  return Object.prototype.toString.call(valeur) === '[object Object]'
}

function normaliserBaseUrl(baseUrl) {
  return typeof baseUrl === 'string' ? baseUrl.trim().replace(/\/+$/, '') : ''
}

function normaliserChemin(path) {
  if (typeof path !== 'string') return ''

  const chemin = path.trim()
  if (!chemin) return ''
  if (/^https?:\/\//i.test(chemin)) return chemin

  return chemin.startsWith('/') ? chemin : `/${chemin}`
}

function construireUrl(baseUrl, path) {
  const baseUrlNettoyee = normaliserBaseUrl(baseUrl)
  const chemin = normaliserChemin(path)

  if (!chemin) return baseUrlNettoyee
  if (/^https?:\/\//i.test(chemin)) return chemin
  if (!baseUrlNettoyee) return chemin

  return `${baseUrlNettoyee}${chemin}`
}

function normaliserMethod(method) {
  return typeof method === 'string' && method.trim()
    ? method.trim().toUpperCase()
    : 'GET'
}

function normaliserHeaders(headers) {
  return estObjetSimple(headers) ? { ...headers } : {}
}

function normaliserTimeout(timeoutMs, timeoutParDefaut) {
  if (Number.isFinite(timeoutMs) && timeoutMs > 0) return timeoutMs
  if (Number.isFinite(timeoutParDefaut) && timeoutParDefaut > 0) return timeoutParDefaut
  return 10000
}

function normaliserClientApi(clientSource) {
  if (clientSource && typeof clientSource.request === 'function') {
    return {
      request: clientSource.request.bind(clientSource),
    }
  }

  return null
}

function construireErreurApi(message, details = {}) {
  const erreur = new Error(message)
  erreur.isApiError = true

  Object.keys(details).forEach((cle) => {
    erreur[cle] = details[cle]
  })

  return erreur
}

function reponseSucces(statusCode) {
  return Number.isInteger(statusCode) && statusCode >= 200 && statusCode < 300
}

function normaliserLogger(logger) {
  if (!estObjetSimple(logger)) return console

  return {
    warn: typeof logger.warn === 'function' ? logger.warn.bind(logger) : () => {},
    error: typeof logger.error === 'function' ? logger.error.bind(logger) : () => {},
  }
}

module.exports = {
  construireErreurApi,
  construireUrl,
  estObjetSimple,
  normaliserBaseUrl,
  normaliserChemin,
  normaliserClientApi,
  normaliserHeaders,
  normaliserLogger,
  normaliserMethod,
  normaliserTimeout,
  reponseSucces,
}
