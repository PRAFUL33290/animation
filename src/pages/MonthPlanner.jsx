import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CalendarRange,
  Wand2,
  Save,
  Printer,
  FileDown,
  Trash2,
  Loader2,
  Sparkles,
  Sun,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { JULY_2026 } from '../data/calendar.js';
import { WEEK_SLOTS } from '../data/timeSlots.js';
import { THEMES } from '../data/themes.js';
import { generateWeekDays } from '../utils/generator.js';
import { downloadText, monthToText, printPage } from '../utils/export.js';

function emptyPlan() {
  return {
    id: null,
    kind: 'month',
    label: JULY_2026.label,
    weeks: JULY_2026.weeks.map((w) => ({
      ...w,
      theme: '',
      days: w.days.map((d) => ({ ...d, slots: {} })),
    })),
  };
}

export default function MonthPlanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWeek, saveWeek, deleteWeek } = useApp();
  const [plan, setPlan] = useState(emptyPlan);
  const [loadingWeek, setLoadingWeek] = useState(null);

  useEffect(() => {
    if (id) {
      const existing = getWeek(id);
      if (existing) setPlan({ ...emptyPlan(), ...existing });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setWeekTheme = (weekId, theme) => {
    setPlan((p) => ({
      ...p,
      weeks: p.weeks.map((w) => (w.id === weekId ? { ...w, theme } : w)),
    }));
  };

  const setSlot = (weekId, dayId, slotId, patch) => {
    setPlan((p) => ({
      ...p,
      weeks: p.weeks.map((w) =>
        w.id !== weekId
          ? w
          : {
              ...w,
              days: w.days.map((d) =>
                d.id !== dayId
                  ? d
                  : {
                      ...d,
                      slots: {
                        ...d.slots,
                        [slotId]: { title: '', materials: '', notes: '', ...d.slots[slotId], ...patch },
                      },
                    }
              ),
            }
      ),
    }));
  };

  const generateForWeek = async (week) => {
    if (!week.theme.trim()) {
      alert('Renseignez d’abord un thème pour cette semaine.');
      return;
    }
    setLoadingWeek(week.id);
    const days = await generateWeekDays(week.days, week.theme);
    setPlan((p) => ({
      ...p,
      weeks: p.weeks.map((w) => (w.id === week.id ? { ...w, days } : w)),
    }));
    setLoadingWeek(null);
  };

  const generateAll = async () => {
    const withTheme = plan.weeks.filter((w) => w.theme.trim());
    if (withTheme.length === 0) {
      alert('Renseignez au moins un thème de semaine.');
      return;
    }
    setLoadingWeek('all');
    const newWeeks = await Promise.all(
      plan.weeks.map(async (w) =>
        w.theme.trim() ? { ...w, days: await generateWeekDays(w.days, w.theme) } : w
      )
    );
    setPlan((p) => ({ ...p, weeks: newWeeks }));
    setLoadingWeek(null);
  };

  const handleSave = () => {
    saveWeek(plan);
    alert('Planning de juillet enregistré ✅');
    navigate('/mois');
  };

  const handleDelete = () => {
    if (plan.id && confirm('Supprimer ce planning ?')) {
      deleteWeek(plan.id);
      navigate('/mois');
      setPlan(emptyPlan());
    }
  };

  const handleExport = () => downloadText('planning-juillet-2026.txt', monthToText(plan));

  const slotValue = (day, slotId, field) => {
    const s = day.slots?.[slotId];
    if (!s) return '';
    if (field === 'materials')
      return Array.isArray(s.materials) ? s.materials.join(', ') : s.materials || '';
    return s[field] || '';
  };

  return (
    <div>
      <PageHeader
        title="Planning Juillet 2026"
        subtitle="Un thème par semaine (saisi par l'équipe). Le thème ne porte que sur le matin."
        icon={CalendarRange}
        actions={
          <>
            <button className="btn-secondary no-print" onClick={handleExport}>
              <FileDown size={16} /> Export texte
            </button>
            <button className="btn-secondary no-print" onClick={printPage}>
              <Printer size={16} /> Imprimer
            </button>
            <button className="btn-primary no-print" onClick={generateAll} disabled={loadingWeek === 'all'}>
              {loadingWeek === 'all' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              Tout générer
            </button>
            {plan.id && (
              <button className="btn-ghost no-print text-red-600" onClick={handleDelete}>
                <Trash2 size={16} /> Supprimer
              </button>
            )}
            <button className="btn-green no-print" onClick={handleSave}>
              <Save size={16} /> Enregistrer
            </button>
          </>
        }
      />

      {/* Légende */}
      <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-slate-500 no-print">
        <span className="chip bg-primary-100 text-primary-700">
          <Sparkles size={12} /> Matin = activité à thème
        </span>
        <span className="chip bg-slate-100 text-slate-600">
          <Sun size={12} /> Après-midi & temps libres = activités libres
        </span>
      </div>

      <datalist id="theme-suggestions">
        {THEMES.map((t) => (
          <option key={t.id} value={t.label} />
        ))}
      </datalist>

      <div className="space-y-8 print-area">
        {plan.weeks.map((week) => (
          <section key={week.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-slate-100 sm:p-5">
            {/* En-tête de semaine + thème */}
            <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-ink">
                  {week.label}{' '}
                  <span className="text-sm font-semibold text-slate-400">· {week.rangeLabel}</span>
                  {week.partial && (
                    <span className="ml-2 chip bg-yellow-100 text-yellow-700">semaine partielle</span>
                  )}
                </h2>
              </div>
              <div className="flex items-end gap-2">
                <div className="w-56">
                  <label className="label !mb-1 !text-xs">Thème de la semaine (matin)</label>
                  <input
                    className="input !py-2"
                    list="theme-suggestions"
                    placeholder="Ex : Pirates, Cirque, Espace…"
                    value={week.theme}
                    onChange={(e) => setWeekTheme(week.id, e.target.value)}
                  />
                </div>
                <button
                  className="btn-primary no-print shrink-0 !py-2"
                  onClick={() => generateForWeek(week)}
                  disabled={loadingWeek === week.id}
                >
                  {loadingWeek === week.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Wand2 size={15} />
                  )}
                  Générer
                </button>
              </div>
            </div>

            {/* Jours de la semaine */}
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${week.days.length}, minmax(0, 1fr))` }}
            >
              {week.days.map((day) => (
                <div key={day.id} className="rounded-xl bg-surface p-2.5">
                  <div className="mb-2">
                    <div className="font-bold text-ink">
                      {day.weekday} {day.day}
                    </div>
                    <div className="text-[11px] font-semibold text-primary">{day.phase}</div>
                  </div>

                  <div className="space-y-2.5">
                    {WEEK_SLOTS.map((slot) => {
                      const isMorning = slot.id === 'activite_matin';
                      return (
                        <div key={slot.id}>
                          <div
                            className={`mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${
                              isMorning ? 'text-primary-700' : 'text-slate-400'
                            }`}
                          >
                            {isMorning && <Sparkles size={10} />}
                            {slot.label}
                          </div>
                          <input
                            className={`input !py-1.5 text-xs ${
                              isMorning ? 'border-primary-200 bg-primary-50/40' : ''
                            }`}
                            placeholder={isMorning ? 'Activité (thème)…' : 'Activité…'}
                            value={slotValue(day, slot.id, 'title')}
                            onChange={(e) =>
                              setSlot(week.id, day.id, slot.id, { title: e.target.value })
                            }
                          />
                          <input
                            className="input mt-1 !py-1 text-[11px]"
                            placeholder="Matériel / notes"
                            value={
                              slotValue(day, slot.id, 'materials') ||
                              slotValue(day, slot.id, 'notes')
                            }
                            onChange={(e) =>
                              setSlot(week.id, day.id, slot.id, { materials: e.target.value })
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
