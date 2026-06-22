import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Save, Printer, FileDown, Trash2, ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import {
  THEMES,
  AGE_RANGES,
  ACTIVITY_TYPES,
  LOCATIONS,
  DIFFICULTIES,
} from '../data/themes.js';
import { downloadText, activityToText, printPage } from '../utils/export.js';

const toLines = (v) => (Array.isArray(v) ? v.join('\n') : v || '');
const fromLines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);

export default function ActivitySheet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getActivity, saveActivity, deleteActivity } = useApp();
  const [a, setA] = useState(null);

  useEffect(() => {
    const found = getActivity(id);
    if (found) {
      setA({ ...found, materialsText: toLines(found.materials), stepsText: toLines(found.steps) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!a) {
    return (
      <div className="card text-center text-slate-500">
        Activité introuvable.{' '}
        <button className="btn-ghost text-primary" onClick={() => navigate('/bibliotheque')}>
          Retour à la bibliothèque
        </button>
      </div>
    );
  }

  const set = (k, v) => setA((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    const clean = {
      ...a,
      materials: fromLines(a.materialsText),
      steps: fromLines(a.stepsText),
      objectives: a.objectives || a.objective,
    };
    delete clean.materialsText;
    delete clean.stepsText;
    saveActivity(clean);
    alert('Fiche enregistrée ✅');
    navigate('/bibliotheque');
  };

  const handleDelete = () => {
    if (confirm('Supprimer cette activité ?')) {
      deleteActivity(a.id);
      navigate('/bibliotheque');
    }
  };

  const handleExport = () =>
    downloadText(`fiche-${a.title || 'activite'}.txt`, activityToText({
      ...a,
      materials: fromLines(a.materialsText),
      steps: fromLines(a.stepsText),
    }));

  return (
    <div>
      <button className="btn-ghost mb-2 no-print" onClick={() => navigate('/bibliotheque')}>
        <ArrowLeft size={16} /> Bibliothèque
      </button>
      <PageHeader
        title="Fiche activité"
        subtitle="Modifiez tous les détails de votre activité."
        icon={FileText}
        actions={
          <>
            <button className="btn-secondary no-print" onClick={handleExport}>
              <FileDown size={16} /> Export
            </button>
            <button className="btn-secondary no-print" onClick={printPage}>
              <Printer size={16} /> Imprimer
            </button>
            <button className="btn-ghost no-print text-red-600" onClick={handleDelete}>
              <Trash2 size={16} /> Supprimer
            </button>
            <button className="btn-primary no-print" onClick={handleSave}>
              <Save size={16} /> Enregistrer
            </button>
          </>
        }
      />

      <div className="card space-y-5 print-area">
        <Field label="Titre">
          <input className="input" value={a.title || ''} onChange={(e) => set('title', e.target.value)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Type d'activité">
            <select className="input" value={a.type || a.category || ''} onChange={(e) => set('type', e.target.value)}>
              <option value="">—</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Thème">
            <select className="input" value={a.theme || ''} onChange={(e) => set('theme', e.target.value)}>
              <option value="">—</option>
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Âge conseillé">
            <select className="input" value={a.ageRange || ''} onChange={(e) => set('ageRange', e.target.value)}>
              {AGE_RANGES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Nombre d'enfants">
            <input className="input" value={a.childrenCount || ''} onChange={(e) => set('childrenCount', e.target.value)} />
          </Field>
          <Field label="Durée (min)">
            <input type="number" className="input" value={a.duration || ''} onChange={(e) => set('duration', e.target.value)} />
          </Field>
          <Field label="Lieu">
            <select className="input" value={a.location || ''} onChange={(e) => set('location', e.target.value)}>
              <option value="">—</option>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Difficulté">
            <select className="input" value={a.difficulty || ''} onChange={(e) => set('difficulty', e.target.value)}>
              <option value="">—</option>
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Objectifs pédagogiques">
          <textarea className="input min-h-[70px]" value={a.objectives || a.objective || ''} onChange={(e) => set('objectives', e.target.value)} />
        </Field>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Matériel (un par ligne)">
            <textarea className="input min-h-[120px]" value={a.materialsText} onChange={(e) => set('materialsText', e.target.value)} />
          </Field>
          <Field label="Déroulement étape par étape (une par ligne)">
            <textarea className="input min-h-[120px]" value={a.stepsText} onChange={(e) => set('stepsText', e.target.value)} />
          </Field>
        </div>

        <Field label="Préparation">
          <textarea className="input min-h-[60px]" value={a.preparation || ''} onChange={(e) => set('preparation', e.target.value)} />
        </Field>
        <Field label="Variantes">
          <textarea className="input min-h-[60px]" value={a.variant || ''} onChange={(e) => set('variant', e.target.value)} />
        </Field>
        <Field label="Sécurité / vigilance">
          <textarea className="input min-h-[60px]" value={a.safety || ''} onChange={(e) => set('safety', e.target.value)} />
        </Field>
        <Field label="Retour animateur">
          <textarea className="input min-h-[60px]" value={a.feedback || ''} onChange={(e) => set('feedback', e.target.value)} />
        </Field>
        <Field label="Note personnelle">
          <textarea className="input min-h-[60px]" value={a.note || ''} onChange={(e) => set('note', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
