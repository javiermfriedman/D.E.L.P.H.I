export default function Sidebar({ active, onNavigate, onAddWord }) {
  const navItems = [
    { id: "upcoming", label: "Prophecies" },
    { id: "past", label: "Echoes" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">D.E.L.P.H.I</span>
        <span className="logo-sub">lexical intelligence</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "nav-item--active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-indicator" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="add-word-btn" onClick={onAddWord}>
          <span className="add-icon">+</span>
          Offer Sacrifice
        </button>
      </div>
    </aside>
  );
}
