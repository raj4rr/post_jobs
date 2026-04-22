const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  request,
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) })
  },
  jobs: {
    list: (query = "") => request(`/jobs${query ? `?${query}` : ""}`),
    byId: (id) => request(`/jobs/${id}`),
    create: (payload) => request("/jobs", { method: "POST", body: JSON.stringify(payload) }),
    apply: (id, payload) => request(`/jobs/${id}/apply`, { method: "POST", body: JSON.stringify(payload) }),
    save: (id) => request(`/jobs/${id}/save`, { method: "POST" }),
    saved: () => request("/jobs/saved/me")
  },
  profile: {
    getMe: () => request("/profile/me"),
    saveMe: (payload) => request("/profile/me", { method: "PUT", body: JSON.stringify(payload) }),
    seekerDashboard: () => request("/profile/dashboard/seeker"),
    posterDashboard: () => request("/profile/dashboard/poster")
  },
  admin: {
    analytics: () => request("/admin/analytics"),
    users: () => request("/admin/users"),
    moderateJob: (id, status) => request(`/admin/jobs/${id}/moderate`, { method: "PATCH", body: JSON.stringify({ status }) })
  }
};
