/**
 * قائمة المراجعات (من Google Places API)
 */
export default function ReviewsList({ reviews }) {
  if (!reviews || !reviews.length) return null;

  return (
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-3">💬 المراجعات</h2>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-sm"
          >
            {r.rating != null && (
              <span className="text-amber-400 mr-2">⭐ {r.rating}</span>
            )}
            <p className="mt-1">{r.text || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
