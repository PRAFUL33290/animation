import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarRange, Wand2, Save, Printer, FileDown, Trash2, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { WEEK_DAYS, WEEK_SLOTS } from '../data/timeSlots.js';
import { THEMES, AGE_RANGES } from '../data/themes.js';
import { generateWeek } from '../utils/generator.js';
import { downloadText, weekToText, printPage } from '../utils/export.js';

function emptyWeek() {
  return {
    id: null,
    theme: '',
    themeLabel: '',
    ageRange: '6-11',
    days: WEEK_DAYS.map((d) => ({ ...d, slots: {} })),
  };
}

export default function WeekPlanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWeek, saveWeek, deleteWeek } = useApp();
  const [week, setWeek] = useState(emptyWeek);
  const [theme, setTheme] = useState('coachella');
  const [ageRange, setAgeRange] = useState('6-11');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = getWeek(id);
      if (existing) {
        setWeek(existing);
        setTheme(existing.theme || '');
        setAgeRange(existing.ageRange || '6-11');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGenerate = async () => {
    setLoading(true);
    const generated = await generateWeek({ theme, ageRange });
    setWeek((w) => ({ ...w, ...generated, id: w.id }));
    setLoading(false);
  };

  const setSlot = (dayId, slotId, patch) => {
    setWeek((w) => ({
      ...w,
      days: w.days.map((d) =>
        d.id !== dayId
          ? d
          : {
              ...d,
              slots: {
                ...d.slots,
                [slotId]: { title: '', notes: '', ...d.slots[slotId], ...patch },
              },
            }
      ),
    }));
  };

  const handleSave = () => {
    saveWeek({ ...week, theme, ageRange });
    alert('Semaine enregistrée ✅');
    navigate('/semaine');
  };

  const handleDelete = () => {
    if (week.id && confirm('Supprimer cette semaine ?')) {
      deleteWeek(week.id);
      navigate('/semaine');
      setWeek(emptyWeek());
    }
  };

  const handleExport = () =>
    downloadText(`semaine-${week.themeLabel || theme || 'sans-titre'}.txt`, weekToText(week));

  const slotValue = (day, slotId, field) => {
    const s = day.slots?.[slotId];
    if (!s) return '';
    if (field === 'materials') return Array.isArray(s.materials) ? s.materials.join(', ') : s.materials || '';
    return s[field] || '';
  };

  return (
    <div>
      <PageHeader
        title="Planning semaine"
        subtitle="Générez une semaine à thème du lundi au vendredi, puis ajustez-la."
        icon={CalendarRange}
        actions={
          <>
            <button className="btn-secondary no-print" onClick={handleExport}>
              <FileDown size={16} /> Export texte
            </button>
            <button className="btn-secondary no-print" onClick={printPage}>
              <Printer size={16} /> Imprimer
            </button>
            {week.id && (
              <button className="btn-ghost no-print text-red-600" onClick={handleDelete}>
                <Trash2 size={16} /> Supprimer
              </button>
            )}
            <button className="btn-primary no-print" onClick={handleSave}>
              <Save size={16} /> Enregistrer
            </button>
          </>
        }
      />

      {/* Générateur de semaine */}
      <div className="card mb-6 flex flex-col gap-4 sm:flex-row sm:items-end no-print">
        <div className="flex-1">
          <label className="label">Thème de la semaine</label>
          <select className="input" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">— Sans thème —</option>
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="label">Tranche d'âge</label>
          <select className="input" value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
            {AGE_RANGES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          Générer la semaine
        </button>
      </div>

      {week.themeLabel && (
        <div className="mb-4 text-sm text-slate-500">
          Thème : <strong className="text-primary-700">{week.themeLabel}</strong>
        </div>
      )}

      {/* Grille des jours */}
      <div className="grid gap-4 lg:grid-cols-5 print-area">
        {week.days.map((day) => (
          <div key={day.id} className="card flex flex-col">
            <div className="mb-3 border-b border-slate-100 pb-2">
              <div className="font-extrabold text-ink">{day.label}</div>
              <div className="text-xs font-semibold text-primary">{day.phase}</div>
            </div>

            <div className="space-y-3">
              {WEEK_SLOTS.map((slot) => (
                <div key={slot.id}>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {slot.time} · {slot.label}
                  </div>
                  <input
                    className="input !py-2 text-sm"
                    placeholder="Activité…"
                    value={slotValue(day, slot.id, 'title')}
                    onChange={(e) => setSlot(day.id, slot.id, { title: e.target.value })}
                  />
                  <input
                    className="input mt-1 !py-1.5 text-xs"
                    placeholder="Matériel / notes"
                    value={slotValue(day, slot.id, 'materials') || slotValue(day, slot.id, 'notes')}
                    onChange={(e) => setSlot(day.id, slot.id, { materials: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
