/**
 * Camera stream and snapshot manager for WebRTC video feed and frame capture
 */
export class CameraManager {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.canvasElement = null;
  }

  async startCamera(videoElement) {
    this.videoElement = videoElement;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        await this.videoElement.play();
      }
      return { success: true };
    } catch (err) {
      console.warn('Camera Access Error:', err);
      return { success: false, error: err.message || 'Camera permission denied or unavailable' };
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  captureFrameBase64(maxDimension = 640) {
    if (!this.videoElement || !this.stream) return null;
    if (!this.canvasElement) {
      this.canvasElement = document.createElement('canvas');
    }

    const video = this.videoElement;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > height) {
      if (width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      }
    } else {
      if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    this.canvasElement.width = width;
    this.canvasElement.height = height;

    const ctx = this.canvasElement.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    return this.canvasElement.toDataURL('image/jpeg', 0.7);
  }
}
