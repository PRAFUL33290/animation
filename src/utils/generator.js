/**
 * Générateur d'idées "IA simulée".
 *
 * Combine les modèles de la banque d'activités avec le thème et les contraintes
 * saisies par l'utilisateur. L'API publique est asynchrone afin de pouvoir,
 * plus tard, remplacer l'implémentation locale par un appel à une vraie API IA
 * sans changer les composants appelants.
 *
 * Règles métier importantes :
 *  - Le thème est saisi librement (c'est l'équipe qui le choisit). Un thème
 *    inconnu de la banque est tout de même exploité (flavor générique).
 *  - Dans le planning, le thème ne s'applique QU'AUX activités du matin.
 *    Les autres créneaux (temps libre, temps calme, activité de l'après-midi)
 *    restent neutres / libres.
 */
import {
  ACTIVITY_TEMPLATES,
  THEME_FLAVOR,
  DEFAULT_FLAVOR,
  CATEGORIES,
} from '../data/activitiesBank.js';
import { findLabel, THEMES } from '../data/themes.js';
import { uid } from './id.js';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Flavor neutre pour les activités SANS thème (après-midi, temps libre/calme).
const NEUTRAL_FLAVOR = {
  univers: 'des activités du centre',
  perso: 'les enfants',
  lieu: 'la salle',
  mot: 'du jour',
};

/**
 * Résout un thème saisi librement vers une "flavor" exploitable.
 * Accepte : un id connu ('oceans'), un libellé connu ('Océans'), ou un texte
 * totalement libre ('Le cirque enchanté').
 */
export function resolveFlavor(theme) {
  if (!theme) return { ...DEFAULT_FLAVOR, label: '' };

  // Thème connu par identifiant.
  if (THEME_FLAVOR[theme]) {
    return { ...THEME_FLAVOR[theme], label: findLabel(THEMES, theme, theme) };
  }
  // Thème connu par libellé (insensible à la casse).
  const byLabel = THEMES.find(
    (t) => t.label.toLowerCase() === String(theme).toLowerCase()
  );
  if (byLabel && THEME_FLAVOR[byLabel.id]) {
    return { ...THEME_FLAVOR[byLabel.id], label: byLabel.label };
  }
  // Thème libre : on fabrique une flavor générique à partir du texte.
  const txt = String(theme).trim();
  return {
    univers: `de ${txt}`,
    perso: 'les enfants',
    lieu: 'la salle',
    mot: txt,
    label: txt,
  };
}

function fill(text, flavor, themeLabel) {
  if (!text) return text;
  return text
    .replaceAll('{univers}', flavor.univers)
    .replaceAll('{perso}', flavor.perso)
    .replaceAll('{lieu}', flavor.lieu)
    .replaceAll('{mot}', flavor.mot)
    .replaceAll('{theme}', themeLabel || flavor.mot)
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Mappe le "type souhaité" du formulaire vers les catégories de la banque.
function categoriesForWish(wish) {
  switch (wish) {
    case 'artistique':
      return ['artistique', 'temps_calme'];
    case 'grand_jeu':
      return ['grand_jeu', 'sport'];
    case 'sport':
      return ['sport', 'grand_jeu'];
    case 'temps_calme':
      return ['temps_calme', 'autonome'];
    case 'libre':
      return ['autonome', 'artistique'];
    default:
      return null; // toutes
  }
}

/**
 * Transforme un modèle en fiche activité concrète.
 * @param template modèle de la banque
 * @param opts { flavor, themeLabel, themed, ageRange, location, childrenCount, duration, animators, weather, wishedType }
 */
function buildIdea(template, opts) {
  const {
    flavor,
    themeLabel = '',
    themed = true,
    ageRange = '6-11',
    location = 'interieur',
    childrenCount = '',
    duration = '',
    animators = '',
    weather = 'ensoleille',
    wishedType = '',
  } = opts;

  const relevance = evaluateRelevance(template, { ageRange, location, childrenCount, duration, animators, weather, wishedType });

  return {
    id: uid('idea'),
    title: fill(template.title, flavor, themeLabel),
    category: template.category,
    type: template.category,
    themed,
    theme: themed ? themeLabel : '',
    themeLabel: themed ? themeLabel : '',
    objective: fill(template.objective, flavor, themeLabel),
    objectives: fill(template.objective, flavor, themeLabel),
    duration: duration || template.minDuration,
    ageRange: ageRange || '6-11',
    childrenCount: childrenCount || '',
    materials: [...template.materials],
    preparation: 'Préparer le matériel et l’espace avant l’arrivée des enfants.',
    steps: template.steps.map((s) => fill(s, flavor, themeLabel)),
    variant: fill(template.variant, flavor, themeLabel),
    difficulty: template.difficulty,
    location: template.locations.includes(location) ? location : template.locations[0],
    relevance,
    safety: 'Rappeler les règles de sécurité et compter les enfants régulièrement.',
    feedback: '',
    note: '',
  };
}


function evaluateRelevance(template, opts) {
  const { ageRange, location, childrenCount, duration, animators, weather, wishedType } = opts;
  const points = [];
  let score = 100;

  if (ageRange && template.ages.includes(ageRange)) points.push(`Adapté aux ${ageRange} ans`);
  else if (ageRange && ageRange !== '6-11') {
    score -= 18;
    points.push('À ajuster pour cette tranche d’âge');
  }

  if (location && template.locations.includes(location)) points.push(location === 'exterieur' ? 'Prévu dehors' : 'Prévu en intérieur');
  else if (location) {
    score -= 25;
    points.push('Lieu à adapter');
  }

  if (duration) {
    const delta = Number(duration) - template.minDuration;
    if (delta >= 0 && delta <= 30) points.push('Durée cohérente');
    else if (delta < 0) {
      score -= 20;
      points.push('Prévoir une version plus courte');
    } else points.push('Peut être enrichi si vous avez du temps');
  }

  const count = Number(childrenCount || 0);
  const staff = Number(animators || 0);
  if (count && staff) {
    const ratio = count / staff;
    if (template.category === 'grand_jeu' && ratio > 10) {
      score -= 12;
      points.push('Grand jeu : prévoir des équipes très cadrées');
    } else if (template.category === 'sport' && ratio > 12) {
      score -= 10;
      points.push('Sport : sécuriser les rotations');
    } else points.push('Encadrement cohérent');
  }

  if (['pluvieux', 'froid'].includes(weather) && template.locations.length === 1 && template.locations[0] === 'exterieur') {
    score -= 30;
    points.push('Météo défavorable : prévoir un plan B intérieur');
  } else if (weather === 'chaud' && ['sport', 'grand_jeu'].includes(template.category)) {
    score -= 12;
    points.push('Forte chaleur : pauses eau et zones d’ombre');
  } else if (weather) points.push('Compatible avec la météo');

  if (wishedType && wishedType !== 'libre' && template.category === wishedType) points.push('Correspond au type demandé');

  const label = score >= 85 ? 'Très pertinent' : score >= 70 ? 'Pertinent' : 'À adapter';
  return { score: Math.max(45, Math.min(100, score)), label, points: points.slice(0, 3) };
}

// Choisit aléatoirement un modèle dans la 1re catégorie non vide, hors exclusions.
function pickTemplate(categories, exclude = []) {
  for (const cat of categories) {
    const candidates = ACTIVITY_TEMPLATES.filter(
      (t) => t.category === cat && !exclude.includes(t.title)
    );
    if (candidates.length) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return null;
}

/**
 * Générateur d'idées (page Générateur). Le thème (libre) est appliqué.
 */
export async function generateIdeas(params = {}) {
  const {
    theme = '',
    ageRange = '6-11',
    childrenCount = '',
    animators = '',
    location = 'interieur',
    weather = 'ensoleille',
    wishedType = '',
    duration = '',
  } = params;

  const flavor = resolveFlavor(theme);
  const themeLabel = flavor.label;
  const wantedCategories = categoriesForWish(wishedType);
  const buildOpts = {
    flavor,
    themeLabel,
    themed: !!theme,
    ageRange,
    location,
    childrenCount,
    animators,
    weather,
    wishedType,
    duration: duration ? Number(duration) : '',
  };

  const matching = ACTIVITY_TEMPLATES.filter((t) => {
    if (wantedCategories && !wantedCategories.includes(t.category)) return false;
    if (ageRange && ageRange !== '6-11' && !t.ages.includes(ageRange)) return false;
    if (location && !t.locations.includes(location)) return false;
    if (duration && t.minDuration > Number(duration) + 30) return false;
    return true;
  });

  const source =
    matching.length > 0
      ? matching
      : ACTIVITY_TEMPLATES.filter(
          (t) => !wantedCategories || wantedCategories.includes(t.category)
        );

  const finalIdeas = source
    .map((t) => buildIdea(t, buildOpts))
    .sort((a, b) => (b.relevance?.score || 0) - (a.relevance?.score || 0));

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    ideas: finalIdeas.filter((i) => i.category === cat.id),
  })).filter((cat) => cat.ideas.length > 0);

  await delay(250);
  return { categories, flat: finalIdeas, recommended: finalIdeas.slice(0, 6) };
}

// Préférences de catégorie du MATIN selon la phase (jour de semaine).
const MORNING_BY_INDEX = {
  0: ['artistique', 'temps_calme'], // lundi – découverte
  1: ['artistique', 'autonome'], // mardi – création
  2: ['grand_jeu', 'sport'], // mercredi – défis / coopération
  3: ['artistique', 'autonome'], // jeudi – préparation
  4: ['grand_jeu', 'artistique'], // vendredi – restitution
};

function slotFrom(idea) {
  if (!idea) return null;
  return {
    title: idea.title,
    materials: idea.materials,
    notes: '',
    themed: idea.themed,
  };
}

/**
 * Remplit les créneaux d'une liste de jours pour un thème donné.
 * ⚠️ Le thème n'est appliqué QU'À l'activité du matin. Les autres créneaux
 * sont générés en neutre (sans thème).
 *
 * @param days  jours issus du calendrier (avec weekdayIndex, phase…)
 * @param theme texte libre du thème de la semaine
 * @returns jours enrichis d'un objet `slots`
 */
export async function generateWeekDays(days = [], theme = '') {
  const flavor = resolveFlavor(theme);
  const themeLabel = flavor.label;

  const themedOpts = { flavor, themeLabel, themed: true };
  const neutralOpts = { flavor: NEUTRAL_FLAVOR, themeLabel: '', themed: false };

  const result = days.map((day) => {
    const idx = day.weekdayIndex ?? 0;
    const used = [];

    const matinT = pickTemplate(MORNING_BY_INDEX[idx] || ['artistique'], used);
    const matin = matinT ? buildIdea(matinT, themedOpts) : null;
    if (matin) used.push(matin.title);

    const apremT = pickTemplate(['sport', 'grand_jeu', 'autonome', 'artistique'], used);
    const aprem = apremT ? buildIdea(apremT, neutralOpts) : null;
    if (aprem) used.push(aprem.title);

    const calmeT = pickTemplate(['temps_calme', 'autonome'], used);
    const calme = calmeT ? buildIdea(calmeT, neutralOpts) : null;
    if (calme) used.push(calme.title);

    const libreT = pickTemplate(['autonome', 'artistique'], used);
    const libre = libreT ? buildIdea(libreT, neutralOpts) : null;

    return {
      ...day,
      slots: {
        temps_libre: slotFrom(libre),
        activite_matin: slotFrom(matin),
        temps_calme: slotFrom(calme),
        activite_aprem: slotFrom(aprem),
      },
    };
  });

  await delay(200);
  return result;
}

/**
 * Génère la trame d'un projet pédagogique complet (thème libre).
 * Là encore, le thème porte sur les temps forts du MATIN ; les après-midis
 * restent en activités libres.
 */
export async function generateProject(params = {}) {
  const {
    name = '',
    theme = '',
    duration = 'semaine',
    audience = '',
    objectives = '',
    constraints = '',
    materials = '',
    finality = 'spectacle',
  } = params;

  const flavor = resolveFlavor(theme);
  const themeLabel = flavor.label || 'Sans thème';

  const durationLabel =
    { jour: 'une journée', semaine: 'une semaine', vacances: 'deux semaines de vacances' }[
      duration
    ] || duration;

  const finalityLabel =
    {
      exposition: 'une exposition des créations',
      spectacle: 'un spectacle présenté aux familles',
      grand_jeu: 'un grand jeu final',
      restitution: 'une restitution aux familles',
    }[finality] || finality;

  const summary = `Projet "${name || 'Sans titre'}" autour ${flavor.univers}, pensé pour ${
    audience || 'des enfants de 6 à 11 ans'
  } sur ${durationLabel}. Les temps forts du matin sont rythmés par le thème ; les après-midis restent consacrés à des activités libres. Objectif final : ${finalityLabel}.`;

  const baseObjectives = objectives
    ? objectives.split('\n').filter(Boolean)
    : [
        'Favoriser la coopération et le vivre-ensemble.',
        'Développer la créativité et l’expression personnelle.',
        'Découvrir le thème de façon active et ludique (le matin).',
        'Valoriser chaque enfant à travers une finalité commune.',
      ];

  const PHASE_FOCUS = {
    0: 'Lancement immersif {univers} : décor, présentation, jeu de découverte.',
    1: 'Ateliers de création et d’apprentissage liés à la finalité.',
    2: 'Grand jeu coopératif pour souder le groupe.',
    3: 'Répétitions et finalisation des productions.',
    4: `Jour J : ${finalityLabel}.`,
  };

  const planning = [0, 1, 2, 3, 4].map((idx) => ({
    day: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][idx],
    phase: [
      'Découverte du thème',
      'Création / apprentissage',
      'Défis / coopération',
      'Préparation finale',
      'Restitution / spectacle',
    ][idx],
    focus: fill(PHASE_FOCUS[idx], flavor, themeLabel),
    afternoon: 'Après-midi : activités libres (hors thème).',
  }));

  // Idées : matin thématisé, et quelques idées d'après-midi neutres.
  const themedOpts = { flavor, themeLabel, themed: true };
  const neutralOpts = { flavor: NEUTRAL_FLAVOR, themeLabel: '', themed: false };
  const morningIdeas = ['artistique', 'grand_jeu', 'temps_calme']
    .map((cat) => pickTemplate([cat]))
    .filter(Boolean)
    .map((t) => ({ ...buildIdea(t, themedOpts), moment: 'Matin (thème)' }));
  const afternoonIdeas = ['sport', 'autonome', 'grand_jeu']
    .map((cat) => pickTemplate([cat]))
    .filter(Boolean)
    .map((t) => ({ ...buildIdea(t, neutralOpts), moment: 'Après-midi (libre)' }));

  const ideaSuggestions = [...morningIdeas, ...afternoonIdeas].map((i) => ({
    title: i.title,
    category: i.category,
    duration: i.duration,
    moment: i.moment,
  }));

  await delay(300);

  return {
    name,
    theme,
    themeLabel,
    themeColor: '#7C3AED',
    duration,
    durationLabel,
    audience,
    constraints,
    materials,
    finality,
    finalityLabel,
    summary,
    objectives: baseObjectives,
    planning,
    ideaSuggestions,
  };
}
