// src/components/TaskSummary.jsx
export default function TaskSummary({ pending, done }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
        Today&apos;s focus
      </h2>
      <p className="mt-1 text-lg font-semibold text-slate-50">
        {pending} pending · {done} done
      </p>
    </section>
  );
}
