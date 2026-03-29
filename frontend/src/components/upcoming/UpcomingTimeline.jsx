import TimelineNode from "./TimelineNode";
import { useUpcomingWords } from "../../hooks/useUpcomingWords";

export default function UpcomingTimeline() {
  const { words, loading, error, remove } = useUpcomingWords();

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-pulse">Loading upcoming words...</div>
      </div>
    );
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
    <div className="timeline-view">
      <div className="view-header">
        <h2 className="view-title">Upcoming Words</h2>
        <span className="word-count">{words.length} queued</span>
      </div>

      <div className="timeline-track">
        <div className="timeline-spine" />
        {words.map((w, i) => (
          <TimelineNode
            key={`${w.word}-${i}`}
            {...w}
            index={i}
            onDelete={remove}
          />
        ))}
      </div>
    </div>
  );
}
