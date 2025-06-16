# Truth or Fake – Test Technique

## Instructions d’installation & de lancement

### Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (installé avec Node.js)

### Installation

Cloner le dépôt puis installer les dépendances :

```sh
npm install
```

### Lancement

Pour démarrer le serveur de développement :

```sh
npm run dev
```

Pour installer Mantine séparément :

```sh
npm install @mantine/core @mantine/hooks
```

L’application sera accessible à l’adresse indiquée dans le terminal (par défaut : http://localhost:5173).

---

## Description technique de l’architecture

- **React** est utilisé pour la structure de l’interface et la gestion des états.
- **Mantine** fournit les composants UI (boutons, grilles, containers, etc.) pour un rendu moderne et responsive.
- **Vite** est utilisé comme outil de build et de développement rapide.
- **Organisation du code :**
  - `src/components/` : composants réutilisables (GameBoard, GameHistory, HeaderTabs, FooterSimple…)
  - `src/hooks/` : hooks personnalisés pour la logique métier (ex : gestion du jeu)
  - `src/types/` : définitions TypeScript pour la robustesse du typage
  - `src/utils/` : fonctions utilitaires
  - `public/` : fichiers statiques

L’interface principale est structurée en deux colonnes (GameBoard et GameHistory) avec Mantine Grid, responsive et adaptative.  
La logique du jeu est centralisée dans un hook personnalisé pour séparer la logique métier de l’affichage.

---

## Points à améliorer avec plus de temps

- **Tests unitaires et d’intégration** : Ajouter des tests pour sécuriser la logique métier et les composants.
- **Accessibilité** : Améliorer la navigation clavier et l’accessibilité ARIA.
- **Gestion des erreurs** : Ajouter une gestion plus fine des erreurs réseau ou de logique.
- **Animations** : Ajouter des transitions pour rendre l’expérience plus fluide.
- **Internationalisation** : Prévoir la traduction de l’interface.
- **Optimisation mobile** : Affiner le responsive pour une expérience mobile optimale.
- **Stockage persistant** : Sauvegarder l’historique des parties en localStorage ou via une API.
- **Séparation avancée des responsabilités** : Découper davantage les hooks et composants pour une meilleure maintenabilité.

---

© 2025 – Test technique