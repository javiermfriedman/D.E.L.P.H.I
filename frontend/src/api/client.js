const BASE_URL = "http://localhost:8000";

export async function fetchUpcomingWords() {
  const res = await fetch(`${BASE_URL}/words/upcoming`);
  if (!res.ok) throw new Error("Failed to fetch upcoming words");
  return res.json();
}

export async function fetchPastWords() {
  const res = await fetch(`${BASE_URL}/words/past`);
  if (!res.ok) throw new Error("Failed to fetch past words");
  return res.json();
}

export async function addWord(word, definition, part_of_speech) {
  const res = await fetch(`${BASE_URL}/words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, definition, part_of_speech }),
  });
  if (!res.ok) throw new Error("Failed to add word");
  return res.json();
}

export async function deleteUpcomingWord(wordId) {
  const res = await fetch(`${BASE_URL}/words/${wordId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete word");
  return res.json();
}

export async function divineWords() {
  const res = await fetch(`${BASE_URL}/words/divine/`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to divine words");
  return res.json();
}

export async function lookupWord(word) {
  const res = await fetch(
    `${BASE_URL}/dictionary/lookup?word=${encodeURIComponent(word)}`,
    {
      method: "POST",
    },
  );
  if (!res.ok) return { word, definition: null, part_of_speech: null };
  return res.json();
}
