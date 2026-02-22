const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function searchPlace(query) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.error || data.details || `خطأ في الخادم (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
