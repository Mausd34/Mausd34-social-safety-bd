const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const config = { credentials: "include", ...options };
  const isFormData = config.body instanceof FormData;
  const headers = new Headers(config.headers || {});

  if (!isFormData && config.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  config.headers = headers;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, config);
  } catch {
    throw new Error(`Cannot connect to Django API at ${API_BASE}. Make sure the backend is running on port 8000.`);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === "object" && data
      ? data.detail || data.message || data.error
      : null;
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return data;
}

export const api = {
  baseUrl: API_BASE,
  health: () => request("/health/"),
  cities: () => request("/cities/"),
  areas: (city = "") => request(`/areas/${city ? `?city=${encodeURIComponent(city)}` : ""}`),
  cases: ({ search = "", status = "", city = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (city) params.set("city", city);
    const query = params.toString();
    return request(`/cases/${query ? `?${query}` : ""}`);
  },
  statistics: () => request("/statistics/"),
  caseDetail: (id) => request(`/cases/${encodeURIComponent(id)}/`),
  login: (email, password) => request("/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password) => request("/register/", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  }),
  me: () => request("/me/"),
  logout: () => request("/logout/", { method: "POST" }),
  submitReport: (formData) => request("/reports/", {
    method: "POST",
    body: formData,
  }),
  adminReports: () => request("/admin/reports/"),
  updateReport: (id, status) => request(`/admin/reports/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }),
};

export default api;
