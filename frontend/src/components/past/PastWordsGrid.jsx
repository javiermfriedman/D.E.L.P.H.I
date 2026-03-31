import { useState, useEffect } from "react";
import WordCard from "./WordCard";
import ConstellationLoader from "./ConstellationLoader";
import { usePastWords } from "../../hooks/usePastWords";

const REVEAL_COUNT = 18;
const REVEAL_STAGGER = 60;
const REVEAL_BASE = 150;

export default function PastWordsGrid() {
  const { words, loading, error } = usePastWords();
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!loading && words.length > 0 && !revealed) {
      const timer = setTimeout(
        () => setRevealed(true),
        REVEAL_BASE + REVEAL_COUNT * REVEAL_STAGGER + 600,
      );
      return () => clearTimeout(timer);
    }
  }, [loading, words.length, revealed]);

  const filtered = words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <ConstellationLoader />;
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
      <div
        className={`view-header ${!revealed ? "cascade-fade" : ""}`}
        style={!revealed ? { animationDelay: "80ms" } : undefined}
      >
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
            <WordCard
              key={w.word}
              {...w}
              revealDelay={
                !revealed && i < REVEAL_COUNT
                  ? REVEAL_BASE + i * REVEAL_STAGGER
                  : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
