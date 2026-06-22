import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Save, Printer, FileDown, Trash2, Plus, Lock } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { DAY_SLOTS } from '../data/timeSlots.js';
import { downloadText, dayToText, printPage } from '../utils/export.js';
import { popFromInbox } from '../utils/planningInbox.js';

function emptyDay() {
  return { id: null, title: '', date: '', theme: '', slots: {} };
}

export default function DayPlanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDay, saveDay, deleteDay } = useApp();
  const [day, setDay] = useState(emptyDay);
  const [inboxTarget, setInboxTarget] = useState(null); // activité à placer

  // Chargement d'une journée existante.
  useEffect(() => {
    if (id) {
      const existing = getDay(id);
      if (existing) setDay(existing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Récupération d'une activité envoyée depuis le générateur / la bibliothèque.
  useEffect(() => {
    const incoming = popFromInbox();
    if (incoming) setInboxTarget(incoming);
  }, []);

  const setSlot = (slotId, patch) => {
    setDay((d) => ({
      ...d,
      slots: {
        ...d.slots,
        [slotId]: { title: '', materials: '', notes: '', ...d.slots[slotId], ...patch },
      },
    }));
  };

  const clearSlot = (slotId) => {
    setDay((d) => {
      const next = { ...d.slots };
      delete next[slotId];
      return { ...d, slots: next };
    });
  };

  const placeInbox = (slotId) => {
    if (!inboxTarget) return;
    const materials = Array.isArray(inboxTarget.materials)
      ? inboxTarget.materials.join(', ')
      : inboxTarget.materials || '';
    setSlot(slotId, { title: inboxTarget.title, materials, notes: inboxTarget.objective || '' });
    setInboxTarget(null);
  };

  const handleSave = () => {
    const toSave = { ...day, title: day.title || 'Journée sans titre' };
    saveDay(toSave);
    if (!day.id) {
      // Récupère l'id généré en relisant après save n'est pas direct ; on
      // renvoie simplement vers la liste des journées (bibliothèque/projets
      // non concernés) — ici on reste sur la page avec un état "enregistré".
    }
    setDay((d) => ({ ...d, title: toSave.title }));
    alert('Journée enregistrée ✅');
    navigate('/journee');
  };

  const handleDelete = () => {
    if (day.id && confirm('Supprimer cette journée ?')) {
      deleteDay(day.id);
      navigate('/journee');
      setDay(emptyDay());
    }
  };

  const handleExport = () => {
    downloadText(`journee-${day.title || 'sans-titre'}.txt`, dayToText(day));
  };

  return (
    <div>
      <PageHeader
        title="Planning journée"
        subtitle="Construisez votre journée autour des créneaux fixes de l'ALSH."
        icon={CalendarDays}
        actions={
          <>
            <button className="btn-secondary no-print" onClick={handleExport}>
              <FileDown size={16} /> Export texte
            </button>
            <button className="btn-secondary no-print" onClick={printPage}>
              <Printer size={16} /> Imprimer
            </button>
            {day.id && (
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

      {/* En-tête de journée */}
      <div className="card mb-6 grid gap-4 sm:grid-cols-3 print-area">
        <div>
          <label className="label">Titre de la journée</label>
          <input
            className="input"
            placeholder="Ex : Journée Océans"
            value={day.title}
            onChange={(e) => setDay((d) => ({ ...d, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={day.date}
            onChange={(e) => setDay((d) => ({ ...d, date: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Thème</label>
          <input
            className="input"
            placeholder="Ex : Océans"
            value={day.theme}
            onChange={(e) => setDay((d) => ({ ...d, theme: e.target.value }))}
          />
        </div>
      </div>

      {inboxTarget && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-800 no-print">
          <span>
            🎯 Placez « <strong>{inboxTarget.title}</strong> » dans un créneau ci-dessous (bouton{' '}
            <Plus size={12} className="inline" />).
          </span>
          <button className="btn-ghost text-primary-700" onClick={() => setInboxTarget(null)}>
            Annuler
          </button>
        </div>
      )}

      {/* Créneaux */}
      <div className="space-y-3">
        {DAY_SLOTS.map((slot) => {
          const entry = day.slots[slot.id];
          const filled = entry && (entry.title || entry.materials || entry.notes);
          return (
            <div key={slot.id} className="card print-area">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="sm:w-44 shrink-0">
                  <div className="font-bold text-primary-700">{slot.time}</div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    {slot.fixed && <Lock size={12} />} {slot.label}
                  </div>
                </div>

                <div className="flex-1">
                  {!filled ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="input"
                        placeholder="Ajouter une activité…"
                        value={entry?.title || ''}
                        onChange={(e) => setSlot(slot.id, { title: e.target.value })}
                      />
                      {inboxTarget && (
                        <button
                          className="btn-blue shrink-0 no-print"
                          onClick={() => placeInbox(slot.id)}
                          title="Placer l'activité ici"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        className="input font-semibold"
                        value={entry.title}
                        placeholder="Titre de l'activité"
                        onChange={(e) => setSlot(slot.id, { title: e.target.value })}
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          className="input"
                          placeholder="Matériel"
                          value={entry.materials || ''}
                          onChange={(e) => setSlot(slot.id, { materials: e.target.value })}
                        />
                        <input
                          className="input"
                          placeholder="Notes"
                          value={entry.notes || ''}
                          onChange={(e) => setSlot(slot.id, { notes: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2 no-print">
                        {inboxTarget && (
                          <button className="btn-blue !py-1.5 text-xs" onClick={() => placeInbox(slot.id)}>
                            <Plus size={13} /> Remplacer par l'activité
                          </button>
                        )}
                        <button
                          className="btn-ghost !py-1.5 text-xs text-red-600"
                          onClick={() => clearSlot(slot.id)}
                        >
                          <Trash2 size={13} /> Vider
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
