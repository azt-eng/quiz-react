// ================================================================
// Accueil.jsx — LA PAGE D'ACCUEIL (orchestrateur)
// ================================================================
//
// 🔑 CONCEPT REACT : COMPOSANT ORCHESTRATEUR
// Ce fichier ne contient PAS de HTML visuel. Il sert uniquement à
// assembler d'autres composants (comme des pièces de Lego) et à
// gérer la logique (état, actions) de la page d'accueil.
//
// 📦 Qu'est-ce qu'un composant React ?
// C'est une fonction JavaScript qui retourne du JSX (code qui
// ressemble à du HTML). Le nom commence par une majuscule.
// Exemple : function Accueil() { return <div>...</div> }
//
// 🔗 Imports utilisés :
//   - useState → pour stocker des données qui peuvent changer
//   - useStore → le "magasin" central de données (zustand)
//   - NIVEAUX  → la liste des 3 niveaux (data statique)
//   - sous-composants → les blocs visuels de la page
// ================================================================

import { useState } from 'react'
// useState est un "hook" React. Il permet à un composant de mémoriser
// une valeur qui peut changer. Quand la valeur change, React
// re-affiche automatiquement la partie concernée de la page.

import { useStore } from '../store/store.js'
// useStore donne accès au magasin central (zustand).
// C'est là que toute la progression du joueur est sauvegardée.

import { NIVEAUX } from '../types/index.js'
// NIVEAUX est un tableau des 3 niveaux (débutant, intermédiaire, expert).
// C'est une donnée statique qui ne change jamais.

import { RotateCcw } from 'lucide-react'
// lucide-react fournit des icônes SVG prêtes à l'emploi.
// RotateCcw = icône de flèche circulaire (réinitialisation).

// --- Imports des sous-composants ---
// Chaque composant est dans son propre dossier avec son propre CSS.
import { Header }             from './Header/Header.jsx'
import { ProgressionGlobale } from './ProgressionGlobale/ProgressionGlobale.jsx'
import { GrilleNiveaux }      from './GrilleNiveaux/GrilleNiveaux.jsx'
import { CarteSurvie }        from './CarteSurvie/CarteSurvie.jsx'
import { CarteExamen }        from './CarteExamen/CarteExamen.jsx'
import { SectionBadges }      from './SectionBadges/SectionBadges.jsx'
import { ModalesAccueil }     from './ModalesAccueil/ModalesAccueil.jsx'

import './Accueil.css'
// L'import d'un fichier CSS sans "from" applique ces styles
// globalement quand ce composant est chargé.

// ================================================================
// EXPORTS NOMMÉS : la fonction est exportée pour être importée
// ailleurs (dans App.jsx). Le mot "export" rend la fonction
// accessible en dehors de ce fichier.
// ================================================================
export function Accueil({ surSelectNiveau, surDemarrerExamen, surDemarrerSurvie }) {
  // 🔑 LES PROPS (paramètres du composant)
  // Les props sont des données passées depuis le composant parent
  // (App.jsx). Ici ce sont des fonctions "callback" qui permettent
  // à l'accueil de communiquer vers le parent pour changer de page.
  //   - surSelectNiveau   → appelée quand l'utilisateur clique un niveau
  //   - surDemarrerExamen → appelée pour lancer l'examen
  //   - surDemarrerSurvie → appelée pour lancer le mode survie

  // ---- Données depuis le store ----
  const { progression, peutAccederNiveau, scoreNiveau, reinitialiser } = useStore()
  // On "destructure" les valeurs dont on a besoin depuis le store.
  // progression    → objet contenant toute la progression du joueur
  // peutAccederNiveau(id) → renvoie true si le niveau est débloqué
  // scoreNiveau(id)       → renvoie le score du joueur sur ce niveau
  // reinitialiser()       → réinitialise toute la progression

  // ---- État local (données propres à ce composant) ----
  const [confirmerReinit, setConfirmerReinit] = useState(false)
  // useState(false) crée une variable "confirmerReinit" initialisée à false.
  // "setConfirmerReinit" est la fonction pour la modifier.
  // Quand on appelle setConfirmerReinit(true), React re-affiche le composant.
  // Ici elle contrôle si la modale de confirmation est visible.

  const [badgeEnDetail, setBadgeEnDetail] = useState(null)
  // null = aucun badge sélectionné.
  // Quand l'utilisateur clique un badge, on stocke ce badge ici.

  // ---- Calculs dérivés de la progression ----
  const examenDebloque = progression.niveauxTermines.length === 3
  // L'examen est disponible uniquement si les 3 niveaux sont terminés.

  const pourcentageGlobal = Math.round((progression.niveauxTermines.length / 3) * 100)
  // Ex: si 1 niveau terminé sur 3 → Math.round((1/3)*100) = 33

  // ================================================================
  // RENDU JSX — ce que le composant affiche à l'écran
  // JSX ressemble à du HTML, mais c'est du JavaScript.
  // Les expressions JavaScript sont entourées de {} accolades.
  // ================================================================
  return (
    <div className="accueil-page">
      {/*
        className est l'équivalent JSX de "class" en HTML.
        React utilise "className" car "class" est un mot réservé en JavaScript.
      */}

      {/* ============================================================
          COMPOSANT : Header (en-tête)
          On lui passe des "props" entre les balises, comme des attributs HTML.
          totalXP et nbBadges sont des données du store.
          ============================================================ */}
      <Header
        totalXP={progression.totalXP}
        nbBadges={progression.badges.length}
      />

      {/* ============================================================
          CONTENU PRINCIPAL
          <main> est une balise HTML sémantique = zone principale de la page
          ============================================================ */}
      <main className="accueil-main">

        {/* Barre de progression globale */}
        <ProgressionGlobale
          pourcentageGlobal={pourcentageGlobal}
          scoreDebutant={scoreNiveau('debutant')}
          scoreIntermediaire={scoreNiveau('intermediaire')}
          scoreExpert={scoreNiveau('expert')}
        />

        {/* Grille des 3 niveaux */}
        <GrilleNiveaux
          niveaux={NIVEAUX}
          progression={progression}
          peutAccederNiveau={peutAccederNiveau}
          scoreNiveau={scoreNiveau}
          surSelectNiveau={surSelectNiveau}
        />

        {/* Mode Survie */}
        <CarteSurvie surDemarrerSurvie={surDemarrerSurvie} />

        {/* Examen Final */}
        <CarteExamen
          examenDebloque={examenDebloque}
          surDemarrerExamen={surDemarrerExamen}
        />

        {/* Badges (uniquement si l'utilisateur en a au moins un) */}
        <SectionBadges
          badges={progression.badges}
          onBadgeClick={setBadgeEnDetail}
          // setBadgeEnDetail est passé directement comme handler de clic.
          // Quand on clique un badge dans SectionBadges, ce composant
          // appelle onBadgeClick(badge), ce qui stocke le badge ici.
        />

        {/* Bouton réinitialisation */}
        <div className="accueil-reinit-zone">
          <button
            onClick={() => setConfirmerReinit(true)}
            // onClick est l'équivalent de addEventListener('click', ...) en JS pur.
            // () => ... est une fonction fléchée anonyme.
            className="accueil-reinit-bouton"
          >
            <RotateCcw className="accueil-reinit-icone" />
            {/* On peut passer className à une icône lucide comme à n'importe quel élément */}
            Réinitialiser ma progression
          </button>
        </div>

      </main>

      {/* ============================================================
          MODALES — rendues ici mais invisibles par défaut.
          Elles s'affichent selon confirmerReinit et badgeEnDetail.
          ============================================================ */}
      <ModalesAccueil
        confirmerReinit={confirmerReinit}
        badgeEnDetail={badgeEnDetail}
        onAnnulerReinit={() => setConfirmerReinit(false)}
        onConfirmerReinit={() => {
          reinitialiser()
          // Appel du store pour effacer la progression
          setConfirmerReinit(false)
          // Cache la modale après confirmation
        }}
        onFermerBadge={() => setBadgeEnDetail(null)}
      />

    </div>
  )
}
