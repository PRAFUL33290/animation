/**
 * Banque d'idées prédéfinies = "IA simulée".
 *
 * Le générateur (src/utils/generator.js) combine ces modèles d'activités avec
 * le thème choisi et les contraintes (âge, lieu, durée...) pour produire des
 * fiches variées. La structure est volontairement déclarative : pour brancher
 * plus tard une vraie API IA, il suffira de remplacer la fonction
 * generateIdeas() sans toucher au reste de l'application.
 *
 * Catégories : artistique | sport | grand_jeu | temps_calme | autonome
 */

// Vocabulaire thématique injecté dans les titres / déroulés.
export const THEME_FLAVOR = {
  coachella: { univers: 'festival', perso: 'des artistes', lieu: 'la scène', mot: 'festival' },
  oceans: { univers: 'des océans', perso: 'des créatures marines', lieu: 'le récif', mot: 'océan' },
  voyage: { univers: 'du tour du monde', perso: 'des explorateurs', lieu: 'les continents', mot: 'voyage' },
  cinema: { univers: 'du cinéma', perso: 'des réalisateurs', lieu: 'le plateau', mot: 'film' },
  mangas: { univers: 'des mangas', perso: 'des héros de manga', lieu: 'le dojo', mot: 'manga' },
  jo: { univers: 'des Jeux Olympiques', perso: 'des athlètes', lieu: 'le stade', mot: 'olympiade' },
  harry_potter: { univers: 'de Poudlard', perso: 'des sorciers', lieu: 'le grand hall', mot: 'sortilège' },
  super_heros: { univers: 'des super-héros', perso: 'des super-héros', lieu: 'la base secrète', mot: 'mission' },
  nature: { univers: 'de la nature', perso: 'des aventuriers', lieu: 'la forêt', mot: 'nature' },
  musique: { univers: 'de la musique', perso: 'des musiciens', lieu: 'le studio', mot: 'mélodie' },
  danse: { univers: 'de la danse', perso: 'des danseurs', lieu: 'le studio de danse', mot: 'chorégraphie' },
  theatre: { univers: 'du théâtre', perso: 'des comédiens', lieu: 'la scène', mot: 'pièce' },
  arts_plastiques: { univers: 'des arts plastiques', perso: 'des artistes', lieu: "l'atelier", mot: 'œuvre' },
};

export const DEFAULT_FLAVOR = {
  univers: 'du thème',
  perso: 'les enfants',
  lieu: 'la salle',
  mot: 'aventure',
};

// Modèles d'activités. {univers}, {perso}, {lieu}, {mot} sont remplacés.
export const ACTIVITY_TEMPLATES = [
  // ---------------------- ARTISTIQUE ----------------------
  {
    category: 'artistique',
    title: 'Fresque collective {mot}',
    objective: "Coopérer et s'exprimer par le dessin autour {univers}.",
    materials: ['Grande feuille kraft', 'Feutres', 'Peinture', 'Pinceaux', 'Tabliers'],
    steps: [
      'Présenter le thème et montrer des images inspirantes.',
      'Diviser la fresque en zones, une par petit groupe.',
      'Chaque groupe dessine puis met en couleur sa partie.',
      'Assembler et afficher la fresque commune.',
    ],
    variant: 'Réaliser la fresque en land art à {lieu} avec des éléments naturels.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur', 'exterieur'],
    minDuration: 45,
  },
  {
    category: 'artistique',
    title: 'Atelier déguisements {mot}',
    objective: "Développer la créativité et l'imaginaire {univers}.",
    materials: ['Cartons', 'Tissus de récup', 'Élastiques', 'Ciseaux', 'Colle', 'Gommettes'],
    steps: [
      'Montrer des exemples de costumes liés au thème.',
      'Chaque enfant choisit son personnage parmi {perso}.',
      'Fabrication des accessoires (masque, chapeau, cape...).',
      'Petit défilé final pour présenter les créations.',
    ],
    variant: 'Organiser un concours de costumes avec un jury d’enfants.',
    difficulty: 'moyen',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur'],
    minDuration: 60,
  },
  {
    category: 'artistique',
    title: 'Mini-spectacle {mot}',
    objective: 'Prendre confiance en soi et travailler en groupe sur scène.',
    materials: ['Enceinte', 'Costumes simples', 'Quelques accessoires'],
    steps: [
      'Constituer des petits groupes de 3 à 5 enfants.',
      'Choisir une mini-scène (sketch, danse, chant) {univers}.',
      'Répéter quelques minutes par groupe.',
      'Représentation devant les autres et applaudissements.',
    ],
    variant: 'Filmer les passages pour créer un "vrai" film {univers}.',
    difficulty: 'moyen',
    ages: ['8-9', '10-11', '6-11'],
    locations: ['interieur', 'exterieur'],
    minDuration: 60,
  },
  {
    category: 'artistique',
    title: 'Atelier chorégraphie {mot}',
    objective: 'Travailler le rythme, la coordination et la mémoire du corps.',
    materials: ['Enceinte', 'Playlist adaptée', 'Espace dégagé'],
    steps: [
      'Échauffement en musique tous ensemble.',
      'Apprentissage de 3 ou 4 mouvements simples.',
      'Création par petits groupes d’un enchaînement {univers}.',
      'Démonstration finale de chaque groupe.',
    ],
    variant: 'Ajouter des accessoires (foulards, rubans) pour enrichir la danse.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur', 'exterieur'],
    minDuration: 45,
  },

  // ---------------------- SPORT COLLECTIF ----------------------
  {
    category: 'sport',
    title: 'Tournoi sportif {mot}',
    objective: 'Favoriser le jeu collectif, le fair-play et la dépense physique.',
    materials: ['Ballons', 'Plots', 'Chasubles', 'Sifflet'],
    steps: [
      'Constituer des équipes équilibrées et les "habiller" du thème.',
      'Expliquer les règles et l’importance du fair-play.',
      'Mini-matchs en rotation entre les équipes.',
      'Remise symbolique et débrief collectif.',
    ],
    variant: 'Remplacer les matchs par des ateliers de défis sportifs notés.',
    difficulty: 'moyen',
    ages: ['8-9', '10-11', '6-11'],
    locations: ['exterieur', 'interieur'],
    minDuration: 60,
  },
  {
    category: 'sport',
    title: 'Parcours du combattant {univers}',
    objective: 'Développer la motricité, l’équilibre et l’esprit d’équipe.',
    materials: ['Cerceaux', 'Cordes', 'Plots', 'Tapis', 'Chronomètre'],
    steps: [
      'Installer 5 à 6 ateliers de motricité avec les enfants.',
      'Habiller chaque atelier d’une mission {univers}.',
      'Passage des enfants en relais ou en contre-la-montre.',
      'Tour final tous ensemble pour le plaisir.',
    ],
    variant: 'Version coopérative : l’équipe doit franchir le parcours sans erreur.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['exterieur', 'interieur'],
    minDuration: 45,
  },
  {
    category: 'sport',
    title: 'Béret {mot} revisité',
    objective: 'Travailler la réactivité et la cohésion d’équipe.',
    materials: ['Un objet à attraper', 'Plots pour délimiter', 'Chasubles'],
    steps: [
      'Deux équipes face à face, chacun reçoit un numéro.',
      'L’animateur appelle un numéro (ou un mot du thème).',
      'Les deux joueurs courent attraper l’objet et le ramener.',
      'On compte les points et on relance plusieurs manches.',
    ],
    variant: 'Appeler plusieurs numéros à la fois pour des duels à 2 contre 2.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['exterieur', 'interieur'],
    minDuration: 30,
  },

  // ---------------------- GRAND JEU ----------------------
  {
    category: 'grand_jeu',
    title: 'Chasse au trésor {univers}',
    objective: 'Coopérer pour résoudre des énigmes et explorer l’espace.',
    materials: ['Cartes / indices imprimés', 'Enveloppes', 'Petit trésor', 'Stylos'],
    steps: [
      'Présenter l’histoire : une quête {univers} à accomplir.',
      'Distribuer le premier indice à chaque équipe.',
      'Les équipes résolvent les énigmes pour avancer d’étape en étape.',
      'Découverte du trésor et célébration tous ensemble.',
    ],
    variant: 'Ajouter des épreuves physiques entre deux énigmes.',
    difficulty: 'moyen',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['exterieur', 'interieur'],
    minDuration: 90,
  },
  {
    category: 'grand_jeu',
    title: 'Grand jeu à postes : la quête {mot}',
    objective: 'Faire vivre une aventure à étapes et gagner des points en équipe.',
    materials: ['Matériel varié par poste', 'Feuille de score', 'Foulards de couleur'],
    steps: [
      'Installer 5 à 8 postes tenus par les animateurs.',
      'Chaque poste propose un défi {univers} (adresse, réflexion, créativité).',
      'Les équipes tournent sur les postes et cumulent des points.',
      'Comptage final et grand cri d’équipe.',
    ],
    variant: 'Transformer en jeu de l’oie géant avec un grand plateau au sol.',
    difficulty: 'difficile',
    ages: ['8-9', '10-11', '6-11'],
    locations: ['exterieur', 'interieur'],
    minDuration: 120,
  },
  {
    category: 'grand_jeu',
    title: 'Olympiades {univers}',
    objective: 'Vivre un grand temps collectif rythmé par des épreuves variées.',
    materials: ['Matériel sportif', 'Médailles maison', 'Tableau des scores'],
    steps: [
      'Cérémonie d’ouverture avec présentation des équipes.',
      'Enchaînement d’épreuves sportives et de défis {univers}.',
      'Cumul des points sur un grand tableau visible de tous.',
      'Cérémonie de clôture et remise des médailles.',
    ],
    variant: 'Inclure des épreuves "calmes" (quiz, énigmes) pour varier les talents.',
    difficulty: 'moyen',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['exterieur'],
    minDuration: 120,
  },

  // ---------------------- TEMPS CALME ----------------------
  {
    category: 'temps_calme',
    title: 'Voyage imaginaire {univers}',
    objective: 'Se détendre, se recentrer et stimuler l’imaginaire après le repas.',
    materials: ['Tapis ou coussins', 'Musique douce', 'Lumière tamisée'],
    steps: [
      'Installer les enfants confortablement, lumière baissée.',
      'Lire un texte de relaxation qui emmène vers {lieu}.',
      'Temps de respiration calme et de visualisation.',
      'Retour en douceur et court échange sur le ressenti.',
    ],
    variant: 'Prolonger par un dessin de "ce que j’ai imaginé".',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur'],
    minDuration: 30,
  },
  {
    category: 'temps_calme',
    title: 'Atelier lecture & histoires {univers}',
    objective: 'Favoriser le calme, l’écoute et le goût des histoires.',
    materials: ['Livres / albums sur le thème', 'Coussins', 'Marque-pages à colorier'],
    steps: [
      'Aménager un coin lecture cosy.',
      'Lecture d’une histoire {univers} par l’animateur.',
      'Temps de lecture libre ou en binôme.',
      'Chacun raconte sa partie préférée en un mot.',
    ],
    variant: 'Créer ensemble la suite de l’histoire à l’oral.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '6-11'],
    locations: ['interieur'],
    minDuration: 30,
  },
  {
    category: 'temps_calme',
    title: 'Coloriages & mandalas {mot}',
    objective: 'Apaiser après le repas par une activité concentrée et autonome.',
    materials: ['Coloriages thématiques', 'Crayons de couleur', 'Feutres fins'],
    steps: [
      'Distribuer des coloriages liés au thème.',
      'Musique douce en fond.',
      'Coloriage libre, sans contrainte de résultat.',
      'Affichage des réalisations pour valoriser chacun.',
    ],
    variant: 'Proposer des mandalas à compléter à deux mains.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur'],
    minDuration: 30,
  },

  // ---------------------- AUTONOME ----------------------
  {
    category: 'autonome',
    title: 'Coin créatif libre {univers}',
    objective: 'Laisser les enfants créer librement à leur rythme.',
    materials: ['Papiers variés', 'Feutres', 'Gommettes', 'Ciseaux', 'Colle', 'Récup'],
    steps: [
      'Installer une table avec du matériel en libre accès.',
      'Donner une consigne ouverte : "imagine quelque chose {univers}".',
      'Les enfants créent seuls ou à plusieurs.',
      'Espace d’exposition pour montrer ce qu’on veut.',
    ],
    variant: 'Ajouter des cartes "défi créatif" à piocher.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur'],
    minDuration: 30,
  },
  {
    category: 'autonome',
    title: 'Jeux de société {mot}',
    objective: 'Développer l’autonomie, le respect des règles et la patience.',
    materials: ['Sélection de jeux de société', 'Tables', 'Sabliers'],
    steps: [
      'Présenter rapidement 3 ou 4 jeux disponibles.',
      'Constituer des petits groupes par jeu.',
      'Jeu en autonomie, l’animateur passe en soutien.',
      'Rangement collectif à la fin.',
    ],
    variant: 'Créer un tournoi doux avec rotation des jeux.',
    difficulty: 'facile',
    ages: ['6-7', '8-9', '10-11', '6-11'],
    locations: ['interieur'],
    minDuration: 45,
  },
  {
    category: 'autonome',
    title: 'Défis photo / mission {mot}',
    objective: 'Explorer en autonomie encadrée à travers de petites missions.',
    materials: ['Cartes mission', 'Crayons', 'Appareil photo (optionnel)'],
    steps: [
      'Distribuer une série de cartes "mission" {univers}.',
      'Les enfants réalisent les défis par petits groupes.',
      'Validation des missions auprès de l’animateur.',
      'Partage des découvertes en fin de temps.',
    ],
    variant: 'Version extérieure type rallye découverte à {lieu}.',
    difficulty: 'moyen',
    ages: ['8-9', '10-11', '6-11'],
    locations: ['interieur', 'exterieur'],
    minDuration: 45,
  },
];

// Catégories affichées (générateur d'idées).
export const CATEGORIES = [
  { id: 'artistique', label: 'Activités artistiques', emoji: '🎨' },
  { id: 'sport', label: 'Activités sportives', emoji: '⚽' },
  { id: 'grand_jeu', label: 'Grands jeux', emoji: '🗺️' },
  { id: 'temps_calme', label: 'Temps calmes', emoji: '🧘' },
  { id: 'autonome', label: 'Activités autonomes', emoji: '🧩' },
];
