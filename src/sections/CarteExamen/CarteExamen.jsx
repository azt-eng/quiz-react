// ================================================================
// CarteExamen.jsx — CARTE EXAMEN FINAL
// ================================================================
// Affiche la carte "Examen Final" (verrouillée si les 3 niveaux
// ne sont pas encore terminés)
//
// Props :
//   - examenDebloque    → boolean
//   - surDemarrerExamen → fonction appelée au clic sur le bouton
// ================================================================

import { Target, Star, GraduationCap } from 'lucide-react'
import './CarteExamen.css'

export function CarteExamen({ examenDebloque, surDemarrerExamen }) {
  return (
    <div className={`examen-carte ${examenDebloque ? 'examen-carte--debloque' : 'examen-carte--verrouille'}`}>

      <h2 className="examen-titre">
        <GraduationCap />
        Examen Final
      </h2>

      <p className="examen-description">
        {examenDebloque
          ? "Félicitations ! Vous pouvez maintenant passer l'examen final pour obtenir votre diplôme."
          : "Terminez les 3 niveaux pour débloquer l'examen final."}
      </p>

      {/* Infos */}
      <div className="examen-infos">
        <div className="examen-info-item">
          <Target />
          <span>3 séries de 20 questions</span>
        </div>
        <div className="examen-info-item">
          <Star />
          <span>Questions mélangées</span>
        </div>
      </div>

      <button
        onClick={surDemarrerExamen}
        disabled={!examenDebloque}
        className={`examen-bouton ${examenDebloque ? 'examen-bouton--actif' : 'examen-bouton--inactif'}`}
      >
        {examenDebloque ? "Commencer l'examen" : "Verrouillé"}
      </button>

    </div>
  )
}
