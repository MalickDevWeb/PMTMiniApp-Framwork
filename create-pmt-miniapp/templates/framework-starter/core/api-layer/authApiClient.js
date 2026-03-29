const { authApiConfig } = require('./authApi.config')

function estObjetSimple(valeur) {
  return Object.prototype.toString.call(valeur) === '[object Object]'
}

function lireValeurObjet(source, cles = [], valeurParDefaut = null) {
  for (const cle of cles) {
    if (source && typeof source === 'object' && Object.prototype.hasOwnProperty.call(source, cle)) {
      return source[cle]
    }
  }

  return valeurParDefaut
}

function mapperReponseLoginParDefaut(reponse) {
  return {
    token: lireValeurObjet(reponse, ['token', 'accessToken', 'access_token'], ''),
    expiresInSeconds: lireValeurObjet(reponse, ['expiresInSeconds', 'expiresIn', 'expires_in'], undefined),
    utilisateur: lireValeurObjet(reponse, ['utilisateur', 'user', 'profile'], null),
    compte: lireValeurObjet(reponse, ['compte', 'account'], null),
  }
}

function mapperReponseSessionCouranteParDefaut(reponse) {
  return {
    utilisateur: lireValeurObjet(reponse, ['utilisateur', 'user', 'profile'], null),
    compte: lireValeurObjet(reponse, ['compte', 'account'], null),
  }
}

function normaliserConfigOperation(configParDefaut, configOperation = {}) {
  return {
    path: typeof configOperation.path === 'string' ? configOperation.path : configParDefaut.path,
    method: typeof configOperation.method === 'string' ? configOperation.method : configParDefaut.method,
  }
}

function appelerOperation(apiService, configOperation, data, options = {}) {
  const method = String(configOperation.method || 'GET').toUpperCase()

  if (method === 'GET') {
    return apiService.get(configOperation.path, options)
  }

  if (method === 'DELETE') {
    return apiService.supprimer(configOperation.path, options)
  }

  if (method === 'PUT') {
    return apiService.put(configOperation.path, data, options)
  }

  if (method === 'PATCH') {
    return apiService.patch(configOperation.path, data, options)
  }

  return apiService.post(configOperation.path, data, options)
}

function creerAuthApiClient(apiService, options = {}) {
  if (!apiService) {
    throw new Error('apiService requis')
  }

  const loginConfig = normaliserConfigOperation(authApiConfig.login, options.login)
  const sessionCouranteConfig = normaliserConfigOperation(authApiConfig.sessionCourante, options.sessionCourante)
  const logoutConfig = normaliserConfigOperation(authApiConfig.logout, options.logout)
  const mapperLogin = typeof options.mapperLogin === 'function'
    ? options.mapperLogin
    : mapperReponseLoginParDefaut
  const mapperSessionCourante = typeof options.mapperSessionCourante === 'function'
    ? options.mapperSessionCourante
    : mapperReponseSessionCouranteParDefaut

  async function login(payload = {}) {
    const reponse = await appelerOperation(apiService, loginConfig, payload)
    return mapperLogin(reponse)
  }

  async function sessionCourante(context = {}) {
    const reponse = await appelerOperation(apiService, sessionCouranteConfig, null, {
      auth: true,
      headers: estObjetSimple(context.headers) ? context.headers : undefined,
    })

    return mapperSessionCourante(reponse)
  }

  async function logout() {
    return appelerOperation(apiService, logoutConfig, null, {
      auth: true,
    })
  }

  return {
    login,
    sessionCourante,
    logout,
  }
}

module.exports = {
  creerAuthApiClient,
  mapperReponseLoginParDefaut,
  mapperReponseSessionCouranteParDefaut,
}
