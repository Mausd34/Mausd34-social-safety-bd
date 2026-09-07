import { cities as demoCities, areas as demoAreas, cases as demoCases } from "./data";

const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const config = { credentials: "include", ...options };
  const isFormData = config.body instanceof FormData;
  const headers = new Headers(config.headers || {});
  if (!isFormData && config.body !== undefined) headers.set("Content-Type", "application/json");
  config.headers = headers;
  let response;
  try { response = await fetch(`${API_BASE}${path}`, config); }
  catch { throw new Error(`Cannot connect to Django API at ${API_BASE}. Make sure the backend is running on port 8000.`); }
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof data === "object" && data ? data.detail || data.message || data.error : null;
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return data;
}

const normalizeCities = (items) => (Array.isArray(items) ? items : []).map(c => ({
  id: c.id, name: c.name, slug: c.slug,
  reported: Number(c.reported ?? c.reported_cases ?? 0),
  investigation: Number(c.investigation ?? c.under_investigation ?? 0),
  trial: Number(c.trial ?? c.under_trial ?? 0),
  convicted: Number(c.convicted ?? 0), acquitted: Number(c.acquitted ?? 0),
}));

const demoStatistics = () => {
  const reported = demoCities.reduce((n, c) => n + c.reported, 0);
  const investigation = demoCities.reduce((n, c) => n + c.investigation, 0);
  const trial = demoCities.reduce((n, c) => n + c.trial, 0);
  const convicted = demoCities.reduce((n, c) => n + c.convicted, 0);
  const acquitted = demoCities.reduce((n, c) => n + c.acquitted, 0);
  const caseStatus = [
    { status: "ACQUITTED", count: acquitted },
    { status: "CONVICTED", count: convicted },
    { status: "INVESTIGATION", count: investigation },
    { status: "TRIAL", count: trial },
  ];
  return {
    cities: demoCities.length, reported, investigation, trial, convicted, acquitted,
    case_status: caseStatus,
    city_totals: demoCities.map(c => ({ name: c.name, slug: c.slug, reported_cases: c.reported, convicted: c.convicted })),
  };
};

export const api = {
  baseUrl: API_BASE,
  health: () => request("/health/"),
  cities: async () => {
    try { const data = normalizeCities(await request("/cities/")); return data.length ? data : demoCities; }
    catch { return demoCities; }
  },
  areas: async (city = "") => {
    try {
      const data = await request(`/areas/${city ? `?city=${encodeURIComponent(city)}` : ""}`);
      if (Array.isArray(data) && data.length) return data;
    } catch {}
    return city ? demoAreas.filter(a => a.city.toLowerCase() === city.toLowerCase()) : demoAreas;
  },
  cases: async ({ search = "", status = "", city = "" } = {}) => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (city) params.set("city", city);
      const query = params.toString();
      return await request(`/cases/${query ? `?${query}` : ""}`);
    } catch {
      return demoCases.filter(c => (!search || `${c.id} ${c.city} ${c.area}`.toLowerCase().includes(search.toLowerCase())) && (!city || c.city.toLowerCase() === city.toLowerCase()) && (!status || c.status.toUpperCase().replaceAll(" ", "_") === status));
    }
  },
  statistics: async () => {
    try { return await request("/statistics/"); }
    catch { return demoStatistics(); }
  },
  caseDetail: (id) => request(`/cases/${encodeURIComponent(id)}/`),
  login: (email, password) => request("/login/", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request("/register/", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => request("/me/"),
  logout: () => request("/logout/", { method: "POST" }),
  submitReport: (formData) => request("/reports/", { method: "POST", body: formData }),
  adminReports: () => request("/admin/reports/"),
  updateReport: (id, status) => request(`/admin/reports/${id}/`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export default api;
