import { useState, useEffect } from "react";

const TITLE = "D.E.L.P.H.I";
const SUBTITLE = "Daily Elocution & Lexical Processing Heuristic Intelligence";

export default function TypewriterTitle({ onComplete }) {
  const [titleChars, setTitleChars] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [subtitleChars, setSubtitleChars] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (titleChars < TITLE.length) {
      const t = setTimeout(() => setTitleChars((c) => c + 1), 110);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowSubtitle(true), 400);
      return () => clearTimeout(t);
    }
  }, [titleChars]);

  useEffect(() => {
    if (!showSubtitle) return;
    if (subtitleChars < SUBTITLE.length) {
      const t = setTimeout(() => setSubtitleChars((c) => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowCTA(true), 500);
      return () => clearTimeout(t);
    }
  }, [showSubtitle, subtitleChars]);

  return (
    <div className="typewriter-container">
      <h1 className="delphi-title">
        {TITLE.slice(0, titleChars)}
        {titleChars < TITLE.length && <span className="cursor">|</span>}
      </h1>

      {showSubtitle && (
        <p className="delphi-subtitle">
          {SUBTITLE.slice(0, subtitleChars)}
          {subtitleChars < SUBTITLE.length && (
            <span className="cursor subtitle-cursor">|</span>
          )}
        </p>
      )}

      {showCTA && (
        <button
          className="enter-btn"
          onClick={onComplete}
          style={{ animation: "fadeIn 0.8s ease forwards" }}
        >
          ENTER
        </button>
      )}
    </div>
  );
}
