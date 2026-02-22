/**
 * تحليل الأسعار (من تحليل AI للمراجعات)
 */
export default function PriceAnalysis({ price }) {
  if (!price) return null;

  const isObject = typeof price === "object" && price !== null;

  if (isObject) {
    const { averageCost, comparison, worthIt } = price;
    return (
      <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-3">💰 تحليل الأسعار</h2>
        <ul className="text-slate-300 space-y-2">
          {averageCost && <li><strong>متوسط التكلفة:</strong> {averageCost}</li>}
          {comparison && <li><strong>مقارنة بالمنطقة:</strong> {comparison}</li>}
          {worthIt && <li><strong>هل يستحق السعر؟</strong> {worthIt}</li>}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2">💰 تحليل الأسعار</h2>
      <p className="text-slate-300">{String(price)}</p>
    </div>
  );
}
