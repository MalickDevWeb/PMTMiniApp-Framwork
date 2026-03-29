# Étape 12 - Page Login et Tests de Flux

## Objectif
Valider en conditions réelles les briques construites:
- service état (via façade profil)
- service navigation
- lifecycle + abonnement/désabonnement

## Écrans
- `pages/index/index`
- `pages/login/login`
- `pages/home/home`

## Flux métier implémenté
1. `index` affiche le nom courant via `profilService`
2. `index` remplace la page courante par `login` ou `home` via `serviceNavigation`
3. `login` permet:
   - saisir un nom
   - sauvegarder (`profilService.mettreNom`)
   - supprimer (`profilService.supprimerNom`)
4. `home` lit et affiche le même nom partagé

## Plan de test manuel DevTools
1. Ouvrir `index`: vérifier "Nom courant: Invite"
2. Aller à `login`
3. Saisir `Aicha` puis cliquer `Sauvegarder nom`
4. Aller à `home`: vérifier "Nom courant: Aicha"
5. Aller à `index`: vérifier "Nom courant: Aicha"
6. Depuis `index`, cliquer `Supprimer nom`
7. Vérifier retour à "Invite" sur `index`, puis sur `home`

## Logs attendus
- lifecycle:
  - `[lifecycle][index] onLoad/onShow/onUnload`
  - `[lifecycle][login] onLoad/onShow/onUnload`
  - `[lifecycle][home] onLoad/onShow/onUnload`
- navigation:
  - `[nav] remplacerPage -> /pages/login/login` ou `/pages/home/home`
- abonnement nom:
  - `[index] onNomChange: ...`
  - `[login] onNomChange: ...`
  - `[home] onNomChange: ...`
