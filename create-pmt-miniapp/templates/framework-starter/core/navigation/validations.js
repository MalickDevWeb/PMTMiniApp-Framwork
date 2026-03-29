const { estObjetSimple } = require('./utils')
const { resoudrePage } = require('./routes')

function pageValide(page) {
  const pageNettoyee = resoudrePage(page)

  return pageNettoyee.length > 0
    && pageNettoyee.startsWith('/pages/')
    && !pageNettoyee.includes('?')
}

function paramsValides(params) {
  if (typeof params === 'undefined') return true
  if (!estObjetSimple(params)) return false

  return Object.keys(params).every((cle) => {
    if (typeof cle !== 'string' || cle.trim().length === 0) return false

    const valeur = params[cle]

    if (typeof valeur === 'string') return true
    if (typeof valeur === 'boolean') return true
    if (typeof valeur === 'number') return Number.isFinite(valeur)

    return false
  })
}

function deltaValide(delta) {
  if (typeof delta === 'undefined') return true

  return Number.isInteger(delta) && delta > 0
}

module.exports = {
  pageValide,
  paramsValides,
  deltaValide,
}
