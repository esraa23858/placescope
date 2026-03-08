/**
 * الأطباق المشهورة وتقييم كل طبق
 */
export default function PopularDishes({ dishes }) {
  if (!dishes || !dishes.length) return null;

  const list = dishes.map((d) =>
    typeof d === "object"
      ? { name: d.name ?? d.dish ?? "", rating: d.rating ?? d.score ?? "" }
      : { name: String(d), rating: "" }
  ).filter((d) => d.name.trim());

  if (!list.length) return null;

  return (
    <div className="bg-slate-800/90 p-6 rounded-2xl mb-5 border border-slate-600/50 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🍽️</span>
        الأطباق المشهورة وتقييم كل طبق
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((d, i) => (
          <div
            key={i}
            className="flex justify-between items-center gap-3 p-3 rounded-lg bg-slate-700/40 border border-slate-600/50"
          >
            <span className="text-slate-200 font-medium">{d.name}</span>
            {d.rating && (
              <span className="text-amber-400 text-sm font-semibold shrink-0">{d.rating}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
