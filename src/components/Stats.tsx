export default function Stats({ insideCount, outsideCount }) {
  const total = insideCount + outsideCount;

  return (
    <div className="flex flex-col gap-2 text-sm font-mono text-[rgba(0,0,0,0.5)] tabular-nums">
      <span>
        <span className="text-sky-600 font-semibold">r</span> ={' '}
        {insideCount.toLocaleString()}
      </span>
      <span>
        <span className="text-pink-600 font-semibold">b</span> ={' '}
        {outsideCount.toLocaleString()}
      </span>
      <span>
        <span className="font-semibold text-[rgba(0,0,0,0.7)]">n</span> = r + b ={' '}
        {total.toLocaleString()}
      </span>
    </div>
  );
}
