const test = require('node:test')
const assert = require('node:assert/strict')

const { analyserConfigurationRoutage } = require('../core/navigation/navigationConfig.shared')

test('analyse une configuration valide et place la page d entree en tete', () => {
  const resultat = analyserConfigurationRoutage({
    pageEntree: 'home',
    routes: {
      login: 'pages/login/login',
      home: 'pages/home/home',
      index: 'pages/index/index',
    },
  })

  assert.equal(resultat.pageEntree, 'home')
  assert.deepEqual(resultat.pages, [
    'pages/home/home',
    'pages/login/login',
    'pages/index/index',
  ])
  assert.deepEqual(resultat.routes, {
    login: 'pages/login/login',
    home: 'pages/home/home',
    index: 'pages/index/index',
  })
  assert.equal(resultat.routesListe[0].estPageEntree, true)
  assert.equal(resultat.routesListe[0].nomRoute, 'home')
})

test('rejette une pageEntree absente des routes', () => {
  assert.throws(() => analyserConfigurationRoutage({
    pageEntree: 'dashboard',
    routes: {
      login: 'pages/login/login',
    },
  }), /pageEntree/)
})

test('rejette les chemins dupliques', () => {
  assert.throws(() => analyserConfigurationRoutage({
    pageEntree: 'login',
    routes: {
      login: 'pages/login/login',
      autre: 'pages/login/login',
    },
  }), /duplique/)
})
