const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
  return data;
}

export const api = {
  health: () => request("/health/"),
  cities: () => request("/cities/"),
  areas: (city = "") => request(`/areas/${city ? `?city=${encodeURIComponent(city)}` : ""}`),
  cases: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/cases/${query ? `?${query}` : ""}`);
  },
  statistics: () => request("/statistics/"),
  caseDetail: (id) => request(`/cases/${encodeURIComponent(id)}/`),
  login: (email, password) => request("/login/", { method: "POST", body: JSON.stringify({ email, password }) }),
  submitReport: (formData) => request("/reports/", { method: "POST", body: formData }),
};

export default api;
