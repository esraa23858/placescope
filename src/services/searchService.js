const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * البحث عن مكان وتحليله عبر API (Google Places + Gemini)
 * @param {string} query - اسم المكان
 * @param {string} lang - لغة النتائج: "ar" | "en"
 */
export async function searchPlace(query, lang = "ar") {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, lang }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.error || data.details || `خطأ في الخادم (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
