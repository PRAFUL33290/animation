/**
 * Générateur d'idées "IA simulée".
 *
 * Combine les modèles de la banque d'activités avec le thème et les contraintes
 * saisies par l'utilisateur. L'API publique (generateIdeas / generateWeek /
 * generateProject) est asynchrone afin de pouvoir, plus tard, remplacer
 * l'implémentation locale par un appel à une vraie API IA sans changer les
 * composants appelants.
 */
import {
  ACTIVITY_TEMPLATES,
  THEME_FLAVOR,
  DEFAULT_FLAVOR,
  CATEGORIES,
} from '../data/activitiesBank.js';
import { findTheme, findLabel, THEMES } from '../data/themes.js';
import { WEEK_DAYS } from '../data/timeSlots.js';
import { uid } from './id.js';

function getFlavor(themeId) {
  return THEME_FLAVOR[themeId] || DEFAULT_FLAVOR;
}

function fill(text, flavor, themeLabel) {
  if (!text) return text;
  return text
    .replaceAll('{univers}', flavor.univers)
    .replaceAll('{perso}', flavor.perso)
    .replaceAll('{lieu}', flavor.lieu)
    .replaceAll('{mot}', flavor.mot)
    .replaceAll('{theme}', themeLabel || flavor.mot);
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
 * Transforme un modèle en fiche activité concrète selon le thème/contraintes.
 */
function buildIdea(template, ctx) {
  const { themeId, themeLabel, ageRange, location, childrenCount, duration } = ctx;
  const flavor = getFlavor(themeId);

  return {
    id: uid('idea'),
    title: fill(template.title, flavor, themeLabel),
    category: template.category,
    type: template.category,
    theme: themeId,
    themeLabel,
    objective: fill(template.objective, flavor, themeLabel),
    objectives: fill(template.objective, flavor, themeLabel),
    duration: duration || template.minDuration,
    ageRange: ageRange || '6-11',
    recommendedAges:
      template.ages && template.ages.includes(ageRange) ? ageRange : '6-11',
    childrenCount: childrenCount || '',
    materials: [...template.materials],
    preparation: 'Préparer le matériel et l’espace avant l’arrivée des enfants.',
    steps: template.steps.map((s) => fill(s, flavor, themeLabel)),
    variant: fill(template.variant, flavor, themeLabel),
    difficulty: template.difficulty,
    location: template.locations.includes(location) ? location : template.locations[0],
    safety: 'Rappeler les règles de sécurité et compter les enfants régulièrement.',
    feedback: '',
    note: '',
  };
}

/**
 * Filtre les modèles selon les contraintes puis construit les idées,
 * regroupées par catégorie.
 *
 * @returns {Promise<{categories: Array<{id, label, emoji, ideas: []}>, flat: []}>}
 */
export async function generateIdeas(params = {}) {
  const {
    theme = '',
    ageRange = '6-11',
    childrenCount = '',
    location = 'interieur',
    wishedType = '',
    duration = '',
  } = params;

  const themeLabel = findLabel(THEMES, theme, theme || 'Sans thème');
  const wantedCategories = categoriesForWish(wishedType);

  const ctx = {
    themeId: theme,
    themeLabel,
    ageRange,
    location,
    childrenCount,
    duration: duration ? Number(duration) : '',
  };

  const ideas = ACTIVITY_TEMPLATES.filter((t) => {
    if (wantedCategories && !wantedCategories.includes(t.category)) return false;
    if (ageRange && ageRange !== '6-11' && !t.ages.includes(ageRange)) return false;
    if (location && !t.locations.includes(location)) return false;
    if (duration && t.minDuration > Number(duration) + 30) return false;
    return true;
  }).map((t) => buildIdea(t, ctx));

  // Repli : si les filtres sont trop stricts, on relâche le lieu/âge.
  const finalIdeas =
    ideas.length > 0
      ? ideas
      : ACTIVITY_TEMPLATES.filter(
          (t) => !wantedCategories || wantedCategories.includes(t.category)
        ).map((t) => buildIdea(t, ctx));

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    ideas: finalIdeas.filter((i) => i.category === cat.id),
  })).filter((cat) => cat.ideas.length > 0);

  // Simule une légère latence "IA" pour une transition fluide à l'écran.
  await new Promise((r) => setTimeout(r, 250));

  return { categories, flat: finalIdeas };
}

/**
 * Génère une semaine complète (lundi -> vendredi) suivant une progression
 * pédagogique, à partir d'un thème.
 */
export async function generateWeek({ theme = '', ageRange = '6-11' } = {}) {
  const themeLabel = findLabel(THEMES, theme, theme || 'Sans thème');
  const flavor = getFlavor(theme);
  const ctx = { themeId: theme, themeLabel, ageRange, location: 'interieur', duration: '' };

  // Préférences de catégorie par jour, alignées sur la progression.
  const dayCategoryPref = {
    lundi: ['artistique', 'temps_calme'],
    mardi: ['artistique', 'autonome'],
    mercredi: ['grand_jeu', 'sport'],
    jeudi: ['artistique', 'autonome'],
    vendredi: ['grand_jeu', 'artistique'],
  };

  const pick = (categories, exclude = []) => {
    for (const cat of categories) {
      const candidates = ACTIVITY_TEMPLATES.filter(
        (t) => t.category === cat && !exclude.includes(t.title)
      );
      if (candidates.length) {
        const t = candidates[Math.floor(Math.random() * candidates.length)];
        return buildIdea(t, ctx);
      }
    }
    return null;
  };

  const days = WEEK_DAYS.map((day) => {
    const prefs = dayCategoryPref[day.id];
    const used = [];
    const matin = pick(prefs, used);
    if (matin) used.push(matin.title);
    const aprem = pick([prefs[1] || prefs[0], ...prefs], used);
    if (aprem) used.push(aprem.title);
    const calme = pick(['temps_calme', 'autonome'], used);
    const libre = pick(['autonome', 'artistique'], used);

    return {
      id: day.id,
      label: day.label,
      phase: day.phase,
      slots: {
        temps_libre: libre ? { title: libre.title, materials: libre.materials, notes: '' } : null,
        activite_matin: matin
          ? { title: matin.title, materials: matin.materials, notes: fill('Objectif : {mot}', flavor, themeLabel) }
          : null,
        temps_calme: calme ? { title: calme.title, materials: calme.materials, notes: '' } : null,
        activite_aprem: aprem ? { title: aprem.title, materials: aprem.materials, notes: '' } : null,
      },
    };
  });

  await new Promise((r) => setTimeout(r, 300));

  return { theme, themeLabel, ageRange, days };
}

/**
 * Génère la trame d'un projet pédagogique complet.
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

  const themeLabel = findLabel(THEMES, theme, theme || 'Sans thème');
  const flavor = getFlavor(theme);
  const t = findTheme(theme);

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
  } sur ${durationLabel}. Les enfants deviennent ${flavor.perso} et progressent étape par étape jusqu'à ${finalityLabel}.`;

  const baseObjectives = objectives
    ? objectives.split('\n').filter(Boolean)
    : [
        'Favoriser la coopération et le vivre-ensemble.',
        'Développer la créativité et l’expression personnelle.',
        'Découvrir le thème de façon active et ludique.',
        'Valoriser chaque enfant à travers une finalité commune.',
      ];

  // Planning suggéré aligné sur la progression de la semaine.
  const planning = WEEK_DAYS.map((d) => ({
    day: d.label,
    phase: d.phase,
    focus: fill(
      {
        lundi: 'Lancement immersif {univers} : décor, présentation, jeu de découverte.',
        mardi: 'Ateliers de création et d’apprentissage liés à la finalité.',
        mercredi: 'Grand jeu coopératif pour souder le groupe.',
        jeudi: 'Répétitions et finalisation des productions.',
        vendredi: `Jour J : ${finalityLabel}.`,
      }[d.id],
      flavor,
      themeLabel
    ),
  }));

  // Quelques idées d'activités tirées de la banque pour ce thème.
  const { flat } = await generateIdeas({ theme, ageRange: '6-11', location: 'interieur' });
  const ideaSuggestions = flat.slice(0, 6).map((i) => ({
    title: i.title,
    category: i.category,
    duration: i.duration,
  }));

  await new Promise((r) => setTimeout(r, 300));

  return {
    name,
    theme,
    themeLabel,
    themeColor: t ? t.color : '#7C3AED',
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
