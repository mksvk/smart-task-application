// src/components/TaskForm.jsx
import { useEffect, useState } from "react";

function toInputValue(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function TaskForm({
  onCreate,
  onUpdate,
  editingTask,
  onCancelEdit
}) {
  const isEditing = Boolean(editingTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
      setStatus(editingTask.status || "pending");
      setDueDate(toInputValue(editingTask.dueDate));
      setReminderAt(toInputValue(editingTask.reminderAt));
      setTagsText((editingTask.tags || []).join(", "));
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate("");
      setReminderAt("");
      setTagsText("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      tags,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null
    };

    if (isEditing) {
      await onUpdate(editingTask._id, payload);
    } else {
      await onCreate(payload);
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-50">
          {isEditing ? "Edit task" : "Quick add"}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel edit
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
            placeholder="Task title (e.g. Pay electricity bill)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="w-32 rounded-xl border border-slate-700 bg-slate-900/60 px-2 py-2 text-sm text-slate-50 focus:border-teal-400 focus:outline-none"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low 🔅</option>
            <option value="medium">Medium ⚖️</option>
            <option value="high">High 🔥</option>
          </select>
        </div>

        <textarea
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
          rows={2}
          placeholder="Short note (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Due date</label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-2 py-2 text-xs text-slate-50 focus:border-teal-400 focus:outline-none"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Reminder at</label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-2 py-2 text-xs text-slate-50 focus:border-teal-400 focus:outline-none"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Tags (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-2 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
              placeholder="home, finance"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Status:</span>
            <select
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs text-slate-50 focus:border-teal-400 focus:outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {isEditing ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </section>
  );
}
