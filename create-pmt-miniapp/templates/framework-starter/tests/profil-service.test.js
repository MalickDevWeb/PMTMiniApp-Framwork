const test = require('node:test')
const assert = require('node:assert/strict')

const { gestionnaireEtat } = require('../core/gestion-etats/gestionnaireEtat.shared')
const { creerProfilService } = require('../core/gestion-etats/profilService')

test('lireNom retourne le fallback si aucun etat ou aucune valeur', () => {
  const profilSansEtat = creerProfilService()
  assert.equal(profilSansEtat.lireNom('Invite'), 'Invite')

  const profil = creerProfilService(gestionnaireEtat({}))
  assert.equal(profil.lireNom('Invite'), 'Invite')
})

test('mettreNom nettoie le texte et refuse les valeurs invalides', () => {
  const etat = gestionnaireEtat({})
  const profil = creerProfilService(etat)

  assert.equal(profil.mettreNom('   '), false)
  assert.equal(profil.mettreNom(42), false)
  assert.equal(profil.mettreNom('  Aicha  '), true)
  assert.equal(etat.get('utilisateur.nom', 'Invite'), 'Aicha')
})

test('onNomChange relaie les changements du gestionnaire d etat', () => {
  const etat = gestionnaireEtat({})
  const profil = creerProfilService(etat)
  const valeurs = []

  const unsubscribe = profil.onNomChange((valeur) => {
    valeurs.push(valeur)
  })

  profil.mettreNom('Moussa')
  profil.supprimerNom()
  unsubscribe()
  profil.mettreNom('Aicha')

  assert.deepEqual(valeurs, ['Moussa', undefined])
})

test('supprimerNom retourne false si etat indisponible ou cle absente', () => {
  const profilSansEtat = creerProfilService()
  assert.equal(profilSansEtat.supprimerNom(), false)

  const profil = creerProfilService(gestionnaireEtat({}))
  assert.equal(profil.supprimerNom(), false)
})
