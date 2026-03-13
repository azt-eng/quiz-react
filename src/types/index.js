// ================================================================
// types/index.js — LES NIVEAUX DU JEU
// ================================================================
// Ce fichier définit les 3 niveaux disponibles dans l'application.
//
// Pour modifier un niveau :
//   - "nom"         → le titre affiché sur la carte
//   - "couleur"     → la couleur du texte du titre (valeur CSS)
//   - "couleurFond" → la couleur de fond de la carte (valeur CSS)
//   - "icone"       → l'emoji affiché sur la carte
//   - "description" → le texte court affiché sous le titre
// ================================================================

export const NIVEAUX = [
  {
    id: 'debutant',
    nom: 'Débutant',
    couleur: '#16a34a',         /* green-600 */
    couleurFond: '#dcfce7',     /* green-100 */
    icone: '🌱',
    description: 'Découvrez les bases du Moyen-Âge',
  },
  {
    id: 'intermediaire',
    nom: 'Intermédiaire',
    couleur: '#2563eb',         /* blue-600 */
    couleurFond: '#dbeafe',     /* blue-100 */
    icone: '📚',
    description: 'Approfondissez vos connaissances',
  },
  {
    id: 'expert',
    nom: 'Expert',
    couleur: '#9333ea',         /* purple-600 */
    couleurFond: '#f3e8ff',     /* purple-100 */
    icone: '👑',
    description: 'Maîtrisez le Moyen-Âge comme un véritable historien',
  },
]
