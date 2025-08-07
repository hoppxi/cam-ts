export interface CameraOptions {
  targetElementId: string;
}

export interface VideoOptions extends CameraOptions {
  duration?: number;
}

export class Capture {
  static openCamera({ targetElementId }: CameraOptions): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      const videoElement = document.getElementById(targetElementId) as HTMLVideoElement;

      if (!videoElement) {
        reject(new Error(`Element with ID ${targetElementId} not found.`));
        return;
      }

      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
          resolve(stream);
        })
        .catch(reject);
    });
  }

  static capturePhoto({ targetElementId }: CameraOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const videoElement = document.getElementById(targetElementId) as HTMLVideoElement;

      if (!videoElement || !videoElement.srcObject) {
        reject(new Error(`Element with ID ${targetElementId} not found or camera not opened.`));
        return;
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      videoElement.addEventListener('loadedmetadata', () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob."));
        }, 'image/jpeg');
      });
    });
  }

  static recordVideo({ targetElementId, duration = 5000 }: VideoOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const videoElement = document.getElementById(targetElementId) as HTMLVideoElement;

      if (!videoElement || !videoElement.srcObject) {
        reject(new Error(`Element with ID ${targetElementId} not found or camera not opened.`));
        return;
      }

      const mediaStream = videoElement.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm',
      });

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        resolve(new Blob(chunks, { type: 'video/webm' }));
      };

      mediaRecorder.start();

      setTimeout(() => mediaRecorder.stop(), duration);
    });
  }
}

