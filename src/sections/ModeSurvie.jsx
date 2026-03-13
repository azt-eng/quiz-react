// ================================================================
// ModeSurvie.jsx — PAGE MODE SURVIE (orchestrateur)
// ================================================================
//
// 🔑 CONCEPT REACT : MACHINE À ÉTATS (State Machine)
// Ce composant utilise une variable "phase" pour gérer 3 écrans
// complètement différents : intro / jeu / fin.
// C'est une "machine à états" : selon la phase, on affiche
// un composant différent. C'est plus lisible que d'avoir plein
// de booléens (estEnIntro, estEnJeu, estEnFin, etc.)
//
// 🔑 CONCEPT JS : LOCALSTORAGE
// localStorage permet de sauvegarder des données dans le navigateur
// qui persistent même après fermeture de l'onglet.
// localStorage.setItem('clé', valeur)  → sauvegarde
// localStorage.getItem('clé')          → lecture
// JSON.parse() / JSON.stringify()      → conversion objet ↔ texte
//
// 🔑 CONCEPT REACT : useCallback
// Mémorise une fonction pour ne pas la recréer à chaque rendu.
// Indispensable quand la fonction est dans un tableau de dépendances
// d'un useEffect (sinon → boucle infinie).
// ================================================================

import { useState, useEffect, useCallback } from 'react'
import { questionsDebutant, questionsIntermediaire, questionsExpert } from '../data/questions.js'
import { useStore } from '../store/store.js'

import { SurvieIntro }    from './SurvieIntro/SurvieIntro.jsx'
import { SurvieFin }      from './SurvieFin/SurvieFin.jsx'
import { SurvieQuestion } from './SurvieQuestion/SurvieQuestion.jsx'

import './ModeSurvie.css'

// ================================================================
// CONSTANTES — définies en dehors du composant car elles ne
// changent jamais. Les mettre dans le composant recréerait de
// nouveaux objets à chaque rendu (légèrement moins efficace).
// ================================================================
const NB_QUESTIONS        = 50     // Nombre total de questions
const TEMPS_PAR_QUESTION  = 20    // Secondes par question
const DUREE_ANIMATION     = 400   // Durée animation glissement (ms)
const COOLDOWN_MS         = 60_000 * 60  // 1h en ms (notation avec _)
const SCORE_BASE          = 100   // Points de base par bonne réponse
const BONUS_VITESSE       = 5     // Points bonus par seconde restante

// ================================================================
// FONCTIONS UTILITAIRES — hors composant pour plus de clarté
// ================================================================

// Mélange toutes les questions des 3 niveaux, en gardant 50
function melangerQuestions() {
  const toutes = [
    // On ajoute la propriété "level" à chaque question avec spread
    ...questionsDebutant.map(q => ({ ...q, level: 'debutant' })),
    // { ...q, level: 'X' } = copie l'objet q et ajoute/écrase le champ level
    ...questionsIntermediaire.map(q => ({ ...q, level: 'intermediaire' })),
    ...questionsExpert.map(q => ({ ...q, level: 'expert' })),
  ]
  return toutes
    .sort(() => Math.random() - 0.5)
    // () => Math.random() - 0.5 donne un nombre aléatoire entre -0.5 et 0.5
    // sort() réorganise le tableau selon ce nombre (mélange aléatoire)
    .slice(0, NB_QUESTIONS)
    // .slice(0, 50) = garde uniquement les 50 premières questions
}

// Formate un temps en ms en HH:MM:SS
function formaterCooldown(ms) {
  const totalSecondes = Math.ceil(ms / 1000)   // ms → secondes (arrondi supérieur)
  const h = Math.floor(totalSecondes / 3600)   // heures
  const m = Math.floor((totalSecondes % 3600) / 60)  // minutes restantes
  const s = totalSecondes % 60                 // secondes restantes
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  // padStart(2, '0') ajoute un zéro devant si la valeur est à 1 chiffre : "3" → "03"
}

// Charge le classement depuis localStorage
function chargerClassement() {
  try {
    return JSON.parse(localStorage.getItem('classement-survie') || '[]')
    // || '[]' = valeur par défaut si localStorage renvoie null
    // JSON.parse() convertit la chaîne JSON en tableau JavaScript
  } catch {
    return []  // Si le JSON est corrompu, on retourne un tableau vide
  }
}

// Ajoute une entrée au classement, trie, garde le top 10
function sauvegarderClassement(entree) {
  const classement = chargerClassement()
  classement.push(entree)
  classement.sort((a, b) => b.score - a.score)  // Tri décroissant par score
  const top10 = classement.slice(0, 10)
  localStorage.setItem('classement-survie', JSON.stringify(top10))
  // JSON.stringify() convertit le tableau en chaîne JSON pour le stockage
  return top10.findIndex(e => e === classement[0]) + 1
}

// Lit le temps restant avant de pouvoir rejouer
function lireCooldown() {
  const dernierJeu = localStorage.getItem('survie-dernier-jeu')
  if (!dernierJeu) return 0
  const restant = COOLDOWN_MS - (Date.now() - parseInt(dernierJeu, 10))
  // parseInt(str, 10) = convertit une chaîne en nombre entier (base 10)
  // Date.now() = timestamp actuel en ms
  return restant > 0 ? restant : 0
}

// ================================================================
// COMPOSANT PRINCIPAL
// phase : 'intro' | 'jeu' | 'fin'
// ================================================================
export function ModeSurvie({ surQuitter }) {
  const { ajouterXP } = useStore()

  // ---- Phase courante ----
  const [phase, setPhase] = useState('intro')
  // 'intro' = écran de règles
  // 'jeu'   = en train de jouer
  // 'fin'   = résultats + classement

  // ---- État de jeu ----
  const [questions,       setQuestions]       = useState([])
  const [indexQuestion,   setIndexQuestion]   = useState(0)
  const [reponseChoisie,  setReponseChoisie]  = useState(null)
  const [tempsRestant,    setTempsRestant]    = useState(TEMPS_PAR_QUESTION)
  const [score,           setScore]           = useState(0)
  const [nbBonnes,        setNbBonnes]        = useState(0)
  const [timerActif,      setTimerActif]      = useState(false)
  // timerActif = le compte à rebours tourne-t-il ?
  const [animationActive, setAnimationActive] = useState(false)
  // animationActive = animation de transition entre questions

  // ---- Fin de partie ----
  const [estVictoire, setEstVictoire] = useState(false)
  const [rang,        setRang]        = useState(null)
  const [classement,  setClassement]  = useState(chargerClassement)
  // Appel de la fonction directement (sans ()) = initialisation lazy.
  // La fonction ne s'exécute QU'UNE FOIS à l'initialisation du state.
  const [cooldown,    setCooldown]    = useState(lireCooldown)

  // Mise à jour du cooldown chaque seconde
  useEffect(() => {
    if (cooldown <= 0) return  // Pas besoin de timer si cooldown terminé
    const id = setInterval(() => setCooldown(lireCooldown), 1000)
    return () => clearInterval(id)  // Nettoyage du timer
  }, [cooldown])

  // ================================================================
  // TIMER DE JEU — useCallback pour stabiliser la référence
  // ================================================================
  const tempsEcoule = useCallback(() => {
    if (reponseChoisie !== null || !timerActif) return
    // Le joueur n'a pas répondu dans le temps → partie perdue
    finDePartie(score, nbBonnes, indexQuestion, false)
  }, [reponseChoisie, timerActif, score, nbBonnes, indexQuestion])

  useEffect(() => {
    // Le timer ne tourne que pendant la phase 'jeu', quand le timer
    // est actif et qu'il n'y a pas d'animation en cours
    if (phase !== 'jeu' || !timerActif || animationActive) return

    const minuterie = setInterval(() => {
      setTempsRestant(prev => {
        if (prev <= 1) {
          clearInterval(minuterie)
          tempsEcoule()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(minuterie)  // Nettoyage important !
  }, [phase, timerActif, animationActive, indexQuestion, tempsEcoule])

  // ================================================================
  // DÉMARRER LA PARTIE
  // ================================================================
  function demarrerPartie() {
    const questionsGenerees = melangerQuestions()
    setQuestions(questionsGenerees)
    setIndexQuestion(0)
    setReponseChoisie(null)
    setTempsRestant(TEMPS_PAR_QUESTION)
    setScore(0)
    setNbBonnes(0)
    lancerAnimation()  // Petite animation de dmarrage
    setPhase('jeu')    // Changement de phase → React affiche SurvieQuestion
  }

  // ================================================================
  // ANIMATION DE TRANSITION (glissement vers la droite)
  // ================================================================
  function lancerAnimation() {
    setAnimationActive(true)
    setTimerActif(false)
    setTimeout(() => {
      // setTimeout exécute une fonction après un délai
      setAnimationActive(false)
      setTimerActif(true)
    }, DUREE_ANIMATION)  // Après 400ms
  }

  // ================================================================
  // CHOISIR UNE RÉPONSE
  // ================================================================
  function choisirReponse(index) {
    // Protections
    if (reponseChoisie !== null || animationActive || !timerActif) return

    setTimerActif(false)   // Arrête le timer
    setReponseChoisie(index)

    const question = questions[indexQuestion]
    const correct  = index === question.correctAnswer

    if (!correct) {
      // Mauvaise réponse → on montre brièvement la correction avant la fin
      setTimeout(() => finDePartie(score, nbBonnes, indexQuestion, false), 1200)
      return
    }

    // Bonne réponse → calcul du score
    const bonus         = Math.max(0, tempsRestant) * BONUS_VITESSE
    // Math.max(0, x) empêche un bonus négatif si tempsRestant était < 0
    const nouvelScore   = score + SCORE_BASE + bonus
    const nbBonnesNouv  = nbBonnes + 1

    setScore(nouvelScore)
    setNbBonnes(nbBonnesNouv)

    if (indexQuestion >= NB_QUESTIONS - 1) {
      // Dernière question passée → victoire !
      setTimeout(() => finDePartie(nouvelScore, nbBonnesNouv, indexQuestion, true), 1200)
    } else {
      // Question suivante avec animation
      setTimeout(() => {
        setIndexQuestion(i => i + 1)  // i => i+1 : forme "updater" de setState
        setReponseChoisie(null)
        setTempsRestant(TEMPS_PAR_QUESTION)
        lancerAnimation()
      }, 1200)
    }
  }

  // ================================================================
  // FIN DE LA PARTIE
  // ================================================================
  function finDePartie(scoreTotal, bonnes, derniereQuestion, victoire) {
    setTimerActif(false)
    localStorage.setItem('survie-dernier-jeu', Date.now().toString())
    // Date.now() = timestamp en ms, .toString() le convertit en chaîne
    const rang = sauvegarderClassement({
      nom:             'Joueur',
      score:           scoreTotal,
      questionAtteinte: derniereQuestion + 1,
      bonnesReponses:  bonnes,
      date:            new Date().toLocaleDateString('fr-FR'),
    })
    setClassement(chargerClassement())
    setRang(rang)
    setEstVictoire(victoire)
    setPhase('fin')  // Changement de phase → affiche SurvieFin
    ajouterXP(Math.round(scoreTotal / 10))
    setCooldown(COOLDOWN_MS)
  }

  // ================================================================
  // RENDU — MACHINE À ÉTATS
  // Selon "phase", on retourne un composant différent.
  // C'est beaucoup plus lisible qu'une multitude de conditions imbriquées.
  // ================================================================
  if (phase === 'intro') {
    return (
      <SurvieIntro
        surQuitter={surQuitter}
        surDemarrer={demarrerPartie}
        nbQuestions={NB_QUESTIONS}
        tempsQuestion={TEMPS_PAR_QUESTION}
      />
    )
  }

  if (phase === 'fin') {
    return (
      <SurvieFin
        estVictoire={estVictoire}
        score={score}
        nbBonnes={nbBonnes}
        rang={rang}
        indexQuestion={indexQuestion}
        cooldown={cooldown}
        classement={classement}
        surDemarrer={demarrerPartie}
        surQuitter={surQuitter}
        nbQuestions={NB_QUESTIONS}
        formaterCooldown={formaterCooldown}
      />
    )
  }

  // Phase 'jeu' (valeur par défaut)
  if (questions.length === 0) return null  // Sécurité : questions pas encore chargées

  return (
    <SurvieQuestion
      question={questions[indexQuestion]}
      reponseChoisie={reponseChoisie}
      animationActive={animationActive}
      timerActif={timerActif}
      tempsRestant={tempsRestant}
      score={score}
      nbBonnes={nbBonnes}
      indexQuestion={indexQuestion}
      nbQuestions={NB_QUESTIONS}
      onChoisirReponse={choisirReponse}
      surQuitter={surQuitter}
      TEMPS_PAR_QUESTION={TEMPS_PAR_QUESTION}
      DUREE_ANIMATION={DUREE_ANIMATION}
    />
  )
}
