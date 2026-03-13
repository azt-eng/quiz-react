// ================================================================
// Examen.jsx — PAGE D'EXAMEN FINAL (orchestrateur)
// ================================================================
// Gère les 3 séries de 20 questions.
// Délègue l'affichage aux sous-composants dans src/sections/.
//
// Sous-composants :
//   ExamenResultats/ → écran de résultats final
//   ExamenSeries/    → indicateur des 3 séries
//   QuizTimer/       → compte à rebours (partagé avec Quiz)
//   QuizQuestion/    → question + réponses (partagé)
//   QuizExplication/ → explication (partagée)
//
// Props reçues depuis App.jsx :
//   - surTermine → revenir à l'accueil
//   - surQuitter → quitter
// ================================================================

import { useState, useEffect, useCallback } from 'react'
import { examQuestions } from '../data/questions.js'
import { useStore, BADGES_DISPONIBLES } from '../store/store.js'

import { ExamenResultats }  from './ExamenResultats/ExamenResultats.jsx'
import { ExamenSeries }     from './ExamenSeries/ExamenSeries.jsx'
import { QuizTimer }        from './QuizTimer/QuizTimer.jsx'
import { QuizQuestion }     from './QuizQuestion/QuizQuestion.jsx'
import { QuizExplication }  from './QuizExplication/QuizExplication.jsx'

import './Examen.css'

const TEMPS_PAR_QUESTION = 45
const QUESTIONS_PAR_SERIE = 20

export function Examen({ surTermine, surQuitter }) {
  const { ajouterXP } = useStore()

  // Genère 3 séries aléatoires de 20 questions
  const [seriesQuestions]       = useState(() => {
    const melangees = [...examQuestions].sort(() => Math.random() - 0.5)
    return [
      melangees.slice(0, 20),
      melangees.slice(20, 40),
      melangees.slice(40, 60),
    ]
  })

  const [serieActuelle,      setSerieActuelle]      = useState(0)
  const [questionActuelle,   setQuestionActuelle]   = useState(0)
  const [reponseChoisie,     setReponseChoisie]     = useState(null)
  const [montrerExplication, setMontrerExplication] = useState(false)
  const [tempsRestant,       setTempsRestant]        = useState(TEMPS_PAR_QUESTION)
  const [resultatsSeries,    setResultatsSeries]    = useState([[], [], []])
  const [examenTermine,      setExamenTermine]      = useState(false)
  const [nouveauBadge,       setNouveauBadge]       = useState(null)

  const questionsActuelles = seriesQuestions[serieActuelle] || []
  const question           = questionsActuelles[questionActuelle]

  // Timer
  const tempsEcoule = useCallback(() => {
    if (reponseChoisie === null && !montrerExplication) {
      const nouveauxResultats = [...resultatsSeries]
      nouveauxResultats[serieActuelle] = [...nouveauxResultats[serieActuelle], {
        idQuestion: question.id, reponseChoisie: -1, correct: false, tempsPasse: TEMPS_PAR_QUESTION
      }]
      setResultatsSeries(nouveauxResultats)
      setMontrerExplication(true)
    }
  }, [question, reponseChoisie, montrerExplication, resultatsSeries, serieActuelle])

  useEffect(() => {
    if (montrerExplication || examenTermine) return
    const minuterie = setInterval(() => {
      setTempsRestant(prev => { if (prev <= 1) { tempsEcoule(); return 0 } return prev - 1 })
    }, 1000)
    return () => clearInterval(minuterie)
  }, [questionActuelle, serieActuelle, montrerExplication, examenTermine, tempsEcoule])

  // Répondre
  function choisirReponse(index) {
    if (reponseChoisie !== null || montrerExplication) return
    setReponseChoisie(index)
    const nouveauxResultats = [...resultatsSeries]
    nouveauxResultats[serieActuelle] = [...nouveauxResultats[serieActuelle], {
      idQuestion: question.id, reponseChoisie: index, correct: index === question.correctAnswer, tempsPasse: TEMPS_PAR_QUESTION - tempsRestant
    }]
    setResultatsSeries(nouveauxResultats)
    setMontrerExplication(true)
  }

  // Passer à la question suivante
  function questionSuivante() {
    if (questionActuelle < QUESTIONS_PAR_SERIE - 1) {
      setQuestionActuelle(q => q + 1)
      setReponseChoisie(null)
      setMontrerExplication(false)
      setTempsRestant(TEMPS_PAR_QUESTION)
    } else if (serieActuelle < 2) {
      // Série suivante
      setSerieActuelle(s => s + 1)
      setQuestionActuelle(0)
      setReponseChoisie(null)
      setMontrerExplication(false)
      setTempsRestant(TEMPS_PAR_QUESTION)
    } else {
      // Examen terminé
      const totalBonnes = resultatsSeries.flat().filter(r => r.correct).length
      ajouterXP(totalBonnes * 15 + 500)
      if (totalBonnes >= 48) setNouveauBadge(BADGES_DISPONIBLES.EXCELLENCE.nom)
      setExamenTermine(true)
    }
  }

  // Résultats finaux
  if (examenTermine) {
    return (
      <ExamenResultats
        resultatsSeries={resultatsSeries}
        nouveauBadge={nouveauBadge}
        surTermine={surTermine}
      />
    )
  }

  // Écran de jeu
  if (!question) return null

  const estDerniereQuestion = questionActuelle >= QUESTIONS_PAR_SERIE - 1
  const estDerniereSerie    = serieActuelle >= 2

  return (
    <div className="examen-page">
      <div className="examen-contenu">

        {/* En-tête */}
        <div className="examen-entete">
          <button onClick={surQuitter} className="examen-bouton-quitter">Quitter</button>
          <h2 className="examen-entete-titre">🎓 Examen Final</h2>
          <div className="examen-entete-espace" />
        </div>

        {/* Indicateur séries */}
        <ExamenSeries serieActuelle={serieActuelle} />

        {/* Progression */}
        <div className="examen-progression">
          <div className="examen-progression-labels">
            <span>Série {serieActuelle + 1} — Question {questionActuelle + 1}/{QUESTIONS_PAR_SERIE}</span>
            <span>{Math.round(((questionActuelle + 1) / QUESTIONS_PAR_SERIE) * 100)}%</span>
          </div>
          <div className="examen-progression-piste">
            <div
              className="examen-progression-remplissage"
              style={{ width: `${((questionActuelle + 1) / QUESTIONS_PAR_SERIE) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <QuizTimer tempsRestant={tempsRestant} />

        {/* Question */}
        <QuizQuestion
          question={question}
          reponseChoisie={reponseChoisie}
          onReponse={choisirReponse}
        />

        {/* Explication */}
        {montrerExplication && (
          <QuizExplication
            question={question}
            reponseChoisie={reponseChoisie ?? -1}
            estDerniere={estDerniereQuestion && estDerniereSerie}
            onSuivant={questionSuivante}
          />
        )}

      </div>
    </div>
  )
}
