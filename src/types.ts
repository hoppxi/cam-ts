export interface CameraOptions {
  targetElementId: string;
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
  frameRate?: number;
  audio?: boolean;
}

export interface PhotoOptions {
  mimeType?: string;
  quality?: number;
  filters?: string;
  burstCount?: number;
  burstIntervalMs?: number;
  timerMs?: number;
}

export interface VideoOptions extends CameraOptions {
  duration?: number;
  mimeType?: string;
  audio?: boolean;
}

export type ProgressCallback = (progress: number) => void;
