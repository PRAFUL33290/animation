import { Clock, Users, MapPin, CalendarPlus, BookmarkPlus, Eye, Check } from 'lucide-react';
import Badge, { DifficultyBadge } from './Badge.jsx';
import { ACTIVITY_TYPES, findLabel, LOCATIONS } from '../data/themes.js';

export default function ActivityCard({
  activity,
  onAddToPlanning,
  onSave,
  onView,
  saved = false,
  compact = false,
}) {
  const type = ACTIVITY_TYPES.find((t) => t.id === (activity.type || activity.category));

  return (
    <div className="card flex flex-col transition hover:shadow-card-hover">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="font-bold leading-tight text-ink">{activity.title}</h4>
        {type && (
          <span className="text-xl" title={type.label}>
            {type.emoji}
          </span>
        )}
      </div>

      <p className="mb-3 text-sm text-slate-600 line-clamp-2">
        {activity.objective || activity.objectives}
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5 text-xs text-slate-500">
        {activity.duration && (
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {activity.duration} min
          </span>
        )}
        {activity.ageRange && (
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> {activity.ageRange} ans
          </span>
        )}
        {activity.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {findLabel(LOCATIONS, activity.location, activity.location)}
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {type && <Badge tone="primary">{type.label}</Badge>}
        <DifficultyBadge value={activity.difficulty} />
      </div>

      {!compact && activity.materials?.length > 0 && (
        <div className="mb-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Matériel : </span>
          {activity.materials.slice(0, 4).join(', ')}
          {activity.materials.length > 4 && '…'}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {onView && (
          <button onClick={() => onView(activity)} className="btn-secondary flex-1 !py-2 text-xs">
            <Eye size={14} /> Fiche
          </button>
        )}
        {onAddToPlanning && (
          <button onClick={() => onAddToPlanning(activity)} className="btn-blue flex-1 !py-2 text-xs">
            <CalendarPlus size={14} /> Planning
          </button>
        )}
        {onSave && (
          <button
            onClick={() => onSave(activity)}
            className={`${saved ? 'btn-green' : 'btn-primary'} flex-1 !py-2 text-xs`}
            disabled={saved}
          >
            {saved ? <Check size={14} /> : <BookmarkPlus size={14} />}
            {saved ? 'Sauvegardée' : 'Sauvegarder'}
          </button>
        )}
      </div>
    </div>
  );
}
