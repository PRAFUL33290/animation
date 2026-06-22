import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Wand2,
  Save,
  Printer,
  FileDown,
  Trash2,
  Loader2,
  Target,
  CalendarRange,
  Lightbulb,
  Flag,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { THEMES, PROJECT_DURATIONS, PROJECT_FINALITIES } from '../data/themes.js';
import { generateProject } from '../utils/generator.js';
import { downloadText, projectToText, printPage } from '../utils/export.js';

const DEFAULTS = {
  name: '',
  theme: '',
  duration: 'semaine',
  audience: '6-11 ans',
  objectives: '',
  constraints: '',
  materials: '',
  finality: 'spectacle',
};

export default function ProjectGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, saveProject, deleteProject, getProject } = useApp();
  const [form, setForm] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const p = getProject(id);
      if (p) {
        setForm({ ...DEFAULTS, ...p, objectives: Array.isArray(p.objectives) ? p.objectives.join('\n') : p.objectives });
        setResult(p);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    const res = await generateProject(form);
    setResult({ ...res, id: result?.id || null });
    setLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    saveProject({ ...result, id: result.id || undefined });
    alert('Projet enregistré ✅');
    navigate('/projets');
  };

  const handleDelete = (pid) => {
    if (confirm('Supprimer ce projet ?')) {
      deleteProject(pid);
      if (result?.id === pid) setResult(null);
      navigate('/projets');
    }
  };

  const handleExport = () => downloadText(`projet-${result.name || 'sans-titre'}.txt`, projectToText(result));

  return (
    <div>
      <PageHeader
        title="Générateur de projet pédagogique"
        subtitle="Décrivez votre projet, l'assistant propose une trame complète."
        icon={FolderKanban}
      />

      <form onSubmit={handleGenerate} className="card mb-6 no-print">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nom du projet</label>
            <input className="input" placeholder="Ex : Une semaine à Poudlard" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Thème (saisie libre)</label>
            <input
              className="input"
              list="project-theme-suggestions"
              placeholder="Ex : Une semaine de pirates…"
              value={form.theme}
              onChange={(e) => update('theme', e.target.value)}
            />
            <datalist id="project-theme-suggestions">
              {THEMES.map((t) => (
                <option key={t.id} value={t.label}>{t.emoji} {t.label}</option>
              ))}
            </datalist>
          </div>
          <div>
            <label className="label">Durée</label>
            <select className="input" value={form.duration} onChange={(e) => update('duration', e.target.value)}>
              {PROJECT_DURATIONS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Public</label>
            <input className="input" placeholder="Ex : 24 enfants de 8-11 ans" value={form.audience} onChange={(e) => update('audience', e.target.value)} />
          </div>
          <div>
            <label className="label">Finalité souhaitée</label>
            <select className="input" value={form.finality} onChange={(e) => update('finality', e.target.value)}>
              {PROJECT_FINALITIES.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Matériel disponible</label>
            <input className="input" placeholder="Ex : peinture, cartons, enceinte…" value={form.materials} onChange={(e) => update('materials', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Objectifs pédagogiques (un par ligne, optionnel)</label>
            <textarea className="input min-h-[80px]" placeholder="Laissez vide pour des objectifs proposés automatiquement" value={form.objectives} onChange={(e) => update('objectives', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Contraintes</label>
            <textarea className="input min-h-[60px]" placeholder="Ex : pas d'accès extérieur le mardi…" value={form.constraints} onChange={(e) => update('constraints', e.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            Générer le projet
          </button>
        </div>
      </form>

      {/* Résultat */}
      {result && result.summary && (
        <div className="space-y-5 print-area">
          <div className="card" style={{ borderTop: `4px solid ${result.themeColor || '#7C3AED'}` }}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 no-print">
              <h2 className="text-xl font-extrabold text-ink">{result.name || 'Projet sans titre'}</h2>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={handleExport}>
                  <FileDown size={15} /> Export
                </button>
                <button className="btn-secondary" onClick={printPage}>
                  <Printer size={15} /> Imprimer
                </button>
                <button className="btn-primary" onClick={handleSave}>
                  <Save size={15} /> Enregistrer
                </button>
              </div>
            </div>
            <p className="text-slate-700">{result.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="chip bg-primary-100 text-primary-700">{result.themeLabel}</span>
              <span className="chip bg-blue-100 text-sky">{result.durationLabel}</span>
              <span className="chip bg-green-100 text-grass">Finalité : {result.finalityLabel}</span>
            </div>
          </div>

          <Block icon={Target} title="Objectifs">
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              {result.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </Block>

          <Block icon={CalendarRange} title="Planning proposé">
            <div className="space-y-2">
              {result.planning.map((d, i) => (
                <div key={i} className="rounded-xl bg-surface p-3">
                  <div className="text-sm font-bold text-ink">
                    {d.day} <span className="font-semibold text-primary">· {d.phase}</span>
                  </div>
                  <div className="text-sm text-slate-600">{d.focus}</div>
                  {d.afternoon && (
                    <div className="mt-0.5 text-xs italic text-slate-400">{d.afternoon}</div>
                  )}
                </div>
              ))}
            </div>
          </Block>

          <Block icon={Lightbulb} title="Idées d'activités">
            <div className="grid gap-2 sm:grid-cols-2">
              {result.ideaSuggestions.map((idea, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-surface p-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-medium text-ink">{idea.title}</span>
                    {idea.moment && (
                      <span
                        className={`ml-2 chip ${
                          idea.moment.startsWith('Matin')
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {idea.moment}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{idea.duration} min</span>
                </div>
              ))}
            </div>
          </Block>

          <Block icon={Flag} title="Finalité possible">
            <p className="text-sm text-slate-700">{result.finalityLabel}</p>
          </Block>
        </div>
      )}

      {/* Liste des projets enregistrés */}
      {projects.length > 0 && (
        <div className="mt-10 no-print">
          <h2 className="mb-3 text-lg font-bold text-ink">Mes projets enregistrés</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="card flex flex-col">
                <h4 className="font-bold text-ink">{p.name || 'Projet sans titre'}</h4>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.summary}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="chip bg-primary-100 text-primary-700">{p.themeLabel}</span>
                  <span className="chip bg-blue-100 text-sky">{p.durationLabel || p.duration}</span>
                </div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button className="btn-secondary flex-1 !py-2 text-xs" onClick={() => navigate(`/projets/${p.id}`)}>
                    Ouvrir
                  </button>
                  <button className="btn-ghost !py-2 text-xs text-red-600" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Block({ icon: Icon, title, children }) {
  return (
    <div className="card">
      <h3 className="mb-3 flex items-center gap-2 font-bold text-ink">
        <Icon size={18} className="text-primary" /> {title}
      </h3>
      {children}
    </div>
  );
}
