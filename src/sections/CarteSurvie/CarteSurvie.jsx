// ================================================================
// CarteSurvie.jsx — CARTE "MODE SURVIE"
// ================================================================
//
// 🔑 CONCEPT REACT : COMPOSANT AVEC UNE SEULE ACTION
// Ce composant est très simple : il affiche une carte décorative
// et appelle une fonction parent quand l'utilisateur clique.
// Il n'a PAS de state propre (pas de useState).
//
// 📥 Props :
//   - surDemarrerSurvie → fonction appelée au clic sur le bouton
//                         (définie dans App.jsx, passée via Accueil.jsx)
// ================================================================

import { Skull } from 'lucide-react'
// Skull = icône crâne de lucide-react
import './CarteSurvie.css'

export function CarteSurvie({ surDemarrerSurvie }) {
  return (
    <div className="survie-carte">
      {/*
        position: relative est appliqué par la CSS.
        Cela permet à l'enfant .survie-crane-fond d'être
        positionné "absolute" par rapport à cette carte.
      */}

      {/* Crâne géant décoratif en arrière-plan */}
      <div className="survie-crane-fond">
        💀
        {/*
          Cet emoji est positionné "absolute" en CSS (position: absolute).
          L'opacité (opacity: 0.1) le rend quasi-invisible = effet décoratif.
          user-select: none → empêche de sélectionner l'emoji par clic.
          pointer-events: none → l'emoji ne capture pas les clics de souris.
        */}
      </div>

      {/* Contenu principal (z-index supérieur à l'emoji) */}
      <div className="survie-contenu">

        {/* Ligne titre + badge "NOUVEAU" */}
        <div className="survie-entete">

          {/* Fond orange du crâne */}
          <div className="survie-icone-fond">
            <Skull />
          </div>

          <h2 className="survie-titre">Mode Survie</h2>

          {/* Badge "NOUVEAU" */}
          <span className="survie-badge-nouveau">NOUVEAU</span>
          {/*
            margin-left: auto dans le CSS pousse cet élément tout
            à droite dans le conteneur flex. C'est un "spacer flex".
          */}
        </div>

        {/* Description du mode */}
        <p className="survie-description">
          50 questions mélangées. Une erreur et tout s'arrête.
          Testez vos limites et grimpez dans le classement !
        </p>

        {/* Règles résumées en icônes */}
        <div className="survie-regles">
          <span>💀 Une vie</span>
          <span>⏱️ 20s / question</span>
          <span>🏆 Classement sauvegardé</span>
        </div>

        {/* Bouton principal */}
        <button
          onClick={surDemarrerSurvie}
          // onClick reçoit la prop directement comme handler.
          // Quand le bouton est cliqué, React appelle surDemarrerSurvie().
          className="survie-bouton"
        >
          <Skull />
          Entrer en Mode Survie
        </button>

      </div>
    </div>
  )
}
