// ================================================================
// CoursHeader.jsx — EN-TÊTE STICKY DU COURS
// ================================================================
// Props :
//   - niveau          → 'debutant' | 'intermediaire' | 'expert'
//   - titre           → titre du cours
//   - duree           → durée estimée en minutes
//   - pourcentage     → 0-100
//   - surRetour       → fonction retour
// ================================================================

import { ChevronLeft, Clock } from 'lucide-react'
import './CoursHeader.css'

const NOMS_NIVEAU = {
  debutant:      'Débutant',
  intermediaire: 'Intermédiaire',
  expert:        'Expert',
}

const ICONES_NIVEAU = {
  debutant:      '🌱',
  intermediaire: '📚',
  expert:        '👑',
}

export function CoursHeader({ niveau, titre, duree, pourcentage, surRetour }) {
  return (
    <header className="cours-header">
      <div className="cours-header-contenu">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Bouton retour */}
            <button onClick={surRetour} className="cours-header-retour">
              <ChevronLeft />
              Retour
            </button>

            {/* Titre du cours */}
            <div className="cours-header-titre-groupe">
              <span className="cours-header-niveau-icone">{ICONES_NIVEAU[niveau]}</span>
              <div>
                <h1 className="cours-header-titre">{titre}</h1>
                <p className="cours-header-niveau-nom">{NOMS_NIVEAU[niveau]}</p>
              </div>
            </div>

            {/* Durée estimée */}
            <div className="cours-header-duree">
              <Clock />
              {duree} min
            </div>

          </div>

          {/* Barre de progression du cours */}
          <div className="cours-header-progression">
            <div className="cours-header-progression-labels">
              <span>Progression du cours</span>
              <span>{Math.round(pourcentage)}%</span>
            </div>
            <div className="cours-header-progression-piste">
              <div
                className="cours-header-progression-remplissage"
                style={{ width: `${pourcentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
