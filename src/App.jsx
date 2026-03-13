import { useState, useRef, useCallback, useEffect } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Controls from './components/Controls';
import FormulaDisplay from './components/FormulaDisplay';
import Stats from './components/Stats';
import InfoPanel from './components/InfoPanel';

export default function App() {
  const [mode, setMode] = useState('realtime');
  const [speed, setSpeed] = useState('normal');
  const [sampleSize, setSampleSize] = useState(10000);
  const [points, setPoints] = useState([]);
  const [insideCount, setInsideCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pixelBuffer, setPixelBuffer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(() => {
    return !document.cookie.includes('info_seen=1');
  });

  const rafRef = useRef(null);
  const workerRef = useRef(null);
  const pointsRef = useRef([]);
  const insideRef = useRef(0);

  const handleReset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setPoints([]);
    setInsideCount(0);
    setTotalCount(0);
    setPixelBuffer(null);
    setIsRunning(false);
    setIsComputing(false);
    setProgress(0);
    pointsRef.current = [];
    insideRef.current = 0;
  }, []);

  const startRealtime = useCallback(() => {
    const batchSize = speed === 'fast' ? 100 : 10;

    // Generate first batch synchronously for instant visual feedback
    const firstPoints = [];
    let firstInside = 0;
    for (let i = 0; i < batchSize; i++) {
      const x = Math.random();
      const y = Math.random();
      const inside = x * x + y * y <= 1;
      if (inside) firstInside++;
      firstPoints.push({ x, y, inside });
    }

    pointsRef.current = firstPoints;
    insideRef.current = firstInside;

    setIsRunning(true);
    setPoints([...firstPoints]);
    setInsideCount(firstInside);
    setTotalCount(firstPoints.length);

    const step = () => {
      const currentLen = pointsRef.current.length;
      if (currentLen >= sampleSize) {
        setIsRunning(false);
        return;
      }

      const remaining = sampleSize - currentLen;
      const count = Math.min(batchSize, remaining);
      const newPoints = [];
      let newInside = 0;

      for (let i = 0; i < count; i++) {
        const x = Math.random();
        const y = Math.random();
        const inside = x * x + y * y <= 1;
        if (inside) newInside++;
        newPoints.push({ x, y, inside });
      }

      pointsRef.current = [...pointsRef.current, ...newPoints];
      insideRef.current += newInside;

      setPoints([...pointsRef.current]);
      setInsideCount(insideRef.current);
      setTotalCount(pointsRef.current.length);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [sampleSize, speed]);

  const startNonRealtime = useCallback(() => {
    setIsRunning(true);
    setIsComputing(true);

    const worker = new Worker(
      new URL('./workers/simulation.worker.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type } = e.data;
      if (type === 'progress') {
        setProgress(e.data.progress);
      } else {
        const { pixels, insideCount: count, totalCount: total } = e.data;
        setPixelBuffer(pixels);
        setInsideCount(count);
        setTotalCount(total);
        setProgress(1);
        setIsComputing(false);
        setIsRunning(false);
        worker.terminate();
        workerRef.current = null;
      }
    };

    worker.postMessage({ sampleSize });
  }, [sampleSize]);

  const handleStart = useCallback(() => {
    handleReset();
    if (mode === 'realtime') {
      startRealtime();
    } else {
      startNonRealtime();
    }
  }, [mode, handleReset, startRealtime, startNonRealtime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[rgba(0,0,0,0.8)]">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-8">
        <header className="text-center space-y-2 relative">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight text-[rgba(0,0,0,0.9)]">
              Monte Carlo π Approximation
            </h1>
            <button
              onClick={() => setShowInfo(true)}
              className="w-6 h-6 flex items-center justify-center rounded-full outline outline-1 outline-black/25 text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.8)] hover:outline-black/40 transition-colors text-xs font-medium cursor-pointer"
            >
              i
            </button>
          </div>
          <p className="text-sm text-[rgba(0,0,0,0.5)]">
            Estimating π by sampling random points in a unit square
          </p>
        </header>

        <InfoPanel isOpen={showInfo} onClose={() => {
          setShowInfo(false);
          document.cookie = 'info_seen=1; max-age=31536000; path=/';
        }} />

        <Controls
          mode={mode}
          setMode={setMode}
          speed={speed}
          setSpeed={setSpeed}
          sampleSize={sampleSize}
          setSampleSize={setSampleSize}
          isRunning={isRunning}
          onStart={handleStart}
          onReset={handleReset}
        />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <div className="shrink-0">
            <SimulationCanvas
              points={points}
              insideCount={insideCount}
              pixelBuffer={pixelBuffer}
              isComputing={isComputing}
              progress={progress}
            />
          </div>

          <div className="flex flex-col items-center lg:items-start gap-6 lg:py-6 lg:min-w-56">
            <FormulaDisplay insideCount={insideCount} totalCount={totalCount || points.length} />

            <Stats
              insideCount={insideCount}
              outsideCount={(totalCount || points.length) - insideCount}
            />
          </div>
        </div>

        <footer className="text-xs text-[rgba(0,0,0,0.3)] pt-4">
          &copy; 2026 Erdem Bircan
        </footer>
      </div>
    </div>
  );
}
