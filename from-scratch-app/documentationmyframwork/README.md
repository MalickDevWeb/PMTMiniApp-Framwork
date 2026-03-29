# Documentation PMTMiniApp

Cette documentation suit la construction de notre mini-framework TCMPP depuis zéro.

Si tu veux juste utiliser le projet comme développeur:
- commence par `../README.md`

## Objectif
- Comprendre toute l'architecture interne
- Reproduire chaque brique sans magie externe
- Pouvoir créer un framework personnel propre et maintenable
- Distribuer ce framework sous forme de starter + CLI

## Structure
- `etapes/` : progression pédagogique étape par étape
- `dossiers/` : documentation technique par dossier du projet
- `journal/` : suivi de progression et décisions d'architecture

Repères importants:
- `../README.md` : point d'entrée du starter officiel
- `../../create-pmt-miniapp/README.md` : CLI de création de projet
- `dossiers/api-publique.md` : surface publique stable du framework
- `dossiers/core.md` : vue d'ensemble du dossier `core`
- `dossiers/navigation.md` : séparation navigation classique vs service
- `../routage/README.md` : point d'entrée pratique pour modifier les routes
- `dossiers/gestion-etat.md` : séparation usage direct vs façade métier
- `dossiers/auth.md` : session complète login / restore / logout
- `dossiers/api-layer.md` : couche HTTP centrale
- `dossiers/composants.md` : composants UI réutilisables
- `dossiers/lifecycle.md` : cycle simple à appliquer dans les pages
- `dossiers/storage.md` : persistance locale simple
- `dossiers/noyau.md` : ce que contient `globalData.noyau`

## Règles
1. Une étape validée avant de passer à la suivante
2. Compréhension avant implémentation
3. Chaque brique doit être testée avec logs/preuves
4. On documente les décisions (pas seulement le code)

## État actuel
- noyau : validé
- gestion d'état : validée
- navigation : validée
- storage : validé
- auth : validée
- api-layer : validé
- composants : validés
- page de démonstration framework : disponible
- base stable de framework : atteinte

## Convention de nommage cible
- Recommandé: `globalData.noyau`
- Raison: éviter la confusion avec `this.data` des pages
- Convention service: `globalData.noyau.services.gestionnaireEtat`
- Convention navigation: `globalData.noyau.services.navigation`
- Convention métier profil: `globalData.noyau.services.profilService`
