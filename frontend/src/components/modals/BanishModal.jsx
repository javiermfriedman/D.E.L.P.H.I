export default function BanishModal({ word, onConfirm, onCancel }) {
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal banish-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="modal-title">BANISH WORD</span>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="banish-modal-body">
          <p className="banish-word-display">{word}</p>
          <p className="banish-prompt">
            Remove this word from the oracle's queue?
          </p>
          <p className="banish-warning">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-banish" onClick={onConfirm}>
            Banish
          </button>
        </div>
      </div>
    </div>
  );
}
