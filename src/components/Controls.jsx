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
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-[rgba(0,0,0,0.4)]">Mode</label>
        <div className="flex rounded-full overflow-hidden outline outline-1 outline-black/10">
          <button
            className={`px-3.5 py-1.5 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'realtime'
                ? 'bg-[rgba(0,0,0,0.85)] text-white'
                : 'bg-white text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.04)]'
            }`}
            onClick={() => setMode('realtime')}
            disabled={isRunning}
          >
            Realtime
          </button>
          <button
            className={`px-3.5 py-1.5 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'non-realtime'
                ? 'bg-[rgba(0,0,0,0.85)] text-white'
                : 'bg-white text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.04)]'
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
        <label className="text-xs font-medium uppercase tracking-wide text-[rgba(0,0,0,0.4)]">Samples</label>
        <input
          type="number"
          min="100"
          max="1000000"
          step="100"
          value={sampleSize}
          onChange={(e) => setSampleSize(Math.max(100, Number(e.target.value)))}
          disabled={isRunning}
          className="w-28 px-3 py-1.5 bg-white outline outline-1 outline-black/10 rounded-full text-sm text-[rgba(0,0,0,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Speed toggle — only in realtime mode */}
      {mode === 'realtime' && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-[rgba(0,0,0,0.4)]">Speed</label>
          <div className="flex rounded-full overflow-hidden outline outline-1 outline-black/10">
            <button
              className={`px-3.5 py-1.5 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                speed === 'normal'
                  ? 'bg-[rgba(0,0,0,0.85)] text-white'
                  : 'bg-white text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.04)]'
              }`}
              onClick={() => setSpeed('normal')}
              disabled={isRunning}
            >
              Normal
            </button>
            <button
              className={`px-3.5 py-1.5 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                speed === 'fast'
                  ? 'bg-[rgba(0,0,0,0.85)] text-white'
                  : 'bg-white text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.04)]'
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
      <div className="flex gap-2">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="px-5 py-1.5 bg-[rgba(0,0,0,0.85)] hover:bg-[rgba(0,0,0,0.75)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
        >
          Start
        </button>
        <button
          onClick={onReset}
          className="px-5 py-1.5 bg-white hover:bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.6)] text-sm font-medium rounded-full outline outline-1 outline-black/10 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
