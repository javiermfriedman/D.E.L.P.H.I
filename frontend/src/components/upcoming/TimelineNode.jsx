const CASCADE_STAGGER = 100;
const CASCADE_BASE = 80;

export default function TimelineNode({
  word,
  definition,
  part_of_speech,
  index,
  onDelete,
  cascadeIndex,
}) {
  const isFirst = index === 0;
  const hasCascade = cascadeIndex != null;
  const cascadeStyle = hasCascade
    ? { animationDelay: `${CASCADE_BASE + (cascadeIndex + 1) * CASCADE_STAGGER}ms` }
    : undefined;

  return (
    <div
      className={`timeline-node ${isFirst ? "timeline-node--next" : ""} ${hasCascade ? "cascade-fade" : ""}`}
      style={cascadeStyle}
    >
      <div className="timeline-connector">
        <div
          className={`timeline-dot ${isFirst ? "timeline-dot--active" : ""}`}
        />
      </div>

      <div className={`timeline-card ${isFirst ? "timeline-card--next" : ""}`}>
        <div className="timeline-card-header">
          <span className="day-label">
            {isFirst ? "NEXT UP · DAY 1" : `DAY ${index + 1}`}
          </span>
          <button
            className="delete-btn"
            onClick={() => onDelete(index)}
            title="Remove from queue"
          >
            ×
          </button>
        </div>

        <div className="timeline-word">{word}</div>

        <div className="timeline-meta">
          <span className="pos-badge">{part_of_speech}</span>
          <span className="timeline-definition">{definition}</span>
        </div>
      </div>
    </div>
  );
}
