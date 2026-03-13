// ================================================================
// QuizResultats.jsx — ÉCRAN DE RÉSULTATS FINAL DU QUIZ
// ================================================================
// Props :
//   - resultats   → tableau des résultats par question
//   - questions   → tableau des questions
//   - niveau      → 'debutant' | 'intermediaire' | 'expert'
//   - nouveauBadge → string ou null
//   - surTermine  → retourner à l'accueil
// ================================================================

import { Trophy, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import './QuizResultats.css'

const NOMS_NIVEAU = {
  debutant: 'Débutant', intermediaire: 'Intermédiaire', expert: 'Expert'
}

export function QuizResultats({ resultats, questions, niveau, nouveauBadge, surTermine }) {
  const nbBonnes    = resultats.filter(r => r.correct).length
  const pourcentage = Math.round((nbBonnes / questions.length) * 100)
  const reussi      = nbBonnes >= 12

  return (
    <div className="quiz-resultats-page">
      <div className="quiz-resultats-contenu">

        <div className="quiz-resultats-carte">

          {/* Badge débloqué */}
          {nouveauBadge && (
            <div className="quiz-resultats-badge">
              <span className="quiz-resultats-badge-pill">
                <Trophy />
                Nouveau badge : {nouveauBadge}
              </span>
            </div>
          )}

          {/* Icône résultat */}
          <div className={`quiz-resultats-icone-cercle ${reussi ? 'quiz-resultats-icone-cercle--succes' : 'quiz-resultats-icone-cercle--echec'}`}>
            {reussi ? <Trophy /> : <AlertCircle />}
          </div>

          <h2 className="quiz-resultats-titre">
            {reussi ? 'Félicitations !' : 'Quiz terminé'}
          </h2>
          <p className="quiz-resultats-sous-titre">
            {reussi
              ? `Vous avez validé le niveau ${NOMS_NIVEAU[niveau]} !`
              : `Score minimum non atteint (12/20 requis). Vous pouvez réessayer.`}
          </p>

          {/* Statistiques */}
          <div className="quiz-resultats-stats">
            <div className="quiz-resultats-stat quiz-resultats-stat--amber">
              <div className="quiz-resultats-stat-valeur">{nbBonnes}/20</div>
              <div className="quiz-resultats-stat-label">Bonnes réponses</div>
            </div>
            <div className="quiz-resultats-stat quiz-resultats-stat--blue">
              <div className="quiz-resultats-stat-valeur">{pourcentage}%</div>
              <div className="quiz-resultats-stat-label">Score</div>
            </div>
            <div className="quiz-resultats-stat quiz-resultats-stat--purple">
              <div className="quiz-resultats-stat-valeur">+{nbBonnes * 10}</div>
              <div className="quiz-resultats-stat-label">XP gagné</div>
            </div>
          </div>

          {/* Boutons */}
          {reussi ? (
            <button onClick={surTermine} className="quiz-resultats-bouton-succes">
              <CheckCircle />
              Continuer
            </button>
          ) : (
            <>
              <button onClick={surTermine} className="quiz-resultats-bouton-echec">
                Retour à l'accueil
              </button>
              <p className="quiz-resultats-note">Vous pouvez réessayer le quiz plus tard</p>
            </>
          )}
        </div>

        {/* Révision */}
        <div className="quiz-revision">
          <h3 className="quiz-revision-titre">Révision des réponses</h3>
          <div className="quiz-revision-liste">
            {resultats.map((resultat, idx) => {
              const q = questions.find(q => q.id === resultat.idQuestion)
              if (!q) return null
              return (
                <div key={idx} className={`quiz-revision-item ${resultat.correct ? 'quiz-revision-item--correct' : 'quiz-revision-item--incorrect'}`}>
                  <div className="quiz-revision-item-corps">
                    {resultat.correct
                      ? <CheckCircle />
                      : <XCircle />
                    }
                    <div>
                      <p className="quiz-revision-question">{q.question}</p>
                      <p className="quiz-revision-reponse">
                        Votre réponse : {resultat.reponseChoisie >= 0 ? q.options[resultat.reponseChoisie] : 'Temps écoulé'}
                      </p>
                      {!resultat.correct && (
                        <p className="quiz-revision-bonne">Bonne réponse : {q.options[q.correctAnswer]}</p>
                      )}
                      <p className="quiz-revision-explication">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
