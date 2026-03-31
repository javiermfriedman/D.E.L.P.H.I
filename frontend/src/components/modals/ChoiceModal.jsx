export default function ChoiceModal({ onAskOracle, onScribeByHand, onClose, error }) {
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal choice-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="modal-title">SUMMON WORDS</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <p className="choice-error">{error}</p>}

        <div className="choice-grid">
          <button className="choice-card" onClick={onAskOracle}>
            <svg className="choice-icon" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M24 6V4M14 10l-1.5-1.5M34 10l1.5-1.5"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"
              />
              <path
                d="M20 16l1.5-3 1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5z"
                fill="currentColor" opacity="0.5"
              />
              <circle cx="27" cy="23" r="1.5" fill="currentColor" opacity="0.3" />
              <path
                d="M16 32c0-2 3-3 8-3s8 1 8 3"
                stroke="currentColor" strokeWidth="1.5" fill="none"
              />
              <line x1="16" y1="35" x2="32" y2="35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="choice-name">Ask the Oracle</span>
            <span className="choice-desc">Divine 7 words from the ether</span>
          </button>

          <button className="choice-card choice-card--scribe" onClick={onScribeByHand}>
            <svg className="choice-icon" viewBox="0 0 48 48" fill="none">
              <path
                d="M36 6c-2-2-5-2-7 0L9 26l-3 14 14-3L40 17c2-2 2-5 0-7l-4-4z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
              />
              <path d="M29 6l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 26l7 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
              <path d="M6 40l3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="choice-name">Scribe by Hand</span>
            <span className="choice-desc">Write your own word</span>
          </button>
        </div>
      </div>
    </div>
  );
}
