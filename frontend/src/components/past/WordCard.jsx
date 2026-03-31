export default function WordCard({
  word,
  definition,
  part_of_speech,
  featured_on,
  revealDelay,
}) {
  const date = featured_on
    ? new Date(featured_on).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const hasReveal = revealDelay != null;

  return (
    <div
      className={`word-card ${hasReveal ? "word-card--reveal" : ""}`}
      style={hasReveal ? { animationDelay: `${revealDelay}ms` } : undefined}
    >
      <div className="word-card-date">{date}</div>
      <div className="word-card-word">{word}</div>
      <div className="word-card-pos">{part_of_speech}</div>
      <div className="word-card-definition">{definition}</div>
    </div>
  );
}
