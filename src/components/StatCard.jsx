export default function StatCard({ icon: Icon, label, value, color = '#7C3AED' }) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${color}1A`, color }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="text-2xl font-extrabold leading-none text-ink">{value}</div>
        <div className="mt-1 text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}
