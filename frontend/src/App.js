import React, { useState, useEffect } from "react";
import MapView from "./MapView";
import ControlPanel from "./ControlPanel";
import AttackLog from "./AttackLog";
import io from "socket.io-client";
import "./App.css";
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [attacks, setAttacks] = useState([]);
  const [filters, setFilters] = useState({ severity: "", type: "" });

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("new_attack", (attack) => {
      setAttacks((prev) => [attack, ...prev.slice(0, 99)]); // limit log to 100 entries
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredAttacks = attacks.filter((a) => {
    const severityMatch = !filters.severity || a.severity === filters.severity;
    const typeMatch = !filters.type || a.type === filters.type;
    return severityMatch && typeMatch;
  });

  return (
    <div className="app-container">
      <div className="side-panel">
        <ControlPanel filters={filters} setFilters={setFilters} />
        <AttackLog attacks={filteredAttacks} />
      </div>
      <div className="map-container">
        <MapView attacks={filteredAttacks} />
      </div>
    </div>
  );
}

export default App;
