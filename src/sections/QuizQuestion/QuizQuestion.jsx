// ================================================================
// QuizQuestion.jsx — CARTE QUESTION + BOUTONS RÉPONSES
// ================================================================
//
// 🔑 CONCEPT REACT : CALLBACK "REMONTANT" (Lifting State Up)
// Ce composant N'a PAS de state.
// Quand l'utilisateur clique une réponse, ce composant appelle
// la prop "onReponse(index)" pour signaler au parent (Quiz.jsx)
// quel bouton a été cliqué.
// Le parent met alors à jour son state et repasse des props.
// C'est le flux de données React : les données descendent (props),
// les actions remontent (callbacks).
//
// 🔑 CONCEPT JSX : disabled
// <button disabled={...}> grise et désactive le bouton.
// Ici les boutons sont désactivés après qu'une réponse a été choisie.
//
// 📥 Props :
//   - question       → objet { question, options, correctAnswer, explanation }
//   - reponseChoisie → null (pas encore) ou index 0-3
//   - onReponse      → fonction(index) appelée au clic
// ================================================================

import { CheckCircle, XCircle } from 'lucide-react'
import './QuizQuestion.css'

// ================================================================
// FONCTION LOCALE UTILITAIRE — calcule la classe CSS du bouton
// selon l'état de la réponse.
// Elle est déclarée EN DEHORS du composant car elle ne dépend
// d'aucun state ou prop du composant lui-même.
// ================================================================
function styleReponse(index, reponseChoisie, correctAnswer) {
  if (reponseChoisie === null)           return 'quiz-reponse--neutre'
  // Pas encore répondu → état neutre (hover actif)

  if (index === correctAnswer)           return 'quiz-reponse--correct'
  // Toujours afficher la bonne réponse en vert, même si pas choisie

  if (index === reponseChoisie)          return 'quiz-reponse--incorrect'
  // La réponse choisie (mauvaise) → rouge

  return 'quiz-reponse--grise'
  // Les autres options → grisées
}

export function QuizQuestion({ question, reponseChoisie, onReponse }) {
  return (
    <div className="quiz-question-carte">

      {/* Texte de la question */}
      <h2 className="quiz-question-texte">{question.question}</h2>

      {/* Liste des 4 options de réponse */}
      <div className="quiz-question-liste">

        {/* 🔑 .map() SUR UN TABLEAU D'OPTIONS
            question.options = ['réponse A', 'réponse B', 'réponse C', 'réponse D']
            Pour chaque option, on crée un bouton. */}
        {question.options.map((option, index) => (
          <button
            key={index}
            // key={index} est acceptable ici car l'ordre des options
            // ne change jamais pour une même question.

            onClick={() => onReponse(index)}
            // () => onReponse(index) : fonction fléchée qui appelle le callback
            // avec l'index du bouton cliqué.
            // On N'ÉCRIT PAS : onClick={onReponse(index)}
            // car ça appellerait la fonction immédiatement au lieu d'attendre le clic.

            disabled={reponseChoisie !== null}
            // disabled=true quand une réponse a déjà été choisie.
            // Empêche de changer de réponse après coup.

            className={`quiz-reponse-bouton ${styleReponse(index, reponseChoisie, question.correctAnswer)}`}
            // On combine la classe de base + la classe d'état (neutre/correct/incorrect/gris)
          >
            {/* Contenu du bouton : lettre + texte + icône */}
            <div className="quiz-reponse-ligne">

              {/* Badge lettre : A, B, C ou D */}
              <span className="quiz-reponse-lettre">
                {String.fromCharCode(65 + index)}
                {/*
                  String.fromCharCode() convertit un code ASCII en caractère.
                  65 = 'A', 66 = 'B', 67 = 'C', 68 = 'D'
                  Donc 65 + 0 = 'A', 65 + 1 = 'B', etc.
                */}
              </span>

              {/* Texte de l'option */}
              <span>{option}</span>

              {/* Icône résultat (visible seulement après réponse) */}

              {/* Mauvaise réponse choisie → croix rouge */}
              {reponseChoisie === index && index !== question.correctAnswer && (
                <XCircle className="quiz-reponse-icone quiz-reponse-icone--incorrect" />
              )}

              {/* Bonne réponse choisie → coche verte */}
              {reponseChoisie === index && index === question.correctAnswer && (
                <CheckCircle className="quiz-reponse-icone quiz-reponse-icone--correct" />
              )}

              {/* Bonne réponse non choisie → coche verte quand même */}
              {reponseChoisie !== null && reponseChoisie !== index && index === question.correctAnswer && (
                <CheckCircle className="quiz-reponse-icone quiz-reponse-icone--correct" />
              )}
            </div>
          </button>
        ))}

      </div>
    </div>
  )
}
