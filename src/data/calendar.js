// Calendrier de juillet 2026, construit automatiquement.
// Les week-ends sont ignorés ; chaque semaine va du lundi au vendredi.
// Le 1er juillet 2026 tombe un mercredi → la 1re semaine est partielle (mer/jeu/ven).

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Progression pédagogique par jour de la semaine (lundi → vendredi).
const PHASES = [
  'Découverte du thème', // lundi
  'Création / apprentissage', // mardi
  'Défis / coopération', // mercredi
  'Préparation finale', // jeudi
  'Restitution / spectacle', // vendredi
];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function buildMonth(year, month /* 0-indexed */, monthLabel) {
  const weeks = [];
  let current = null;
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay(); // 0 dim … 6 sam
    if (dow === 0 || dow === 6) continue; // on saute le week-end

    const weekdayIndex = dow - 1; // lundi = 0 … vendredi = 4
    // Nouvelle semaine le lundi, ou au tout premier jour rencontré.
    if (weekdayIndex === 0 || !current) {
      current = { days: [] };
      weeks.push(current);
    }

    current.days.push({
      id: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      weekday: cap(WEEKDAYS[dow]),
      dateLabel: `${SHORT[dow]}. ${d}`,
      longDate: `${cap(WEEKDAYS[dow])} ${d} ${monthLabel}`,
      day: d,
      weekdayIndex,
      phase: PHASES[weekdayIndex],
    });
  }

  return weeks.map((w, i) => ({
    id: `sem-${i + 1}`,
    label: `Semaine ${i + 1}`,
    partial: w.days.length < 5,
    rangeLabel: `${w.days[0].day} → ${w.days[w.days.length - 1].day} ${monthLabel}`,
    days: w.days,
  }));
}

export const JULY_2026 = {
  id: 'juillet-2026',
  label: 'Juillet 2026',
  monthLabel: 'juillet',
  weeks: buildMonth(2026, 6, 'juillet'),
};
