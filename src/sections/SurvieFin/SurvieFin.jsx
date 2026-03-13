// ================================================================
// SurvieFin.jsx — ÉCRAN DE FIN DE PARTIE MODE SURVIE
// ================================================================
// Props :
//   - estVictoire    → boolean
//   - score          → score final
//   - nbBonnes       → nombre de bonnes réponses
//   - rang           → position dans le classement
//   - indexQuestion  → dernière question atteinte
//   - cooldown       → millisecondes avant de pouvoir rejouer
//   - classement     → tableau des scores
//   - surDemarrer    → relancer une partie
//   - surQuitter     → retour à l'accueil
//   - nbQuestions    → nombre total de questions
//   - formaterCooldown → fonction(ms) → string HH:MM:SS
// ================================================================

import { Trophy, Clock } from 'lucide-react'
import './SurvieFin.css'

export function SurvieFin({ estVictoire, score, nbBonnes, rang, indexQuestion, cooldown, classement, surDemarrer, surQuitter, nbQuestions, formaterCooldown }) {
  return (
    <div className="survie-fin-page">
      <div className="survie-fin-contenu">

        {/* Résultat */}
        <div className="survie-fin-carte">
          <span className="survie-fin-emoji">{estVictoire ? '🏆' : '💀'}</span>
          <h2 className="survie-fin-titre">{estVictoire ? 'INCROYABLE !' : 'GAME OVER'}</h2>
          <p className="survie-fin-sous-titre">
            {estVictoire
              ? `Vous avez répondu correctement aux ${nbQuestions} questions !`
              : `Éliminé à la question ${indexQuestion + 1} sur ${nbQuestions}`}
          </p>

          <div className="survie-fin-stats">
            <div className="survie-fin-stat">
              <div className="survie-fin-stat-valeur survie-fin-stat-valeur--score">{score}</div>
              <div className="survie-fin-stat-label">Score total</div>
            </div>
            <div className="survie-fin-stat">
              <div className="survie-fin-stat-valeur survie-fin-stat-valeur--bonnes">{nbBonnes}</div>
              <div className="survie-fin-stat-label">Bonnes réponses</div>
            </div>
            <div className="survie-fin-stat">
              <div className="survie-fin-stat-valeur survie-fin-stat-valeur--rang">#{rang}</div>
              <div className="survie-fin-stat-label">Classement</div>
            </div>
          </div>

          {/* Cooldown */}
          <div className="survie-fin-cooldown">
            <Clock />
            <div>
              <p className="survie-fin-cooldown-label">Vous pouvez réessayer dans</p>
              <p className="survie-fin-cooldown-valeur">
                {cooldown > 0 ? formaterCooldown(cooldown) : 'Disponible maintenant !'}
              </p>
            </div>
          </div>

          <button onClick={surDemarrer} className="survie-fin-bouton-rejouer">
            ⚔️ Relancer une session
          </button>
          <button onClick={surQuitter} className="survie-fin-bouton-retour">
            Retour à l'accueil
          </button>
        </div>

        {/* Classement */}
        <div className="survie-classement-carte">
          <h3 className="survie-classement-titre">
            <Trophy />
            Classement du Mode Survie
          </h3>

          {classement.length === 0 ? (
            <p className="survie-classement-vide">Aucun score enregistré.</p>
          ) : (
            <div className="survie-classement-liste">
              {classement.map((entree, index) => {
                const estLeJoueur = entree.score === score && index + 1 === rang
                return (
                  <div
                    key={index}
                    className={`survie-classement-ligne ${estLeJoueur ? 'survie-classement-ligne--joueur' : 'survie-classement-ligne--autre'}`}
                  >
                    <div className="survie-classement-gauche">
                      <span className="survie-classement-medaille">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <div>
                        <p className="survie-classement-nom">
                          {entree.nom}
                          {estLeJoueur && <span className="survie-classement-nom-badge">Vous</span>}
                        </p>
                        <p className="survie-classement-detail">
                          Question {entree.questionAtteinte} atteinte · {entree.date}
                        </p>
                      </div>
                    </div>
                    <p className="survie-classement-score">{entree.score} pts</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
