/**
 * Real-time Speech Recognition Service using Web Speech API with advanced Word Classification Engine
 */

export const POWER_WORDS = [
  'discovered', 'transformed', 'suddenly', 'breakthrough', 'pivot', 'critical',
  'imagine', 'truth', 'impact', 'mastered', 'essential', 'unforgettable',
  'struggle', 'crisis', 'victory', 'revelation', 'turning point', 'secret',
  'proven', 'extraordinary', 'remarkable', 'key', 'challenge', 'fear'
];

export const JARGON_WORDS = [
  'synergy', 'paradigm', 'leverage', 'utilize', 'bandwidth', 'modalities',
  'infrastructure', 'optimization', 'scalability', 'actionable', 'deliverable',
  'ecosystem', 'orchestrate', 'touchpoint', 'holistic', 'disruptive'
];

export const FILLER_WORDS = [
  'um', 'uh', 'you know', 'like', 'basically', 'literally',
  'honestly', 'so yeah', 'sort of', 'kind of', 'i mean', 'actually', 'right'
];

export const VAGUE_WORDS = [
  'stuff', 'things', 'maybe', 'somewhat', 'whatever', 'somewhere', 'something'
];

export class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onTranscriptUpdate = null;
    this.onFillerDetected = null;
    this.onChunkComplete = null;
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.wordsAnalyzed = [];
    this.fillersFound = [];
    this.powerWordsFound = [];
    this.jargonFound = [];
    this.vagueFound = [];
    this.shouldAutoRestart = false;
    this.startTime = null;
  }

  isSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  init() {
    if (!this.isSupported()) {
      console.warn('Web Speech API is not supported in this browser.');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      let currentChunk = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          currentChunk += text + ' ';
          this.fullTranscript += text + ' ';
          this._classifyWords(text);
          if (this.onChunkComplete) {
            this.onChunkComplete(text.trim());
          }
        } else {
          currentInterim += text;
        }
      }

      this.interimTranscript = currentInterim;

      const elapsedMinutes = this.startTime ? (Date.now() - this.startTime) / 60000 : 0.1;
      const totalWords = this.fullTranscript.trim().split(/\s+/).filter(Boolean).length;
      const wpm = elapsedMinutes > 0.05 ? Math.round(totalWords / elapsedMinutes) : 0;

      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate({
          full: this.fullTranscript.trim(),
          interim: this.interimTranscript.trim(),
          latestChunk: currentChunk.trim(),
          wordsAnalyzed: [...this.wordsAnalyzed],
          fillers: [...this.fillersFound],
          powerWords: [...this.powerWordsFound],
          jargon: [...this.jargonFound],
          vague: [...this.vagueFound],
          wpm,
          totalWords
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech Recognition Event Error:', event.error);
      if (event.error === 'no-speech') return;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.shouldAutoRestart) {
        try {
          this.recognition.start();
          this.isListening = true;
        } catch (e) {
          console.warn('Auto-restart speech recognition failed:', e);
        }
      }
    };

    return true;
  }

  start() {
    if (!this.recognition) {
      this.init();
    }
    if (this.recognition && !this.isListening) {
      try {
        this.startTime = Date.now();
        this.shouldAutoRestart = true;
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.error('Speech recognition start failed:', err);
      }
    }
  }

  stop() {
    this.shouldAutoRestart = false;
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  reset() {
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.wordsAnalyzed = [];
    this.fillersFound = [];
    this.powerWordsFound = [];
    this.jargonFound = [];
    this.vagueFound = [];
    this.startTime = Date.now();
  }

  _classifyWords(text) {
    const rawTokens = text.split(/\s+/).filter(Boolean);
    const textLower = text.toLowerCase();

    // Detect phrase-based filler words
    FILLER_WORDS.forEach(filler => {
      if (filler.includes(' ')) {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi');
        if (regex.test(textLower)) {
          this.fillersFound.push(filler);
          if (this.onFillerDetected) this.onFillerDetected(filler);
        }
      }
    });

    rawTokens.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (!cleanWord) return;

      let category = 'normal';

      if (FILLER_WORDS.includes(cleanWord)) {
        category = 'filler';
        this.fillersFound.push(cleanWord);
        if (this.onFillerDetected) this.onFillerDetected(cleanWord);
      } else if (POWER_WORDS.includes(cleanWord)) {
        category = 'power';
        this.powerWordsFound.push(cleanWord);
      } else if (JARGON_WORDS.includes(cleanWord)) {
        category = 'jargon';
        this.jargonFound.push(cleanWord);
      } else if (VAGUE_WORDS.includes(cleanWord)) {
        category = 'vague';
        this.vagueFound.push(cleanWord);
      }

      this.wordsAnalyzed.push({
        raw: word,
        clean: cleanWord,
        category,
        timestamp: Date.now()
      });
    });
  }
}
