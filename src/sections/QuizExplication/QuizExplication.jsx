// ================================================================
// QuizExplication.jsx — BLOC EXPLICATION + BOUTON SUIVANT
// ================================================================
// Props :
//   - question        → objet question { explanation, correctAnswer }
//   - reponseChoisie  → index de la réponse (ou -1 si temps écoulé)
//   - estDerniere     → boolean (si c'est la dernière question)
//   - onSuivant       → passer à la question suivante ou aux résultats
// ================================================================

import { CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import './QuizExplication.css'

export function QuizExplication({ question, reponseChoisie, estDerniere, onSuivant }) {
  const correct = reponseChoisie === question.correctAnswer

  return (
    <div className={`quiz-explication-carte ${correct ? 'quiz-explication-carte--correct' : 'quiz-explication-carte--incorrect'}`}>
      <div className="quiz-explication-corps">
        {correct
          ? <CheckCircle className="quiz-explication-icone quiz-explication-icone--correct" />
          : <AlertCircle className="quiz-explication-icone quiz-explication-icone--incorrect" />
        }
        <div>
          <p className="quiz-explication-label">
            {correct ? 'Bonne réponse !' : 'Explication'}
          </p>
          <p className="quiz-explication-texte">{question.explanation}</p>
        </div>
      </div>

      <button onClick={onSuivant} className="quiz-explication-bouton">
        {estDerniere
          ? 'Voir les résultats'
          : <><span>Question suivante</span><ChevronRight /></>
        }
      </button>
    </div>
  )
}
