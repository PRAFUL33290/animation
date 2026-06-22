// Génère un identifiant unique simple (suffisant pour le localStorage).
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
