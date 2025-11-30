// src/components/FiltersBar.jsx

const FILTERS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "overdue", label: "Overdue" },
  { id: "upcoming", label: "Next 7 days" },
];

export default function FiltersBar({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`rounded-full px-3 py-1 text-sm border transition
          ${
            activeFilter === f.id
              ? "bg-sky-500/90 text-white border-sky-500 shadow-sm"
              : "bg-slate-900/60 text-slate-200 border-slate-700 hover:border-slate-500"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
