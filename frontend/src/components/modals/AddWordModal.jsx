import { useState, useEffect } from "react";
import { useDictionaryLookup } from "../../hooks/useDictionaryLookup";
import { addWord } from "../../api/client";

export default function AddWordModal({ onClose, onSuccess, noOverlay }) {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [definitionEdited, setDefinitionEdited] = useState(false);
  const [posEdited, setPosEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { suggestion, loading: lookingUp } = useDictionaryLookup(word);

  // Auto-fill from suggestion if user hasn't manually edited
  useEffect(() => {
    if (!suggestion) return;
    if (!definitionEdited && suggestion.definition) {
      setDefinition(suggestion.definition);
    }
    if (!posEdited && suggestion.part_of_speech) {
      setPartOfSpeech(suggestion.part_of_speech);
    }
  }, [suggestion, definitionEdited, posEdited]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!word.trim() || !definition.trim() || !partOfSpeech.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await addWord(word.trim(), definition.trim(), partOfSpeech.trim());
      onSuccess?.(result);
      onClose();
    } catch (err) {
      setError("Failed to add word. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const isSuggested = (field) => {
    if (field === "definition")
      return suggestion?.definition === definition && !definitionEdited;
    if (field === "pos")
      return suggestion?.part_of_speech === partOfSpeech && !posEdited;
    return false;
  };

  const modalContent = (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-header">
        <span className="modal-title">ADD NEW WORD</span>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="field-group">
          <label className="field-label">Word</label>
          <div className="field-row">
            <input
              className="field-input"
              type="text"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                setDefinitionEdited(false);
                setPosEdited(false);
              }}
              placeholder="Enter a word..."
              autoFocus
            />
            {lookingUp && (
              <span className="lookup-indicator">
                <span className="lookup-dot" />
                looking up
              </span>
            )}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">
            Definition
            {isSuggested("definition") && (
              <span className="suggestion-tag">suggested</span>
            )}
          </label>
          <textarea
            className={`field-input field-textarea ${isSuggested("definition") ? "field-input--suggested" : ""}`}
            value={definition}
            onChange={(e) => {
              setDefinition(e.target.value);
              setDefinitionEdited(true);
            }}
            placeholder="Definition will appear here..."
            rows={3}
          />
        </div>

        <div className="field-group">
          <label className="field-label">
            Part of Speech
            {isSuggested("pos") && (
              <span className="suggestion-tag">suggested</span>
            )}
          </label>
          <input
            className={`field-input ${isSuggested("pos") ? "field-input--suggested" : ""}`}
            type="text"
            value={partOfSpeech}
            onChange={(e) => {
              setPartOfSpeech(e.target.value);
              setPosEdited(true);
            }}
            placeholder="noun, verb, adjective..."
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={
              submitting ||
              !word.trim() ||
              !definition.trim() ||
              !partOfSpeech.trim()
            }
          >
            {submitting ? "Adding..." : "Add to Queue"}
          </button>
        </div>
      </form>
    </div>
  );

  if (noOverlay) return modalContent;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {modalContent}
    </div>
  );
}
