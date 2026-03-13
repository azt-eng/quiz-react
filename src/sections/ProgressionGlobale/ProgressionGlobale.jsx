// ================================================================
// ProgressionGlobale.jsx — CARTE DE PROGRESSION
// ================================================================
//
// 🔑 CONCEPT REACT : PROPS SIMPLES (numbers)
// Ce composant reçoit uniquement des nombres.
// Il les affiche et les utilise dans du CSS inline pour la largeur
// de la barre de progression.
//
// 📥 Props :
//   - pourcentageGlobal    → 0-100 → largeur de la barre
//   - scoreDebutant        → nombre de bonnes réponses (débutant)
//   - scoreIntermediaire   → idem (intermédiaire)
//   - scoreExpert          → idem (expert)
// ================================================================

import { Target } from 'lucide-react'
import './ProgressionGlobale.css'

export function ProgressionGlobale({ pourcentageGlobal, scoreDebutant, scoreIntermediaire, scoreExpert }) {
  return (
    <div className="progression-carte">

      {/* Titre avec icône */}
      <h2 className="progression-titre">
        <Target />
        {/* <Target /> = icône "cible" de lucide-react */}
        Votre progression
      </h2>

      {/* ---- Barre de progression ---- */}

      {/* Labels au-dessus de la barre */}
      <div className="progression-labels">
        <span>Progression globale</span>
        <span>{pourcentageGlobal}%</span>
        {/* {pourcentageGlobal} injecte la valeur de la prop */}
      </div>

      {/* Piste de la barre (fond) */}
      <div className="progression-piste">
        {/* Remplissage dynamique */}
        <div
          className="progression-remplissage"
          style={{ width: `${pourcentageGlobal}%` }}
          // 🔑 STYLE INLINE DYNAMIQUE
          // style={{ ... }} = attribut style en JSX (double accolades)
          // La première { } = expression JavaScript dans JSX
          // La deuxième { } = syntaxe objet CSS
          // `${pourcentageGlobal}%` = template literal
          // ex: si pourcentageGlobal=33, → width: "33%"
        />
        {/* Ce div n'a PAS de contenu enfant. La barre est uniquement visible
            grâce à sa hauteur (h-3) et sa couleur de fond définies en CSS. */}
      </div>

      {/* ---- Scores par niveau ---- */}
      <div className="progression-scores">
        {/* Grille de 3 colonnes (voir CSS : grid-template-columns: repeat(3, 1fr)) */}

        <div className="score-cellule score-cellule--debutant">
          {/* On combine 2 classes CSS : la classe de base + la variante de couleur */}
          <div className="score-nombre score-nombre--debutant">{scoreDebutant}</div>
          <div className="score-label">Débutant</div>
        </div>

        <div className="score-cellule score-cellule--intermediaire">
          <div className="score-nombre score-nombre--intermediaire">{scoreIntermediaire}</div>
          <div className="score-label">Intermédiaire</div>
        </div>

        <div className="score-cellule score-cellule--expert">
          <div className="score-nombre score-nombre--expert">{scoreExpert}</div>
          <div className="score-label">Expert</div>
        </div>
      </div>

    </div>
  )
}
