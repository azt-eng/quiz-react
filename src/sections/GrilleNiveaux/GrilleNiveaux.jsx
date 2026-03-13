// ================================================================
// GrilleNiveaux.jsx — GRILLE DES 3 CARTES DE NIVEAUX
// ================================================================
//
// 🔑 CONCEPT REACT : RENDU DE LISTE AVEC .map()
// .map() parcourt un tableau et transforme chaque élément en JSX.
// C'est LA façon standard d'afficher une liste en React.
// Exemple :
//   const fruits = ['🍎', '🍌', '🍇']
//   fruits.map(fruit => <li>{fruit}</li>)
//   → <li>🍎</li> <li>🍌</li> <li>🍇</li>
//
// 🔑 CONCEPT REACT : LA PROP "key"
// Quand on utilise .map(), chaque élément JSX doit avoir une prop
// "key" unique. React l'utilise en interne pour optimiser les
// mises à jour du DOM. Ne PAS utiliser l'index du tableau comme key
// (sauf si la liste ne change pas). Utiliser un ID unique.
//
// 🔑 CONCEPT REACT : RENDU CONDITIONNEL
// En JSX, on peut afficher/masquer des éléments avec :
//   {condition && <Element />}    → affiche si condition est vraie
//   {condition ? <A /> : <B />}  → ternaire : A si vrai, B si faux
// ================================================================

import './GrilleNiveaux.css'

// ================================================================
// FONCTION UTILITAIRE (hors composant)
// Cette fonction calcule le statut d'affichage d'un niveau.
// Elle retourne un objet { texte, classe } utilisé dans le JSX.
// ================================================================
function statutDuNiveau(id, niveauxTermines, niveauActuel, peutAcceder) {
  // Ordre de priorité des vérifications :
  if (niveauxTermines.includes(id))
    return { texte: 'Complété',   classe: 'niveau-statut-badge--complete'   }
  if (niveauActuel === id)
    return { texte: 'En cours',   classe: 'niveau-statut-badge--en-cours'   }
  if (peutAcceder(id))
    return { texte: 'Disponible', classe: 'niveau-statut-badge--disponible' }
  // Valeur par défaut si aucune condition ci-dessus n'est vraie :
  return   { texte: 'Verrouillé', classe: 'niveau-statut-badge--verrouille' }
}

// ================================================================
// COMPOSANT PRINCIPAL
// Props :
//   - niveaux           → tableau des 3 niveaux (depuis types/index.js)
//   - progression       → objet contenant niveauxTermines, niveauActuel
//   - peutAccederNiveau → fonction(id) → boolean
//   - scoreNiveau       → fonction(id) → nombre de bonnes réponses
//   - surSelectNiveau   → appelée quand on clique sur un niveau
// ================================================================
export function GrilleNiveaux({ niveaux, progression, peutAccederNiveau, scoreNiveau, surSelectNiveau }) {
  return (
    <div className="grille-niveaux">
      {/*
        .map() parcourt le tableau "niveaux" (3 objets).
        Pour chaque niveau, on retourne une carte JSX.
        "niveau" est la variable locale pour chaque itération.
      */}
      {niveaux.map((niveau) => {
        // ---- Calculs pour ce niveau ----
        const statut    = statutDuNiveau(
          niveau.id,
          progression.niveauxTermines,
          progression.niveauActuel,
          peutAccederNiveau
        )
        const estBloque = !peutAccederNiveau(niveau.id)
        // Le niveau est verrouillé si peutAccederNiveau renvoie false
        const score     = scoreNiveau(niveau.id)
        // score = nombre de réponses correctes (entre 0 et 20)

        return (
          // 🔑 La prop "key" est OBLIGATOIRE dans un .map()
          // On utilise niveau.id car c'est unique ('debutant', etc.)
          <div
            key={niveau.id}

            // 🔑 TEMPLATE LITERALS dans className
            // Les backticks `` permettent d'insérer des expressions :
            // `classe-fixe ${variable}` combine une classe fixe + variable
            className={`niveau-carte ${estBloque ? 'niveau-carte--bloque' : 'niveau-carte--accessible'}`}

            // 🔑 STYLE INLINE
            // style={{ ... }} applique du CSS directement sur l'élément.
            // On utilise les vraies valeurs CSV du niveau (définies dans types/index.js)
            style={{ backgroundColor: niveau.couleurFond }}

            // 🔑 HANDLER DE CLIC CONDITIONNEL
            // On n'appelle surSelectNiveau que si le niveau n'est pas bloqué.
            // Le && court-circuite : si estBloque est vrai, rien ne se passe.
            onClick={() => !estBloque && surSelectNiveau(niveau.id)}
          >
            {/* Badge de statut (coin supérieur droit) */}
            <div className="niveau-statut">
              <span className={`niveau-statut-badge ${statut.classe}`}>
                {statut.texte}
              </span>
            </div>

            {/* Corps de la carte */}
            <div className="niveau-contenu">
              <div className="niveau-icone">{niveau.icone}</div>
              {/* niveau.icone est un emoji stocké dans types/index.js */}

              <h3
                className="niveau-nom"
                style={{ color: niveau.couleur }}
                // La couleur du titre dépend du niveau (vert/bleu/violet)
              >
                {niveau.nom}
              </h3>

              <p className="niveau-description">{niveau.description}</p>

              {/* Infos (nombre de questions / temps) */}
              <div className="niveau-infos">
                <span>
                  {/* Affichage conditionnel : ternaire */}
                  {score > 0 ? `${score}/20 questions` : '20 questions'}
                </span>
                <span>45s/question</span>
              </div>

              {/* Mini barre de progression */}
              {/* 🔑 RENDU CONDITIONNEL : affiché seulement si score > 0 */}
              {score > 0 && (
                <div className="niveau-progression-piste">
                  <div
                    className="niveau-progression-remplissage"
                    style={{ width: `${(score / 20) * 100}%` }}
                    // width calculée dynamiquement : si score=10, width=50%
                  />
                </div>
              )}
            </div>

            {/* Overlay cadenas (uniquement si le niveau est verrouillé) */}
            {estBloque && (
              <div className="niveau-overlay">
                <div className="niveau-overlay-texte">
                  🔒 Terminez le niveau précédent
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
