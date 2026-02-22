/**
 * الأطباق المشهورة وتقييم كل طبق (من تحليل AI للمراجعات)
 */
export default function PopularDishes({ dishes }) {
  if (!dishes || !dishes.length) return null;

  return (
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-3">🍽️ أطباق مشهورة</h2>
      <ul className="space-y-2">
        {dishes.map((d, i) => (
          <li key={i} className="text-slate-300 flex justify-between items-start gap-2">
            <span>{typeof d === "object" ? d.name : d}</span>
            {typeof d === "object" && d.rating && (
              <span className="text-amber-400 text-sm shrink-0">{d.rating}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
