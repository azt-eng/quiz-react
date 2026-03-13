// ================================================================
// ExamenResultats.jsx — ÉCRAN DE RÉSULTATS FINAUX DE L'EXAMEN
// ================================================================
// Props :
//   - resultatsSeries → tableau de 3 tableaux de résultats
//   - nouveauBadge    → string ou null
//   - surTermine      → retourner à l'accueil
// ================================================================

import { CheckCircle, GraduationCap, AlertCircle, Medal, Trophy } from 'lucide-react'
import './ExamenResultats.css'

export function ExamenResultats({ resultatsSeries, nouveauBadge, surTermine }) {
  const tousLesResultats = resultatsSeries.flat()
  const nbBonnes    = tousLesResultats.filter(r => r.correct).length
  const pourcentage = Math.round((nbBonnes / 60) * 100)
  const reussi      = nbBonnes >= 36

  return (
    <div className="examen-resultats-page">
      <div className="examen-resultats-contenu">
        <div className="examen-resultats-carte">

          {/* Badge débloqué */}
          {nouveauBadge && (
            <div>
              <span className="examen-resultats-badge-pill">
                <Medal />
                Nouveau badge : {nouveauBadge}
              </span>
            </div>
          )}

          {/* Icône résultat */}
          <div className={`examen-resultats-icone-cercle ${reussi ? 'examen-resultats-icone-cercle--succes' : 'examen-resultats-icone-cercle--echec'}`}>
            {reussi ? <GraduationCap /> : <AlertCircle />}
          </div>

          <h2 className="examen-resultats-titre">
            {reussi ? 'Diplôme obtenu !' : 'Examen terminé'}
          </h2>
          <p className="examen-resultats-sous-titre">
            {reussi
              ? 'Félicitations ! Vous êtes maintenant un expert du Moyen-Âge !'
              : "Vous pouvez retenter l'examen pour améliorer votre score."}
          </p>

          {/* Score par série */}
          <div className="examen-resultats-stats-series">
            {resultatsSeries.map((resultats, idx) => (
              <div key={idx} className="examen-resultats-stat-serie">
                <div className="examen-resultats-stat-serie-valeur">
                  {resultats.filter(r => r.correct).length}/20
                </div>
                <div className="examen-resultats-stat-serie-label">Série {idx + 1}</div>
              </div>
            ))}
          </div>

          {/* Score global */}
          <div className="examen-resultats-stats-global">
            <div className="examen-resultats-stat examen-resultats-stat--green">
              <div className="examen-resultats-stat-valeur">{nbBonnes}/60</div>
              <div className="examen-resultats-stat-label">Bonnes réponses</div>
            </div>
            <div className="examen-resultats-stat examen-resultats-stat--blue">
              <div className="examen-resultats-stat-valeur">{pourcentage}%</div>
              <div className="examen-resultats-stat-label">Score global</div>
            </div>
            <div className="examen-resultats-stat examen-resultats-stat--purple">
              <div className="examen-resultats-stat-valeur">+{nbBonnes * 15 + 500}</div>
              <div className="examen-resultats-stat-label">XP gagné</div>
            </div>
          </div>

          {/* Certificat */}
          {reussi && (
            <div className="examen-certificat">
              <Trophy />
              <h3 className="examen-certificat-titre">Certificat de réussite</h3>
              <p className="examen-certificat-texte">
                Wikipedia Learn certifie que vous avez maîtrisé le programme sur le Moyen-Âge
              </p>
            </div>
          )}

          <button onClick={surTermine} className="examen-resultats-bouton">
            <CheckCircle />
            Retour à l'accueil
          </button>

        </div>
      </div>
    </div>
  )
}
