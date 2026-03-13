export default function Controls({
  mode,
  setMode,
  speed,
  setSpeed,
  sampleSize,
  setSampleSize,
  isRunning,
  onStart,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Mode:</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            className={`px-3 py-1.5 text-sm transition-colors ${
              mode === 'realtime'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('realtime')}
            disabled={isRunning}
          >
            Realtime
          </button>
          <button
            className={`px-3 py-1.5 text-sm transition-colors ${
              mode === 'non-realtime'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('non-realtime')}
            disabled={isRunning}
          >
            Non-realtime
          </button>
        </div>
      </div>

      {/* Sample size */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Samples:</label>
        <input
          type="number"
          min="100"
          max="1000000"
          step="100"
          value={sampleSize}
          onChange={(e) => setSampleSize(Math.max(100, Number(e.target.value)))}
          disabled={isRunning}
          className="w-28 px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 disabled:opacity-50"
        />
      </div>

      {/* Speed toggle — only in realtime mode */}
      {mode === 'realtime' && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Speed:</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              className={`px-3 py-1.5 text-sm transition-colors ${
                speed === 'normal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSpeed('normal')}
              disabled={isRunning}
            >
              Normal
            </button>
            <button
              className={`px-3 py-1.5 text-sm transition-colors ${
                speed === 'fast'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSpeed('fast')}
              disabled={isRunning}
            >
              Fast
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Start
        </button>
        <button
          onClick={onReset}
          className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
