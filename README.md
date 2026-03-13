# Wikipedia Learn – Le Moyen-Âge 🏰

IMPORTANT : sur le rendu il y a le lien du premier git utilisé pour ce travail avec les branches de tous le monde je le remets plus bas au cas ou 

https://github.com/DaupinDavid/codingsprint -> premier git 

Quiz interactif sur le Moyen-Âge, développé en React.js.

## Stack technique

- **React 18** (JavaScript / JSX — pas de TypeScript)
- **Vite** — bundler et serveur de développement
- **Tailwind CSS** — styles utilitaires
- **Zustand** — gestion de l'état global avec persistance localStorage
- **Lucide React** — icônes

## Structure du projet

```
src/
├── main.jsx              # Point d'entrée
├── App.jsx               # Composant racine + routage
├── index.css             # Styles globaux (Tailwind)
├── data/
│   ├── questions.js      # 60 questions (3 niveaux)
│   └── courses.js        # Contenus des cours
├── sections/
│   ├── Home.jsx          # Écran d'accueil
│   ├── Course.jsx        # Cours avec sommaire
│   ├── Quiz.jsx          # Quiz avec timer
│   └── Exam.jsx          # Examen final (3 séries)
├── store/
│   └── gameStore.js      # Store Zustand (XP, badges, progression)
└── types/
    └── index.js          # Constantes (LEVELS)
```

## Démarrage

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Fonctionnalités

- 3 niveaux progressifs : Débutant → Intermédiaire → Expert
- Cours de révision avant chaque quiz
- Timer de 45 secondes par question
- Système XP et badges
- Examen final déblocable (3 séries de 20 questions)
- Progression sauvegardée en localStorage
