/**
 * Utilitaires d'export : impression, export texte (.txt) et export
 * spécifique journée / semaine.
 */
import { DAY_SLOTS, WEEK_SLOTS } from '../data/timeSlots.js';

export function printPage() {
  window.print();
}

export function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function line(char = '─', n = 48) {
  return char.repeat(n);
}

export function activityToText(a) {
  const lines = [];
  lines.push(`FICHE ACTIVITÉ : ${a.title || 'Sans titre'}`);
  lines.push(line());
  if (a.type) lines.push(`Type : ${a.type}`);
  if (a.themeLabel || a.theme) lines.push(`Thème : ${a.themeLabel || a.theme}`);
  if (a.ageRange) lines.push(`Âge conseillé : ${a.ageRange} ans`);
  if (a.childrenCount) lines.push(`Nombre d'enfants : ${a.childrenCount}`);
  if (a.duration) lines.push(`Durée : ${a.duration} min`);
  if (a.difficulty) lines.push(`Difficulté : ${a.difficulty}`);
  if (a.location) lines.push(`Lieu : ${a.location}`);
  lines.push('');
  if (a.objectives || a.objective) {
    lines.push('OBJECTIFS PÉDAGOGIQUES');
    lines.push(a.objectives || a.objective);
    lines.push('');
  }
  if (a.materials && a.materials.length) {
    lines.push('MATÉRIEL');
    a.materials.forEach((m) => lines.push(`  - ${m}`));
    lines.push('');
  }
  if (a.preparation) {
    lines.push('PRÉPARATION');
    lines.push(a.preparation);
    lines.push('');
  }
  if (a.steps && a.steps.length) {
    lines.push('DÉROULEMENT');
    a.steps.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
    lines.push('');
  }
  if (a.variant) {
    lines.push('VARIANTE');
    lines.push(a.variant);
    lines.push('');
  }
  if (a.safety) {
    lines.push('SÉCURITÉ / VIGILANCE');
    lines.push(a.safety);
    lines.push('');
  }
  if (a.feedback) {
    lines.push('RETOUR ANIMATEUR');
    lines.push(a.feedback);
    lines.push('');
  }
  if (a.note) {
    lines.push('NOTE PERSONNELLE');
    lines.push(a.note);
  }
  return lines.join('\n');
}

export function dayToText(day) {
  const lines = [];
  lines.push(`PLANNING JOURNÉE : ${day.title || day.date || ''}`.trim());
  lines.push(line('═'));
  if (day.theme) lines.push(`Thème : ${day.theme}`);
  lines.push('');
  DAY_SLOTS.forEach((slot) => {
    const entry = day.slots && day.slots[slot.id];
    lines.push(`${slot.time}  |  ${slot.label}`);
    if (entry && entry.title) {
      lines.push(`   → ${entry.title}`);
      if (entry.materials) lines.push(`     Matériel : ${entry.materials}`);
      if (entry.notes) lines.push(`     Notes : ${entry.notes}`);
    }
    lines.push('');
  });
  return lines.join('\n');
}

export function weekToText(week) {
  const lines = [];
  lines.push(`PLANNING SEMAINE${week.themeLabel ? ' : ' + week.themeLabel : ''}`);
  lines.push(line('═'));
  lines.push('');
  (week.days || []).forEach((day) => {
    lines.push(`■ ${day.label.toUpperCase()} — ${day.phase}`);
    WEEK_SLOTS.forEach((slot) => {
      const entry = day.slots && day.slots[slot.id];
      const title = entry && entry.title ? entry.title : '—';
      lines.push(`   ${slot.time}  ${slot.label} : ${title}`);
      if (entry && entry.materials && entry.materials.length) {
        const mats = Array.isArray(entry.materials)
          ? entry.materials.join(', ')
          : entry.materials;
        lines.push(`        Matériel : ${mats}`);
      }
    });
    lines.push('');
  });
  return lines.join('\n');
}

export function monthToText(plan) {
  const lines = [];
  lines.push(`PLANNING ${(plan.label || 'MOIS').toUpperCase()}`);
  lines.push(line('═'));
  lines.push('Rappel : le thème porte uniquement sur les activités du matin.');
  lines.push('');
  (plan.weeks || []).forEach((week) => {
    lines.push(`■ ${week.label.toUpperCase()} (${week.rangeLabel})${week.theme ? ' — Thème : ' + week.theme : ''}`);
    (week.days || []).forEach((day) => {
      lines.push(`  • ${day.weekday} ${day.day} — ${day.phase}`);
      WEEK_SLOTS.forEach((slot) => {
        const entry = day.slots && day.slots[slot.id];
        const title = entry && entry.title ? entry.title : '—';
        const tag = slot.id === 'activite_matin' ? ' [thème]' : '';
        lines.push(`      ${slot.time} ${slot.label}${tag} : ${title}`);
        if (entry && entry.materials && entry.materials.length) {
          const mats = Array.isArray(entry.materials) ? entry.materials.join(', ') : entry.materials;
          lines.push(`           Matériel : ${mats}`);
        }
      });
    });
    lines.push('');
  });
  return lines.join('\n');
}

export function projectToText(p) {
  const lines = [];
  lines.push(`PROJET PÉDAGOGIQUE : ${p.name || 'Sans titre'}`);
  lines.push(line('═'));
  lines.push(`Thème : ${p.themeLabel || p.theme}`);
  lines.push(`Durée : ${p.durationLabel || p.duration}`);
  if (p.audience) lines.push(`Public : ${p.audience}`);
  lines.push(`Finalité : ${p.finalityLabel || p.finality}`);
  lines.push('');
  lines.push('RÉSUMÉ');
  lines.push(p.summary || '');
  lines.push('');
  lines.push('OBJECTIFS');
  (p.objectives || []).forEach((o) => lines.push(`  - ${o}`));
  lines.push('');
  if (p.constraints) {
    lines.push('CONTRAINTES');
    lines.push(p.constraints);
    lines.push('');
  }
  if (p.materials) {
    lines.push('MATÉRIEL DISPONIBLE');
    lines.push(p.materials);
    lines.push('');
  }
  lines.push('PLANNING');
  (p.planning || []).forEach((d) => {
    lines.push(`  ${d.day} (${d.phase})`);
    lines.push(`    ${d.focus}`);
  });
  lines.push('');
  lines.push('IDÉES D\'ACTIVITÉS');
  (p.ideaSuggestions || []).forEach((i) => lines.push(`  - ${i.title} (${i.duration} min)`));
  return lines.join('\n');
}
