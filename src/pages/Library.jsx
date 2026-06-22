import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library as LibraryIcon, Search, Pencil, Trash2, CalendarPlus, Eye, Inbox } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import ActivityDetail from '../components/ActivityDetail.jsx';
import Badge, { DifficultyBadge } from '../components/Badge.jsx';
import { useApp } from '../context/AppContext.jsx';
import {
  THEMES,
  AGE_RANGES,
  ACTIVITY_TYPES,
  LOCATIONS,
  DIFFICULTIES,
  DURATIONS,
  findLabel,
} from '../data/themes.js';
import { pushToInbox } from '../utils/planningInbox.js';

const ALL = '';

export default function Library() {
  const navigate = useNavigate();
  const { activities, deleteActivity } = useApp();
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState({
    theme: ALL,
    ageRange: ALL,
    type: ALL,
    duration: ALL,
    location: ALL,
    difficulty: ALL,
  });
  const [preview, setPreview] = useState(null);

  const setF = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (q && !`${a.title} ${a.objectives || a.objective || ''}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (filters.theme && a.theme !== filters.theme) return false;
      if (filters.ageRange && a.ageRange !== filters.ageRange) return false;
      if (filters.type && (a.type || a.category) !== filters.type) return false;
      if (filters.location && a.location !== filters.location) return false;
      if (filters.difficulty && a.difficulty !== filters.difficulty) return false;
      if (filters.duration && Number(a.duration) !== Number(filters.duration)) return false;
      return true;
    });
  }, [activities, q, filters]);

  const handleDelete = (a) => {
    if (confirm(`Supprimer « ${a.title} » ?`)) deleteActivity(a.id);
  };

  const handleAddToPlanning = (a) => {
    pushToInbox(a);
    navigate('/journee');
  };

  return (
    <div>
      <PageHeader
        title="Bibliothèque d'activités"
        subtitle={`${activities.length} activité(s) sauvegardée(s)`}
        icon={LibraryIcon}
      />

      {/* Filtres */}
      <div className="card mb-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Rechercher une activité…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect label="Thème" value={filters.theme} onChange={(v) => setF('theme', v)} options={THEMES} />
          <FilterSelect label="Âge" value={filters.ageRange} onChange={(v) => setF('ageRange', v)} options={AGE_RANGES} />
          <FilterSelect label="Type" value={filters.type} onChange={(v) => setF('type', v)} options={ACTIVITY_TYPES} />
          <FilterSelect label="Durée" value={filters.duration} onChange={(v) => setF('duration', v)} options={DURATIONS} />
          <FilterSelect label="Lieu" value={filters.location} onChange={(v) => setF('location', v)} options={LOCATIONS} />
          <FilterSelect label="Difficulté" value={filters.difficulty} onChange={(v) => setF('difficulty', v)} options={DIFFICULTIES} />
        </div>
      </div>

      {/* Liste */}
      {activities.length === 0 ? (
        <EmptyState onGo={() => navigate('/generateur')} />
      ) : filtered.length === 0 ? (
        <p className="card text-center text-slate-500">Aucune activité ne correspond à ces filtres.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => {
            const type = ACTIVITY_TYPES.find((t) => t.id === (a.type || a.category));
            return (
              <div key={a.id} className="card flex flex-col">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h4 className="font-bold leading-tight text-ink">{a.title}</h4>
                  {type && <span className="text-xl">{type.emoji}</span>}
                </div>
                <p className="mb-3 text-sm text-slate-600 line-clamp-2">{a.objectives || a.objective}</p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {a.theme && <Badge tone="blue">{findLabel(THEMES, a.theme, a.theme)}</Badge>}
                  {a.ageRange && <Badge tone="primary">{a.ageRange} ans</Badge>}
                  {a.duration && <Badge tone="gray">{a.duration} min</Badge>}
                  <DifficultyBadge value={a.difficulty} />
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                  <button className="btn-secondary !py-2 text-xs" onClick={() => setPreview(a)}>
                    <Eye size={14} /> Fiche
                  </button>
                  <button className="btn-secondary !py-2 text-xs" onClick={() => navigate(`/activite/${a.id}`)}>
                    <Pencil size={14} /> Modifier
                  </button>
                  <button className="btn-blue !py-2 text-xs" onClick={() => handleAddToPlanning(a)}>
                    <CalendarPlus size={14} /> Planning
                  </button>
                  <button className="btn-ghost !py-2 text-xs text-red-600" onClick={() => handleDelete(a)}>
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title}
        size="lg"
        footer={
          <button className="btn-primary" onClick={() => navigate(`/activite/${preview.id}`)}>
            <Pencil size={15} /> Modifier la fiche
          </button>
        }
      >
        <ActivityDetail activity={preview} />
      </Modal>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="label !mb-1 !text-xs">{label}</label>
      <select className="input !py-2" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Tous</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({ onGo }) {
  return (
    <div className="card flex flex-col items-center justify-center py-12 text-center text-slate-500">
      <Inbox size={40} className="mb-3 text-primary-300" />
      <p className="font-semibold text-slate-600">Votre bibliothèque est vide</p>
      <p className="mb-4 text-sm">Sauvegardez des activités depuis le générateur pour les retrouver ici.</p>
      <button className="btn-primary" onClick={onGo}>
        Générer des idées
      </button>
    </div>
  );
}
