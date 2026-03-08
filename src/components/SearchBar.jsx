import React, { useState, useEffect } from "react";
import { searchPlace } from "../services/searchService";
import { useT } from "../i18n";

const HISTORY_KEY = "placescope_search_history";
const HISTORY_MAX = 10;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch (_) {}
}

export default function SearchBar({ setData, setLoading, setError, lang }) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(loadHistory);
  const T = useT(lang);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSearch = async (searchQuery) => {
    const q = (typeof searchQuery === "string" ? searchQuery : query).trim();
    if (!q) return;

    setError(null);
    setLoading(true);

    try {
      const result = await searchPlace(q, lang);
      setData(result);
      const next = [q, ...history.filter((x) => x !== q)].slice(0, HISTORY_MAX);
      setHistory(next);
      saveHistory(next);
    } catch (err) {
      setData(null);
      setError(err.message || "حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 no-print">
      <div className="flex justify-center gap-2 flex-wrap">
        <input
          className="p-3 rounded-lg text-black w-80 max-w-full border border-slate-600 focus:ring-2 focus:ring-blue-500"
          placeholder={T.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
        >
          🔎 {T.search}
        </button>
      </div>
      {history.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="text-slate-400 text-sm self-center">{T.searchHistory}:</span>
          {history.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSearch(item)}
              className="text-sm px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}