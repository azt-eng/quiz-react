// ================================================================
// Header.jsx — EN-TÊTE DE LA PAGE D'ACCUEIL
// ================================================================
//
// 🔑 CONCEPT REACT : COMPOSANT PRÉSENTATIONNEL
// Ce composant ne gère PAS de logique (pas de useState, pas de
// useEffect). Il reçoit des données via des "props" et les affiche.
// C'est le type de composant le plus simple : entrée → sortie visuelle.
//
// 📥 Props reçues :
//   - totalXP  (number) → points d'expérience totaux du joueur
//   - nbBadges (number) → nombre de badges débloqués
// ================================================================

// On importe uniquement les icônes dont on a besoin depuis lucide-react.
// BookOpen = icône de livre ouvert (logo)
// Star     = étoile (XP)
// Trophy   = trophée (badge)
import { BookOpen, Star, Trophy } from 'lucide-react'

import './Header.css'
// Ce fichier CSS contient UNIQUEMENT les styles de ce composant.
// C'est le principe de "CSS scopé" : chaque composant a son propre fichier.

// ================================================================
// DÉFINITION DU COMPOSANT
// { totalXP, nbBadges } = destructuration des props
// Équivalent à : function Header(props) { const totalXP = props.totalXP ... }
// ================================================================
export function Header({ totalXP, nbBadges }) {
  return (
    <header className="header-barre">
      {/*
        <header> est une balise HTML5 sémantique.
        Elle indique au navigateur et aux moteurs de recherche
        que c'est l'en-tête de la page.
      */}
      <div className="header-contenu">
        {/* Ce div centre le contenu et crée la mise en page flex (voir CSS) */}

        {/* ---- Logo + Titre ---- */}
        <div className="header-logo-groupe">
          {/* Flex horizontal : icône à gauche, titres à droite */}

          <div className="header-logo-icone">
            {/* Fond semi-transparent pour l'icône */}
            <BookOpen />
            {/* <BookOpen /> est un composant React (de lucide-react).
                Il génère une balise <svg> avec le dessin d'un livre. */}
          </div>

          <div>
            <h1 className="header-titre">Wikipedia Learn</h1>
            {/* h1 = titre principal de la page (un seul par page en SEO) */}
            <p className="header-sous-titre">Le Moyen-Âge</p>
          </div>
        </div>

        {/* ---- Statistiques (XP + Badges) ---- */}
        <div className="header-stats">
          {/* Flex horizontal des deux badges de statistiques */}

          <div className="header-stat-badge">
            {/* Badge XP */}
            <Star />
            <span>{totalXP} XP</span>
            {/*
              {totalXP} est une expression JavaScript dans le JSX.
              Les accolades {} permettent d'injecter une valeur JavaScript
              dans le rendu HTML. totalXP vient de la prop reçue.
            */}
          </div>

          <div className="header-stat-badge">
            {/* Badge Badges */}
            <Trophy />
            <span>{nbBadges} Badges</span>
          </div>
        </div>

      </div>
    </header>
  )
}
