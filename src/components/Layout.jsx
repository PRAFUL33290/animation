import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  CalendarRange,
  Library,
  FolderKanban,
  Menu,
  X,
} from 'lucide-react';

const NAV = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/generateur', label: "Générateur d'idées", icon: Sparkles },
  { to: '/journee', label: 'Planning journée', icon: CalendarDays },
  { to: '/semaine', label: 'Planning semaine', icon: CalendarRange },
  { to: '/bibliotheque', label: "Bibliothèque", icon: Library },
  { to: '/projets', label: 'Mes projets', icon: FolderKanban },
];

function NavItem({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
          isActive
            ? 'bg-primary text-white shadow-card'
            : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg">
        🎨
      </span>
      <span className="text-base font-extrabold leading-tight text-ink">
        Assistant ALSH<span className="block text-xs font-semibold text-primary">Créatif</span>
      </span>
    </Link>
  );
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar bureau */}
      <aside className="no-print fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        <div className="px-1">
          <Brand />
        </div>
        <nav className="mt-8 flex flex-col gap-1.5">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-primary-50 p-3 text-xs text-primary-700">
          💡 Astuce : sauvegardez vos meilleures activités pour les retrouver dans la bibliothèque.
        </div>
      </aside>

      {/* Barre mobile */}
      <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button onClick={() => setOpen(true)} className="btn-ghost !p-2" aria-label="Menu">
          <Menu size={22} />
        </button>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={() => setOpen(false)} className="btn-ghost !p-2" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1.5">
              {NAV.map((item) => (
                <NavItem key={item.to} item={item} onClick={() => setOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Contenu */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
