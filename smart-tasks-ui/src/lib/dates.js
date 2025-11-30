// src/lib/dates.js
export function formatDateTime(value) {
  if (!value) return null;
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
    