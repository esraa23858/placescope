/**
 * الإيجابيات والسلبيات (من تحليل AI للمراجعات القادمة من API)
 */
export default function ProsAndCons({ analysis }) {
  if (!analysis) return null;

  const pros = analysis.pros || [];
  const cons = analysis.cons || [];

  const renderItem = (item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && (item.point || item.explanation))
      return (
        <span>
          <strong>{item.point || ""}</strong>
          {item.explanation ? ` — ${item.explanation}` : ""}
        </span>
      );
    return String(item);
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-3">التحليل التفصيلي</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-green-400 font-semibold mb-2">الإيجابيات</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            {pros.length ? pros.map((p, i) => <li key={i}>{renderItem(p)}</li>) : <li>—</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-red-400 font-semibold mb-2">السلبيات</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            {cons.length ? cons.map((c, i) => <li key={i}>{renderItem(c)}</li>) : <li>—</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
