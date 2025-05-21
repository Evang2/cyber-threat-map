import React from "react";
import "./App.css";

function AttackLog({ attackHistory = [] }) {
  const getFlagUrl = (country) =>
    country ? `https://countryflagsapi.com/png/${encodeURIComponent(country)}` : "";

  const totalAttacks = attackHistory.length;
  const severityCount = (level) =>
    attackHistory.filter((a) => a.severity === level).length;

  return (
    <div className="attack-log">
      <div className="stats-panel">
        <h3>Attack Summary</h3>
        <p>Total Attacks: {totalAttacks}</p>
        <p>High: {severityCount("High")}</p>
        <p>Medium: {severityCount("Medium")}</p>
        <p>Low: {severityCount("Low")}</p>
        <p>Unknown: {severityCount("Unknown")}</p>
      </div>

      <div className="log-entries">
        {attackHistory.map((attack, i) => {
          const { source = {}, target = {}, severity = "Unknown", type = "Unknown" } = attack;

          return (
            <div key={i} className="log-entry">
              <span className="timestamp">
                [{new Date(attack.timestamp).toLocaleTimeString()}]
              </span>{" "}
              <img
                src={getFlagUrl(source.country)}
                alt={source.country || "Unknown"}
                className="flag"
              />
              {source.country || "?"} ➜{" "}
              <img
                src={getFlagUrl(target.country)}
                alt={target.country || "Unknown"}
                className="flag"
              />
              {target.country || "?"} | <strong>{type}</strong> |{" "}
              <span className={`severity ${severity.toLowerCase()}`}>
                {severity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttackLog;
