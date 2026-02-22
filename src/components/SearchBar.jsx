import React, { useState } from "react";
import { searchPlace } from "../services/searchService";

export default function SearchBar({ setData, setLoading, setError }) {

  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const result = await searchPlace(query.trim());
      setData(result);
    } catch (err) {
      setData(null);
      setError(err.message || "حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-2 mb-6 flex-wrap">
      <input
        className="p-3 rounded text-black w-80 max-w-full"
        placeholder="اكتب اسم المطعم أو المكان..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
      >
        🔎 بحث
      </button>
    </div>
  );
}