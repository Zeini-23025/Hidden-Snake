# Hidden Snake 🐍

**Hidden Snake** est un mini-jeu Snake caché dans une application React, accessible via un code secret !

## Présentation du projet

Ce projet propose une version moderne et stylisée du jeu Snake, intégrée dans une page React. Le jeu est caché et ne s’affiche qu’après avoir entré un code spécial (Konami code personnalisé). Il fonctionne sur ordinateur et mobile (clavier virtuel inclus).

## Fonctionnalités principales

- Grille de jeu 18x18
- Contrôles clavier (flèches, espace pour pause, Échap pour quitter)
- Contrôles tactiles sur mobile
- Sélecteur de vitesse
- Score affiché en temps réel
- Game Over en cas d’auto-collision
- Design néon/futuriste

## Comment jouer ?

### 1. Accès au jeu

- **Sur ordinateur** : Tapez la séquence suivante sur votre clavier :
	- `o`, `x`, `Flèche Haut`, `o`, `x`, `Flèche Bas`, `Flèche Gauche`, `o`, `x`, `Flèche Droite`
    - `➡️ 🟠 ❌ ⬆️ 🟠 ❌ ⬇️ ⬅️ 🟠 ❌ ➡️ `
- **Sur mobile** : Utilisez les boutons virtuels affichés en bas de l’écran pour entrer le code.

Une fois le code entré, le jeu Snake apparaît en plein écran !

### 2. Commandes du jeu

- **Déplacement** : Flèches directionnelles
- **Pause/Reprendre** : Barre d’espace ou bouton pause
- **Quitter le jeu** : Touche Échap ou bouton croix
- **Changer la vitesse** : Boutons x0.5, x1, x2
- **Redémarrer** : Bouton « 🔄 Restart »

## Lancer le projet en local

```bash
npm install
npm start
```
Puis ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.



## Structure du code

- `src/App.js` : Page principale, gestion du code secret et affichage du jeu
- `src/components/HiddenSnake.js` : Composant du jeu Snake

