// src/App.js
import React, { useState } from "react";
import GlobeView from "./GlobeView";
import AttackLog from "./AttackLog";
import ControlPanel from "./ControlPanel";
import "./App.css";

function App() {
  const [attackLog, setAttackLog] = useState([]);
  const [filters, setFilters] = useState({ severity: "", type: "" });

  const handleNewAttack = (attack) => {
    setAttackLog((prev) => [attack, ...prev.slice(0, 99)]); // limit log to 100 entries
  };

  const filteredAttacks = attackLog.filter((a) => {
    const severityMatch = !filters.severity || a.severity === filters.severity;
    const typeMatch = !filters.type || a.type === filters.type;
    return severityMatch && typeMatch;
  });

  return (
    <div className="app-container">
      <GlobeView onNewAttack={handleNewAttack} />
      <div className="side-panel">
        <ControlPanel filters={filters} setFilters={setFilters} />
        <AttackLog attacks={filteredAttacks} />
      </div>
    </div>
  );
}

export default App;
