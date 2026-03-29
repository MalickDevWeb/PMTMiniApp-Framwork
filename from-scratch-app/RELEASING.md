# Release PMTMiniApp Starter

## Objectif
Préparer le starter officiel utilisé par `create-pmtminiapp`.

## Checklist
- mettre à jour la version dans `package.json`
- lancer `npm run framework:ready`
- vérifier la route `frameworkDemo`
- vérifier la documentation publique
- vérifier `CHANGELOG.md`
- vérifier `CONTRIBUTING.md`

## Régénérer le template CLI

Depuis `create-pmt-miniapp` :

```bash
npm run refresh:template
```

## Publication
Le starter n'est pas destiné à être publié seul sur npm comme application finale.

Il sert de base officielle pour :
- `create-pmtminiapp`
- la documentation
- les démonstrations internes
