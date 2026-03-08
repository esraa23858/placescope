/**
 * التوصية النهائية وأفضل وقت للزيارة
 */
export default function Recommendation({ recommendation, bestTimeToVisit }) {
  const hasRec = recommendation != null && String(recommendation).trim();
  const hasTime = bestTimeToVisit != null && String(bestTimeToVisit).trim();
  if (!hasRec && !hasTime) return null;

  return (
    <div className="bg-slate-800/90 p-6 rounded-2xl mb-5 border border-slate-600/50 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">✅</span>
        التوصية النهائية وأنسب وقت لزيارة المكان
      </h2>
      <div className="space-y-4">
        {hasRec && (
          <div className="p-4 rounded-xl bg-slate-700/40 border border-emerald-500/20">
            <h3 className="text-emerald-400 font-semibold mb-2">التوصية النهائية</h3>
            <p className="text-slate-200 leading-relaxed">{recommendation}</p>
          </div>
        )}
        {hasTime && (
          <div className="p-4 rounded-xl bg-slate-700/40 border border-amber-500/20">
            <h3 className="text-amber-400 font-semibold mb-2">أنسب وقت لزيارة المكان</h3>
            <p className="text-slate-200">{bestTimeToVisit}</p>
          </div>
        )}
      </div>
    </div>
  );
}
