import { CameraManager, PhotoCapture } from "./src";

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start");
  const photoButton = document.getElementById("photo");
  const video = document.getElementById("camera") as HTMLVideoElement;

  startButton?.addEventListener("click", async () => {
    try {
      await CameraManager.openCamera({
        targetElementId: "camera",
        facingMode: "environment",
        width: 1280,
        height: 720,
        frameRate: 30,
        audio: false,
      });
      console.log("Camera opened");
    } catch (err) {
      console.error("Failed to open camera:", err);
    }
  });

  photoButton?.addEventListener("click", async () => {
    try {
      // Capture 3 burst photos with 300ms interval, grayscale + brightness filter, 1-second timer
      const photos = await PhotoCapture.capturePhoto({
        mimeType: "image/jpeg",
        quality: 0.9,
        filters: "grayscale(1) brightness(120%)",
        burstCount: 3,
        burstIntervalMs: 300,
        timerMs: 1000,
      });

      photos.forEach((blob, i) => {
        const url = URL.createObjectURL(blob);
        window.open(url, `_photo_${i}`);
      });
    } catch (err) {
      console.error("Failed to capture photo:", err);
    }
  });
});
