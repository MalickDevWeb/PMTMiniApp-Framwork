const {
  estObjetSimple,
  construireErreur,
  construireUrl,
} = require('./utils')
const {
  pageValide,
  paramsValides,
  deltaValide,
} = require('./validations')
const { resoudrePage } = require('./routes')

function extraireOptionsPage(options = {}) {
  if (typeof options === 'undefined') return {}
  if (!estObjetSimple(options)) return null
  if (!Object.keys(options).every((cle) => cle === 'params')) return null

  const { params } = options

  if (!paramsValides(params)) return null

  return { params }
}

function extraireOptionsRetour(options = {}) {
  if (typeof options === 'undefined') return { delta: 1 }
  if (!estObjetSimple(options)) return null
  if (!Object.keys(options).every((cle) => cle === 'delta')) return null

  const delta = typeof options.delta === 'undefined' ? 1 : options.delta

  if (!deltaValide(delta)) return null

  return { delta }
}

function executerNavigation(nomAction, page, options, methodeWx) {
  const pageResolue = resoudrePage(page)

  if (!pageValide(page)) {
    const erreur = construireErreur('page invalide', { page, pageResolue })
    console.warn(`[serviceNavigation] ${nomAction}: page invalide`, page)
    return Promise.reject(erreur)
  }

  const optionsValides = extraireOptionsPage(options)
  if (!optionsValides) {
    const erreur = construireErreur('options invalides', { options })
    console.warn(`[serviceNavigation] ${nomAction}: options invalides`, options)
    return Promise.reject(erreur)
  }

  const url = construireUrl(pageResolue, optionsValides.params)
  console.log(`[nav] ${nomAction} -> ${url}`)

  return new Promise((resolve, reject) => {
    methodeWx({
      url,
      success: (res) => resolve(res),
      fail: (err) => {
        console.error(`[serviceNavigation] ${nomAction} fail:`, err)
        reject(err)
      },
    })
  })
}

function serviceNavigation() {
  function allerA(page, options = {}) {
    return executerNavigation('allerA', page, options, (config) => wx.navigateTo(config))
  }

  function remplacerPage(page, options = {}) {
    return executerNavigation('remplacerPage', page, options, (config) => wx.redirectTo(config))
  }

  function redemarrerA(page, options = {}) {
    return executerNavigation('redemarrerA', page, options, (config) => wx.reLaunch(config))
  }

  function revenir(options = {}) {
    const optionsValides = extraireOptionsRetour(options)
    if (!optionsValides) {
      const erreur = construireErreur('options invalides', { options })
      console.warn('[serviceNavigation] revenir: options invalides', options)
      return Promise.reject(erreur)
    }

    console.log(`[nav] revenir -> delta=${optionsValides.delta}`)

    return new Promise((resolve, reject) => {
      wx.navigateBack({
        delta: optionsValides.delta,
        success: (res) => resolve(res),
        fail: (err) => {
          console.error('[serviceNavigation] revenir fail:', err)
          reject(err)
        },
      })
    })
  }

  return {
    allerA,
    remplacerPage,
    revenir,
    redemarrerA,
  }
}

module.exports = {
  serviceNavigation,
}
