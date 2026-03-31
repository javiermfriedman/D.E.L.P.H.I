const CASCADE_STAGGER = 100;
const CASCADE_BASE = 80;

export default function TimelineNode({
  word,
  definition,
  part_of_speech,
  index,
  onBanish,
  cascadeIndex,
  isCollapsing,
}) {
  const isFirst = index === 0;
  const hasCascade = cascadeIndex != null;
  const cascadeStyle = hasCascade
    ? { animationDelay: `${CASCADE_BASE + (cascadeIndex + 1) * CASCADE_STAGGER}ms` }
    : undefined;

  const classes = [
    "timeline-node",
    isFirst && "timeline-node--next",
    hasCascade && "cascade-fade",
    isCollapsing && "timeline-node--collapsing",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={cascadeStyle}>
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
            className="banish-btn"
            onClick={() => onBanish(index, word)}
            title="Banish from queue"
          >
            <svg
              className="banish-icon"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2c0 0-8 8.5-8 14a8 8 0 0 0 16 0c0-5.5-8-14-8-14Z" />
              <path d="M12 22c0 0-3-3.5-3-6a3 3 0 0 1 6 0c0 2.5-3 6-3 6Z" />
            </svg>
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
