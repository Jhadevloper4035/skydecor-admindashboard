

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(`http://localhost:8000${url}`,
    {
      credentials: "include",
      ...options,
    });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json();
};