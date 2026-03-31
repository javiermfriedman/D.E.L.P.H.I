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
  const [showAddModal, setShowAddModal] = useState(false);
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
    setOraclePhase(null);
    setShowAddModal(true);
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

  function handleCloseChoice() {
    setOraclePhase(null);
    setOracleError(null);
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

      {showAddModal && (
        <AddWordModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleWordAdded}
        />
      )}

      {oraclePhase === "choice" && (
        <ChoiceModal
          onAskOracle={handleAskOracle}
          onScribeByHand={handleScribeByHand}
          onClose={handleCloseChoice}
          error={oracleError}
        />
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
