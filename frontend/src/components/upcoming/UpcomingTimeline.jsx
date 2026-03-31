import TimelineNode from "./TimelineNode";
import OracleLoader from "./OracleLoader";
import { useUpcomingWords } from "../../hooks/useUpcomingWords";

const CASCADE_COUNT = 5;
const CASCADE_BASE = 80;

export default function UpcomingTimeline() {
  const { words, loading, error, remove } = useUpcomingWords();

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
            key={`${w.word}-${i}`}
            {...w}
            index={i}
            onDelete={remove}
            cascadeIndex={i < CASCADE_COUNT ? i : null}
          />
        ))}
      </div>
    </div>
  );
}
