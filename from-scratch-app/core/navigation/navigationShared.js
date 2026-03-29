function estObjetSimple(valeur) {
  return Object.prototype.toString.call(valeur) === '[object Object]'
}

function nettoyerTexte(valeur) {
  return typeof valeur === 'string' ? valeur.trim() : ''
}

module.exports = {
  estObjetSimple,
  nettoyerTexte,
}
