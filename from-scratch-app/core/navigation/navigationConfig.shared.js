const { estObjetSimple, nettoyerTexte } = require('./navigationShared')

function validerNomRoute(nomRoute) {
  return nettoyerTexte(nomRoute).length > 0
}

function normaliserPageRoute(page) {
  if (typeof page !== 'string') {
    throw new Error(`Chemin de page invalide: ${String(page)}`)
  }

  const pageNettoyee = nettoyerTexte(page).replace(/^\/+/, '')
  if (!pageNettoyee.startsWith('pages/')) {
    throw new Error(`Chemin invalide pour app.json: ${page}`)
  }

  return pageNettoyee
}

function analyserConfigurationRoutage(configuration) {
  if (!estObjetSimple(configuration)) {
    throw new Error('`routage/routes.json` doit contenir un objet simple')
  }

  const { pageEntree, routes } = configuration

  if (!validerNomRoute(pageEntree)) {
    throw new Error('`pageEntree` doit etre une chaine non vide')
  }

  if (!estObjetSimple(routes)) {
    throw new Error('`routes` doit etre un objet simple')
  }

  const pageEntreeNormalisee = nettoyerTexte(pageEntree)
  const pages = []
  const routesListe = []
  const pagesVues = new Set()
  let pageEntreeTrouvee = false

  Object.entries(routes).forEach(([nomRoute, cheminPage]) => {
    if (!validerNomRoute(nomRoute)) {
      throw new Error('Chaque nom de route doit etre une chaine non vide')
    }

    const nomRouteNettoye = nettoyerTexte(nomRoute)
    const pageNormalisee = normaliserPageRoute(cheminPage)
    if (pagesVues.has(pageNormalisee)) {
      throw new Error(`Chemin de page duplique: ${pageNormalisee}`)
    }

    const routeInfo = {
      nomRoute: nomRouteNettoye,
      cheminPage: pageNormalisee,
      estPageEntree: nomRouteNettoye === pageEntreeNormalisee,
    }

    pagesVues.add(pageNormalisee)
    if (routeInfo.estPageEntree) {
      pageEntreeTrouvee = true
      pages.unshift(pageNormalisee)
      routesListe.unshift(routeInfo)
      return
    }

    pages.push(pageNormalisee)
    routesListe.push(routeInfo)
  })

  if (!pageEntreeTrouvee) {
    throw new Error('`pageEntree` doit correspondre a une route declaree')
  }

  const routesNormalisees = routesListe.reduce((acc, routeInfo) => {
    acc[routeInfo.nomRoute] = routeInfo.cheminPage
    return acc
  }, {})

  return {
    pageEntree: pageEntreeNormalisee,
    pages,
    routes: routesNormalisees,
    routesListe,
  }
}

module.exports = {
  analyserConfigurationRoutage,
  estObjetSimple,
  normaliserPageRoute,
  validerNomRoute,
}
