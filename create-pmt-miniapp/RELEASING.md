# Release create-pmtminiapp

## Avant publication
- vérifier la version dans `package.json`
- lancer `npm run lint`
- lancer `npm run refresh:template`
- lancer `npm run pack:check`
- vérifier que le starter `PMTMiniApp` est à jour

## Publication npm

```bash
npm login
npm publish
```

Le package publié est :
- `create-pmtminiapp`

## Vérification après publication

```bash
npx create-pmtminiapp mon-app --no-install
```

Puis vérifier dans le projet généré :

```bash
cd mon-app
npm install
npm run framework:ready
```

## Remarque
Si le package doit être public, définir aussi une licence finale adaptée avant publication.
