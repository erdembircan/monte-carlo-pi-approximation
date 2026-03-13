import { useState, useRef, useCallback, useEffect } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Controls from './components/Controls';
import FormulaDisplay from './components/FormulaDisplay';
import Stats from './components/Stats';

export default function App() {
  const [mode, setMode] = useState('realtime');
  const [speed, setSpeed] = useState('normal');
  const [sampleSize, setSampleSize] = useState(10000);
  const [points, setPoints] = useState([]);
  const [insideCount, setInsideCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComputing, setIsComputing] = useState(false);

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
      const { points: rawPoints, insideCount: count } = e.data;
      const parsed = [];
      for (let i = 0; i < rawPoints.length; i += 2) {
        const x = rawPoints[i];
        const y = rawPoints[i + 1];
        parsed.push({ x, y, inside: x * x + y * y <= 1 });
      }

      pointsRef.current = parsed;
      insideRef.current = count;
      setPoints(parsed);
      setInsideCount(count);
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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Monte Carlo π Approximation
        </h1>

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
          isComputing={isComputing}
        />

        <FormulaDisplay insideCount={insideCount} totalCount={points.length} />

        <Stats
          insideCount={insideCount}
          outsideCount={points.length - insideCount}
        />
      </div>
    </div>
  );
}
