// ================================================================
// SectionBadges.jsx — SECTION DES BADGES DÉBLOQUÉS
// ================================================================
//
// 🔑 CONCEPT REACT : EARLY RETURN (retour anticipé)
// Si le joueur n'a aucun badge, on retourne null.
// "null" en JSX = afficher rien du tout.
// C'est une technique courante pour masquer complètement un
// composant sans erreurs : if (!condition) return null
//
// 📥 Props :
//   - badges       → tableau de badges (peut être vide)
//   - onBadgeClick → fonction(badge) pour voir un badge en détail
// ================================================================

import { Trophy } from 'lucide-react'
import './SectionBadges.css'

export function SectionBadges({ badges, onBadgeClick }) {

  // 🔑 EARLY RETURN - si pas de badges, on n'affiche rien
  if (!badges || badges.length === 0) return null
  // !badges → vrai si badges est null, undefined, ou vide
  // badges.length === 0 → tableau vide

  return (
    <div className="badges-carte">

      <h2 className="badges-titre">
        <Trophy />
        Vos badges ({badges.length})
        {/* badges.length = nombre total de badges débloqués */}
      </h2>

      {/* Liste de badges (flex-wrap en CSS : les badges passent à la ligne) */}
      <div className="badges-liste">
        {badges.map((badge) => (
          <button
            key={badge.id}
            // Chaque badge a un "id" unique dans le store

            onClick={() => onBadgeClick(badge)}
            // On passe le badge ENTIER (objet) au parent.
            // L'accueil stocke ce badge dans badgeEnDetail (useState),
            // ce qui déclenche l'affichage de la modale.

            className="badge-bouton"
          >
            <span className="badge-icone">{badge.icone}</span>
            <span className="badge-nom">{badge.nom}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
