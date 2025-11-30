// src/components/TaskList.jsx
import { formatDateTime } from "../lib/dates";

function priorityClasses(priority) {
  switch (priority) {
    case "high":
      return "bg-rose-500/20 text-rose-200 border-rose-400/60";
    case "low":
      return "bg-sky-500/20 text-sky-200 border-sky-400/60";
    default:
      return "bg-amber-500/20 text-amber-200 border-amber-400/60";
  }
}

function TaskItem({ task, onToggleStatus, onDelete, onEdit }) {
  const isDone = task.status === "done";

  return (
    <li className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleStatus(task)}
              className={[
                "h-4 w-4 rounded-full border transition-colors",
                isDone
                  ? "border-teal-400 bg-teal-500"
                  : "border-slate-500 bg-slate-900"
              ].join(" ")}
              aria-label={isDone ? "Mark as pending" : "Mark as done"}
            />
            <h3
              className={[
                "text-sm font-semibold",
                isDone ? "text-slate-400 line-through" : "text-slate-50"
              ].join(" ")}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-slate-400">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span
              className={[
                "inline-flex items-center rounded-full border px-2 py-0.5",
                priorityClasses(task.priority)
              ].join(" ")}
            >
              {task.priority}
            </span>

            {task.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-2 space-y-1 text-[11px] text-slate-400">
            {task.dueDate && (
              <p>Due: {formatDateTime(task.dueDate)}</p>
            )}
            {task.reminderAt && (
              <p>Reminder: {formatDateTime(task.reminderAt)}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-full border border-slate-700 px-2 py-1 text-slate-300 hover:border-slate-500 hover:text-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-full border border-rose-600/70 px-2 py-1 text-rose-300 hover:bg-rose-600/20"
          >
            Delete
          </button>
          <span
            className={[
              "mt-1 inline-flex justify-center rounded-full px-2 py-0.5 text-[10px]",
              isDone
                ? "bg-teal-500/20 text-teal-200"
                : "bg-slate-800 text-slate-300"
            ].join(" ")}
          >
            {isDone ? "Done" : "Pending"}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function TaskList({
  tasks,
  onToggleStatus,
  onDelete,
  onEdit,
  activeFilter
}) {
  if (!tasks.length) {
    let label = "tasks";
    if (activeFilter === "today") label = "today";
    else if (activeFilter === "overdue") label = "overdue";
    else if (activeFilter === "upcoming") label = "next 7 days";

    return (
      <div className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
        No {label} yet. Add something above to get started.
      </div>
    );
  }

  return (
    <ul className="mt-2 space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
