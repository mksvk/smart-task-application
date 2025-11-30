// src/components/FilterTabs.jsx
const FILTERS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "overdue", label: "Overdue" },
  { id: "upcoming", label: "Next 7 days" }
];

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-4 border-b border-slate-800">
      {FILTERS.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={[
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              isActive
                ? "border-teal-400 text-teal-300"
                : "border-transparent text-slate-400 hover:text-slate-100"
            ].join(" ")}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
