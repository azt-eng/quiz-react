// ================================================================
// ModalesAccueil.jsx — FENÊTRES MODALES
// ================================================================
//
// 🔑 CONCEPT REACT : FRAGMENTS (<>...</>)
// Un composant React ne peut retourner QU'UN SEUL élément racine.
// Si on veut retourner plusieurs éléments sans div englobant,
// on utilise un Fragment : <> ... </>
// C'est ce que fait ce composant : il retourne 2 modales possibles
// sans créer un div inutile dans le DOM.
//
// 🔑 CONCEPT REACT : PORTAIL IMPLICITE
// Les modales utilisent "position: fixed" en CSS pour se placer
// par-dessus tout le reste de la page, indépendamment de leur
// position dans l'arbre DOM.
//
// 📥 Props :
//   - confirmerReinit    → boolean : modale de réinit visible ?
//   - badgeEnDetail      → badge ou null : modale badge visible ?
//   - onAnnulerReinit    → fonction : annuler la réinit
//   - onConfirmerReinit  → fonction : confirmer la réinit
//   - onFermerBadge      → fonction : fermer la modale badge
// ================================================================

import './ModalesAccueil.css'

export function ModalesAccueil({ confirmerReinit, badgeEnDetail, onAnnulerReinit, onConfirmerReinit, onFermerBadge }) {
  return (
    // 🔑 FRAGMENT : conteneur invisible
    <>

      {/* ============================================================
          MODALE 1 : Confirmation de réinitialisation
          Conditionnelle : s'affiche uniquement si confirmerReinit === true
          ============================================================ */}
      {confirmerReinit && (
        <div className="modale-fond">
          {/*
            .modale-fond a position: fixed + z-index: 50.
            → Il couvre toute la fenêtre par-dessus tout le reste.
            → En cliquant sur ce fond, l'utilisateur pourrait fermer
               la modale (non implémenté ici pour la réinit, c'est exprès
               car l'action est dangereuse).
          */}
          <div className="modale-fenetre modale-fenetre--reinit">
            {/* La fenêtre blanche centrée par flexbox du parent */}

            <h3 className="modale-reinit-titre">Réinitialiser ?</h3>
            <p className="modale-reinit-texte">
              Êtes-vous sûr de vouloir effacer toute votre progression ?
              Cette action est irréversible.
            </p>

            {/* Deux boutons côte à côte (flex horizontal en CSS) */}
            <div className="modale-boutons">
              <button onClick={onAnnulerReinit} className="modale-bouton-annuler">
                Annuler
              </button>
              <button onClick={onConfirmerReinit} className="modale-bouton-confirmer">
                Oui, réinitialiser
              </button>
              {/* Ce bouton est rouge (destructif) pour alerter l'utilisateur */}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================
          MODALE 2 : Détail d'un badge
          Conditionnelle : s'affiche si badgeEnDetail n'est PAS null
          ============================================================ */}
      {badgeEnDetail && (
        // Cliquer sur le fond sombre ferme la modale
        <div className="modale-fond" onClick={onFermerBadge}>
          <div
            className="modale-fenetre modale-fenetre--badge"
            onClick={e => e.stopPropagation()}
            // 🔑 e.stopPropagation()
            // Sans ça, cliquer DANS la fenêtre blanche déclencherait
            // aussi le onClick du parent (.modale-fond), ce qui
            // fermerait la modale immédiatement.
            // stopPropagation() empêche l'événement de "remonter"
            // vers les éléments parents. C'est la "propagation d'événements".
          >

            <div className="modale-badge-centre">
              <span className="modale-badge-icone">{badgeEnDetail.icone}</span>
              <h3 className="modale-badge-nom">{badgeEnDetail.nom}</h3>
              <p className="modale-badge-description">{badgeEnDetail.description}</p>
            </div>

            <p className="modale-badge-date">
              Débloqué le {new Date(badgeEnDetail.debloqueA).toLocaleDateString('fr-FR')}
              {/*
                new Date(timestamp) crée un objet Date JavaScript.
                .toLocaleDateString('fr-FR') le formate en français :
                ex: "13/03/2026"
              */}
            </p>

            <button onClick={onFermerBadge} className="modale-bouton-fermer">
              Fermer
            </button>

          </div>
        </div>
      )}

    </>
  )
}
