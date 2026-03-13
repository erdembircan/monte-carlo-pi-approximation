self.onmessage = function (e) {
  const { sampleSize } = e.data;
  const points = new Float32Array(sampleSize * 2);
  let insideCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const x = Math.random();
    const y = Math.random();
    points[i * 2] = x;
    points[i * 2 + 1] = y;
    if (x * x + y * y <= 1) {
      insideCount++;
    }
  }

  self.postMessage({ points, insideCount }, [points.buffer]);
};
