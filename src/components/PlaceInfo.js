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
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
      {summary && (
        <p className="text-slate-300 text-sm mb-3 leading-relaxed">{summary}</p>
      )}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-300">
        <span>📍 {address}</span>
        <span>⭐ {rating} / 5</span>
        <span>💬 {reviewCount} مراجعة</span>
        <span>💰 {price}</span>
        <span>🏷️ {type}</span>
      </div>
    </div>
  );
}
