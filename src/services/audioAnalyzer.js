/**
 * Audio Context Analyzer for volume levels, pause duration, and vocal rhythm visualizer
 */
export class AudioAnalyzerService {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.stream = null;
    this.dataArray = null;
    this.animFrameId = null;
    this.onVolumeUpdate = null;
    this.onPauseDetected = null;
    this.lastSoundTime = Date.now();
    this.isPaused = false;
    this.silenceThreshold = 0.03; // RMS volume cutoff
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this._loop();
      return { success: true };
    } catch (err) {
      console.warn('Audio Analyzer Start Error:', err);
      return { success: false, error: err.message };
    }
  }

  stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  _loop() {
    if (!this.analyser) return;
    this.analyser.getByteFrequencyData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const average = sum / this.dataArray.length;
    const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));

    // Check silence for pause detection
    const now = Date.now();
    if (normalizedVolume > 5) {
      this.lastSoundTime = now;
      if (this.isPaused) {
        const pauseDurationMs = now - this.pauseStartTime;
        this.isPaused = false;
        if (this.onPauseDetected) {
          this.onPauseDetected({
            durationSec: Math.round(pauseDurationMs / 100) / 10,
            type: pauseDurationMs > 2500 ? 'long_hesitation' : 'intentional_pause'
          });
        }
      }
    } else {
      if (!this.isPaused && now - this.lastSoundTime > 1200) {
        this.isPaused = true;
        this.pauseStartTime = this.lastSoundTime;
      }
    }

    if (this.onVolumeUpdate) {
      this.onVolumeUpdate(normalizedVolume, this.dataArray);
    }

    this.animFrameId = requestAnimationFrame(() => this._loop());
  }
}
