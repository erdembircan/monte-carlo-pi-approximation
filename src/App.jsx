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
    pointsRef.current = [];
    insideRef.current = 0;
  }, []);

  const startRealtime = useCallback(() => {
    setIsRunning(true);
    pointsRef.current = [];
    insideRef.current = 0;

    const batchSize = speed === 'fast' ? 100 : 10;

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
      const { pixels, insideCount: count, totalCount: total } = e.data;
      setPixelBuffer(pixels);
      setInsideCount(count);
      setTotalCount(total);
      setIsComputing(false);
      setIsRunning(false);
      worker.terminate();
      workerRef.current = null;
    };

    worker.postMessage({ sampleSize });
  }, [sampleSize]);

  const handleStart = useCallback(() => {
    handleReset();
    setTimeout(() => {
      if (mode === 'realtime') {
        startRealtime();
      } else {
        startNonRealtime();
      }
    }, 0);
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
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center gap-10">
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

        <SimulationCanvas
          points={points}
          insideCount={insideCount}
          pixelBuffer={pixelBuffer}
          isComputing={isComputing}
        />

        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <FormulaDisplay insideCount={insideCount} totalCount={totalCount || points.length} />

          <Stats
            insideCount={insideCount}
            outsideCount={(totalCount || points.length) - insideCount}
          />
        </div>

        <footer className="text-xs text-[rgba(0,0,0,0.3)] pt-4">
          &copy; 2026 Erdem Bircan
        </footer>
      </div>
    </div>
  );
}
