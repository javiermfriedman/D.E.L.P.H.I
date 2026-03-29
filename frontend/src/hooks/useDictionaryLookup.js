import { useState, useEffect, useRef } from "react";
import { lookupWord } from "../api/client";

export function useDictionaryLookup(word) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!word || word.trim().length < 2) {
      setSuggestion(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const data = await lookupWord(word.trim());
        setSuggestion(data);
      } catch {
        setSuggestion(null);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timerRef.current);
  }, [word]);

  return { suggestion, loading };
}
