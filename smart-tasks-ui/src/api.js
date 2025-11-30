// src/api.js
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000").replace(
    /\/$/,
    ""
  );

async function handleResponse(res) {
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }
  return res.json();
}

// Fetch tasks based on filter
export async function fetchTasks(filter = "all", queryParams) {
  let url = `${API_BASE_URL}/api/tasks`;

  if (filter === "today") {
    url = `${API_BASE_URL}/api/tasks/filters/today`;
  } else if (filter === "overdue") {
    url = `${API_BASE_URL}/api/tasks/filters/overdue`;
  } else if (filter === "upcoming") {
    url = `${API_BASE_URL}/api/tasks/filters/upcoming`;
  } else if (filter === "custom" && queryParams) {
    const search = new URLSearchParams(queryParams).toString();
    url = `${API_BASE_URL}/api/tasks?${search}`;
  }

  const res = await fetch(url);
  return handleResponse(res);
}

// For "Today's focus" summary
export async function fetchTodayTasks() {
  const res = await fetch(`${API_BASE_URL}/api/tasks/filters/today`);
  return handleResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "DELETE"
  });
  return handleResponse(res);
}
