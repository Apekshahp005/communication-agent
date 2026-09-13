import React, { useState, useEffect, useRef } from 'react';
import CameraFeed from './CameraFeed';
import AudioWaveform from './AudioWaveform';
import InteractiveTranscript from './InteractiveTranscript';
import LiveAnalysisHUD from './LiveAnalysisHUD';
import LiveMetricsHUD from './LiveMetricsHUD';
import MicroFeedbackHUD from './MicroFeedbackHUD';
import RetryModal from './RetryModal';
import SentenceAnalysisModal from './SentenceAnalysisModal';
import { CameraManager } from '../../services/cameraManager';
import { SpeechRecognitionService } from '../../services/speechRecognition';
import { AudioAnalyzerService } from '../../services/audioAnalyzer';
import { analyzeSpeechChunk, analyzeCameraFrame, generateAdaptiveResponse } from '../../services/api';
import { ttsService } from '../../services/textToSpeech';
import {
  Play, Square, Sparkles, Volume2, VolumeX, MessageSquare, CameraOff, Video, Brain, Mic, MicOff, Pause, PlayCircle, RefreshCw
} from 'lucide-react';

export default function StudioView({
  currentMode,
  audienceType,
  onFinishSession,
  activeChallenge,
  currentTopic,
  onWordClick
}) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraStatus, setCameraStatus] = useState('idle'); // 'granted' | 'denied' | 'not_found' | 'loading' | 'idle'
  const [cameraError, setCameraError] = useState(null);

  const [isMicActive, setIsMicActive] = useState(true);
  const [isVoiceCoachMuted, setIsVoiceCoachMuted] = useState(false);

  // Live transcript & word classification state
  const [fullTranscript, setFullTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [wordsAnalyzed, setWordsAnalyzed] = useState([]);
  const [fillers, setFillers] = useState([]);
  const [powerWords, setPowerWords] = useState([]);
  const [jargon, setJargon] = useState([]);
  const [vague, setVague] = useState([]);
  const [wpm, setWpm] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const [volume, setVolume] = useState(0);
  const [pauseInfo, setPauseInfo] = useState(null);
  const [visualData, setVisualData] = useState(null);

  // Micro-coaching HUD state
  const [level1Alert, setLevel1Alert] = useState(null);
  const [level2Toasts, setLevel2Toasts] = useState([]);
  const [storyOpportunity, setStoryOpportunity] = useState(null);
  const [witOpportunity, setWitOpportunity] = useState(null);

  // Adaptive AI response state
  const [aiSpeechResponse, setAiSpeechResponse] = useState(null);
  const [aiCoachingSubtext, setAiCoachingSubtext] = useState(null);

  // Retry modal state
  const [isRetryOpen, setIsRetryOpen] = useState(false);
  const [retrySnippet, setRetrySnippet] = useState('');
  const [retryPrompt, setRetryPrompt] = useState('');
  const [retriesPerformed, setRetriesPerformed] = useState([]);

  // Sentence analysis modal state
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [isSentenceModalOpen, setIsSentenceModalOpen] = useState(false);

  // Timer state
  const [sessionTime, setSessionTime] = useState(0);

  // Media services refs
  const videoRef = useRef(null);
  const cameraManagerRef = useRef(new CameraManager());
  const speechServiceRef = useRef(new SpeechRecognitionService());
  const audioAnalyzerRef = useRef(new AudioAnalyzerService());

  const lastChunkProcessedRef = useRef('');

  // Start Camera handler
  const initCamera = async () => {
    if (!videoRef.current) return;
    setCameraStatus('loading');
    const result = await cameraManagerRef.current.startCamera(videoRef.current);
    if (result.success) {
      setCameraStatus('granted');
      setCameraError(null);
    } else {
      setCameraStatus(result.status || 'error');
      setCameraError(result.error);
    }
  };

  useEffect(() => {
    if (isCameraActive) {
      initCamera();
    } else {
      cameraManagerRef.current.stopCamera();
      setCameraStatus('idle');
    }
    return () => {
      cameraManagerRef.current.stopCamera();
    };
  }, [isCameraActive]);

  useEffect(() => {
    let timer;
    if (isSessionActive && !isSessionPaused) {
      timer = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, isSessionPaused]);

  useEffect(() => {
    let frameInterval;
    if (isSessionActive && !isSessionPaused && isCameraActive && cameraStatus === 'granted') {
      frameInterval = setInterval(async () => {
        const frameBase64 = cameraManagerRef.current.captureFrameBase64(640);
        if (frameBase64) {
          const visResult = await analyzeCameraFrame({
            imageBase64: frameBase64,
            recentTranscript: fullTranscript.slice(-200)
          });
          setVisualData(visResult);
        }
      }, 4000);
    }
    return () => clearInterval(frameInterval);
  }, [isSessionActive, isSessionPaused, isCameraActive, cameraStatus, fullTranscript]);

  const speakWithMicDucking = (text) => {
    if (isVoiceCoachMuted) return;
    ttsService.speak(text, {
      onStart: () => {
        if (speechServiceRef.current.isListening) {
          speechServiceRef.current.stop();
        }
      },
      onEnd: () => {
        if (isSessionActive && !isSessionPaused && isMicActive) {
          speechServiceRef.current.start();
        }
      }
    });
  };

  const handleStartPracticeSession = async () => {
    setIsSessionActive(true);
    setIsSessionPaused(false);
    setSessionTime(0);
    setFullTranscript('');
    setInterimTranscript('');
    setWordsAnalyzed([]);
    setFillers([]);
    setPowerWords([]);
    setJargon([]);
    setVague([]);
    setLevel1Alert(null);
    setLevel2Toasts([]);
    setAiSpeechResponse(null);
    setRetriesPerformed([]);

    audioAnalyzerRef.current.onVolumeUpdate = (vol) => {
      if (!isSessionPaused) setVolume(vol);
    };
    audioAnalyzerRef.current.onPauseDetected = (pause) => {
      if (!isSessionPaused) setPauseInfo(pause);
    };
    await audioAnalyzerRef.current.start();

    const speechService = speechServiceRef.current;
    speechService.reset();

    speechService.onTranscriptUpdate = ({
      full, interim, wordsAnalyzed: wList, fillers: fList, powerWords: pList, jargon: jList, vague: vList, wpm: currentWpm, totalWords: tw
    }) => {
      if (!isSessionPaused) {
        setFullTranscript(full);
        setInterimTranscript(interim);
        setWordsAnalyzed(wList);
        setFillers(fList);
        setPowerWords(pList);
        setJargon(jList);
        setVague(vList);
        setWpm(currentWpm);
        setTotalWords(tw);
      }
    };

    speechService.onChunkComplete = async (finalChunk) => {
      if (!finalChunk || finalChunk === lastChunkProcessedRef.current || isSessionPaused) return;
      lastChunkProcessedRef.current = finalChunk;

      const analysis = await analyzeSpeechChunk({
        transcript: finalChunk,
        recentContext: fullTranscript.slice(-300),
        mode: currentTopic || currentMode.title,
        audienceType,
        activeStoryMemory: []
      });

      if (analysis.level1Alert) {
        setLevel1Alert(analysis.level1Alert);
        speakWithMicDucking(analysis.level1Alert);
        setTimeout(() => setLevel1Alert(null), 7000);
      }

      if (analysis.level2Toasts && analysis.level2Toasts.length > 0) {
        setLevel2Toasts(analysis.level2Toasts);
        setTimeout(() => setLevel2Toasts([]), 5000);
      }

      if (analysis.storyCallbackOpportunity) {
        setStoryOpportunity(analysis.storyCallbackOpportunity);
      }
      if (analysis.witOpportunity) {
        setWitOpportunity(analysis.witOpportunity);
      }

      if (analysis.retryTriggered && !isRetryOpen) {
        const pText = analysis.retryPrompt || "That part is key, but difficult to follow. Try it again in 1 simple sentence.";
        setRetrySnippet(analysis.weakSnippet || finalChunk);
        setRetryPrompt(pText);
        setIsRetryOpen(true);
        speakWithMicDucking(pText);
      }

      if (['interview', 'podcast', 'sales', 'audience_qa'].includes(currentMode.id)) {
        const adaptive = await generateAdaptiveResponse({
          mode: currentMode.title,
          audienceType,
          fullTranscript: fullTranscript.slice(-400),
          lastUserResponse: finalChunk
        });
        if (adaptive?.aiSpeechResponse) {
          setAiSpeechResponse(adaptive.aiSpeechResponse);
          setAiCoachingSubtext(adaptive.coachingSubtext);
          speakWithMicDucking(adaptive.aiSpeechResponse);
        }
      }
    };

    if (isMicActive) {
      speechService.start();
    }
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setIsSessionPaused(false);
    speechServiceRef.current.stop();
    audioAnalyzerRef.current.stop();
    ttsService.stop();

    onFinishSession({
      sessionMode: currentTopic || currentMode.title,
      audienceType,
      fullTranscript,
      wordsAnalyzed,
      detectedFillers: fillers,
      powerWords,
      jargon,
      visualNotes: visualData ? [visualData.observableNotes] : [],
      retriesPerformed,
      sessionTimeSec: sessionTime,
      isCameraActive
    });
  };

  const handleToggleSessionPause = () => {
    if (isSessionPaused) {
      setIsSessionPaused(false);
      if (isMicActive) speechServiceRef.current.start();
    } else {
      setIsSessionPaused(true);
      speechServiceRef.current.stop();
      ttsService.stop();
    }
  };

  const handleRestartSession = () => {
    speechServiceRef.current.stop();
    ttsService.stop();
    handleStartPracticeSession();
  };

  const handleToggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleToggleMic = () => {
    setIsMicActive(!isMicActive);
    if (isMicActive) {
      speechServiceRef.current.stop();
    } else if (isSessionActive && !isSessionPaused) {
      speechServiceRef.current.start();
    }
  };

  const handleToggleVoiceCoachMute = () => {
    const muted = ttsService.toggleMute();
    setIsVoiceCoachMuted(muted);
  };

  const handleSentenceClick = (sentenceText) => {
    setSelectedSentence(sentenceText);
    setIsSentenceModalOpen(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Studio Header Bar */}
      <div className="glass-panel p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-purple-500">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> LIVE PRACTICE STUDIO
            <span className="text-slate-600">•</span>
            <span className={isCameraActive && cameraStatus === 'granted' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold flex items-center gap-1'}>
              {isCameraActive && cameraStatus === 'granted' ? <Video size={13} /> : <CameraOff size={13} />}
              Camera {isCameraActive && cameraStatus === 'granted' ? 'Active' : 'Disabled / Audio-Only'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2 font-heading">
            <Brain className="text-purple-400" size={24} /> "{currentTopic || currentMode.title}"
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mode: <span className="text-slate-300 font-semibold">{currentMode.title}</span> | Audience: <span className="text-cyan-300 font-semibold capitalize">{audienceType}</span>
            {activeChallenge && <span className="ml-2 text-amber-300">| {activeChallenge.prompt}</span>}
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={handleToggleVoiceCoachMute}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              !isVoiceCoachMuted
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/50 hover:bg-purple-900/80'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle AI Voice Coach (Text-to-Speech Output)"
          >
            {!isVoiceCoachMuted ? <Volume2 size={15} className="text-purple-400 animate-pulse" /> : <VolumeX size={15} />}
            <span>AI Voice {isVoiceCoachMuted ? 'OFF' : 'ON'}</span>
          </button>

          {isSessionActive && (
            <div className="bg-slate-950/90 border border-slate-800 px-3.5 py-2 rounded-xl text-sm font-mono text-slate-200 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSessionPaused ? 'bg-amber-400' : 'bg-rose-500 animate-ping'}`}></span>
              <span>{formatTime(sessionTime)}</span>
            </div>
          )}

          {!isSessionActive ? (
            <button onClick={handleStartPracticeSession} className="btn-primary flex-1 md:flex-none">
              <Play size={18} /> Start Live Practice
            </button>
          ) : (
            <button onClick={handleEndSession} className="btn-danger flex-1 md:flex-none">
              <Square size={18} /> Complete & Analyze Session
            </button>
          )}
        </div>
      </div>

      {/* Live Metrics HUD */}
      {isSessionActive && (
        <LiveMetricsHUD
          wpm={wpm}
          fillers={fillers}
          pauseInfo={pauseInfo}
          volume={volume}
          isMicActive={isMicActive}
          powerWordsCount={powerWords.length}
          onLaunchPracticeDrill={(metricName) => {
            setRetrySnippet(fullTranscript.slice(-150) || "Improve speech delivery");
            setRetryPrompt(`Targeted practice drill for: ${metricName}`);
            setIsRetryOpen(true);
          }}
        />
      )}

      {/* Live Dual Audio & Video Multimodal Analysis Hub */}
      {isSessionActive && (
        <LiveAnalysisHUD
          wordsAnalyzed={wordsAnalyzed}
          fillers={fillers}
          powerWords={powerWords}
          jargon={jargon}
          wpm={wpm}
          visualData={visualData}
          isCameraActive={isCameraActive}
        />
      )}

      {/* Adaptive AI Persona Response Box */}
      {aiSpeechResponse && isSessionActive && (
        <div className="bg-gradient-to-r from-purple-950/90 via-indigo-900/80 to-slate-950/90 border-2 border-purple-500/60 p-4 rounded-2xl shadow-xl space-y-1.5 animate-slide-up">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-purple-300 font-bold uppercase flex items-center gap-1.5">
              <MessageSquare size={14} className="text-purple-400" /> AI Persona Response ({currentMode.title})
            </span>
            <span className="text-purple-400 font-semibold">{isVoiceCoachMuted ? 'Text Mode' : 'Spoken via TTS'}</span>
          </div>
          <p className="text-base font-bold text-white leading-relaxed">"{aiSpeechResponse}"</p>
          {aiCoachingSubtext && (
            <p className="text-xs text-purple-200/80 italic pt-1 border-t border-purple-800/40">
              Coach Note: {aiCoachingSubtext}
            </p>
          )}
        </div>
      )}

      {/* Micro-Feedback Overlays */}
      <MicroFeedbackHUD
        level1Alert={level1Alert}
        level2Toasts={level2Toasts}
        storyOpportunity={storyOpportunity}
        witOpportunity={witOpportunity}
        onTriggerRetry={(promptText) => {
          setRetrySnippet(fullTranscript.slice(-150) || promptText);
          setRetryPrompt(promptText);
          setIsRetryOpen(true);
        }}
      />

      {/* Hero Video Stage & Controls + Live Transcript Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <CameraFeed
            videoRef={videoRef}
            isCameraActive={isCameraActive}
            cameraStatus={cameraStatus}
            cameraError={cameraError}
            onToggleCamera={handleToggleCamera}
            onRetryCamera={initCamera}
            visualData={visualData}
            isMicActive={isMicActive}
            volume={volume}
          />

          {/* FLOATING GLASS HERO SESSION CONTROLS BAR */}
          <div className="glass-panel p-3 border border-slate-800 flex justify-around items-center gap-2 flex-wrap">
            {/* Microphone Toggle */}
            <button
              onClick={handleToggleMic}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all ${
                isMicActive
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
              title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicActive ? <Mic size={16} className="text-purple-400" /> : <MicOff size={16} />}
              <span>{isMicActive ? 'Mic ON' : 'Mic Muted'}</span>
            </button>

            {/* Camera Toggle */}
            <button
              onClick={handleToggleCamera}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all ${
                isCameraActive && cameraStatus === 'granted'
                  ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
              title={isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCameraActive ? <Video size={16} className="text-cyan-400" /> : <CameraOff size={16} />}
              <span>{isCameraActive ? 'Camera ON' : 'Camera OFF'}</span>
            </button>

            {/* Pause / Resume */}
            {isSessionActive && (
              <button
                onClick={handleToggleSessionPause}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold border transition-all ${
                  isSessionPaused
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title={isSessionPaused ? 'Resume Session' : 'Pause Session'}
              >
                {isSessionPaused ? <PlayCircle size={16} className="text-amber-400" /> : <Pause size={16} />}
                <span>{isSessionPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            {/* Restart Session */}
            {isSessionActive && (
              <button
                onClick={handleRestartSession}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 transition-all"
                title="Restart Session"
              >
                <RefreshCw size={16} />
                <span>Restart</span>
              </button>
            )}
          </div>

          <AudioWaveform
            volume={volume}
            isMicActive={isMicActive}
            onToggleMic={handleToggleMic}
            pauseInfo={pauseInfo}
          />
        </div>

        <div>
          <InteractiveTranscript
            fullTranscript={fullTranscript}
            interimTranscript={interimTranscript}
            wpm={wpm}
            totalWords={totalWords}
            fillers={fillers}
            powerWords={powerWords}
            onWordClick={onWordClick}
            onSentenceClick={handleSentenceClick}
          />
        </div>
      </div>

      {/* Storytelling Retry Loop Modal */}
      <RetryModal
        isOpen={isRetryOpen}
        onClose={() => setIsRetryOpen(false)}
        weakSnippet={retrySnippet}
        retryPrompt={retryPrompt}
        fullTranscript={fullTranscript}
        onCompleteRetry={(retryRecord) => {
          setRetriesPerformed((prev) => [...prev, retryRecord]);
          setIsRetryOpen(false);
        }}
      />

      {/* Sentence Level Analysis Modal */}
      <SentenceAnalysisModal
        isOpen={isSentenceModalOpen}
        onClose={() => setIsSentenceModalOpen(false)}
        selectedSentence={selectedSentence}
        onPracticeSentence={(improvedSentence) => {
          setIsSentenceModalOpen(false);
          setRetrySnippet(selectedSentence);
          setRetryPrompt(`Practice delivering this refined sentence: "${improvedSentence}"`);
          setIsRetryOpen(true);
        }}
      />
    </div>
  );
}
