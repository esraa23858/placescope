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
import { useT } from "./i18n";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("placescope_lang") || "ar");
  const T = useT(lang);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem("placescope_lang", newLang);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 no-print">
        <h1 className="text-3xl md:text-4xl font-bold text-center sm:text-left">
          {T.appTitle} 🔍
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLangChange("ar")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "ar" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            عربي
          </button>
          <button
            type="button"
            onClick={() => handleLangChange("en")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "en" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            EN
          </button>
        </div>
      </header>

      <SearchBar
        setData={setData}
        setLoading={setLoading}
        setError={setError}
        lang={lang}
      />

      {loading && <Loading text={T.loading} />}
      {error && (
        <div className="bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-xl mb-4">
          {error}
        </div>
      )}

      {data && data.place === null && !loading && (
        <div className="bg-amber-900/30 border border-amber-600 text-amber-200 p-4 rounded-xl">
          {T.notFound}
        </div>
      )}

      {data && data.place && (
        <>
          <div className="mb-4 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium"
            >
              {T.exportPdf}
            </button>
          </div>
          <div id="report-content" className="space-y-4">
            <PlaceInfo place={data.place} summary={data.analysis?.summary} />
            <MapView place={data.place} />
            <ChartsSection charts={data.analysis?.charts} />
            <ProsAndCons analysis={data.analysis} />
            <PriceAnalysis price={data.analysis?.price ?? {}} />
            <PopularDishes dishes={data.analysis?.popularDishes} />
            <Recommendation
              recommendation={data.analysis?.recommendation}
              bestTimeToVisit={data.analysis?.bestTimeToVisit}
            />
            <ReviewsList reviews={data.reviews} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;