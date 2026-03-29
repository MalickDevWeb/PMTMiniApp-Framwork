const { pageEntreeNavigation, resoudrePage } = require('../navigation/index')

function normaliserRouteCourante(route) {
  if (typeof route !== 'string' || route.length === 0) return ''
  return route.startsWith('/') ? route : `/${route}`
}

function corrigerPageEntreeAuDemarrage(appInstance) {
  const noyau = appInstance && appInstance.globalData && appInstance.globalData.noyau
  const meta = noyau && noyau.meta
  const services = noyau && noyau.services

  if (!meta || !services || meta.pageEntreeVerifiee) return

  meta.pageEntreeVerifiee = true

  const pagesCourantes = typeof getCurrentPages === 'function' ? getCurrentPages() : []
  if (!Array.isArray(pagesCourantes) || pagesCourantes.length === 0) return

  const routeCourante = normaliserRouteCourante(pagesCourantes[0] && pagesCourantes[0].route)
  const routeEntree = resoudrePage(pageEntreeNavigation)

  if (!routeCourante || !routeEntree || routeCourante === routeEntree) return

  console.warn(`[App] correction pageEntree: ${routeCourante} -> ${routeEntree}`)

  services.navigation.redemarrerA(pageEntreeNavigation).catch((erreur) => {
    console.error('[App] echec correction pageEntree:', erreur)
  })
}

module.exports = {
  corrigerPageEntreeAuDemarrage,
}
