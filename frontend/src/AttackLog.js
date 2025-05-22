import React from "react";

function AttackLog({ attacks }) {
  const totalAttacks = attacks.length;

  // Enhanced severity mapping based on ThreatFox threat types
  const getSeverityInfo = (severity) => {
    const severityMap = {
      // High Risk
      botnet_cc: {
        level: "high",
        label: "Botnet C&C",
        description: "Command & Control Server",
      },
      malware_download: {
        level: "high",
        label: "Malware Download",
        description: "Active Malware Distribution",
      },
      exploit_kit: {
        level: "high",
        label: "Exploit Kit",
        description: "Automated Exploitation Tool",
      },

      // Medium Risk
      phishing: {
        level: "medium",
        label: "Phishing",
        description: "Credential Harvesting",
      },
      suspicious_domain: {
        level: "medium",
        label: "Suspicious Domain",
        description: "Potentially Malicious Domain",
      },
      payload_delivery: {
        level: "medium",
        label: "Payload Delivery",
        description: "Malware Distribution Point",
      },

      // Lower Risk
      reconnaissance: {
        level: "low",
        label: "Reconnaissance",
        description: "Information Gathering",
      },
      scanning: {
        level: "low",
        label: "Scanning",
        description: "Network/Port Scanning",
      },

      // Default
      default: {
        level: "unknown",
        label: "Unknown",
        description: "Unclassified Threat",
      },
    };

    return severityMap[severity] || severityMap["default"];
  };

  // Get severity counts with enhanced mapping
  const getSeverityCounts = () => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
      unknown: 0,
    };

    attacks.forEach((attack) => {
      const severityInfo = getSeverityInfo(attack.severity);
      counts[severityInfo.level]++;
    });

    return counts;
  };

  const severityCounts = getSeverityCounts();

  // Function to get color class based on mapped severity level
  const getSeverityClass = (severity) => {
    const severityInfo = getSeverityInfo(severity);
    return `severity ${severityInfo.level}`;
  };

  // Get unique threat types for summary
  const getUniqueThreatTypes = () => {
    const typeCount = {};
    attacks.forEach((attack) => {
      const severityInfo = getSeverityInfo(attack.severity);
      typeCount[severityInfo.label] = (typeCount[severityInfo.label] || 0) + 1;
    });
    return typeCount;
  };

  const threatTypeCounts = getUniqueThreatTypes();

  return (
    <div className="attack-log">
      <div className="stats-panel">
        <h3>Attack Summary</h3>

        {/* Overall Stats */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            Total Attacks: {totalAttacks}
          </p>
        </div>

        {/* Severity Level Summary */}
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ fontSize: "14px", marginBottom: "8px", color: "#ccc" }}>
            Risk Levels:
          </h4>
          <p style={{ color: "#ff4757", margin: "2px 0" }}>
            🔴 High: {severityCounts.high}
          </p>
          <p style={{ color: "#ffa726", margin: "2px 0" }}>
            🟠 Medium: {severityCounts.medium}
          </p>
          <p style={{ color: "#ffeb3b", margin: "2px 0" }}>
            🟡 Low: {severityCounts.low}
          </p>
          <p style={{ color: "#9e9e9e", margin: "2px 0" }}>
            ⚪ Unknown: {severityCounts.unknown}
          </p>
        </div>

        {/* Threat Type Breakdown */}
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ fontSize: "14px", marginBottom: "8px", color: "#ccc" }}>
            Threat Types:
          </h4>
          {Object.entries(threatTypeCounts)
            .slice(0, 5)
            .map(([type, count]) => (
              <p key={type} style={{ margin: "2px 0", fontSize: "12px" }}>
                {type}: {count}
              </p>
            ))}
        </div>
      </div>

      <div
        className="log-entries"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <h4 style={{ fontSize: "14px", marginBottom: "10px", color: "#ccc" }}>
          Recent Activity:
        </h4>
        {attacks.slice(0, 50).map((attack, i) => {
          const severityInfo = getSeverityInfo(attack.severity);
          return (
            <div
              key={i}
              className="log-entry"
              style={{
                padding: "8px",
                margin: "5px 0",
                backgroundColor: "#2a2a2a",
                borderRadius: "4px",
                borderLeft: `3px solid ${
                  severityInfo.level === "high"
                    ? "#ff4757"
                    : severityInfo.level === "medium"
                    ? "#ffa726"
                    : severityInfo.level === "low"
                    ? "#ffeb3b"
                    : "#9e9e9e"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="timestamp"
                  style={{ fontSize: "11px", color: "#999" }}
                >
                  {new Date(attack.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={getSeverityClass(attack.severity)}
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {severityInfo.level}
                </span>
              </div>

              <div style={{ margin: "4px 0", fontSize: "13px" }}>
                <strong>{attack.source.country}</strong> ➜{" "}
                <strong>{attack.target.country}</strong>
              </div>

              <div style={{ fontSize: "12px", color: "#ccc" }}>
                <div>
                  🦠 <strong>{attack.type}</strong>
                </div>
                <div
                  style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}
                >
                  {severityInfo.label} - {severityInfo.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttackLog;
