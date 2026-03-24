const PI_STR = Math.PI.toFixed(6);

interface FormulaDisplayProps {
  insideCount: number;
  totalCount: number;
}

export default function FormulaDisplay({ insideCount, totalCount }: FormulaDisplayProps) {
  const piApprox = totalCount > 0 ? (4 * insideCount) / totalCount : 0;
  const approxStr = piApprox.toFixed(6);

  // Find how many characters match from the left
  let matchLen = 0;
  if (totalCount > 0) {
    for (let i = 0; i < approxStr.length; i++) {
      if (approxStr[i] === PI_STR[i]) {
        matchLen = i + 1;
      } else {
        break;
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums">
        {totalCount > 0 ? (
          <>
            <span className="bg-emerald-100 text-emerald-700 px-0.5">
              {approxStr.slice(0, matchLen)}
            </span>
            <span className="bg-red-100 text-red-600 px-0.5">
              {approxStr.slice(matchLen)}
            </span>
          </>
        ) : '—'}
      </span>
      <div className="text-sm font-mono text-[rgba(0,0,0,0.35)]">
        <span>π ≈ 4 · r / n</span>
      </div>
    </div>
  );
}
