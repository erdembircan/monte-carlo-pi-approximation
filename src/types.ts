export interface Point {
  x: number;
  y: number;
  inside: boolean;
}

export interface WorkerProgressMessage {
  type: 'progress';
  progress: number;
}

export interface WorkerDoneMessage {
  type: 'done';
  pixels: Uint8ClampedArray;
  insideCount: number;
  totalCount: number;
}

export type WorkerMessage = WorkerProgressMessage | WorkerDoneMessage;

export type Mode = 'realtime' | 'non-realtime';
export type Speed = 'normal' | 'fast';
