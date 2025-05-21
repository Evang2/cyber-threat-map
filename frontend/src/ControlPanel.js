function ControlPanel({ filters, setFilters }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Severity:
          </label>
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Type:
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="DDoS">DDoS</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware">Malware</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
