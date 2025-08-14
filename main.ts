import { CameraManager, PhotoCapture, VideoRecorder } from "./src";

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start");
  const photoButton = document.getElementById("photo");
  const recordButton = document.getElementById("record");
  const pauseButton = document.getElementById("pause");
  const resumeButton = document.getElementById("resume");
  const stopButton = document.getElementById("stop");
  const video = document.getElementById("camera") as HTMLVideoElement;

  let recordedBlob: Blob | null = null;

  startButton?.addEventListener("click", async () => {
    try {
      await CameraManager.openCamera({
        targetElementId: "camera",
        facingMode: "environment",
        width: 1280,
        height: 720,
        frameRate: 30,
        audio: true,
      });
      console.log("Camera opened");
    } catch (err) {
      console.error("Failed to open camera:", err);
    }
  });

  photoButton?.addEventListener("click", async () => {
    try {
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

  recordButton?.addEventListener("click", async () => {
    try {
      recordedBlob = await VideoRecorder.recordVideo({
        targetElementId: "camera",
        duration: 10000, // 10 seconds recording
        mimeType: "video/webm",
        audio: true,
        onProgress: (progress) => {
          console.log(`Recording progress: ${(progress * 100).toFixed(1)}%`);
        },
      });
      console.log("Recording complete");
      const url = URL.createObjectURL(recordedBlob);
      window.open(url, "_video");
    } catch (err) {
      console.error("Failed to record video:", err);
    }
  });

  pauseButton?.addEventListener("click", () => {
    try {
      VideoRecorder.pauseRecording();
      console.log("Recording paused");
    } catch {
      console.warn("No active recording to pause");
    }
  });

  resumeButton?.addEventListener("click", () => {
    try {
      VideoRecorder.resumeRecording();
      console.log("Recording resumed");
    } catch {
      console.warn("No paused recording to resume");
    }
  });

  stopButton?.addEventListener("click", () => {
    try {
      VideoRecorder.stopRecording();
      console.log("Recording stopped");
    } catch {
      console.warn("No active recording to stop");
    }
  });
});
