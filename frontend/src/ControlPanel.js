import React from "react";
import "./App.css";

function ControlPanel({ filters, setFilters }) {
  return (
    <div className="control-panel">
      <h2>Filters</h2>
      <label>
        Severity:
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
        >
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Unknown">Unknown</option>
        </select>
      </label>
    </div>
  );
}

export default ControlPanel;
