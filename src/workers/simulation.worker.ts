const CANVAS_SIZE = 500;
const PADDING = 40;
const PLOT_SIZE = CANVAS_SIZE - PADDING * 2;

const INSIDE_R = 2, INSIDE_G = 132, INSIDE_B = 199;
const OUTSIDE_R = 219, OUTSIDE_G = 39, OUTSIDE_B = 119;

self.onmessage = function (e: MessageEvent<{ sampleSize: number }>) {
  const { sampleSize } = e.data;

  const pixels = new Uint8ClampedArray(CANVAS_SIZE * CANVAS_SIZE * 4);
  let insideCount = 0;

  const progressInterval = Math.max(1, Math.floor(sampleSize / 100));

  for (let i = 0; i < sampleSize; i++) {
    const x = Math.random();
    const y = Math.random();
    const inside = x * x + y * y <= 1;
    if (inside) insideCount++;

    const px = (PADDING + x * PLOT_SIZE) | 0;
    const py = (PADDING + (1 - y) * PLOT_SIZE) | 0;
    const r = inside ? INSIDE_R : OUTSIDE_R;
    const g = inside ? INSIDE_G : OUTSIDE_G;
    const b = inside ? INSIDE_B : OUTSIDE_B;

    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const xi = px + dx;
        const yi = py + dy;
        if (xi >= 0 && xi < CANVAS_SIZE && yi >= 0 && yi < CANVAS_SIZE) {
          const idx = (yi * CANVAS_SIZE + xi) * 4;
          pixels[idx] = r;
          pixels[idx + 1] = g;
          pixels[idx + 2] = b;
          pixels[idx + 3] = 210;
        }
      }
    }

    if (i % progressInterval === 0) {
      self.postMessage({ type: 'progress', progress: i / sampleSize });
    }
  }

  self.postMessage(
    { type: 'done', pixels, insideCount, totalCount: sampleSize },
    { transfer: [pixels.buffer] }
  );
};
