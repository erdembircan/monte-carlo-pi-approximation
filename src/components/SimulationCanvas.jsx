import { useRef, useEffect } from 'react';

const CANVAS_SIZE = 500;
const PADDING = 40;
const PLOT_SIZE = CANVAS_SIZE - PADDING * 2;

export default function SimulationCanvas({ points, insideCount, isComputing }) {
  const canvasRef = useRef(null);
  const bufferRef = useRef(null);
  const drawnCountRef = useRef(0);

  // Initialize offscreen buffer
  useEffect(() => {
    const buffer = document.createElement('canvas');
    buffer.width = CANVAS_SIZE;
    buffer.height = CANVAS_SIZE;
    bufferRef.current = buffer;
    drawnCountRef.current = 0;
  }, []);

  // Reset buffer when points are cleared
  const pointCount = points.length;
  useEffect(() => {
    if (pointCount === 0 && bufferRef.current) {
      const ctx = bufferRef.current.getContext('2d');
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawnCountRef.current = 0;
    }
  }, [pointCount]);

  // Draw new points incrementally onto buffer, then composite
  useEffect(() => {
    const canvas = canvasRef.current;
    const buffer = bufferRef.current;
    if (!canvas || !buffer) return;

    const bufCtx = buffer.getContext('2d');
    const startIdx = drawnCountRef.current;

    // Draw only new points onto the buffer
    for (let i = startIdx; i < points.length; i++) {
      const { x, y, inside } = points[i];
      const px = PADDING + x * PLOT_SIZE;
      const py = PADDING + (1 - y) * PLOT_SIZE;

      bufCtx.fillStyle = inside ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)';
      bufCtx.beginPath();
      bufCtx.arc(px, py, 1.5, 0, Math.PI * 2);
      bufCtx.fill();
    }
    drawnCountRef.current = points.length;

    // Draw the main canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Plot area background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(PADDING, PADDING, PLOT_SIZE, PLOT_SIZE);

    // Grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const pos = PADDING + (i / 4) * PLOT_SIZE;
      ctx.beginPath();
      ctx.moveTo(pos, PADDING);
      ctx.lineTo(pos, PADDING + PLOT_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(PADDING, pos);
      ctx.lineTo(PADDING + PLOT_SIZE, pos);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = '#4b5563';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4).toFixed(2);
      const pos = PADDING + (i / 4) * PLOT_SIZE;
      ctx.fillText(val, pos, CANVAS_SIZE - 12);
      ctx.save();
      ctx.textAlign = 'right';
      ctx.fillText((1 - i / 4).toFixed(2), PADDING - 6, pos + 4);
      ctx.restore();
    }

    // Quarter circle arc
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(PADDING, PADDING + PLOT_SIZE, PLOT_SIZE, -Math.PI / 2, 0);
    ctx.stroke();

    // Composite buffered dots
    ctx.drawImage(buffer, 0, 0);

    // Border around plot area
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.strokeRect(PADDING, PADDING, PLOT_SIZE, PLOT_SIZE);
  }, [points, insideCount]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-lg"
      />
      {isComputing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Computing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
