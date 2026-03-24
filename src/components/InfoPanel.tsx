interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-[-4px_0_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto px-8 py-10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.4)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>

          <h2 className="text-2xl font-semibold tracking-tight text-[rgba(0,0,0,0.9)] mb-6">
            About This Experiment
          </h2>

          <div className="space-y-4 text-[15px] leading-relaxed text-[rgba(0,0,0,0.7)]">
            <p>
              The <strong className="text-[rgba(0,0,0,0.85)]">Monte Carlo method</strong> is
              a statistical technique that uses random sampling to estimate numerical results.
              It is named after the Monte Carlo Casino in Monaco, reflecting the element of
              chance central to the approach.
            </p>

            <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.85)] pt-2">How It Works</h3>
            <p>
              Imagine a unit square with side length 1 and a quarter circle of radius 1
              inscribed in its corner. The area of the quarter circle
              is <em>π/4</em>, while the area of the square is 1.
            </p>
            <p>
              If we scatter random points uniformly across the square, the fraction that
              land inside the quarter circle approximates the ratio of the two areas:
            </p>
            <div className="font-mono text-center py-3 text-[rgba(0,0,0,0.6)]">
              inside / total ≈ π / 4
            </div>
            <p>
              Rearranging gives us:
            </p>
            <div className="font-mono text-center py-3 text-[rgba(0,0,0,0.85)] font-semibold">
              π ≈ 4 × (inside / total)
            </div>

            <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.85)] pt-2">The Test</h3>
            <p>
              A point <em>(x, y)</em> falls inside the quarter circle if it satisfies:
            </p>
            <div className="font-mono text-center py-3 text-[rgba(0,0,0,0.6)]">
              x² + y² ≤ 1
            </div>

            <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.85)] pt-2">Convergence</h3>
            <p>
              By the law of large numbers, as the sample size increases, the approximation
              converges toward the true value of π (3.14159...). With 10,000 points you
              typically get 2 correct decimal places; with 1,000,000 you can expect 3–4.
            </p>

            <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.85)] pt-2">Why It Matters</h3>
            <p>
              Monte Carlo methods are used far beyond estimating π. They are essential tools
              in physics simulations, financial modeling, engineering design, computer graphics,
              and artificial intelligence — anywhere a problem is too complex for an exact
              analytical solution.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
