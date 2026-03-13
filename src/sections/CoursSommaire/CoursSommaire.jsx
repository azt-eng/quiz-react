// ================================================================
// CoursSommaire.jsx — TABLE DES MATIÈRES
// ================================================================
// Props :
//   - sections        → liste des sections du cours
//   - sectionActuelle → index de la section active
//   - sectionsVues    → tableau d'index des sections vues
//   - niveau          → 'debutant' | 'intermediaire' | 'expert'
//   - onSelectSection → fonction(index) appelée au clic
// ================================================================

import { BookOpen, CheckCircle } from 'lucide-react'
import './CoursSommaire.css'

export function CoursSommaire({ sections, sectionActuelle, sectionsVues, niveau, onSelectSection }) {
  return (
    <div className="sommaire-carte">

      <h3 className="sommaire-titre">
        <BookOpen />
        Sommaire
      </h3>

      <div className="sommaire-liste">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onSelectSection(index)}
            className={`sommaire-item ${
              sectionActuelle === index ? `sommaire-item--actif-${niveau}` : ''
            }`}
          >
            <div className="sommaire-item-ligne">
              {/* Coche ou cercle vide */}
              {sectionsVues.includes(index) ? (
                <span className="sommaire-item-vue"><CheckCircle /></span>
              ) : (
                <span className="sommaire-item-cercle" />
              )}
              <span className="sommaire-item-titre">{section.title}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}
