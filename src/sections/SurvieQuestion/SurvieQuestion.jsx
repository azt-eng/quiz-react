// ================================================================
// SurvieQuestion.jsx — ÉCRAN DE JEU : QUESTION ANIMÉE + RÉPONSES
// ================================================================
// Contient tout l'écran de jeu du Mode Survie :
// header score/progress, timer, carte question + réponses
//
// Props :
//   - question        → objet question
//   - reponseChoisie  → index ou null
//   - animationActive → boolean
//   - timerActif      → boolean
//   - tempsRestant    → secondes
//   - score           → score actuel
//   - nbBonnes        → nb de bonnes réponses
//   - indexQuestion   → index courant
//   - nbQuestions     → total questions
//   - onChoisirReponse → fonction(index)
//   - surQuitter      → retour accueil
//   - TEMPS_PAR_QUESTION / DUREE_ANIMATION → constantes
// ================================================================

import { Timer, Zap, ChevronRight, XCircle } from 'lucide-react'
import './SurvieQuestion.css'

const NOMS_NIVEAU = {
  debutant: 'Débutant', intermediaire: 'Intermédiaire', expert: 'Expert'
}

function iconeNiveau(niveau) {
  const icones = { debutant: '🌱', intermediaire: '📚', expert: '👑' }
  return icones[niveau] || '❓'
}

function classeTimer(tempsRestant) {
  if (tempsRestant <= 5)  return 'survie-timer--urgent'
  if (tempsRestant <= 10) return 'survie-timer--alerte'
  return 'survie-timer--normal'
}

function classeDecompte(tempsRestant) {
  if (tempsRestant <= 5)  return 'survie-jeu-decompte-remplissage--urgent'
  if (tempsRestant <= 10) return 'survie-jeu-decompte-remplissage--alerte'
  return 'survie-jeu-decompte-remplissage--normal'
}

function styleReponse(index, reponseChoisie, correctAnswer) {
  if (reponseChoisie === null) return 'survie-reponse--neutre'
  if (index === correctAnswer) return 'survie-reponse--correct'
  if (index === reponseChoisie) return 'survie-reponse--incorrect'
  return 'survie-reponse--grise'
}

export function SurvieQuestion({
  question,
  reponseChoisie,
  animationActive,
  timerActif,
  tempsRestant,
  score,
  nbBonnes,
  indexQuestion,
  nbQuestions,
  onChoisirReponse,
  surQuitter,
  TEMPS_PAR_QUESTION,
  DUREE_ANIMATION
}) {
  return (
    <div className="survie-jeu-page">
      <div className="survie-jeu-contenu">

        {/* En-tête score */}
        <div className="survie-jeu-entete">
          <button onClick={surQuitter} className="survie-jeu-bouton-quitter">Quitter</button>
          <div className="survie-jeu-score-badge">
            <Zap />
            <span>{score} pts</span>
          </div>
          <div className="survie-jeu-bonnes-badge">
            ✅ {nbBonnes}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="survie-jeu-progress-labels">
          <span>Question {indexQuestion + 1} sur {nbQuestions}</span>
          <span>{Math.round(((indexQuestion + 1) / nbQuestions) * 100)}%</span>
        </div>
        <div className="survie-jeu-progress-piste">
          <div
            className="survie-jeu-progress-remplissage"
            style={{ width: `${((indexQuestion + 1) / nbQuestions) * 100}%` }}
          />
        </div>

        {/* Timer + badge niveau */}
        <div className={`survie-jeu-timer-carte ${tempsRestant <= 5 ? 'survie-jeu-timer-carte--urgent' : 'survie-jeu-timer-carte--normal'}`}>
          <div className="survie-jeu-timer-ligne">
            {/* Badge niveau */}
            <div className="survie-jeu-niveau-badge">
              <span>{iconeNiveau(question.level)}</span>
              <span className={`survie-jeu-niveau-pilule survie-jeu-niveau-pilule--${question.level}`}>
                {NOMS_NIVEAU[question.level]}
              </span>
            </div>
            {/* Secondes */}
            <div className="survie-jeu-timer-valeur-ligne">
              <Timer className={classeTimer(tempsRestant)} />
              <span className={`survie-jeu-timer-valeur ${classeTimer(tempsRestant)}`}>
                {animationActive ? '—' : `${tempsRestant}s`}
              </span>
            </div>
          </div>

          {/* Barre de décompte */}
          {!animationActive && (
            <div className="survie-jeu-decompte-piste">
              <div
                className={`survie-jeu-decompte-remplissage ${classeDecompte(tempsRestant)}`}
                style={{ width: `${(tempsRestant / TEMPS_PAR_QUESTION) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Carte question (animée) */}
        <div
          className="survie-question-carte"
          style={{
            animation: animationActive
              ? `glissementDroite ${DUREE_ANIMATION}ms ease-out forwards`
              : 'none'
          }}
        >
          <div className="survie-question-corps">
            <h2 className="survie-question-texte">{question.question}</h2>

            <div className="survie-question-liste">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onChoisirReponse(index)}
                  disabled={reponseChoisie !== null || animationActive || !timerActif}
                  className={`survie-reponse-bouton ${styleReponse(index, reponseChoisie, question.correctAnswer)} disabled:cursor-not-allowed`}
                >
                  <div className="survie-reponse-ligne">
                    <span className="survie-reponse-lettre">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {reponseChoisie !== null && index === question.correctAnswer && (
                      <ChevronRight className="survie-reponse-icone survie-reponse-icone--correct" />
                    )}
                    {reponseChoisie === index && index !== question.correctAnswer && (
                      <XCircle className="survie-reponse-icone survie-reponse-icone--incorrect" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message pendant l'animation */}
        {animationActive && (
          <div className="survie-jeu-message-attente">Préparez-vous...</div>
        )}

      </div>
    </div>
  )
}
