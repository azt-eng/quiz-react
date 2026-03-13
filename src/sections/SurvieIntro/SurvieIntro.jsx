// ================================================================
// SurvieIntro.jsx — ÉCRAN D'INTRODUCTION MODE SURVIE
// ================================================================
// Props :
//   - surQuitter    → retour à l'accueil
//   - surDemarrer   → démarrer la partie
//   - nbQuestions   → nombre de questions (default 50)
//   - tempsQuestion → secondes par question (default 20)
// ================================================================

import { Zap, Skull, Timer, Trophy } from 'lucide-react'
import './SurvieIntro.css'

export function SurvieIntro({ surQuitter, surDemarrer, nbQuestions = 50, tempsQuestion = 20 }) {
  return (
    <div className="survie-intro-fond">
      <div className="survie-intro-carte">

        <div className="survie-intro-entete">
          <span className="survie-intro-emoji">💀</span>
          <h1 className="survie-intro-titre">Mode Survie</h1>
          <p className="survie-intro-sous-titre">Jusqu'où pouvez-vous aller ?</p>
        </div>

        <div className="survie-intro-regles">
          <div className="survie-intro-regle">
            <Zap style={{ color: '#fb923c' }} />
            <p className="survie-intro-regle-texte">
              <strong>{nbQuestions} questions</strong> mélangées des 3 niveaux
            </p>
          </div>
          <div className="survie-intro-regle">
            <Skull style={{ color: '#f87171' }} />
            <p className="survie-intro-regle-texte">
              <strong>Une seule erreur</strong> et la partie s'arrête
            </p>
          </div>
          <div className="survie-intro-regle">
            <Timer style={{ color: '#fb923c' }} />
            <p className="survie-intro-regle-texte">
              <strong>{tempsQuestion} secondes</strong> par question — le temps écoulé compte comme une erreur
            </p>
          </div>
          <div className="survie-intro-regle">
            <Zap style={{ color: '#facc15' }} />
            <p className="survie-intro-regle-texte">
              Plus vous répondez vite, plus vous gagnez de <strong>points</strong>
            </p>
          </div>
          <div className="survie-intro-regle">
            <Trophy style={{ color: '#facc15' }} />
            <p className="survie-intro-regle-texte">
              Votre score est sauvegardé dans le <strong>classement</strong>
            </p>
          </div>
        </div>

        <div className="survie-intro-boutons">
          <button onClick={surQuitter} className="survie-intro-bouton-retour">
            Retour
          </button>
          <button onClick={surDemarrer} className="survie-intro-bouton-jouer">
            ⚔️ Jouer
          </button>
        </div>

      </div>
    </div>
  )
}
