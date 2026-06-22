// Créneaux fixes de la journée ALSH (planning journée).
export const DAY_SLOTS = [
  { id: 'accueil_matin', time: '07h15 - 09h00', label: 'Accueil échelonné', fixed: true },
  { id: 'temps_libre', time: '09h00 - 10h00', label: 'Temps libre / ateliers autonomes' },
  { id: 'activite_matin', time: '10h00 - 11h30', label: 'Activité principale du matin' },
  { id: 'repas', time: '11h30 - 13h00', label: 'Repas', fixed: true },
  { id: 'temps_calme', time: '13h00 - 14h30', label: 'Temps calme' },
  { id: 'activite_aprem', time: '14h30 - 16h00', label: "Activité principale de l'après-midi" },
  { id: 'gouter', time: '16h00 - 16h30', label: 'Goûter', fixed: true },
  { id: 'accueil_soir', time: '16h30 - 18h45', label: 'Accueil du soir / départs échelonnés / petits jeux' },
];

// Créneaux retenus pour la vue semaine (les moments "actifs" à remplir).
export const WEEK_SLOTS = [
  { id: 'temps_libre', time: '09h00 - 10h00', label: 'Temps libre' },
  { id: 'activite_matin', time: '10h00 - 11h30', label: 'Activité matin' },
  { id: 'temps_calme', time: '13h00 - 14h30', label: 'Temps calme' },
  { id: 'activite_aprem', time: '14h30 - 16h00', label: 'Activité après-midi' },
];

export const WEEK_DAYS = [
  { id: 'lundi', label: 'Lundi', phase: 'Découverte du thème' },
  { id: 'mardi', label: 'Mardi', phase: 'Création / apprentissage' },
  { id: 'mercredi', label: 'Mercredi', phase: 'Défis / coopération' },
  { id: 'jeudi', label: 'Jeudi', phase: 'Préparation finale' },
  { id: 'vendredi', label: 'Vendredi', phase: 'Restitution / spectacle / grand jeu final' },
];
