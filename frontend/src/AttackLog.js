function AttackLog({ attacks }) {
  const totalAttacks = attacks.length;
  const severityCount = (level) =>
    attacks.filter((a) => a.severity === level).length;

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex-1">
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-white">Attack Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-300">Total: <span className="text-white font-semibold">{totalAttacks}</span></p>
          <p className="text-gray-300">High: <span className="text-red-400 font-semibold">{severityCount("High")}</span></p>
          <p className="text-gray-300">Medium: <span className="text-orange-400 font-semibold">{severityCount("Medium")}</span></p>
          <p className="text-gray-300">Low: <span className="text-yellow-400 font-semibold">{severityCount("Low")}</span></p>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-bold mb-3 text-white">Recent Attacks</h3>
        {attacks.slice(0, 20).map((attack) => (
          <div key={attack.id} className="p-3 bg-gray-800 rounded text-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-gray-400">
                {new Date(attack.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-xs font-semibold ${getSeverityColor(attack.severity)}`}>
                {attack.severity}
              </span>
            </div>
            <div className="text-white">
              <span className="font-medium">{attack.source.country}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="font-medium">{attack.target.country}</span>
            </div>
            <div className="text-blue-400 font-medium mt-1">
              {attack.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AttackLog;
