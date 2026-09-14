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
    if (!videoRef.current) {
      setTimeout(initCamera, 100);
      return;
    }
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

  // Studio transition and compact metrics toggle state
  const [isPreparingStudio, setIsPreparingStudio] = useState(false);
  const [prepStep, setPrepStep] = useState(0); // 0 -> 1 -> 2 -> 3
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

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
    setIsPreparingStudio(true);
    setPrepStep(1);

    setTimeout(() => setPrepStep(2), 400);
    setTimeout(() => setPrepStep(3), 800);

    setTimeout(async () => {
      setIsPreparingStudio(false);
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
    }, 1200);
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
      visualData,
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
      {/* PRE-SESSION STUDIO SETUP TRANSITION OVERLAY */}
      {isPreparingStudio && (
        <div className="glass-panel p-8 flex flex-col items-center justify-center space-y-4 text-center border-2 border-purple-500/60 bg-slate-900/95 animate-slide-up shadow-2xl">
          <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white font-heading">Preparing Your AI Coaching Studio...</h3>
            <p className="text-xs text-slate-400 font-mono">Configuring real-time WebRTC camera, audio metering, and multimodal coaching engine.</p>
          </div>
          <div className="flex gap-3 text-xs font-mono pt-2">
            <span className={`px-3 py-1 rounded-full border ${prepStep >= 1 ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              ✓ Mic Stream Ready
            </span>
            <span className={`px-3 py-1 rounded-full border ${prepStep >= 2 ? 'bg-cyan-950 text-cyan-300 border-cyan-700' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              ✓ Camera Feed Active
            </span>
            <span className={`px-3 py-1 rounded-full border ${prepStep >= 3 ? 'bg-purple-950 text-purple-300 border-purple-700' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              ✓ AI Coach Connected
            </span>
          </div>
        </div>
      )}

      {/* PRE-SESSION HERO CHALLENGE CARD (EXACT 5-SECOND RULE CLEAR INTENT) */}
      {!isSessionActive && !isPreparingStudio && (
        <div className="glass-panel p-8 border-2 border-purple-500/60 bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 space-y-6 rounded-3xl shadow-2xl animate-slide-up">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2 bg-purple-950/90 px-4 py-1.5 rounded-full border border-purple-500/50 shadow-md">
              <Brain size={16} className="text-purple-400" /> TODAY'S CHALLENGE
            </span>
            <span className="text-xs font-mono text-cyan-300 font-bold bg-slate-950/90 px-3.5 py-1 rounded-full border border-slate-800">
              Mode: {currentMode.title}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-heading leading-tight tracking-tight">
              "{currentTopic || "Explain AGI to a beginner."}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-300">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Audience</span>
                <span className="text-cyan-300 font-bold capitalize text-sm">{audienceType || 'Curious listener'}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Mode</span>
                <span className="text-purple-300 font-bold text-sm">{currentMode.title}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Duration</span>
                <span className="text-emerald-400 font-bold text-sm">2 minutes</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              onClick={handleStartPracticeSession}
              className="btn-primary text-base font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/30 flex items-center gap-3 scale-105 hover:scale-110 transition-transform"
            >
              <Play size={22} /> START PRACTICE
            </button>
          </div>
        </div>
      )}

      {/* Studio Header Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-purple-500">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> LIVE AI COACHING STUDIO
            <span className="text-slate-600">•</span>
            <span className={
              cameraStatus === 'loading'
                ? 'text-purple-300 font-bold flex items-center gap-1'
                : isCameraActive && cameraStatus === 'granted'
                ? 'text-emerald-400 font-bold'
                : 'text-amber-400 font-bold flex items-center gap-1'
            }>
              {cameraStatus === 'loading' ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-purple-400" /> Initializing Camera...
                </>
              ) : isCameraActive && cameraStatus === 'granted' ? (
                <>
                  <Video size={13} /> Camera Active
                </>
              ) : (
                <>
                  <CameraOff size={13} /> Camera {cameraStatus === 'denied' ? 'Blocked' : 'Disabled (Audio Mode)'}
                </>
              )}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1 font-heading flex items-center gap-2">
            "{currentTopic || currentMode.title}"
          </h3>
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
            title="Toggle AI Voice Coach Output"
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

          {isSessionActive && (
            <button onClick={handleEndSession} className="btn-danger flex-1 md:flex-none">
              <Square size={18} /> Complete & Analyze Session
            </button>
          )}
        </div>
      </div>

      {/* SINGLE FLOATING GLASS AI COACH INSIGHT PANEL (SECTION 8 REQUIREMENT) */}
      {isSessionActive && (
        <div className="glass-panel p-5 border-2 border-purple-500/60 bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 space-y-2 animate-slide-up rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-purple-300 font-bold uppercase flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400 animate-pulse" /> ✦ AI COACH
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              volume > 15 ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              {volume > 15 ? '● YOU\'RE SPEAKING' : 'LISTENING FOR YOUR VOICE'}
            </span>
          </div>
          <p className="text-base font-extrabold text-white leading-relaxed font-heading pt-1">
            {wpm > 165
              ? `You're speaking slightly faster than your target (${wpm} WPM). Try adding a 1.5-second silent pause.`
              : wpm >= 120 && wpm <= 165
              ? `Vocal cadence is optimal (${wpm} WPM) with strong sentence structure.`
              : fillers.length > 0
              ? `Filler word detected ("${fillers[fillers.length - 1]}"). Replace hesitation words with silent pauses.`
              : volume > 15
              ? `Strong opening. You stated your main idea clearly. Keep going.`
              : `Listening... state your next key takeaway with firm vocal authority.`}
          </p>
        </div>
      )}

      {/* COMPACT COMMUNICATION PULSE BAR (SECTION 9 REQUIREMENT) */}
      {isSessionActive && (
        <div className="glass-panel p-3 border border-slate-800 flex justify-between items-center gap-2 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1">
              <Sparkles size={13} className="text-purple-400" /> PULSE:
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${wpm > 175 ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'}`}>
              PACE ● {wpm > 175 ? 'RUSHED' : 'OPTIMAL'} ({wpm} WPM)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              CLARITY ● HIGH
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${fillers.length > 3 ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-purple-950 text-purple-300 border-purple-800'}`}>
              FILLERS ● {fillers.length} DETECTED
            </span>
          </div>

          <button
            onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
            className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors font-sans"
          >
            {showDetailedMetrics ? 'Collapse Detailed Metrics ↑' : 'Expand Detailed Metrics ↓'}
          </button>
        </div>
      )}

      {/* Detailed Live Metrics HUD (EXPANDABLE) */}
      {isSessionActive && showDetailedMetrics && (
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
          onLaunchPracticeDrill={(metricName) => {
            setRetrySnippet(fullTranscript.slice(-150) || "Improve video & visual presence");
            setRetryPrompt(`Targeted practice drill for: ${metricName}`);
            setIsRetryOpen(true);
          }}
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
