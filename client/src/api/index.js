import api from "./axios";

// ── Auth ────────────────────────────────────────────────────────────
export const authApi = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    getMe: () => api.get("/auth/me"),
    refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
};

// ── Tasks ───────────────────────────────────────────────────────────
export const taskApi = {
    list: (params) => api.get("/tasks", { params }),
    listAll: (params) => api.get("/tasks/all", { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post("/tasks", data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
};

// ── Users (admin) ───────────────────────────────────────────────────
export const userApi = {
    list: (params) => api.get("/users", { params }),
    delete: (id) => api.delete(`/users/${id}`),
};
