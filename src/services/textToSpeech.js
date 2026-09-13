/**
 * Text-to-Speech (TTS) Voice Synthesis Service using Web Speech API
 * Completes the STT -> LLM -> TTS Voice Loop
 */

export class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.selectedVoice = null;
    this.isMuted = false;
    this.isSpeaking = false;
    this.rate = 1.05; // Slightly clear, natural coaching speed
    this.pitch = 1.0;
    this.onStartSpeaking = null;
    this.onEndSpeaking = null;

    if (this.synth) {
      this._loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this._loadVoices();
      }
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  _loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    // Prefer high-quality natural English voices
    const preferred = this.voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Alex')) &&
      v.lang.startsWith('en')
    );

    const englishFallback = this.voices.find(v => v.lang.startsWith('en'));
    this.selectedVoice = preferred || englishFallback || this.voices[0] || null;
  }

  speak(text, { onStart, onEnd } = {}) {
    if (!this.synth || this.isMuted || !text) return;

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
      if (this.onStartSpeaking) this.onStartSpeaking();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      if (this.onEndSpeaking) this.onEndSpeaking();
    };

    utterance.onerror = (err) => {
      console.warn('TTS Speech Error:', err);
      this.isSpeaking = false;
      if (onEnd) onEnd();
      if (this.onEndSpeaking) this.onEndSpeaking();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }
}

export const ttsService = new TextToSpeechService();
