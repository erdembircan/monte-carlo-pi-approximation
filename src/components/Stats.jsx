export default function Stats({ insideCount, outsideCount }) {
  const total = insideCount + outsideCount;

  return (
    <div className="flex gap-6 text-lg font-mono">
      <span>
        <span className="text-red-600 font-semibold">r</span> ={' '}
        {insideCount.toLocaleString()}
      </span>
      <span>
        <span className="text-blue-600 font-semibold">b</span> ={' '}
        {outsideCount.toLocaleString()}
      </span>
      <span>
        <span className="font-semibold">n</span> = r + b ={' '}
        {total.toLocaleString()}
      </span>
    </div>
  );
}
