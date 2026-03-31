import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import UpcomingTimeline from "../components/upcoming/UpcomingTimeline";
import PastWordsGrid from "../components/past/PastWordsGrid";
import AddWordModal from "../components/modals/AddWordModal";
import ChoiceModal from "../components/modals/ChoiceModal";
import OracleSummoning from "../components/oracle/OracleSummoning";
import StoneTablet from "../components/oracle/StoneTablet";
import { divineWords } from "../api/client";
import { useUpcomingWords } from "../hooks/useUpcomingWords";

function toUpcomingWord(w) {
  return { word_id: w.id, word: w.word, definition: w.definition, part_of_speech: w.part_of_speech };
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState("upcoming");
  const [oraclePhase, setOraclePhase] = useState(null);
  const [oracleWords, setOracleWords] = useState(null);
  const [oracleError, setOracleError] = useState(null);

  const { words, loading, error, remove, append } = useUpcomingWords();

  useEffect(() => {
    document.body.classList.remove("fade-out");
  }, []);

  function handleAddWord() {
    setOraclePhase("choice");
    setOracleError(null);
  }

  function handleScribeByHand() {
    setOraclePhase("scribe");
  }

  function handleCloseModal() {
    setOraclePhase(null);
    setOracleError(null);
  }

  function handleScribeSuccess(addedWord) {
    append([toUpcomingWord(addedWord)]);
    setOraclePhase(null);
  }

  function handleAskOracle() {
    setOraclePhase("summoning");
    setOracleError(null);

    divineWords()
      .then((result) => setOracleWords(result))
      .catch(() => {
        setOraclePhase("choice");
        setOracleError("The Oracle could not be reached. Try again.");
      });
  }

  function handleSummoningComplete() {
    setOraclePhase("tablet");
  }

  function handleTabletComplete() {
    append(oracleWords.map(toUpcomingWord));
    setOraclePhase(null);
    setOracleWords(null);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) handleCloseModal();
  }

  return (
    <div className="dashboard">
      <Sidebar
        active={activeView}
        onNavigate={setActiveView}
        onAddWord={handleAddWord}
      />
      <main className="dashboard-main">
        {activeView === "upcoming" && (
          <UpcomingTimeline words={words} loading={loading} error={error} remove={remove} />
        )}
        {activeView === "past" && <PastWordsGrid />}
      </main>

      {(oraclePhase === "choice" || oraclePhase === "scribe") && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          {oraclePhase === "choice" && (
            <ChoiceModal
              onAskOracle={handleAskOracle}
              onScribeByHand={handleScribeByHand}
              onClose={handleCloseModal}
              error={oracleError}
            />
          )}
          {oraclePhase === "scribe" && (
            <AddWordModal
              noOverlay
              onClose={handleCloseModal}
              onSuccess={handleScribeSuccess}
            />
          )}
        </div>
      )}

      {oraclePhase === "summoning" && (
        <OracleSummoning
          words={oracleWords}
          onComplete={handleSummoningComplete}
        />
      )}

      {oraclePhase === "tablet" && oracleWords && (
        <StoneTablet
          words={oracleWords}
          onComplete={handleTabletComplete}
        />
      )}
    </div>
  );
}
