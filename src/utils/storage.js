/**
 * Couche de persistance.
 *
 * Pour cette première version, toutes les données sont stockées dans le
 * localStorage du navigateur. L'API ci-dessous est volontairement générique
 * (getCollection / saveCollection) afin de pouvoir, plus tard, remplacer
 * l'implémentation par des appels à Supabase sans toucher au reste de
 * l'application (voir src/utils/README ou le contexte AppContext).
 */

const PREFIX = 'alsh_';

export const STORAGE_KEYS = {
  activities: `${PREFIX}activities`,
  days: `${PREFIX}days`,
  weeks: `${PREFIX}weeks`,
  projects: `${PREFIX}projects`,
};

function isAvailable() {
  try {
    const k = '__alsh_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch (e) {
    return false;
  }
}

export function getCollection(key) {
  if (!isAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erreur de lecture du stockage', key, e);
    return [];
  }
}

export function saveCollection(key, value) {
  if (!isAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Erreur d\'écriture du stockage', key, e);
  }
}

/**
 * Petit adaptateur "base de données" prêt à être branché sur Supabase.
 * Aujourd'hui synchrone (localStorage) mais renvoie des Promises pour que la
 * migration vers une vraie API asynchrone soit transparente côté appelant.
 */
export const db = {
  async list(key) {
    return getCollection(key);
  },
  async replaceAll(key, items) {
    saveCollection(key, items);
    return items;
  },
};
