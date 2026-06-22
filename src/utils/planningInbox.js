/**
 * Petit "panier" temporaire pour transférer une activité depuis le générateur
 * (ou la bibliothèque) vers le planning journée. Utilise sessionStorage pour
 * survivre à la navigation sans polluer le stockage persistant.
 */
const KEY = 'alsh_planning_inbox';

export function pushToInbox(activity) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(activity));
  } catch (e) {
    /* ignore */
  }
}

export function popFromInbox() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
