import { useRef, useEffect } from 'react';
import type { Point } from '../types';

const CANVAS_SIZE = 500;
const PADDING = 40;
const PLOT_SIZE = CANVAS_SIZE - PADDING * 2;

function drawRealtimeDots(bufCtx: CanvasRenderingContext2D, points: Point[], startIdx: number) {
  if (startIdx >= points.length) return;

  for (let i = startIdx; i < points.length; i++) {
    const { x, y, inside } = points[i];
    const px = PADDING + x * PLOT_SIZE;
    const py = PADDING + (1 - y) * PLOT_SIZE;

    bufCtx.fillStyle = inside
      ? 'rgba(2, 132, 199, 0.85)'
      : 'rgba(219, 39, 119, 0.7)';
    bufCtx.fillRect(px - 1, py - 1, 2, 2);
  }
}

function drawStaticElements(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Grid lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
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
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (let i = 0; i <= 4; i++) {
    const val = (i / 4).toFixed(2);
    const pos = PADDING + (i / 4) * PLOT_SIZE;
    ctx.fillText(val, pos, CANVAS_SIZE - 14);
    ctx.save();
    ctx.textAlign = 'right';
    ctx.fillText((1 - i / 4).toFixed(2), PADDING - 8, pos + 4);
    ctx.restore();
  }

  // Quarter circle arc
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(PADDING, PADDING + PLOT_SIZE, PLOT_SIZE, -Math.PI / 2, 0);
  ctx.stroke();
}

interface SimulationCanvasProps {
  points: Point[];
  insideCount: number;
  pixelBuffer: Uint8ClampedArray | null;
  isComputing: boolean;
  progress: number;
}

export default function SimulationCanvas({ points, insideCount, pixelBuffer, isComputing, progress }: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const drawnCountRef = useRef(0);

  // Initialize offscreen buffer
  useEffect(() => {
    const buffer = document.createElement('canvas');
    buffer.width = CANVAS_SIZE;
    buffer.height = CANVAS_SIZE;
    bufferRef.current = buffer;
    drawnCountRef.current = 0;
  }, []);

  // Render pixel buffer from worker (non-realtime)
  useEffect(() => {
    if (!pixelBuffer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    drawStaticElements(ctx);

    // Draw the pre-rendered pixel buffer via a temp canvas
    const tmp = document.createElement('canvas');
    tmp.width = CANVAS_SIZE;
    tmp.height = CANVAS_SIZE;
    const tmpCtx = tmp.getContext('2d')!;
    const imageData = new ImageData(new Uint8ClampedArray(pixelBuffer), CANVAS_SIZE, CANVAS_SIZE);
    tmpCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tmp, 0, 0);

    // Border around plot area
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(PADDING, PADDING, PLOT_SIZE, PLOT_SIZE);
  }, [pixelBuffer]);

  // Draw realtime points incrementally onto buffer, then composite
  useEffect(() => {
    if (pixelBuffer) return;
    const canvas = canvasRef.current;
    const buffer = bufferRef.current;
    if (!canvas || !buffer) return;

    const bufCtx = buffer.getContext('2d')!;

    // Detect reset: if points decreased, clear the buffer
    if (points.length < drawnCountRef.current) {
      bufCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawnCountRef.current = 0;
    }

    drawRealtimeDots(bufCtx, points, drawnCountRef.current);
    drawnCountRef.current = points.length;

    const ctx = canvas.getContext('2d')!;
    drawStaticElements(ctx);

    // Composite buffered dots
    ctx.drawImage(buffer, 0, 0);

    // Border around plot area
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(PADDING, PADDING, PLOT_SIZE, PLOT_SIZE);
  }, [points, insideCount, pixelBuffer]);

  return (
    <div className="relative rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block rounded-xl"
      />
      {isComputing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/85 rounded-2xl">
          <div className="flex flex-col items-center gap-3 w-48">
            <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="text-sm text-[rgba(0,0,0,0.5)]">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
