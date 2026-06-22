// Thèmes proposés par défaut dans le générateur d'idées et de projets.
export const THEMES = [
  { id: 'coachella', label: 'Coachella', emoji: '🎪', color: '#EC4899' },
  { id: 'oceans', label: 'Océans', emoji: '🌊', color: '#0EA5E9' },
  { id: 'voyage', label: 'Voyage autour du monde', emoji: '🌍', color: '#22C55E' },
  { id: 'cinema', label: 'Cinéma', emoji: '🎬', color: '#111827' },
  { id: 'mangas', label: 'Mangas', emoji: '🍥', color: '#F97316' },
  { id: 'jo', label: 'Jeux Olympiques', emoji: '🏅', color: '#2563EB' },
  { id: 'harry_potter', label: 'Harry Potter', emoji: '⚡', color: '#7C3AED' },
  { id: 'super_heros', label: 'Super-héros', emoji: '🦸', color: '#EF4444' },
  { id: 'nature', label: 'Nature', emoji: '🌿', color: '#16A34A' },
  { id: 'musique', label: 'Musique', emoji: '🎵', color: '#A855F7' },
  { id: 'danse', label: 'Danse', emoji: '💃', color: '#DB2777' },
  { id: 'theatre', label: 'Théâtre', emoji: '🎭', color: '#9333EA' },
  { id: 'arts_plastiques', label: 'Arts plastiques', emoji: '🎨', color: '#FACC15' },
];

export const AGE_RANGES = [
  { id: '6-7', label: '6-7 ans' },
  { id: '8-9', label: '8-9 ans' },
  { id: '10-11', label: '10-11 ans' },
  { id: '6-11', label: '6-11 ans' },
];

export const ACTIVITY_TYPES = [
  { id: 'artistique', label: 'Artistique', emoji: '🎨', color: '#7C3AED' },
  { id: 'sport', label: 'Sport collectif', emoji: '⚽', color: '#22C55E' },
  { id: 'grand_jeu', label: 'Grand jeu', emoji: '🗺️', color: '#2563EB' },
  { id: 'temps_calme', label: 'Temps calme', emoji: '🧘', color: '#0EA5E9' },
  { id: 'autonome', label: 'Activité autonome', emoji: '🧩', color: '#FACC15' },
];

// Correspondance entre le "type souhaité" du formulaire et les catégories générées.
export const WISHED_TYPES = [
  { id: 'artistique', label: 'Artistique' },
  { id: 'grand_jeu', label: 'Grand jeu' },
  { id: 'sport', label: 'Sport collectif' },
  { id: 'temps_calme', label: 'Temps calme' },
  { id: 'libre', label: 'Libre' },
];

export const DIFFICULTIES = [
  { id: 'facile', label: 'Facile', color: '#22C55E' },
  { id: 'moyen', label: 'Moyen', color: '#FACC15' },
  { id: 'difficile', label: 'Difficile', color: '#EF4444' },
];

export const WEATHER = [
  { id: 'ensoleille', label: 'Ensoleillé', emoji: '☀️' },
  { id: 'nuageux', label: 'Nuageux', emoji: '⛅' },
  { id: 'pluvieux', label: 'Pluvieux', emoji: '🌧️' },
  { id: 'chaud', label: 'Forte chaleur', emoji: '🥵' },
  { id: 'froid', label: 'Froid', emoji: '🥶' },
];

export const LOCATIONS = [
  { id: 'interieur', label: 'Intérieur' },
  { id: 'exterieur', label: 'Extérieur' },
];

export const DURATIONS = [
  { id: 30, label: '30 min' },
  { id: 45, label: '45 min' },
  { id: 60, label: '1 h' },
  { id: 90, label: '1 h 30' },
  { id: 120, label: '2 h' },
];

export const PROJECT_DURATIONS = [
  { id: 'jour', label: '1 jour' },
  { id: 'semaine', label: '1 semaine' },
  { id: 'vacances', label: 'Vacances (2 semaines)' },
];

export const PROJECT_FINALITIES = [
  { id: 'exposition', label: 'Exposition' },
  { id: 'spectacle', label: 'Spectacle' },
  { id: 'grand_jeu', label: 'Grand jeu final' },
  { id: 'restitution', label: 'Restitution aux familles' },
];

// Helpers de lookup.
export const findLabel = (list, id, fallback = '') => {
  const item = list.find((x) => String(x.id) === String(id));
  return item ? item.label : fallback;
};

export const findTheme = (id) => THEMES.find((t) => t.id === id);
