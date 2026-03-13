// ================================================================
// CoursTermine.jsx — BANNER DE FIN DE COURS
// ================================================================
// Affiché quand toutes les sections ont été lues.
//
// Props :
//   - nomNiveau       → 'Débutant' | 'Intermédiaire' | 'Expert'
//   - surDemarrerQuiz → fonction démarrer le quiz
// ================================================================

import { CheckCircle, Play } from 'lucide-react'
import './CoursTermine.css'

export function CoursTermine({ nomNiveau, surDemarrerQuiz }) {
  return (
    <div className="cours-termine-carte">
      <CheckCircle className="cours-termine-icone" />
      <h3 className="cours-termine-titre">
        Félicitations ! Vous avez terminé le cours
      </h3>
      <p className="cours-termine-texte">
        Vous êtes maintenant prêt à passer le quiz de {nomNiveau}
      </p>
      <button onClick={surDemarrerQuiz} className="cours-termine-bouton">
        <Play />
        Commencer le quiz (20 questions)
      </button>
    </div>
  )
}
