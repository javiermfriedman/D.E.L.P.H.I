import { useState, useEffect, useRef } from "react";

const POEM_LINES = [
  "From hidden halls where meanings sleep,",
  "The Oracle stirs the silent deep.",
  "Through dust of time and tongues long cast,",
  "It gathers words from future and past.",
  "Seven now shall rise and gleam,",
  "Drawn from thought, from fire, from dream.",
  "Attend, and let the silence part—",
  "New language comes to arm the heart.",
];

const LINE_INTERVAL = 2200;

const OUTER_RUNES = ["ᚠ", "ᚨ", "ᚱ", "ᛏ", "ᛖ", "ᛊ", "ᚹ", "ᛚ"];
const INNER_RUNES = ["᛭", "ᚦ", "ᛇ", "ᚻ"];

export default function OracleSummoning({ words, onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState("summoning");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= POEM_LINES.length) clearInterval(timer);
    }, LINE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (visibleLines >= POEM_LINES.length && words && phase === "summoning") {
      const timer = setTimeout(() => setPhase("burst"), 600);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, words, phase]);

  useEffect(() => {
    if (phase === "burst") {
      const timer = setTimeout(() => onCompleteRef.current(), 900);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className={`oracle-summoning-overlay ${phase === "burst" ? "oracle-summoning--burst" : ""}`}>
      <div className="summoning-content">
        <div className="crystal-ball-wrapper">
          <div className="crystal-glow-ring" />
          <div className="crystal-ball-orb">
            <div className="crystal-mist crystal-mist-1" />
            <div className="crystal-mist crystal-mist-2" />
            <div className="crystal-mist crystal-mist-3" />
            <div className="crystal-highlight" />
          </div>
          <div className="rune-ring rune-ring--outer">
            {OUTER_RUNES.map((r, i) => (
              <span
                key={i}
                className="floating-rune"
                style={{ transform: `rotate(${i * 45}deg) translateY(-130px)` }}
              >
                {r}
              </span>
            ))}
          </div>
          <div className="rune-ring rune-ring--inner">
            {INNER_RUNES.map((r, i) => (
              <span
                key={i}
                className="floating-rune"
                style={{ transform: `rotate(${i * 90 + 45}deg) translateY(-95px)` }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="oracle-poem-container">
          {POEM_LINES.map((line, i) => (
            <p
              key={i}
              className={`oracle-poem-line ${i < visibleLines ? "oracle-poem-line--visible" : ""}`}
            >
              {line}
            </p>
          ))}
          {visibleLines >= POEM_LINES.length && !words && (
            <p className="oracle-waiting">The Oracle speaks…</p>
          )}
        </div>
      </div>

      {phase === "burst" && <div className="oracle-burst-flash" />}
    </div>
  );
}
