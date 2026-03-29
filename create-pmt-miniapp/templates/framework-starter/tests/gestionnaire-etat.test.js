const test = require('node:test')
const assert = require('node:assert/strict')

const { gestionnaireEtat } = require('../core/gestion-etats/gestionnaireEtat.shared')

test('set et get fonctionnent sur une cle valide', () => {
  const etat = gestionnaireEtat({})

  assert.equal(etat.set('utilisateur.nom', 'Aicha'), true)
  assert.equal(etat.get('utilisateur.nom', 'Invite'), 'Aicha')
})

test('set retourne false sur une cle invalide', () => {
  const etat = gestionnaireEtat({})

  assert.equal(etat.set('', 'Aicha'), false)
  assert.equal(etat.get('utilisateur.nom', 'Invite'), 'Invite')
})

test('onState retourne un unsubscribe no-op pour un callback invalide', () => {
  const etat = gestionnaireEtat({})
  const unsubscribe = etat.onState('utilisateur.nom', 'pasUneFonction')

  assert.equal(typeof unsubscribe, 'function')
  assert.doesNotThrow(() => unsubscribe())
})

test('un callback qui throw ne casse pas la notification globale', () => {
  const etat = gestionnaireEtat({})
  const valeurs = []

  etat.onState('utilisateur.nom', () => {
    throw new Error('boom')
  })
  etat.onState('utilisateur.nom', (valeur) => {
    valeurs.push(valeur)
  })

  assert.equal(etat.set('utilisateur.nom', 'Moussa'), true)
  assert.deepEqual(valeurs, ['Moussa'])
})

test('unsubscribe coupe bien les notifications suivantes', () => {
  const etat = gestionnaireEtat({})
  const valeurs = []

  const unsubscribe = etat.onState('utilisateur.nom', (valeur) => {
    valeurs.push(valeur)
  })

  etat.set('utilisateur.nom', 'Aicha')
  unsubscribe()
  unsubscribe()
  etat.set('utilisateur.nom', 'Moussa')

  assert.deepEqual(valeurs, ['Aicha'])
})

test('remove supprime la cle et retablit le fallback', () => {
  const etat = gestionnaireEtat({})

  etat.set('utilisateur.nom', 'Aicha')
  assert.equal(etat.remove('utilisateur.nom'), true)
  assert.equal(etat.get('utilisateur.nom', 'Invite'), 'Invite')
})

test('initialise defensivement state et listeners si le noyau est mal forme', () => {
  const noyau = { state: null, listeners: null }
  const etat = gestionnaireEtat(noyau)

  etat.set('session.token', 'abc')

  assert.deepEqual(noyau.state, { 'session.token': 'abc' })
  assert.deepEqual(noyau.listeners, {})
})

test('supprime la cle de listeners quand le dernier abonnement est retire', () => {
  const noyau = { state: {}, listeners: {} }
  const etat = gestionnaireEtat(noyau)
  const unsubscribe = etat.onState('utilisateur.nom', () => {})

  assert.deepEqual(Object.keys(noyau.listeners), ['utilisateur.nom'])
  unsubscribe()

  assert.deepEqual(noyau.listeners, {})
})

test('accepte un logger injecte pour eviter console en dur', () => {
  const logs = []
  const etat = gestionnaireEtat({}, {
    logger: {
      warn: (...args) => logs.push(['warn', ...args]),
      error: (...args) => logs.push(['error', ...args]),
    },
  })

  assert.equal(etat.set('', 'x'), false)
  assert.equal(logs[0][0], 'warn')
  assert.match(logs[0][1], /\[gestionnaireEtat\] set: cle invalide/)
})
