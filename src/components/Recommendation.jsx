/**
 * التوصية النهائية وأفضل وقت للزيارة (من تحليل AI)
 */
export default function Recommendation({ recommendation, bestTimeToVisit }) {
  if (!recommendation && !bestTimeToVisit) return null;

  return (
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-3">✅ التوصية</h2>
      {recommendation && (
        <p className="text-slate-300 mb-2">{recommendation}</p>
      )}
      {bestTimeToVisit && (
        <p className="text-slate-300">
          <strong className="text-slate-200">أفضل وقت للزيارة:</strong> {bestTimeToVisit}
        </p>
      )}
    </div>
  );
}
