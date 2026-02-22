import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import PlaceInfo from "./components/PlaceInfo";
import ChartsSection from "./components/ChartsSection";
import ProsAndCons from "./components/ProsAndCons";
import PriceAnalysis from "./components/PriceAnalysis";
import PopularDishes from "./components/PopularDishes";
import Recommendation from "./components/Recommendation";
import ReviewsList from "./components/ReviewsList";
import Loading from "./components/Loading";
import MapView from "./components/MapView";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        PlaceScope 🔍
      </h1>

      <SearchBar setData={setData} setLoading={setLoading} setError={setError} />

      {loading && <Loading />}
      {error && (
        <div className="bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-xl mb-4">
          {error}
        </div>
      )}

      {data && data.place === null && !loading && (
        <div className="bg-amber-900/30 border border-amber-600 text-amber-200 p-4 rounded-xl">
          لم يتم العثور على نتائج. جرّب اسم مكان آخر.
        </div>
      )}

      {data && data.place && (
        <>
          <PlaceInfo place={data.place} summary={data.analysis?.summary} />
          <MapView place={data.place} />
          <ChartsSection charts={data.analysis?.charts} />
          <ProsAndCons analysis={data.analysis} />
          <PriceAnalysis price={data.analysis?.price} />
          <PopularDishes dishes={data.analysis?.popularDishes} />
          <Recommendation
            recommendation={data.analysis?.recommendation}
            bestTimeToVisit={data.analysis?.bestTimeToVisit}
          />
          <ReviewsList reviews={data.reviews} />
        </>
      )}
    </div>
  );
}

export default App;