# Changelog

## 1.0.1

Correctif de robustesse autour de la page d'entree et de la recompilation DevTools.

### Ajouts
- correction automatique de `pageEntree` au demarrage si WeChat DevTools n'a pas relance la bonne page apres `Compile`
- template CLI regenere avec le meme garde-fou

### Impact
- `routage/routes.json` reste la source de verite
- `Compile` continue d'utiliser `scripts/syncAppPages.js`
- si le hook DevTools tombe, l'app relance quand meme la bonne page d'entree

## 1.0.0

Première base stable du framework Mini Program.

### Inclus
- noyau applicatif
- gestion d'état
- navigation pilotée par `routage/routes.json`
- storage local et session
- auth locale ou API
- api-layer central
- composants UI réutilisables
- page de démonstration `frameworkDemo`
- documentation d'onboarding et d'architecture
