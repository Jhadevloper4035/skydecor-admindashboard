
const rawApiBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

const API_BASE_URL = rawApiBase.replace(/\/$/, "");

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
    ...options,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json();
};

export const downloadExcel = async (url, filename) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
};
