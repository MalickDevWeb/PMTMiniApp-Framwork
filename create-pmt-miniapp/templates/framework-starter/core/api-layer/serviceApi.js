const {
  construireErreurApi,
  construireUrl,
  estObjetSimple,
  normaliserClientApi,
  normaliserHeaders,
  normaliserLogger,
  normaliserMethod,
  normaliserTimeout,
  reponseSucces,
} = require('./api.shared')

function serviceApi(options = {}) {
  const clientSource = typeof options.client !== 'undefined'
    ? options.client
    : (typeof wx !== 'undefined' ? wx : null)
  const client = normaliserClientApi(clientSource)
  const baseUrl = typeof options.baseUrl === 'string' ? options.baseUrl : ''
  const timeoutParDefaut = normaliserTimeout(options.timeoutMs, 10000)
  const sessionService = options.sessionService
  const logger = normaliserLogger(options.logger)
  const onUnauthorized = typeof options.onUnauthorized === 'function'
    ? options.onUnauthorized
    : null

  function tokenDisponible() {
    return !!(
      sessionService
      && typeof sessionService.lireToken === 'function'
    )
  }

  function lireToken() {
    if (!tokenDisponible()) return ''
    return sessionService.lireToken('')
  }

  function construireHeaders(optionsRequete = {}) {
    const headers = normaliserHeaders(optionsRequete.headers)

    if (!headers.Accept && !headers.accept) {
      headers.Accept = 'application/json'
    }

    if (optionsRequete.auth === true) {
      const token = lireToken()

      if (token && !headers.Authorization && !headers.authorization) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  function requeteDetaillee(optionsRequete = {}) {
    if (!client || typeof client.request !== 'function') {
      return Promise.reject(construireErreurApi('client api indisponible'))
    }

    const method = normaliserMethod(optionsRequete.method)
    const url = construireUrl(baseUrl, optionsRequete.url || optionsRequete.path || '')
    const timeout = normaliserTimeout(optionsRequete.timeoutMs, timeoutParDefaut)
    const headers = construireHeaders(optionsRequete)

    if (!url) {
      return Promise.reject(construireErreurApi('url api invalide', {
        method,
      }))
    }

    return new Promise((resolve, reject) => {
      client.request({
        url,
        method,
        data: optionsRequete.data,
        header: headers,
        timeout,
        success: async (reponse) => {
          const statusCode = Number.isInteger(reponse.statusCode) ? reponse.statusCode : 0
          const resultat = {
            data: reponse.data,
            statusCode,
            headers: estObjetSimple(reponse.header) ? reponse.header : {},
            cookies: Array.isArray(reponse.cookies) ? reponse.cookies : [],
            url,
            method,
          }

          if (reponseSucces(statusCode)) {
            resolve(resultat)
            return
          }

          const erreur = construireErreurApi('requete api en echec', {
            statusCode,
            data: reponse.data,
            url,
            method,
          })

          if (statusCode === 401 && onUnauthorized) {
            try {
              await onUnauthorized(erreur)
            } catch (hookError) {
              logger.warn('[serviceApi] onUnauthorized fail:', hookError)
            }
          }

          reject(erreur)
        },
        fail: (error) => {
          reject(construireErreurApi('requete api impossible', {
            url,
            method,
            error,
          }))
        },
      })
    })
  }

  function requete(optionsRequete = {}) {
    return requeteDetaillee(optionsRequete).then((resultat) => resultat.data)
  }

  function get(path, optionsRequete = {}) {
    return requete({
      ...optionsRequete,
      path,
      method: 'GET',
    })
  }

  function post(path, data, optionsRequete = {}) {
    return requete({
      ...optionsRequete,
      path,
      data,
      method: 'POST',
    })
  }

  function put(path, data, optionsRequete = {}) {
    return requete({
      ...optionsRequete,
      path,
      data,
      method: 'PUT',
    })
  }

  function patch(path, data, optionsRequete = {}) {
    return requete({
      ...optionsRequete,
      path,
      data,
      method: 'PATCH',
    })
  }

  function supprimer(path, optionsRequete = {}) {
    return requete({
      ...optionsRequete,
      path,
      method: 'DELETE',
    })
  }

  return {
    requete,
    requeteDetaillee,
    get,
    post,
    put,
    patch,
    supprimer,
  }
}

module.exports = {
  serviceApi,
}
