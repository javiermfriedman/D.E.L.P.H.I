import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import UpcomingTimeline from "../components/upcoming/UpcomingTimeline";
import PastWordsGrid from "../components/past/PastWordsGrid";
import AddWordModal from "../components/modals/AddWordModal";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("upcoming");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.body.classList.remove("fade-out");
  }, []);

  function handleWordAdded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="dashboard">
      <Sidebar
        active={activeView}
        onNavigate={setActiveView}
        onAddWord={() => setShowAddModal(true)}
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
    </div>
  );
}
