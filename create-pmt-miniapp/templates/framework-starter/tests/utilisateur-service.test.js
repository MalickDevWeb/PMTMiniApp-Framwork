const test = require('node:test')
const assert = require('node:assert/strict')

const { gestionnaireEtat } = require('../core/gestion-etats/gestionnaireEtat.shared')
const { creerUtilisateurService } = require('../core/gestion-etats/utilisateurService')

test('hydraterUtilisateur remplit le profil courant et les champs utiles', () => {
  const etat = gestionnaireEtat({})
  const utilisateurService = creerUtilisateurService(etat)

  assert.equal(utilisateurService.hydraterUtilisateur({
    id: 'u1',
    nom: 'Aicha',
    email: 'aicha@mail.com',
  }), true)

  assert.deepEqual(utilisateurService.lireUtilisateur(null), {
    id: 'u1',
    nom: 'Aicha',
    email: 'aicha@mail.com',
  })
  assert.equal(utilisateurService.lireNom('Invite'), 'Aicha')
  assert.equal(utilisateurService.lireEmail(''), 'aicha@mail.com')
})

test('mettreNom met a jour le nom sans casser le profil courant', () => {
  const etat = gestionnaireEtat({})
  const utilisateurService = creerUtilisateurService(etat)

  utilisateurService.hydraterUtilisateur({
    id: 'u1',
    nom: 'Aicha',
  })

  assert.equal(utilisateurService.mettreNom('  Mariama  '), true)
  assert.equal(utilisateurService.lireNom('Invite'), 'Mariama')
  assert.deepEqual(utilisateurService.lireUtilisateur(null), {
    id: 'u1',
    nom: 'Mariama',
  })
})

test('supprimerUtilisateur vide le profil courant', () => {
  const etat = gestionnaireEtat({})
  const utilisateurService = creerUtilisateurService(etat)

  utilisateurService.hydraterUtilisateur({
    id: 'u1',
    nom: 'Aicha',
  })

  assert.equal(utilisateurService.supprimerUtilisateur(), true)
  assert.equal(utilisateurService.lireNom('Invite'), 'Invite')
  assert.equal(utilisateurService.lireUtilisateur(null), null)
})
