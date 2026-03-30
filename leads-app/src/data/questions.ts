import { EligibilityQuestion, ScoringQuestion } from '../types';

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: 'elig-1',
    question: "Quel est votre statut actuel ?",
    subtitle: "Cette information nous permet de personnaliser votre diagnostic.",
    options: [
      { label: "Je suis entrepreneur ou chef d'entreprise", value: 'entrepreneur', eligible: true },
      { label: "Je suis en cours de création d'entreprise", value: 'creation', eligible: true },
      { label: "Je suis salarié sans projet entrepreneurial", value: 'salarie', eligible: false },
    ]
  },
  {
    id: 'elig-2',
    question: "Avez-vous une offre de produit ou service déjà définie ?",
    subtitle: "Même en version beta ou en cours d'affinement.",
    options: [
      { label: "Oui, mon offre est claire et je la vends déjà", value: 'clear', eligible: true },
      { label: "Oui, mais elle n'est pas encore parfaitement définie", value: 'wip', eligible: true },
      { label: "Non, je n'ai pas encore d'offre définie", value: 'none', eligible: false },
    ]
  },
  {
    id: 'elig-3',
    question: "Êtes-vous prêt à investir un minimum de 5 € par jour en publicité digitale ?",
    subtitle: "C'est le budget de départ minimum pour tester le système PVC.",
    options: [
      { label: "Oui, c'est tout à fait envisageable", value: 'yes', eligible: true },
      { label: "J'y réfléchis sérieusement", value: 'maybe', eligible: true },
      { label: "Non, je ne souhaite pas investir en publicité", value: 'no', eligible: false },
    ]
  },
  {
    id: 'elig-4',
    question: "Êtes-vous disponible pour consacrer du temps à la mise en place d'un système d'acquisition ?",
    subtitle: "Le déploiement du système PVC demande un engagement de votre part.",
    options: [
      { label: "Oui, c'est une priorité pour moi", value: 'priority', eligible: true },
      { label: "Oui, je peux dégager du temps pour ça", value: 'available', eligible: true },
      { label: "Non, je n'ai aucun temps à y consacrer", value: 'no-time', eligible: false },
    ]
  }
];

export const scoringQuestions: ScoringQuestion[] = [
  // Axe 1 — Acquisition & Publicité Digitale (Q1-Q4)
  {
    id: 'q1',
    axis: 'pub',
    question: "Utilisez-vous actuellement la publicité payante (Meta Ads, Google Ads) pour acquérir des clients ?",
    options: [
      { label: "Non, jamais", value: 0 },
      { label: "J'ai essayé mais arrêté", value: 1 },
      { label: "Ponctuellement, sans vraie stratégie", value: 2 },
      { label: "Oui, régulièrement mais sans optimisation", value: 3 },
      { label: "Oui, avec un système optimisé et rentable", value: 5 },
    ]
  },
  {
    id: 'q2',
    axis: 'pub',
    question: "Quel est votre budget publicitaire mensuel actuel ?",
    options: [
      { label: "0 € — pas de budget pub", value: 0 },
      { label: "Moins de 150 €/mois", value: 1 },
      { label: "150 à 500 €/mois", value: 2 },
      { label: "500 à 1500 €/mois", value: 3 },
      { label: "Plus de 1500 €/mois", value: 5 },
    ]
  },
  {
    id: 'q3',
    axis: 'pub',
    question: "Connaissez-vous le coût d'acquisition d'un client dans votre activité ?",
    options: [
      { label: "Non, aucune idée", value: 0 },
      { label: "J'ai une vague estimation", value: 1 },
      { label: "Je le connais approximativement", value: 3 },
      { label: "Oui, précisément, et je l'optimise", value: 5 },
    ]
  },
  {
    id: 'q4',
    axis: 'pub',
    question: "Avez-vous une page de destination (landing page) dédiée pour vos campagnes ?",
    options: [
      { label: "Non, pas de landing page", value: 0 },
      { label: "J'envoie vers mon site internet classique", value: 1 },
      { label: "J'ai une landing page mais pas optimisée", value: 2 },
      { label: "Oui, une landing page optimisée avec CTA clair", value: 5 },
    ]
  },
  // Axe 2 — Qualification & Contenu Éducatif (Q5-Q8)
  {
    id: 'q5',
    axis: 'vee',
    question: "Avez-vous un contenu vidéo qui présente votre expertise et votre offre ?",
    options: [
      { label: "Non, aucun contenu vidéo", value: 0 },
      { label: "Quelques vidéos sur les réseaux, sans stratégie", value: 1 },
      { label: "Une vidéo de présentation basique", value: 2 },
      { label: "Oui, une vidéo éducative structurée (type VEE)", value: 5 },
    ]
  },
  {
    id: 'q6',
    axis: 'vee',
    question: "Vos prospects arrivent-ils en rendez-vous déjà éduqués sur votre méthode ?",
    options: [
      { label: "Non, je dois tout expliquer à chaque fois", value: 0 },
      { label: "Rarement, la plupart découvrent en RDV", value: 1 },
      { label: "Parfois, certains ont vu du contenu", value: 3 },
      { label: "Oui, ils connaissent déjà ma méthode avant le RDV", value: 5 },
    ]
  },
  {
    id: 'q7',
    axis: 'vee',
    question: "Avez-vous identifié les 3 piliers de valeur que vous apportez à vos clients ?",
    options: [
      { label: "Non, je n'y ai jamais réfléchi", value: 0 },
      { label: "J'ai une vague idée", value: 1 },
      { label: "Oui, mais pas formalisé clairement", value: 3 },
      { label: "Oui, clairement définis et communiqués", value: 5 },
    ]
  },
  {
    id: 'q8',
    axis: 'vee',
    question: "Avez-vous un processus de qualification avant vos rendez-vous commerciaux ?",
    options: [
      { label: "Non, je prends tout le monde", value: 0 },
      { label: "Un simple échange par email ou message", value: 1 },
      { label: "Un formulaire basique", value: 3 },
      { label: "Un formulaire de qualification structuré", value: 5 },
    ]
  },
  // Axe 3 — Closing & Processus de Vente (Q9-Q12)
  {
    id: 'q9',
    axis: 'closing',
    question: "Comment se déroulent vos rendez-vous de vente actuellement ?",
    options: [
      { label: "Pas de processus — chaque RDV est différent", value: 0 },
      { label: "J'ai une trame mais je l'applique rarement", value: 1 },
      { label: "J'ai un script que je suis globalement", value: 3 },
      { label: "Un processus structuré avec des étapes claires", value: 5 },
    ]
  },
  {
    id: 'q10',
    axis: 'closing',
    question: "Quel est votre taux de conversion actuel (prospects → clients) ?",
    options: [
      { label: "Aucune idée", value: 0 },
      { label: "Moins de 10 %", value: 1 },
      { label: "Entre 10 et 25 %", value: 2 },
      { label: "Entre 25 et 50 %", value: 3 },
      { label: "Plus de 50 %", value: 5 },
    ]
  },
  {
    id: 'q11',
    axis: 'closing',
    question: "Vos rendez-vous se font en visio ou par téléphone ?",
    options: [
      { label: "Principalement par téléphone", value: 1 },
      { label: "Un mix des deux", value: 2 },
      { label: "En physique principalement", value: 3 },
      { label: "En visio systématiquement", value: 5 },
    ]
  },
  {
    id: 'q12',
    axis: 'closing',
    question: "Lors de vos RDV de vente, vous sentez-vous plutôt en posture de...",
    options: [
      { label: "Demandeur — j'essaie de convaincre", value: 0 },
      { label: "Présentateur — j'expose mon offre", value: 1 },
      { label: "Conseiller — j'écoute et je propose", value: 3 },
      { label: "Sélectionneur — le prospect veut travailler avec moi", value: 5 },
    ]
  },
  // Axe 4 — Prédictibilité & Automatisation (Q13-Q15)
  {
    id: 'q13',
    axis: 'predictability',
    question: "Pouvez-vous prédire combien de clients vous allez signer le mois prochain ?",
    options: [
      { label: "Absolument pas", value: 0 },
      { label: "Très vaguement", value: 1 },
      { label: "Avec une marge d'erreur de 30-50 %", value: 3 },
      { label: "Oui, avec précision (+/- 10 %)", value: 5 },
    ]
  },
  {
    id: 'q14',
    axis: 'predictability',
    question: "Votre acquisition de clients fonctionne-t-elle sans votre intervention directe ?",
    options: [
      { label: "Non, tout repose sur moi", value: 0 },
      { label: "Très peu de choses sont automatisées", value: 1 },
      { label: "Certaines parties sont automatisées", value: 3 },
      { label: "Oui, le système tourne en autonomie", value: 5 },
    ]
  },
  {
    id: 'q15',
    axis: 'predictability',
    question: "Avez-vous un tableau de bord qui vous montre vos métriques d'acquisition en temps réel ?",
    options: [
      { label: "Non, aucun suivi", value: 0 },
      { label: "Je regarde ponctuellement quelques chiffres", value: 1 },
      { label: "J'ai un suivi partiel (tableur, CRM basique)", value: 3 },
      { label: "Oui, un dashboard complet et suivi régulièrement", value: 5 },
    ]
  },
];
