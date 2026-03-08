/**
 * ثالثاً: التحليل التفصيلي — قائمة الإيجابيات (Pros) والسلبيات (Cons) مع شرح لكل نقطة
 */
export default function ProsAndCons({ analysis }) {
  if (!analysis) return null;

  const pros = analysis.pros || [];
  const cons = analysis.cons || [];

  const getPoint = (item) => {
    if (typeof item === "string") return { point: item, explanation: "" };
    if (item && typeof item === "object")
      return {
        point: item.point ?? item.title ?? item.name ?? "",
        explanation: item.explanation ?? item.desc ?? item.description ?? "",
      };
    return { point: String(item), explanation: "" };
  };

  return (
    <div className="bg-slate-800/90 p-6 rounded-2xl mb-5 border border-slate-600/50 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📌</span>
        ثالثاً: التحليل التفصيلي <span className="text-slate-400 font-normal text-sm">(من تحليل المراجعات عبر API)</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قائمة الإيجابيات (Pros) مع شرح لكل نقطة */}
        <div className="bg-slate-700/40 rounded-xl p-4 border border-green-500/20">
          <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <span>✓</span>
            قائمة الإيجابيات (Pros)
          </h3>
          {pros.length ? (
            <ul className="space-y-3">
              {pros.map((p, i) => {
                const { point, explanation } = getPoint(p);
                if (!point && !explanation) return null;
                return (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-400 shrink-0 mt-0.5">•</span>
                    <div>
                      <span className="font-semibold text-slate-200">{point}</span>
                      {explanation && (
                        <p className="text-slate-400 text-sm mt-0.5">{explanation}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500">— لا توجد إيجابيات مسجلة</p>
          )}
        </div>

        {/* قائمة السلبيات (Cons) مع شرح لكل نقطة */}
        <div className="bg-slate-700/40 rounded-xl p-4 border border-red-500/20">
          <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
            <span>✗</span>
            قائمة السلبيات (Cons)
          </h3>
          {cons.length ? (
            <ul className="space-y-3">
              {cons.map((c, i) => {
                const { point, explanation } = getPoint(c);
                if (!point && !explanation) return null;
                return (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-400 shrink-0 mt-0.5">•</span>
                    <div>
                      <span className="font-semibold text-slate-200">{point}</span>
                      {explanation && (
                        <p className="text-slate-400 text-sm mt-0.5">{explanation}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500">— لا توجد سلبيات مسجلة</p>
          )}
        </div>
      </div>
    </div>
  );
}
