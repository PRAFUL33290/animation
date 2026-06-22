import { Clock, Users, MapPin, Hash } from 'lucide-react';
import Badge, { DifficultyBadge } from './Badge.jsx';
import { ACTIVITY_TYPES, findLabel, LOCATIONS } from '../data/themes.js';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="mb-4">
      <h4 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-primary-700">{title}</h4>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

/** Affichage en lecture seule d'une fiche activité complète. */
export default function ActivityDetail({ activity }) {
  if (!activity) return null;
  const type = ACTIVITY_TYPES.find((t) => t.id === (activity.type || activity.category));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {type && <Badge tone="primary">{type.emoji} {type.label}</Badge>}
        {(activity.themeLabel || activity.theme) && (
          <Badge tone="blue">{activity.themeLabel || activity.theme}</Badge>
        )}
        <DifficultyBadge value={activity.difficulty} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Meta icon={Clock} label="Durée" value={activity.duration ? `${activity.duration} min` : '—'} />
        <Meta icon={Users} label="Âge" value={activity.ageRange ? `${activity.ageRange} ans` : '—'} />
        <Meta icon={Hash} label="Enfants" value={activity.childrenCount || '—'} />
        <Meta
          icon={MapPin}
          label="Lieu"
          value={findLabel(LOCATIONS, activity.location, '—')}
        />
      </div>

      <Section title="Objectifs pédagogiques">{activity.objectives || activity.objective}</Section>

      {activity.materials?.length > 0 && (
        <Section title="Matériel">
          <ul className="list-inside list-disc space-y-0.5">
            {activity.materials.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Préparation">{activity.preparation}</Section>

      {activity.steps?.length > 0 && (
        <Section title="Déroulement étape par étape">
          <ol className="list-inside list-decimal space-y-1">
            {activity.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </Section>
      )}

      <Section title="Variantes">{activity.variant}</Section>
      <Section title="Sécurité / vigilance">{activity.safety}</Section>
      <Section title="Retour animateur">{activity.feedback}</Section>
      <Section title="Note personnelle">{activity.note}</Section>
    </div>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-surface p-3">
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Icon size={13} /> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
