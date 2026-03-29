import WordCard from "./WordCard";
import { usePastWords } from "../../hooks/usePastWords";
import { useState } from "react";

export default function PastWordsGrid() {
  const { words, loading, error } = usePastWords();
  const [search, setSearch] = useState("");

  const filtered = words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-pulse">Retrieving past words...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <p className="state-error">Could not load past words.</p>
      </div>
    );
  }

  return (
    <div className="past-view">
      <div className="view-header">
        <h2 className="view-title">Past Words</h2>
        <input
          className="search-input"
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="state-container">
          <p className="state-empty">No past words found.</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {filtered.map((w, i) => (
            <WordCard key={`${w.word}-${i}`} {...w} />
          ))}
        </div>
      )}
    </div>
  );
}
