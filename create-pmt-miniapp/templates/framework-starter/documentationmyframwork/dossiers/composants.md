# Dossier `composants`

## Rôle
Le dossier `components` contient les composants visuels réutilisables du framework.

Leur rôle est simple :
- éviter de répéter du WXML partout
- garder une interface claire
- donner des noms explicites

## Règle de nommage
Le nom du composant doit dire ce qu'il fait.

Exemples retenus :
- `app-bouton-action`
- `app-carte-section`
- `app-champ-texte`
- `app-barre-navigation`
- `app-boite-dialogue`
- `app-chargeur-page`
- `app-message-action`
- `app-etat-vide`

## Base technique
Ces composants viennent de la base `tcmpp-boilerplate`, mais ils ont été :
- renommés
- simplifiés
- enrichis
- rendus plus clairs pour ce framework

## Composants disponibles

### `app-bouton-action`
Pour déclencher une action.

Exemple :
```xml
<app-bouton-action
  texte="Sauvegarder"
  bind:press="sauvegarder"
/>
```

### `app-carte-section`
Pour grouper un bloc de contenu.

Exemple :
```xml
<app-carte-section
  titre="Profil"
  sous-titre="Informations utilisateur"
>
  <text>Nom : {{ nom }}</text>
</app-carte-section>
```

### `app-champ-texte`
Pour saisir une valeur texte.

Exemple :
```xml
<app-champ-texte
  label="Nom"
  value="{{ inputNom }}"
  placeholder="Entrez votre nom"
  bind:input="handleInputNom"
/>
```

### `app-barre-navigation`
Pour afficher une barre de navigation custom.

Exemple :
```xml
<app-barre-navigation
  titre="Accueil"
  sous-titre="Exemple de page"
  afficher-retour="{{false}}"
/>
```

### `app-boite-dialogue`
Pour afficher une boîte de dialogue simple.

Exemple :
```xml
<app-boite-dialogue
  visible="{{ modalVisible }}"
  titre="Confirmation"
  message="Voulez-vous continuer ?"
  afficher-action-secondaire="{{true}}"
  bind:confirm="confirmer"
  bind:cancel="annuler"
  bind:close="fermer"
/>
```

### `app-chargeur-page`
Pour afficher un état de chargement de page.

Exemple :
```xml
<app-chargeur-page
  visible="{{ initialisationEnCours }}"
  titre="Chargement de la page"
  message="Initialisation en cours..."
/>
```

### `app-message-action`
Pour afficher un message de retour avec action.

Exemple :
```xml
<app-message-action
  visible="{{ messageVisible }}"
  variante="succes"
  titre="Succès"
  message="Le nom a été sauvegardé."
  bind:closetap="fermerMessage"
/>
```

### `app-etat-vide`
Pour afficher un écran vide simple avec action.

Exemple :
```xml
<app-etat-vide
  titre="Aucun profil"
  message="Aucun nom n'est encore enregistré."
  texte-action="Définir un nom"
  bind:actiontap="allerLogin"
/>
```

## Règle à retenir
- une page utilise les composants
- un composant ne doit pas cacher de logique métier
- les services restent dans `core`
- les composants restent dans `components`
