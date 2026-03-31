import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import UpcomingTimeline from "../components/upcoming/UpcomingTimeline";
import PastWordsGrid from "../components/past/PastWordsGrid";
import AddWordModal from "../components/modals/AddWordModal";
import ChoiceModal from "../components/modals/ChoiceModal";
import OracleSummoning from "../components/oracle/OracleSummoning";
import StoneTablet from "../components/oracle/StoneTablet";
import { divineWords } from "../api/client";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("upcoming");
  const [refreshKey, setRefreshKey] = useState(0);
  const [oraclePhase, setOraclePhase] = useState(null);
  const [oracleWords, setOracleWords] = useState(null);
  const [oracleError, setOracleError] = useState(null);

  useEffect(() => {
    document.body.classList.remove("fade-out");
  }, []);

  function handleWordAdded() {
    setRefreshKey((k) => k + 1);
  }

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

  function handleScribeSuccess() {
    handleWordAdded();
    setOraclePhase(null);
  }

  function handleAskOracle() {
    setOraclePhase("summoning");
    setOracleError(null);

    divineWords()
      .then((words) => setOracleWords(words))
      .catch(() => {
        setOraclePhase("choice");
        setOracleError("The Oracle could not be reached. Try again.");
      });
  }

  function handleSummoningComplete() {
    setOraclePhase("tablet");
  }

  function handleTabletComplete() {
    setOraclePhase(null);
    setOracleWords(null);
    handleWordAdded();
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
        {activeView === "upcoming" && <UpcomingTimeline key={`upcoming-${refreshKey}`} />}
        {activeView === "past" && <PastWordsGrid key={`past-${refreshKey}`} />}
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
