export default function FormulaDisplay({ insideCount, totalCount }) {
  const piApprox = totalCount > 0 ? (4 * insideCount) / totalCount : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-4xl font-semibold tracking-tight text-[rgba(0,0,0,0.85)]">
        {totalCount > 0 ? piApprox.toFixed(6) : '—'}
      </span>
      <div className="text-sm font-mono text-[rgba(0,0,0,0.35)]">
        <span>π ≈ 4 · r / n</span>
      </div>
    </div>
  );
}
