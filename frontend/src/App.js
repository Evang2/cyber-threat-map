import React, { useState, useEffect } from "react";
import MapView from "./MapView";
import ControlPanel from "./ControlPanel";
import AttackLog from "./AttackLog";
import io from "socket.io-client";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const [attacks, setAttacks] = useState([]);
  const [filters, setFilters] = useState({ severity: "", type: "" });
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("✅ Connected to ThreatFox server");
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from ThreatFox server");
      setConnectionStatus("disconnected");
    });

    socket.on("new_attack", (attack) => {
      console.log("📡 Received attack:", attack);

      // Validate attack data structure
      if (
        attack &&
        attack.source &&
        attack.target &&
        attack.type &&
        attack.severity
      ) {
        setAttacks((prev) => [attack, ...prev.slice(0, 99)]); // limit log to 100 entries
      } else {
        console.warn("⚠️ Invalid attack data received:", attack);
      }
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error);
      setConnectionStatus("error");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Enhanced filtering with better matching
  const filteredAttacks = attacks.filter((attack) => {
    if (!attack) return false;

    const severityMatch =
      !filters.severity || attack.severity === filters.severity;
    const typeMatch = !filters.type || attack.type === filters.type;

    return severityMatch && typeMatch;
  });

  // Connection status indicator
  const getConnectionStatusStyle = () => {
    switch (connectionStatus) {
      case "connected":
        return { color: "#4caf50", backgroundColor: "#1b5e20" };
      case "error":
        return { color: "#f44336", backgroundColor: "#5d1e1e" };
      default:
        return { color: "#ff9800", backgroundColor: "#3d2914" };
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "🟢 Live Feed Active";
      case "error":
        return "🔴 Connection Error";
      default:
        return "🟡 Connecting...";
    }
  };

  console.log("📊 App State:", {
    totalAttacks: attacks.length,
    filteredAttacks: filteredAttacks.length,
    filters,
    connectionStatus,
  });

  return (
    <div className="app-container">
      <div className="side-panel">
        {/* Connection Status */}
        <div
          style={{
            padding: "8px 12px",
            marginBottom: "15px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            textAlign: "center",
            ...getConnectionStatusStyle(),
          }}
        >
          {getConnectionStatusText()}
        </div>

        {/* Real-time Stats */}
        {attacks.length > 0 && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "#2a2a2a",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              📈 <strong>Live Stats:</strong>
            </div>
            <div style={{ color: "#ccc" }}>
              • Total Threats: {attacks.length}
            </div>
            <div style={{ color: "#ccc" }}>
              • Filtered: {filteredAttacks.length}
            </div>
            <div style={{ color: "#ccc" }}>
              • Latest:{" "}
              {attacks[0]
                ? new Date(attacks[0].timestamp).toLocaleTimeString()
                : "N/A"}
            </div>
          </div>
        )}

        <ControlPanel
          filters={filters}
          setFilters={setFilters}
          attacks={attacks}
        />

        <AttackLog attacks={filteredAttacks} />
      </div>

      <div className="map-container">
        <MapView attacks={filteredAttacks} />
      </div>
    </div>
  );
}

export default App;
