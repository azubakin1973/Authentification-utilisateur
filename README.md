# Authentification utilisateur

## Description Générale
Application mobile multiplateforme développée avec NativeScript-Vue offrant
un système complet d'authentification utilisateur : inscription, connexion
et accès aux données personnelles.

## Prérequis

### Environnement de Développement
- Node.js (version LTS recommandée)
- NativeScript CLI
- Git
- Éditeur de code (VS Code recommandé)

### Installations Requises par Plateforme

#### Pour Android
- Android Studio
- SDK Android
- Java Development Kit (JDK)

#### Pour iOS (Mac uniquement)
- Xcode
- Outils en ligne de commande Xcode
- CocoaPods

## Installation du Projet

### 1. Clonage du Dépôt
```bash
git clone https://github.com/azubakin1973/Authentification-utilisateur.git
cd Authentification-utilisateur
```

### 2. Installation des Dépendances
```bash
npm install
ns prepare
```

## Configuration de l'Environnement

### Android
1. Installez Android Studio
2. Configurez les variables d'environnement :
   - `ANDROID_HOME` vers le dossier SDK Android
   - `JAVA_HOME` vers votre installation JDK
3. Créez un émulateur via Android Studio ou utilisez un appareil physique

### iOS (Mac uniquement)
1. Installez Xcode depuis l'App Store
2. Installez les outils en ligne de commande :
   ```bash
   xcode-select --install
   ```
3. Installez CocoaPods :
   ```bash
   sudo gem install cocoapods
   ```

## Lancement de l'Application

### Mode Développement
```bash
# Pour Android
ns run android

# Pour iOS (Mac uniquement)
ns run ios
```

### Mode Production
```bash
# Build Android
ns build android --release

# Build iOS (Mac uniquement)
ns build ios --release
```

## Fonctionnalités Principales

### 1. Inscription (Register)
- Création de compte utilisateur
- Validation des champs de formulaire (nom d'utilisateur, courriel, mot de passe)
- Gestion des erreurs d'inscription (doublon, format invalide, etc.)

### 2. Connexion (Login)
- Authentification sécurisée via JWT
- Validation des identifiants
- Gestion des sessions utilisateur (persistance du token)
- Redirection automatique si une session est active

### 3. Profil Utilisateur (UserProfile)
- Affichage des données personnelles
- Modification du nom d'utilisateur
- Déconnexion sécurisée avec nettoyage de session

## Navigation
L'application utilise la navigation intégrée de NativeScript-Vue (`$navigateTo`, `$navigateBack`)
pour gérer les transitions entre les écrans.

**Flux de navigation :**
```
Login ──→ Home (page d'accueil)
  │              │
  ↓              ↓
Register    UserProfile
```

## Structure du projet

```
app/
├── components/         # Composants Vue (interface utilisateur)
│   ├── Login.vue           # Écran de connexion
│   ├── Register.vue        # Écran d'inscription
│   ├── Home.vue            # Page d'accueil après connexion
│   └── UserProfile.vue     # Écran de profil utilisateur
├── services/           # Couche de services (logique métier / API)
│   ├── api.js              # Instance Axios préconfigurée (intercepteurs)
│   └── authService.js      # Service d'authentification
├── config.js           # Configuration centralisée (URL API)
└── app.js              # Point d'entrée de l'application
```

## Architecture

L'application suit une architecture en couches :

- **Composants (Vue)** : Interface utilisateur et logique d'affichage
- **Services** : Couche intermédiaire qui centralise les appels API et la logique métier
- **Config** : Configuration centralisée (URL de l'API backend)

Pour intégrer de nouvelles fonctionnalités ou une base de données,
il suffit de créer de nouveaux services dans `services/` et de nouveaux
composants dans `components/` sans modifier le code existant.

## Dépendances Principales
- NativeScript-Vue (~2.9.3)
- @nativescript/core (~8.8.0)
- Axios (^0.18.1)
- @nativescript/theme (^3.1.0)

## Dépannage
- Assurez-vous que toutes les variables d'environnement sont correctement configurées
- Vérifiez que les versions des outils correspondent aux prérequis
- En cas de problème, consultez la documentation NativeScript

## Informations du Projet
**Auteur:** Alexei de Moraes Zubakin  
**Lieu:** Montreal-QC  
**Date:** 30 janvier 2025
