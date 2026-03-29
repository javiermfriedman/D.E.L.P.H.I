import { useState, useEffect, useCallback } from "react";
import { fetchUpcomingWords, deleteUpcomingWord } from "../api/client";

export function useUpcomingWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUpcomingWords();
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

  const remove = useCallback(
    async (index) => {
      const word = words[index];
      setWords((prev) => prev.filter((_, i) => i !== index));
      try {
        await deleteUpcomingWord(index + 1);
      } catch {
        load();
      }
    },
    [words, load],
  );

  return { words, loading, error, refetch: load, remove };
}
