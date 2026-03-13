export default function FormulaDisplay({ insideCount, totalCount }) {
  const piApprox = totalCount > 0 ? (4 * insideCount) / totalCount : 0;

  return (
    <div className="text-lg font-mono text-center">
      <span className="text-gray-500">π/4 ≈ r/n</span>
      <span className="mx-3 text-gray-500">⟹</span>
      <span className="text-gray-500">π ≈ 4 · r/n</span>
      <span className="mx-3">=</span>
      <span className="text-2xl font-bold text-emerald-600">
        {totalCount > 0 ? piApprox.toFixed(6) : '—'}
      </span>
    </div>
  );
}
