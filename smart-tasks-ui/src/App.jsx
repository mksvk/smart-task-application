// src/App.jsx
import { useEffect, useState } from "react";
import {
  fetchTasks,
  fetchTodayTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api";
import TaskSummary from "./components/TaskSummary";
import FilterTabs from "./components/FilterTabs";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function useTasks() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [todaySummary, setTodaySummary] = useState({ pending: 0, done: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async (currentFilter = filter) => {
    try {
      setLoading(true);
      setError("");

      // Main list based on active filter
      const [list, todayList] = await Promise.all([
        fetchTasks(currentFilter),
        fetchTodayTasks()
      ]);

      setTasks(list);

      const pending = todayList.filter((t) => t.status === "pending").length;
      const done = todayList.filter((t) => t.status === "done").length;
      setTodaySummary({ pending, done });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const refresh = () => loadData(filter);

  return {
    filter,
    setFilter,
    tasks,
    todaySummary,
    loading,
    error,
    refresh,
    setTasks // if needed later
  };
}

export default function App() {
  const {
    filter,
    setFilter,
    tasks,
    todaySummary,
    loading,
    error,
    refresh
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);
  const [busy, setBusy] = useState(false); // create/update/delete in progress

  const handleCreate = async (payload) => {
    try {
      setBusy(true);
      await createTask(payload);
      setEditingTask(null);
      await refresh();
    } catch (err) {
      alert(err.message || "Failed to create task");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      setBusy(true);
      await updateTask(id, payload);
      setEditingTask(null);
      await refresh();
    } catch (err) {
      alert(err.message || "Failed to update task");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "done" ? "pending" : "done";
    await handleUpdate(task._id, { status: nextStatus });
  };

  const handleDelete = async (task) => {
    const ok = window.confirm(`Delete "${task.title}"?`);
    if (!ok) return;

    try {
      setBusy(true);
      await deleteTask(task._id);
      await refresh();
    } catch (err) {
      alert(err.message || "Failed to delete task");
    } finally {
      setBusy(false);
    }
  };

  const handleEditRequest = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Smart Tasks + Reminders
            </h1>
            <p className="text-sm text-slate-400">
              Keep your day tight. One screen, all your priorities.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <div>
               <span className="font-mono">M K S V Krishna Reddy</span>
            </div>
            {(loading || busy) && (
              <div className="mt-1 text-teal-300">
                {loading ? "Syncing tasks…" : "Saving…"}
              </div>
            )}
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="rounded-xl border border-rose-600/70 bg-rose-950/70 px-4 py-2 text-sm text-rose-100">
            {error}
          </div>
        )}

        {/* Today's focus */}
        <TaskSummary
          pending={todaySummary.pending}
          done={todaySummary.done}
        />

        {/* Create / edit */}
        <TaskForm
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        {/* Filters */}
        <FilterTabs active={filter} onChange={setFilter} />

        {/* List */}
        <TaskList
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          onEdit={handleEditRequest}
          activeFilter={filter}
        />
      </div>
    </div>
  );
}
