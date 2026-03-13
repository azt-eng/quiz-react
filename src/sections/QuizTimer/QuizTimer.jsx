// ================================================================
// QuizTimer.jsx — AFFICHAGE DU COMPTE À REBOURS
// ================================================================
//
// 🔑 CONCEPT REACT : COMPOSANT PUR (pas de state)
// Ce composant n'a aucune logique interne.
// Il reçoit "tempsRestant" et change juste son apparence selon
// si le temps est urgent (≤ 10s) ou normal.
//
// 🔑 CONCEPT JSX : EXPRESSION DANS className
// On peut calculer la valeur de className avec une expression :
//   className={`classe-fixe ${condition ? 'classe-a' : 'classe-b'}`}
//
// 📥 Props :
//   - tempsRestant → number : secondes restantes
// ================================================================

import { Timer } from 'lucide-react'
import './QuizTimer.css'

export function QuizTimer({ tempsRestant }) {
  // Calcul d'un booléen : true si 10 secondes ou moins restent
  const urgent = tempsRestant <= 10

  return (
    <div className={`quiz-timer-carte ${urgent ? 'quiz-timer-carte--urgent' : ''}`}>
      {/*
        Template literal dans className :
        - Toujours : "quiz-timer-carte"
        - Si urgent=true → ajoute "quiz-timer-carte--urgent" (bordure rouge)
        - Si urgent=false → ajoute "" (chaîne vide = pas de classe)
        
        C'est la convention BEM (Block Element Modifier) :
        - .quiz-timer-carte   = le bloc (base)
        - .quiz-timer-carte--urgent = le modificateur (variante)
      */}

      <div className="quiz-timer-centre">
        {/* flex horizontal centré (display:flex; justify-content:center) */}

        {/* Icône Timer : change de couleur selon l'urgence */}
        <Timer
          className={`quiz-timer-icone ${urgent ? 'quiz-timer-icone--urgent' : 'quiz-timer-icone--normal'}`}
        />

        {/* Valeur numérique : change de couleur selon l'urgence */}
        <span className={`quiz-timer-valeur ${urgent ? 'quiz-timer-valeur--urgent' : 'quiz-timer-valeur--normal'}`}>
          {tempsRestant}s
          {/* "{tempsRestant}s" affiche par ex "28s" */}
        </span>

      </div>
    </div>
  )
}
