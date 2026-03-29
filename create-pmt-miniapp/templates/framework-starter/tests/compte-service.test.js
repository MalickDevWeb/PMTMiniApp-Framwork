const test = require('node:test')
const assert = require('node:assert/strict')

const { gestionnaireEtat } = require('../core/gestion-etats/gestionnaireEtat.shared')
const { creerCompteService } = require('../core/gestion-etats/compteService')

test('hydraterCompte remplit le compte courant et les champs utiles', () => {
  const etat = gestionnaireEtat({})
  const compteService = creerCompteService(etat)

  assert.equal(compteService.hydraterCompte({
    id: 'c1',
    type: 'client',
    nom: 'Compte Principal',
  }), true)

  assert.deepEqual(compteService.lireCompte(null), {
    id: 'c1',
    type: 'client',
    nom: 'Compte Principal',
  })
  assert.equal(compteService.lireType(''), 'client')
})

test('supprimerCompte vide le compte courant', () => {
  const etat = gestionnaireEtat({})
  const compteService = creerCompteService(etat)

  compteService.hydraterCompte({
    id: 'c1',
    type: 'client',
  })

  assert.equal(compteService.supprimerCompte(), true)
  assert.equal(compteService.lireCompte(null), null)
})
