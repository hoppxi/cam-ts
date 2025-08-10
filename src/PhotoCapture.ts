import type { PhotoOptions } from "./types";
import { CameraManager } from "./CameraManager";

export class PhotoCapture {
  static async capturePhoto(options: PhotoOptions = {}): Promise<Blob[]> {
    const videoElement = CameraManager.getVideoElement();
    const stream = CameraManager.getStream();

    if (!videoElement || !stream) {
      throw new Error("Camera not opened.");
    }

    const {
      mimeType = "image/jpeg",
      quality = 0.92,
      filters = "",
      burstCount = 1,
      burstIntervalMs = 200,
      timerMs = 0,
    } = options;

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (filters) ctx.filter = filters;

    const photos: Blob[] = [];

    if (timerMs > 0) {
      await new Promise((r) => setTimeout(r, timerMs));
    }

    for (let i = 0; i < burstCount; i++) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error("Failed to create photo blob.")),
          mimeType,
          quality
        );
      });
      photos.push(blob);

      if (i < burstCount - 1) {
        await new Promise((r) => setTimeout(r, burstIntervalMs));
      }
    }

    return photos;
  }
}
