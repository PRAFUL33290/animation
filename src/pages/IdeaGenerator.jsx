import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Loader2, SlidersHorizontal } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import ActivityCard from '../components/ActivityCard.jsx';
import ActivityDetail from '../components/ActivityDetail.jsx';
import Modal from '../components/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { generateIdeas } from '../utils/generator.js';
import { pushToInbox } from '../utils/planningInbox.js';
import {
  THEMES,
  AGE_RANGES,
  LOCATIONS,
  WEATHER,
  WISHED_TYPES,
  DURATIONS,
} from '../data/themes.js';

const DEFAULTS = {
  theme: '',
  ageRange: '6-11',
  childrenCount: '24',
  animators: '3',
  location: 'interieur',
  weather: 'ensoleille',
  wishedType: '',
  duration: '',
};

export default function IdeaGenerator() {
  const navigate = useNavigate();
  const { saveActivity, activities } = useApp();
  const [form, setForm] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onGenerate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    const res = await generateIdeas(form);
    setResult(res);
    setLoading(false);
  };

  const handleSave = (activity) => {
    saveActivity({ ...activity, id: undefined });
    setSavedIds((prev) => new Set(prev).add(activity.id));
  };

  const handleAddToPlanning = (activity) => {
    pushToInbox(activity);
    navigate('/journee');
  };

  const isSaved = (a) =>
    savedIds.has(a.id) || activities.some((x) => x.title === a.title && x.theme === a.theme);

  return (
    <div>
      <PageHeader
        title="Générateur d'idées"
        subtitle="Une page plus simple : 3 critères suffisent, puis l'assistant vérifie la pertinence des activités."
        icon={Sparkles}
      />

      <form onSubmit={onGenerate} className="card mb-8 space-y-5">
        <div className="rounded-2xl bg-primary-50 p-4 text-sm text-primary-800">
          <p className="font-bold">Mode simple</p>
          <p>Choisissez seulement le thème, l’âge et le lieu. Les autres réglages restent disponibles si besoin.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="label">1. Thème</label>
            <input
              className="input"
              list="idea-theme-suggestions"
              placeholder="Ex : Pirates, Océans, Cirque…"
              value={form.theme}
              onChange={(e) => update('theme', e.target.value)}
            />
            <datalist id="idea-theme-suggestions">
              {THEMES.map((t) => (
                <option key={t.id} value={t.label}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label className="label">2. Âge</label>
            <select className="input" value={form.ageRange} onChange={(e) => update('ageRange', e.target.value)}>
              {AGE_RANGES.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">3. Lieu</label>
            <select className="input" value={form.location} onChange={(e) => update('location', e.target.value)}>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn-ghost text-slate-600"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <SlidersHorizontal size={16} /> {showAdvanced ? 'Masquer les options' : 'Options avancées'}
        </button>

        {showAdvanced && (
          <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="label">Type souhaité</label>
              <select className="input" value={form.wishedType} onChange={(e) => update('wishedType', e.target.value)}>
                <option value="">Tous les types</option>
                {WISHED_TYPES.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Enfants</label>
              <input type="number" min="1" className="input" value={form.childrenCount} onChange={(e) => update('childrenCount', e.target.value)} />
            </div>
            <div>
              <label className="label">Animateurs</label>
              <input type="number" min="1" className="input" value={form.animators} onChange={(e) => update('animators', e.target.value)} />
            </div>
            <div>
              <label className="label">Durée</label>
              <select className="input" value={form.duration} onChange={(e) => update('duration', e.target.value)}>
                <option value="">Indifférente</option>
                {DURATIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Météo</label>
              <select className="input" value={form.weather} onChange={(e) => update('weather', e.target.value)}>
                {WEATHER.map((w) => <option key={w.id} value={w.id}>{w.emoji} {w.label}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {loading ? 'Vérification…' : 'Voir les activités pertinentes'}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-8">
          {result.recommended?.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
                <span className="text-xl">✅</span> Activités les plus pertinentes
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.recommended.map((idea) => (
                  <ActivityCard
                    key={idea.id}
                    activity={idea}
                    onView={setPreview}
                    onAddToPlanning={handleAddToPlanning}
                    onSave={handleSave}
                    saved={isSaved(idea)}
                  />
                ))}
              </div>
            </section>
          )}

          {result.categories.length === 0 && (
            <p className="text-center text-slate-500">
              Aucune idée ne correspond à ces critères. Essayez d'élargir le lieu ou l'âge.
            </p>
          )}
          <details className="card">
            <summary className="cursor-pointer font-bold text-ink">Voir toutes les idées par catégorie</summary>
            <div className="mt-5 space-y-8">
          {result.categories.map((cat) => (
            <section key={cat.id}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
                <span className="text-xl">{cat.emoji}</span> Toutes les idées — {cat.label}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                  {cat.ideas.length}
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.ideas.map((idea) => (
                  <ActivityCard
                    key={idea.id}
                    activity={idea}
                    onView={setPreview}
                    onAddToPlanning={handleAddToPlanning}
                    onSave={handleSave}
                    saved={isSaved(idea)}
                  />
                ))}
              </div>
            </section>
          ))}
            </div>
          </details>
        </div>
      )}

      {!result && !loading && (
        <div className="card flex flex-col items-center justify-center py-12 text-center text-slate-500">
          <Sparkles size={40} className="mb-3 text-primary-300" />
          <p className="font-semibold text-slate-600">Prêt à trouver des idées ?</p>
          <p className="text-sm">Choisissez vos critères ci-dessus puis lancez la génération.</p>
        </div>
      )}

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title}
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => handleAddToPlanning(preview)}>
              Ajouter au planning
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                handleSave(preview);
                setPreview(null);
              }}
            >
              Sauvegarder
            </button>
          </>
        }
      >
        <ActivityDetail activity={preview} />
      </Modal>
    </div>
  );
}
