/**
 * تحليل الأسعار: متوسط التكلفة، مقارنة بالمنطقة، هل يستحق السعر
 */
export default function PriceAnalysis({ price }) {
  const isObject = typeof price === "object" && price !== null;
  const priceRange = isObject ? price.priceRange : null;
  const averageCost = isObject ? price.averageCost : null;
  const comparison = isObject ? price.comparison : null;
  const worthIt = isObject ? price.worthIt : null;
  const hasAny = priceRange || averageCost || comparison || worthIt;

  const items = [
    { label: "نطاق الأسعار (حسب API)", value: priceRange, icon: "🏷️" },
    { label: "متوسط التكلفة", value: averageCost, icon: "💵" },
    { label: "مقارنة بالمنطقة", value: comparison, icon: "📊", skipDash: true },
    { label: "هل يستحق السعر؟", value: worthIt, icon: "✓" },
  ].filter((i) => i.value != null && String(i.value).trim() && (i.skipDash !== true || i.value !== "—"));

  return (
    <div className="bg-slate-800/90 p-6 rounded-2xl mb-5 border border-slate-600/50 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">💰</span>
        تحليل الأسعار <span className="text-slate-400 font-normal text-base">(بالدينار الأردني)</span>
      </h2>
      {hasAny ? (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 rounded-lg bg-slate-700/40 border border-slate-600/50"
            >
              <span className="text-slate-400 shrink-0 font-medium flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}:
              </span>
              <span className="text-slate-200">{item.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 p-3 rounded-lg bg-slate-700/30">لا تتوفر بيانات تحليل الأسعار من المراجعات.</p>
      )}
    </div>
  );
}
