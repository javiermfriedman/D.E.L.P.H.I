import { useState } from "react";
import TimelineNode from "./TimelineNode";
import OracleLoader from "./OracleLoader";
import BanishVortex from "./BanishVortex";
import BanishModal from "../modals/BanishModal";

const CASCADE_COUNT = 5;
const CASCADE_BASE = 80;
const COLLAPSE_MS = 500;

export default function UpcomingTimeline({ words, loading, error, remove }) {
  const [banishTarget, setBanishTarget] = useState(null);
  const [banishPhase, setBanishPhase] = useState("idle");

  function handleBanishClick(index, word) {
    setBanishTarget({ index, word });
    setBanishPhase("confirm");
  }

  function handleBanishConfirm() {
    setBanishPhase("animating");
  }

  function handleVortexComplete() {
    setBanishPhase("collapsing");
    setTimeout(() => {
      remove(banishTarget.index);
      setBanishTarget(null);
      setBanishPhase("idle");
    }, COLLAPSE_MS);
  }

  function handleBanishCancel() {
    setBanishTarget(null);
    setBanishPhase("idle");
  }

  if (loading) {
    return <OracleLoader />;
  }

  if (error) {
    return (
      <div className="state-container">
        <p className="state-error">Could not load upcoming words.</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="state-container">
        <p className="state-empty">
          No words in the queue. Add one to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="timeline-view">
        <div
          className="view-header cascade-fade"
          style={{ animationDelay: `${CASCADE_BASE}ms` }}
        >
          <h2 className="view-title">Upcoming Words</h2>
          <span className="word-count">{words.length} queued</span>
        </div>

        <div className="timeline-track">
          <div className="timeline-spine" />
          {words.map((w, i) => (
            <TimelineNode
              key={`${w.word}-${w.word_id}`}
              {...w}
              index={i}
              onBanish={handleBanishClick}
              cascadeIndex={i < CASCADE_COUNT ? i : null}
              isCollapsing={
                banishPhase === "collapsing" && banishTarget?.index === i
              }
            />
          ))}
        </div>
      </div>

      {banishPhase === "confirm" && banishTarget && (
        <BanishModal
          word={banishTarget.word}
          onConfirm={handleBanishConfirm}
          onCancel={handleBanishCancel}
        />
      )}

      {banishPhase === "animating" && banishTarget && (
        <BanishVortex
          word={banishTarget.word}
          onComplete={handleVortexComplete}
        />
      )}
    </>
  );
}
