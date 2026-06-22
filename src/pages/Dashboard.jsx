import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarDays,
  CalendarRange,
  Library,
  FolderKanban,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import StatCard from '../components/StatCard.jsx';

const ACTIONS = [
  {
    to: '/journee',
    title: 'Créer une journée',
    desc: 'Construire un planning journée complet avec les créneaux fixes.',
    icon: CalendarDays,
    color: '#2563EB',
  },
  {
    to: '/semaine',
    title: 'Créer une semaine',
    desc: 'Générer une semaine à thème avec une progression pédagogique.',
    icon: CalendarRange,
    color: '#22C55E',
  },
  {
    to: '/generateur',
    title: "Générateur d'idées",
    desc: "Trouver des idées d'activités adaptées à votre groupe.",
    icon: Sparkles,
    color: '#7C3AED',
  },
  {
    to: '/bibliotheque',
    title: "Bibliothèque d'activités",
    desc: 'Retrouver et gérer vos activités sauvegardées.',
    icon: Library,
    color: '#FACC15',
  },
  {
    to: '/projets',
    title: 'Mes projets',
    desc: 'Créer et consulter vos projets pédagogiques.',
    icon: FolderKanban,
    color: '#EC4899',
  },
];

export default function Dashboard() {
  const { activities, days, weeks, projects } = useApp();

  return (
    <div>
      {/* Bandeau d'accueil */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-sky p-6 text-white shadow-card sm:p-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Bonjour 👋</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Bienvenue sur votre <strong>Assistant ALSH Créatif</strong>. Trouvez des idées,
          construisez vos journées, organisez vos semaines et gardez vos meilleures animations
          au même endroit.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/generateur" className="btn bg-white text-primary-700 hover:bg-white/90">
            <Sparkles size={16} /> Générer des idées
          </Link>
          <Link to="/semaine" className="btn bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25">
            <CalendarRange size={16} /> Préparer une semaine
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <h2 className="mb-3 text-lg font-bold text-ink">En un coup d'œil</h2>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookMarked} label="Activités sauvegardées" value={activities.length} color="#7C3AED" />
        <StatCard icon={FolderKanban} label="Projets créés" value={projects.length} color="#EC4899" />
        <StatCard icon={CalendarRange} label="Semaines préparées" value={weeks.length} color="#22C55E" />
        <StatCard icon={CalendarDays} label="Journées préparées" value={days.length} color="#2563EB" />
      </div>

      {/* Accès rapides */}
      <h2 className="mb-3 text-lg font-bold text-ink">Que voulez-vous faire ?</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.to}
              to={a.to}
              className="card group flex flex-col transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: `${a.color}1A`, color: a.color }}
              >
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-ink">{a.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500">{a.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                Ouvrir <ArrowRight size={15} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
