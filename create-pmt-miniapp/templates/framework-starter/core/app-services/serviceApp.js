function getAppServices() {
  const app = typeof getApp === 'function' ? getApp() : null
  return app?.globalData?.noyau?.services || {}
}

function getAppMeta() {
  const app = typeof getApp === 'function' ? getApp() : null
  return app?.globalData?.noyau?.meta || {}
}

function attendreInitialisationApp() {
  const meta = getAppMeta()
  const initialisationPromise = meta.initialisationPromise

  if (initialisationPromise && typeof initialisationPromise.then === 'function') {
    return initialisationPromise
  }

  return Promise.resolve()
}

function serviceApp() {
  const services = getAppServices()

  return {
    ...services,
    gestionnaireEtat: services.gestionnaireEtat || null,
    profilService: services.profilService || null,
    utilisateurService: services.utilisateurService || null,
    compteService: services.compteService || null,
    apiService: services.apiService || null,
    storage: services.storage || null,
    sessionStorageService: services.sessionStorageService || null,
    sessionService: services.sessionService || null,
    authService: services.authService || null,
    profilStorageService: services.profilStorageService || null,
    navigation: services.navigation || null,
  }
}

function getService(nomService) {
  return getAppServices()[nomService]
}

function getEtatService() {
  return getService('gestionnaireEtat')
}

function getProfilService() {
  return getService('profilService')
}

function getStorageService() {
  return getService('storage')
}

function getApiService() {
  return getService('apiService')
}

function getUtilisateurService() {
  return getService('utilisateurService')
}

function getCompteService() {
  return getService('compteService')
}

function getSessionStorageService() {
  return getService('sessionStorageService')
}

function getSessionService() {
  return getService('sessionService')
}

function getAuthService() {
  return getService('authService')
}

function getProfilStorageService() {
  return getService('profilStorageService')
}

function getNavigationService() {
  return getService('navigation')
}

module.exports = {
  serviceApp,
  getAppServices,
  getAppMeta,
  attendreInitialisationApp,
  getService,
  getEtatService,
  getProfilService,
  getApiService,
  getStorageService,
  getUtilisateurService,
  getCompteService,
  getSessionStorageService,
  getSessionService,
  getAuthService,
  getProfilStorageService,
  getNavigationService,
}
