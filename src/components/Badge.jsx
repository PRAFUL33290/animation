import { DIFFICULTIES } from '../data/themes.js';

const TONE = {
  primary: 'bg-primary-100 text-primary-700',
  blue: 'bg-blue-100 text-sky',
  green: 'bg-green-100 text-grass',
  yellow: 'bg-yellow-100 text-yellow-700',
  gray: 'bg-slate-100 text-slate-600',
};

export default function Badge({ children, tone = 'gray', className = '' }) {
  return <span className={`chip ${TONE[tone] || TONE.gray} ${className}`}>{children}</span>;
}

export function DifficultyBadge({ value }) {
  const d = DIFFICULTIES.find((x) => x.id === value);
  if (!d) return null;
  const tone = { facile: 'green', moyen: 'yellow', difficile: 'gray' }[value] || 'gray';
  return (
    <Badge tone={tone}>
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
      {d.label}
    </Badge>
  );
}
