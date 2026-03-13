// ================================================================
// Quiz.jsx — PAGE DE QUIZ (orchestrateur)
// ================================================================
//
// 🔑 CONCEPT REACT : HOOKS AVANCÉS
// Ce fichier utilise 3 hooks importants :
//
// 1️⃣ useState → stocker des données qui peuvent changer
//    const [valeur, setValeur] = useState(valeurInitiale)
//
// 2️⃣ useEffect → exécuter du code QUAND quelque chose change
//    useEffect(() => { ... code ... }, [dépendance])
//    → Le code s'exécute chaque fois que "dépendance" change.
//    → Le tableau vide [] = s'exécute seulement au premier rendu.
//    → La fonction retournée est le "cleanup" (nettoyage).
//
// 3️⃣ useCallback → mémoriser une fonction pour éviter de la recréer
//    à chaque rendu. Utile quand une fonction est utilisée dans
//    un useEffect (évite les boucles infinies).
//
// 🔑 CONCEPT REACT : LE CYCLE DE VIE
// 1. Le composant s'affiche (mount) → useEffect avec [] s'exécute
// 2. Un état change → le composant se re-affiche (re-render)
// 3. useEffect s'exécute si ses dépendances ont changé
// 4. Le composant disparaît (unmount) → le cleanup s'exécute
// ================================================================

import { useState, useEffect, useCallback } from 'react'
import { questionsDebutant, questionsIntermediaire, questionsExpert } from '../data/questions.js'
import { useStore, BADGES_DISPONIBLES } from '../store/store.js'
import { Star } from 'lucide-react'

import { QuizResultats }   from './QuizResultats/QuizResultats.jsx'
import { QuizTimer }       from './QuizTimer/QuizTimer.jsx'
import { QuizQuestion }    from './QuizQuestion/QuizQuestion.jsx'
import { QuizExplication } from './QuizExplication/QuizExplication.jsx'

import './Quiz.css'

// ================================================================
// CONSTANTE — valeur fixe définie en dehors du composant
// (elle ne change jamais, donc pas besoin de useState)
// ================================================================
const TEMPS_PAR_QUESTION = 45  // secondes par question

const NOMS_NIVEAU = {
  // Objet de correspondance : clé → valeur lisible
  debutant:      'Débutant',
  intermediaire: 'Intermédiaire',
  expert:        'Expert',
}

// ================================================================
// COMPOSANT QUIZ
// Props :
//   - niveau     → 'debutant' | 'intermediaire' | 'expert'
//   - surTermine → appelée quand le quiz est terminé
//   - surQuitter → appelée si l'utilisateur quitte en cours
// ================================================================
export function Quiz({ niveau, surTermine, surQuitter }) {

  // Sélectionne les bonnes questions selon le niveau
  const questions = {
    debutant:      questionsDebutant,
    intermediaire: questionsIntermediaire,
    expert:        questionsExpert,
  }[niveau]
  // Ceci est un accès à un objet par clé dynamique.
  // Si niveau = 'debutant', questions = questionsDebutant.

  // Fonctions du store pour sauvegarder les résultats
  const { ajouterXP, terminerNiveau, sauvegarderResultatsQuiz } = useStore()

  // ---- État du quiz ----
  const [questionActuelle,   setQuestionActuelle]   = useState(0)
  // Index de la question en cours (commence à 0 = première question)

  const [reponseChoisie,     setReponseChoisie]     = useState(null)
  // null = pas encore répondu. Sinon : l'index de l'option choisie.

  const [resultats,          setResultats]           = useState([])
  // Tableau qui s'agrandit au fil des questions.
  // Format : [{ idQuestion, reponseChoisie, correct, tempsPasse }, ...]

  const [tempsRestant,       setTempsRestant]        = useState(TEMPS_PAR_QUESTION)
  // Secondes restantes (45, 44, 43, ...)

  const [montrerExplication, setMontrerExplication] = useState(false)
  // true = l'explication s'affiche après une réponse

  const [quizTermine,        setQuizTermine]         = useState(false)
  // true = on affiche l'écran de résultats

  const [nouveauBadge,       setNouveauBadge]       = useState(null)
  // null = pas de nouveau badge. Sinon : le nom du badge débloqué.

  // Question courante (objet avec question, options, correctAnswer, explanation)
  const question = questions[questionActuelle]

  // ================================================================
  // useCallback — mémorise la fonction "tempsEcoule"
  // Pourquoi ? useCallback est utilisé ici parce que tempsEcoule
  // est dans le tableau de dépendances de useEffect.
  // Si on ne mémorise pas la fonction, elle serait recréée à chaque
  // rendu, déclenchant useEffect en boucle infinie.
  // ================================================================
  const tempsEcoule = useCallback(() => {
    if (reponseChoisie === null) {
      // Le joueur n'a pas répondu → on enregistre une réponse manquée
      setResultats(prev => [...prev, {
        // "prev" = valeur précédente du tableau (avant la mise à jour)
        // [...prev, ...] = copie le tableau existant et ajoute un élément
        // (on ne JAMAIS modifier le state directement, toujours faire une copie)
        idQuestion:      question.id,
        reponseChoisie:  -1,   // -1 = temps écoulé
        correct:         false,
        tempsPasse:      TEMPS_PAR_QUESTION,
      }])
      setMontrerExplication(true)
    }
  }, [question, reponseChoisie])

  // ================================================================
  // useEffect — LE TIMER
  // Ce bloc crée un compte à rebours.
  // Il se remet à zéro à chaque nouvelle question grâce aux
  // dépendances [questionActuelle, montrerExplication, quizTermine]
  // ================================================================
  useEffect(() => {
    // Si l'explication est visible ou le quiz est terminé, on arrête le timer
    if (montrerExplication || quizTermine) return

    // setInterval appelle une fonction toutes les X ms (ici 1000ms = 1s)
    const minuterie = setInterval(() => {
      setTempsRestant(prev => {
        if (prev <= 1) {
          tempsEcoule()  // Temps écoulé !
          return 0
        }
        return prev - 1  // Décrémente de 1 chaque seconde
      })
    }, 1000)

    // ---- CLEANUP ----
    // React appelle cette fonction avant de relancer l'effet
    // ou quand le composant est démonté.
    // Sans ça, plusieurs timers s'accumuleraient !
    return () => clearInterval(minuterie)

  }, [questionActuelle, montrerExplication, quizTermine, tempsEcoule])
  // Ce tableau de dépendances dit :
  // "Relance cet effet quand une de ces valeurs change"

  // ================================================================
  // HANDLER : CHOISIR UNE RÉPONSE
  // ================================================================
  function choisirReponse(index) {
    // Sécurité : on ignore si déjà répondu
    if (reponseChoisie !== null || montrerExplication) return

    setReponseChoisie(index)

    // Enregistre le résultat
    setResultats(prev => [...prev, {
      idQuestion:      question.id,
      reponseChoisie:  index,
      correct:         index === question.correctAnswer,
      // question.correctAnswer est l'index de la bonne réponse
      tempsPasse:      TEMPS_PAR_QUESTION - tempsRestant,
    }])

    setMontrerExplication(true)
  }

  // ================================================================
  // HANDLER : QUESTION SUIVANTE
  // ================================================================
  function questionSuivante() {
    if (questionActuelle < questions.length - 1) {
      // Il reste des questions → on passe à la suivante
      setQuestionActuelle(questionActuelle + 1)
      setReponseChoisie(null)       // Réinitialise la réponse
      setMontrerExplication(false)  // Cache l'explication
      setTempsRestant(TEMPS_PAR_QUESTION)  // Remet le timer à 45s
    } else {
      // Dernière question → on termine le quiz
      terminerLeQuiz()
    }
  }

  // ================================================================
  // HANDLER : FIN DU QUIZ
  // ================================================================
  function terminerLeQuiz() {
    const nbBonnes   = [...resultats].filter(r => r.correct).length
    // [...resultats] = copie du tableau (bonne pratique)
    // .filter(r => r.correct) = garde seulement les résultats corrects
    // .length = nombre d'éléments restants

    const tempsTotal = [...resultats].reduce((t, r) => t + r.tempsPasse, 0)
    // .reduce() accumule les valeurs. Ici, on additionne tous les "tempsPasse".
    // t = accumulateur (commence à 0), r = résultat courant

    const xpGagne = nbBonnes * 10 + (nbBonnes === 20 ? 100 : 0)
    // Bonus de 100 XP si score parfait

    ajouterXP(xpGagne)
    sauvegarderResultatsQuiz(niveau, resultats)

    if (nbBonnes >= 12) terminerNiveau(niveau)  // Valider le niveau (12/20 min)

    // Vérification des badges
    if (nbBonnes === 20)       setNouveauBadge(BADGES_DISPONIBLES.SCORE_PARFAIT.nom)
    else if (tempsTotal < 600) setNouveauBadge(BADGES_DISPONIBLES.RAPIDITE.nom)
    // 600 secondes = 10 minutes cumulées sur toutes les questions

    setQuizTermine(true)  // Déclenche l'affichage des résultats
  }

  // ================================================================
  // RENDU CONDITIONNEL : ÉCRAN DE RÉSULTATS
  // Si quizTermine est true, on retourne un autre composant.
  // Ce "early return" court-circuite le reste du rendu.
  // ================================================================
  if (quizTermine) {
    return (
      <QuizResultats
        resultats={resultats}
        questions={questions}
        niveau={niveau}
        nouveauBadge={nouveauBadge}
        surTermine={surTermine}
      />
    )
  }

  // ================================================================
  // RENDU PRINCIPAL : ÉCRAN DE JEU
  // ================================================================
  return (
    <div className="quiz-page">
      <div className="quiz-contenu">

        {/* En-tête avec bouton quitter + nom du niveau */}
        <div className="quiz-entete">
          <button onClick={surQuitter} className="quiz-bouton-quitter">
            Quitter
          </button>
          <div className="quiz-entete-niveau">
            <Star className="quiz-entete-icone" />
            <span>{NOMS_NIVEAU[niveau]}</span>
          </div>
          <div className="quiz-entete-espace" />
          {/* Ce div vide sert à équilibrer le flexbox (3 colonnes) */}
        </div>

        {/* Barre de progression (question 1/20, 2/20...) */}
        <div className="quiz-progression">
          <div className="quiz-progression-labels">
            <span>Question {questionActuelle + 1} sur {questions.length}</span>
            {/* +1 car questionActuelle commence à 0, et l'affichage commence à 1 */}
            <span>{Math.round(((questionActuelle + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="quiz-progression-piste">
            <div
              className="quiz-progression-remplissage"
              style={{ width: `${((questionActuelle + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer (compte à rebours) */}
        <QuizTimer tempsRestant={tempsRestant} />

        {/* Carte de la question avec ses 4 choix de réponse */}
        <QuizQuestion
          question={question}
          reponseChoisie={reponseChoisie}
          onReponse={choisirReponse}
          // onReponse est un "callback up" : l'enfant remonte l'info au parent
        />

        {/* Explication — visible seulement après avoir répondu */}
        {montrerExplication && (
          // 🔑 {condition && <Composant />} = si condition vraie, afficher
          <QuizExplication
            question={question}
            reponseChoisie={reponseChoisie}
            estDerniere={questionActuelle >= questions.length - 1}
            onSuivant={questionSuivante}
          />
        )}

      </div>
    </div>
  )
}
