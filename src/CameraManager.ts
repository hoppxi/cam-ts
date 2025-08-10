import type { CameraOptions } from "./types";

export class CameraManager {
  private static stream: MediaStream | null = null;
  private static videoElement: HTMLVideoElement | null = null;
  private static currentFacingMode: "user" | "environment" = "user";

  static async openCamera(options: CameraOptions): Promise<void> {
    if (this.stream) this.stopCamera();

    const {
      targetElementId,
      facingMode = "user",
      width,
      height,
      frameRate,
      audio = false,
    } = options;

    this.currentFacingMode = facingMode;
    this.videoElement = document.getElementById(
      targetElementId
    ) as HTMLVideoElement;
    if (!this.videoElement)
      throw new Error(`Element with ID ${targetElementId} not found.`);

    const constraints: MediaStreamConstraints = {
      video: { facingMode, width, height, frameRate },
      audio,
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.videoElement.srcObject = this.stream;
    await this.videoElement.play();
  }

  static stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }
  }

  static async switchCamera(): Promise<void> {
    this.currentFacingMode =
      this.currentFacingMode === "user" ? "environment" : "user";
    if (!this.videoElement) throw new Error("Camera not opened.");

    const hasAudio = this.stream
      ? this.stream.getAudioTracks().length > 0
      : false;

    this.stopCamera();

    await this.openCamera({
      targetElementId: this.videoElement.id,
      facingMode: this.currentFacingMode,
      audio: hasAudio,
    });
  }

  static applyFilters(filters: string) {
    if (!this.videoElement) throw new Error("Camera not opened.");
    this.videoElement.style.filter = filters;
  }

  static getStream() {
    return this.stream;
  }

  static getVideoElement() {
    return this.videoElement;
  }
}
