/**
 * عرض معلومات المكان الأساسية (كلها من Google Places API)
 */
function priceLevelLabel(level) {
  if (!level || level === "PRICE_LEVEL_UNSPECIFIED") return "—";
  const map = {
    PRICE_LEVEL_FREE: "مجاني",
    PRICE_LEVEL_INEXPENSIVE: "رخيص",
    PRICE_LEVEL_MODERATE: "متوسط",
    PRICE_LEVEL_EXPENSIVE: "غالي",
  };
  return map[level] || level;
}

function placeTypeLabel(place) {
  const type = place.primaryType || (place.types && place.types[0]);
  if (!type) return "—";
  const map = {
    restaurant: "مطعم",
    cafe: "مقهى",
    bar: "بار",
    lodging: "فندق",
    meal_takeaway: "طلب خارجي",
    meal_delivery: "توصيل",
  };
  return map[type] || type;
}

export default function PlaceInfo({ place, summary }) {
  if (!place || !place.displayName) return null;

  const name = place.displayName.text;
  const address = place.formattedAddress || "—";
  const rating = place.rating != null ? place.rating : "N/A";
  const reviewCount = place.userRatingCount ?? 0;
  const price = priceLevelLabel(place.priceLevel);
  const type = placeTypeLabel(place);

  return (
    <div className="bg-slate-800/90 p-6 rounded-2xl mb-5 border border-slate-600/50 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{name}</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-300 text-sm mb-5 pb-4 border-b border-slate-600">
        <span>📍 {address}</span>
        <span>⭐ {rating} / 5</span>
        <span>💬 {reviewCount} مراجعة</span>
        <span>💰 {price}</span>
        <span>🏷️ {type}</span>
      </div>
      {summary && (
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
          <h3 className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2">
            <span className="text-xl">📋</span>
            ملخص عام عن المكان
          </h3>
          <p className="text-slate-200 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
