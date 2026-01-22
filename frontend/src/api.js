export const API_BASE = "http://localhost:5000/api";

export async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/csrf-token`, { credentials: "include" });
  const data = await res.json();
  return data.csrfToken;
}

export async function apiFetch(path, { method = "GET", body, csrfToken } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
