// ================================================================
// Cours.jsx — PAGE DE COURS (orchestrateur)
// ================================================================
//
// 🔑 CONCEPT REACT : useEffect AVEC DÉPENDANCES
// Ce composant utilise useEffect pour marquer automatiquement une
// section comme "vue" dès qu'on la navigue.
// Les dépendances [sectionActuelle] disent à React :
// "Relance cet effet chaque fois que sectionActuelle change"
//
// 🔑 CONCEPT JAVASCRIPT : SPREAD OPERATOR
// [...tableau] = copie un tableau (syntaxe "spread")
// On ne doit JAMAIS modifier le state directement :
//   ❌ sectionsVues.push(index)           ← modifie le state directement
//   ✅ setSectionsVues([...sectionsVues, index]) ← crée une nouvelle copie
//
// 📥 Props reçues de App.jsx :
//   - niveau          → niveau sélectionné ('debutant', ...)
//   - surRetour       → retour à l'accueil
//   - surDemarrerQuiz → démarrer le quiz
// ================================================================

import { useState, useEffect } from 'react'
import { cours } from '../data/courses.js'
// "cours" est un tableau d'objets { level, title, sections, estimatedTime }

import { CoursHeader }   from './CoursHeader/CoursHeader.jsx'
import { CoursSommaire } from './CoursSommaire/CoursSommaire.jsx'
import { CoursContenu }  from './CoursContenu/CoursContenu.jsx'
import { CoursTermine }  from './CoursTermine/CoursTermine.jsx'

import './Cours.css'

// Correspondance clé → nom affiché
const NOMS_NIVEAU = {
  debutant:      'Débutant',
  intermediaire: 'Intermédiaire',
  expert:        'Expert',
}

export function Cours({ niveau, surRetour, surDemarrerQuiz }) {

  // Trouve le cours correspondant au niveau sélectionné
  const contenuDuCours = cours.find(c => c.level === niveau)
  // .find() parcourt le tableau et retourne le PREMIER élément
  // qui satisfait la condition. Retourne "undefined" si rien trouvé.

  // ---- Sections ----
  const [sectionActuelle, setSectionActuelle] = useState(0)
  // Index de la section affichée (0 = première section)

  const [sectionsVues, setSectionsVues] = useState([])
  // Tableau des index des sections déjà visitées.
  // Ex: [0, 1, 3] = sections 1, 2 et 4 ont été vues.

  // Guard : si le cours n'existe pas, n'affiche rien
  if (!contenuDuCours) return null

  // ================================================================
  // useEffect — MARQUER LA SECTION COMME VUE
  // S'exécute chaque fois que "sectionActuelle" change.
  // ================================================================
  useEffect(() => {
    // On vérifie si l'index actuel est DÉJÀ dans le tableau
    if (!sectionsVues.includes(sectionActuelle)) {
      // .includes() retourne true si la valeur est dans le tableau
      setSectionsVues(prev => [...prev, sectionActuelle])
      // [...prev, sectionActuelle] = copie du tableau + nouvel élément
    }
  }, [sectionActuelle])
  // Dépendance : relancer quand sectionActuelle change

  // ---- Calculs dérivés ----
  const pourcentage = (sectionsVues.length / contenuDuCours.sections.length) * 100
  // Ex: 3 sections vues sur 8 → (3/8)*100 = 37.5%

  const toutesVues = sectionsVues.length === contenuDuCours.sections.length
  // true quand TOUTES les sections ont été visitées
  // → affiche le banner de félicitations

  return (
    <div className="cours-page">

      {/* En-tête sticky (reste visible en scrollant) */}
      <CoursHeader
        niveau={niveau}
        titre={contenuDuCours.title}
        duree={contenuDuCours.estimatedTime}
        pourcentage={pourcentage}
        surRetour={surRetour}
      />

      {/* Zone de contenu principale */}
      <main className="cours-main">
        <div className="cours-grille">
          {/*
            Grille CSS à 2 colonnes (voir Cours.css) :
            - Colonne étroite (gauche) : sommaire
            - Colonne large (droite) : contenu de la section
          */}

          {/* Colonne 1 : table des matières */}
          <div className="cours-colonne-sommaire">
            <CoursSommaire
              sections={contenuDuCours.sections}
              sectionActuelle={sectionActuelle}
              sectionsVues={sectionsVues}
              niveau={niveau}
              onSelectSection={setSectionActuelle}
              // On passe "setSectionActuelle" directement.
              // CoursSommaire l'appellera avec le numéro de section choisi.
            />
          </div>

          {/* Colonne 2 : contenu de la section active */}
          <div className="cours-colonne-contenu">
            <CoursContenu
              section={contenuDuCours.sections[sectionActuelle]}
              // On accède à la section courante par son index dans le tableau
              indexActuel={sectionActuelle}
              total={contenuDuCours.sections.length}
              surPrecedent={() => setSectionActuelle(s => s - 1)}
              // (s => s - 1) est une fonction de mise à jour :
              // "s" = valeur actuelle, retourne s-1 (section précédente)
              surSuivant={() => setSectionActuelle(s => s + 1)}
              surDemarrerQuiz={surDemarrerQuiz}
            />
          </div>

        </div>

        {/* Banner de félicitations (affiché seulement si toutesVues) */}
        {toutesVues && (
          <CoursTermine
            nomNiveau={NOMS_NIVEAU[niveau]}
            surDemarrerQuiz={surDemarrerQuiz}
          />
        )}

      </main>
    </div>
  )
}
