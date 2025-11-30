// src/components/TaskItem.jsx

function formatDateTime(dtString) {
  if (!dtString) return '—';
  const dt = new Date(dtString);
  return dt.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function priorityColor(priority) {
  switch (priority) {
    case 'high':
      return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
    case 'low':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/35';
    default:
      return 'bg-amber-500/10 text-amber-300 border-amber-500/35';
  }
}

export default function TaskItem({ task, onToggleStatus, onDelete }) {
  const isDone = task.status === 'done';

  return (
    <li
      className={[
        'group flex items-start justify-between gap-3 rounded-xl border px-3 py-3',
        'bg-slate-950/40 border-slate-800 hover:border-slate-600 transition-colors'
      ].join(' ')}
    >
      <div className="flex gap-3 flex-1">
        <button
          type="button"
          onClick={() => onToggleStatus(task)}
          className={[
            'mt-1 w-5 h-5 rounded-full flex items-center justify-center border text-xs',
            isDone
              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
              : 'border-slate-500 text-slate-400 hover:border-slate-300'
          ].join(' ')}
        >
          {isDone ? '✓' : ''}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p
                className={[
                  'text-sm font-medium',
                  isDone ? 'line-through text-slate-500' : 'text-slate-100'
                ].join(' ')}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-slate-400">
                  {task.description}
                </p>
              )}
            </div>

            <span
              className={[
                'text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide',
                'shrink-0',
                priorityColor(task.priority)
              ].join(' ')}
            >
              {task.priority}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <span>
              <span className="text-slate-500">Due:</span>{' '}
              {formatDateTime(task.dueDate)}
            </span>
            <span>
              <span className="text-slate-500">Reminder:</span>{' '}
              {formatDateTime(task.reminderAt)}
            </span>
            {task.tags && task.tags.length > 0 && (
              <span className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(task)}
        className="text-xs text-slate-500 hover:text-rose-400 ml-2"
      >
        ✕
      </button>
    </li>
  );
}
