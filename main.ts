import { Capture } from './src/Capture';
// Tests
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start');
  const photoButton = document.getElementById('photo');
  const video = document.getElementById('camera') as HTMLVideoElement;

  startButton?.addEventListener('click', async () => {
    await Capture.openCamera({ targetElementId: 'camera' });
  });

  photoButton?.addEventListener('click', async () => {
    const blob = await Capture.capturePhoto({ targetElementId: 'camera' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
});

