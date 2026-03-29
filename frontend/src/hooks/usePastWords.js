import { useState, useEffect, useCallback } from "react";
import { fetchPastWords } from "../api/client";

export function usePastWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPastWords();
      setWords(data);
    } catch (e) {
      setError(e.message);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { words, loading, error, refetch: load };
}
