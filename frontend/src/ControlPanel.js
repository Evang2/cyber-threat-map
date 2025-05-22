import React, { useState, useEffect } from "react";

function ControlPanel({ filters, setFilters, attacks }) {
  const [malwareFamilies, setMalwareFamilies] = useState([]);
  const [threatTypes, setThreatTypes] = useState([]);
  const [error, setError] = useState(null);

  // Fetch malware families once on mount
  useEffect(() => {
    const fetchInitialMalwareFamilies = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/threatfox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "malware_list" }),
        });
        const data = await response.json();
        if (data.query_status === "ok" && data.data) {
          const families = Object.entries(data.data).map(([key, val]) => ({
            id: key,
            name: val.malware_printable || key,
          }));
          setMalwareFamilies(families);
        }
      } catch (err) {
        console.warn(
          "⚠️ Failed to fetch malware list. Will fallback to attack data."
        );
        setError("Failed to fetch initial malware list");
      }
    };

    fetchInitialMalwareFamilies();
  }, []);

  // Dynamically update filters when new attack data arrives
  useEffect(() => {
    const newTypes = [...new Set(attacks.map((a) => a.type))].filter(Boolean);
    const newSeverities = [...new Set(attacks.map((a) => a.severity))].filter(
      Boolean
    );

    // Update malware families with any new types
    setMalwareFamilies((prev) => {
      const prevIds = new Set(prev.map((f) => f.id));
      const merged = [...prev];
      newTypes.forEach((type) => {
        if (!prevIds.has(type)) {
          merged.push({ id: type, name: type });
        }
      });
      return merged;
    });

    // Update threat types with new severities
    setThreatTypes((prev) => {
      const prevIds = new Set(prev.map((t) => t.id));
      const merged = [...prev];
      newSeverities.forEach((sev) => {
        if (!prevIds.has(sev)) {
          merged.push({ id: sev, name: sev.replace(/_/g, " ").toUpperCase() });
        }
      });
      return merged;
    });
  }, [attacks]);

  return (
    <div className="control-panel">
      <h2>Filters</h2>

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            fontSize: "12px",
            marginBottom: "10px",
            padding: "5px",
            background: "#2a1a1a",
            borderRadius: "3px",
          }}
        >
          {error}
        </div>
      )}

      <label>
        Threat Type (Severity):
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
        >
          <option value="">All Severities</option>
          {threatTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Malware Family:
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Families</option>
          {malwareFamilies.map((family) => (
            <option key={family.id} value={family.id}>
              {family.name}
            </option>
          ))}
        </select>
      </label>

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: "#2a2a2a",
          borderRadius: "5px",
          fontSize: "12px",
        }}
      >
        <p style={{ margin: "2px 0", color: "#ccc" }}>
          📊 {malwareFamilies.length} malware families
        </p>
        <p style={{ margin: "2px 0", color: "#ccc" }}>
          🛡️ {threatTypes.length} threat types
        </p>
        <p style={{ margin: "2px 0", color: "#ccc" }}>
          🎯 {attacks.length} total attacks
        </p>
      </div>
    </div>
  );
}

export default ControlPanel;
