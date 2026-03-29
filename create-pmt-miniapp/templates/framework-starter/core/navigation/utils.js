const { estObjetSimple, nettoyerTexte } = require('./navigationShared')

function nettoyerPage(page) {
  return nettoyerTexte(page)
}

function construireErreur(message, details = {}) {
  const erreur = new Error(message)
  erreur.details = details
  return erreur
}

function encoderParam(valeur) {
  return encodeURIComponent(String(valeur))
}

function construireUrl(page, params) {
  const pageNettoyee = nettoyerPage(page)

  if (!params || Object.keys(params).length === 0) {
    return pageNettoyee
  }

  const query = Object.keys(params)
    .map((cle) => `${encodeURIComponent(cle)}=${encoderParam(params[cle])}`)
    .join('&')

  return `${pageNettoyee}?${query}`
}

module.exports = {
  estObjetSimple,
  nettoyerPage,
  construireErreur,
  encoderParam,
  construireUrl,
}
