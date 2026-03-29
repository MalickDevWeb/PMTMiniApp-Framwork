const {
  gestionnaireEtat,
  creerProfilService,
  creerUtilisateurService,
  creerCompteService,
} = require('../gestion-etats/index')
const { creerAuthService } = require('../auth/index')
const {
  apiConfig,
  authApiConfig,
  serviceApi,
  creerAuthApiClient,
} = require('../api-layer/index')
const {
  clesStorage,
  serviceStorage,
  creerSessionStorageService,
  creerSessionService,
  creerServicesStorageSimples,
  creerRestaurationStorageService,
} = require('../storage/index')
const { serviceNavigation } = require('../navigation/index')
const { creerNoyau } = require('../noyau/noyau')

function creerNoyauApp() {
  const noyau = creerNoyau()
  const serviceEtat = gestionnaireEtat(noyau)
  const utilisateurService = creerUtilisateurService(serviceEtat)
  const compteService = creerCompteService(serviceEtat)
  const storage = serviceStorage({
    allowedKeys: Object.values(clesStorage),
  })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({
    etat: serviceEtat,
    sessionStorageService,
  })
  const apiService = serviceApi({
    baseUrl: apiConfig.baseUrl,
    timeoutMs: apiConfig.timeoutMs,
    sessionService,
  })
  const servicesStorageSimples = creerServicesStorageSimples(storage)
  const profilStorageService = servicesStorageSimples.profilStorageService || null
  const restaurationStorageService = creerRestaurationStorageService({
    etat: serviceEtat,
    sessionService,
    profilStorageService,
  })
  const authService = creerAuthService({
    strategie: apiConfig.authStrategy,
    sessionService,
    utilisateurService,
    compteService,
    apiClient: creerAuthApiClient(apiService, authApiConfig),
  })

  noyau.services.gestionnaireEtat = serviceEtat
  noyau.services.profilService = creerProfilService(utilisateurService)
  noyau.services.utilisateurService = utilisateurService
  noyau.services.compteService = compteService
  noyau.services.apiService = apiService
  noyau.services.storage = storage
  noyau.services.sessionStorageService = sessionStorageService
  noyau.services.sessionService = sessionService
  noyau.services.authService = authService
  Object.assign(noyau.services, servicesStorageSimples)
  noyau.services.navigation = serviceNavigation()

  noyau.meta.initialisationPromise = restaurationStorageService.restaurer()

  return noyau
}

module.exports = {
  creerNoyauApp,
}
