/**
 * Camera stream and snapshot manager for WebRTC video feed and frame capture
 */
export class CameraManager {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.activeRequestId = 0;
  }

  async startCamera(videoElement) {
    this.videoElement = videoElement;
    const currentReqId = ++this.activeRequestId;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        success: false,
        status: 'unsupported',
        error: 'WebRTC camera access is not supported by your browser or origin (HTTPS required).'
      };
    }

    // Stop existing stream if any
    this.stopCamera();

    try {
      // First attempt: High definition user-facing camera
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
      } catch (hdErr) {
        // Fallback attempt: Basic video constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      // Check if request was cancelled while waiting for user prompt
      if (currentReqId !== this.activeRequestId) {
        stream.getTracks().forEach(track => track.stop());
        return { success: false, status: 'cancelled' };
      }

      this.stream = stream;

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        try {
          await this.videoElement.play();
        } catch (playErr) {
          if (playErr.name !== 'AbortError') {
            console.warn('Video play warning:', playErr);
          }
        }
      }

      return { success: true, status: 'granted' };
    } catch (err) {
      console.warn('Camera Access Error:', err);
      let status = 'error';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        status = 'denied';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        status = 'not_found';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        status = 'in_use';
      }

      return {
        success: false,
        status,
        error: err.message || 'Camera permission denied or unavailable'
      };
    }
  }

  stopCamera() {
    this.activeRequestId++;
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  setVideoEnabled(enabled) {
    if (this.stream) {
      this.stream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
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
