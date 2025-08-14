import type { VideoOptions, ProgressCallback } from "./types";
import { CameraManager } from "./CameraManager";

export class VideoRecorder {
  private static mediaRecorder: MediaRecorder | null = null;
  private static chunks: BlobPart[] = [];

  static async recordVideo(
    options: VideoOptions & { onProgress?: ProgressCallback }
  ): Promise<Blob> {
    const videoElement = CameraManager.getVideoElement();
    const stream = CameraManager.getStream();

    if (!videoElement || !stream) {
      throw new Error("Camera not opened.");
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      throw new Error("Recording already in progress.");
    }

    const {
      duration = 5000,
      mimeType = "video/webm",
      audio = false,
      onProgress,
    } = options;

    this.chunks = [];

    this.mediaRecorder = new MediaRecorder(stream, { mimeType });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };

    let elapsed = 0;
    const intervalMs = 100;
    let timerId: number | null = null;

    return new Promise((resolve, reject) => {
      this.mediaRecorder!.onstop = () => {
        if (timerId !== null) clearInterval(timerId);
        resolve(new Blob(this.chunks, { type: mimeType }));
      };

      this.mediaRecorder!.onerror = (event) => {
        if (timerId !== null) clearInterval(timerId);
        reject(new Error(`MediaRecorder error: ${(event as any).error}`));
      };

      this.mediaRecorder!.start();

      if (onProgress) {
        timerId = window.setInterval(() => {
          elapsed += intervalMs;
          onProgress(Math.min(elapsed / duration, 1));
          if (
            elapsed >= duration &&
            this.mediaRecorder?.state === "recording"
          ) {
            this.mediaRecorder.stop();
          }
        }, intervalMs);
      } else {
        setTimeout(() => {
          if (this.mediaRecorder?.state === "recording") {
            this.mediaRecorder.stop();
          }
        }, duration);
      }
    });
  }

  static pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
    }
  }

  static resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
    }
  }

  static stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
}
