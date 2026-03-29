const { nettoyerPage } = require('./utils')
const {
  pageEntreeNavigation,
  routesNavigation: routesNavigationSource,
} = require('./routes.runtime')

// Source de verite unique des routes applicatives.
// Le mapping visible reste dans `routage/routes.json`.
// Le runtime WeChat charge `routes.runtime.js`, genere automatiquement.
const routesNavigation = Object.freeze({ ...routesNavigationSource })

function normaliserCheminPage(page) {
  const pageNettoyee = nettoyerPage(page)

  if (!pageNettoyee) return ''

  return pageNettoyee.startsWith('/') ? pageNettoyee : `/${pageNettoyee}`
}

function resoudrePage(page) {
  const pageNettoyee = nettoyerPage(page)

  if (!pageNettoyee) return ''

  const chemin = routesNavigation[pageNettoyee] || pageNettoyee
  return normaliserCheminPage(chemin)
}

module.exports = {
  pageEntreeNavigation,
  routesNavigation,
  resoudrePage,
}
