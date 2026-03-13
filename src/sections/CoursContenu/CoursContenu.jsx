// ================================================================
// CoursContenu.jsx — CONTENU D'UNE SECTION DE COURS
// ================================================================
//
// 🔑 CONCEPT REACT : CALCULS DÉRIVÉS
// On peut calculer des valeurs locales à partir des props
// sans avoir besoin de useState. Ces valeurs sont recalculées
// à chaque rendu si les props changent.
// Exemple : estPremiere = indexActuel === 0
//
// 🔑 CONCEPT JSX : split().map()
// Pour afficher un long texte en plusieurs paragraphes,
// on sépare le texte sur '\n\n' (double saut de ligne)
// et on génère un <p> par paragraphe avec .map().
//
// 📥 Props :
//   - section         → { title, content }
//   - indexActuel     → numéro de la section courante (0-based)
//   - total           → nombre total de sections
//   - surPrecedent    → aller section précédente
//   - surSuivant      → aller section suivante
//   - surDemarrerQuiz → lancer le quiz
// ================================================================

import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import './CoursContenu.css'

export function CoursContenu({ section, indexActuel, total, surPrecedent, surSuivant, surDemarrerQuiz }) {

  // Calculs locaux basés sur la position dans la liste de sections
  const estPremiere = indexActuel === 0
  // true si on est sur la première section (pas de "Précédent")

  const estDerniere = indexActuel === total - 1
  // true si on est sur la dernière section
  // (le bouton "Suivant" devient "Commencer le quiz")

  return (
    <div className="contenu-carte">
      <div className="contenu-corps">

        {/* Indicateur de progression (ex: "Section 3 sur 8") */}
        <div className="contenu-compteur">
          Section {indexActuel + 1} sur {total}
          {/* +1 car indexActuel commence à 0, mais l'affichage commence à 1 */}
        </div>

        {/* Titre de la section */}
        <h2 className="contenu-titre">{section.title}</h2>

        {/* ---- Contenu texte du cours ----
            On divise le texte sur les doubles sauts de ligne.
            Chaque bloc devient un paragraphe <p> séparé.
            "\n\n" = séparateur de paragraphes dans les données. */}
        <div>
          {section.content.split('\n\n').map((paragraphe, idx) => (
            <p key={idx} className="contenu-paragraphe">
              {paragraphe}
            </p>
            // key={idx} ici c'est correct car les paragraphes ne
            // changent pas d'ordre dans un même texte.
          ))}
        </div>

        {/* ---- Navigation Précédent / Suivant ---- */}
        <div className="contenu-nav">

          {/* Bouton Précédent */}
          <button
            onClick={surPrecedent}
            disabled={estPremiere}
            // disabled=true sur la première section → le bouton est grisé
            className="contenu-bouton-nav"
          >
            <ChevronLeft />
            Précédent
          </button>

          {/* Bouton de droite : Suivant OU Commencer le quiz */}
          {estDerniere ? (
            // Si dernière section → bouton orange "Commencer le quiz"
            <button onClick={surDemarrerQuiz} className="contenu-bouton-quiz">
              <Play />
              Commencer le quiz
            </button>
          ) : (
            // Sinon → bouton gris "Suivant"
            <button onClick={surSuivant} className="contenu-bouton-nav">
              Suivant
              <ChevronRight />
            </button>
          )}
          {/*
            🔑 OPÉRATEUR TERNAIRE : condition ? siVrai : siFaux
            C'est la version "inline" du if/else en JSX.
          */}

        </div>
      </div>
    </div>
  )
}
