import React, { useState, useEffect, useRef } from 'react';
import CameraFeed from './CameraFeed';
import AudioWaveform from './AudioWaveform';
import InteractiveTranscript from './InteractiveTranscript';
import LiveAnalysisHUD from './LiveAnalysisHUD';
import LiveMetricsHUD from './LiveMetricsHUD';
import MicroFeedbackHUD from './MicroFeedbackHUD';
import RetryModal from './RetryModal';
import { CameraManager } from '../../services/cameraManager';
import { SpeechRecognitionService } from '../../services/speechRecognition';
import { AudioAnalyzerService } from '../../services/audioAnalyzer';
import { analyzeSpeechChunk, analyzeCameraFrame, generateAdaptiveResponse } from '../../services/api';
import { ttsService } from '../../services/textToSpeech';
import { Play, Square, Award, Sparkles, Volume2, VolumeX, MessageSquare, CameraOff, Video, Brain } from 'lucide-react';

export default function StudioView({
  currentMode,
  audienceType,
  onFinishSession,
  activeChallenge,
  currentTopic,
  onWordClick
}) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
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

  // Timer state
  const [sessionTime, setSessionTime] = useState(0);

  // Media services refs
  const videoRef = useRef(null);
  const cameraManagerRef = useRef(new CameraManager());
  const speechServiceRef = useRef(new SpeechRecognitionService());
  const audioAnalyzerRef = useRef(new AudioAnalyzerService());

  const lastChunkProcessedRef = useRef('');

  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      cameraManagerRef.current.startCamera(videoRef.current);
    }
    return () => {
      cameraManagerRef.current.stopCamera();
    };
  }, [isCameraActive]);

  useEffect(() => {
    let timer;
    if (isSessionActive) {
      timer = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive]);

  useEffect(() => {
    let frameInterval;
    if (isSessionActive && isCameraActive) {
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
  }, [isSessionActive, isCameraActive, fullTranscript]);

  const speakWithMicDucking = (text) => {
    if (isVoiceCoachMuted) return;
    ttsService.speak(text, {
      onStart: () => {
        if (speechServiceRef.current.isListening) {
          speechServiceRef.current.stop();
        }
      },
      onEnd: () => {
        if (isSessionActive && isMicActive) {
          speechServiceRef.current.start();
        }
      }
    });
  };

  const toggleSession = async () => {
    if (isSessionActive) {
      setIsSessionActive(false);
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
    } else {
      setIsSessionActive(true);
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

      audioAnalyzerRef.current.onVolumeUpdate = (vol) => setVolume(vol);
      audioAnalyzerRef.current.onPauseDetected = (pause) => setPauseInfo(pause);
      await audioAnalyzerRef.current.start();

      const speechService = speechServiceRef.current;
      speechService.reset();

      speechService.onTranscriptUpdate = ({
        full, interim, wordsAnalyzed: wList, fillers: fList, powerWords: pList, jargon: jList, vague: vList, wpm: currentWpm, totalWords: tw
      }) => {
        setFullTranscript(full);
        setInterimTranscript(interim);
        setWordsAnalyzed(wList);
        setFillers(fList);
        setPowerWords(pList);
        setJargon(jList);
        setVague(vList);
        setWpm(currentWpm);
        setTotalWords(tw);
      };

      speechService.onChunkComplete = async (finalChunk) => {
        if (!finalChunk || finalChunk === lastChunkProcessedRef.current) return;
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

      speechService.start();
    }
  };

  const handleToggleCamera = () => {
    if (isCameraActive) {
      cameraManagerRef.current.stopCamera();
      setIsCameraActive(false);
    } else {
      setIsCameraActive(true);
    }
  };

  const handleToggleMic = () => {
    setIsMicActive(!isMicActive);
    if (isMicActive) {
      speechServiceRef.current.stop();
    } else {
      speechServiceRef.current.start();
    }
  };

  const handleToggleVoiceCoachMute = () => {
    const muted = ttsService.toggleMute();
    setIsVoiceCoachMuted(muted);
  };

  const handleRetryComplete = (retryRecord) => {
    setRetriesPerformed((prev) => [...prev, retryRecord]);
    setIsRetryOpen(false);
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
            <span className={isCameraActive ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold flex items-center gap-1'}>
              {isCameraActive ? <Video size={13} /> : <CameraOff size={13} />}
              Video {isCameraActive ? 'Active' : 'OFF (Audio-Only)'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Brain className="text-purple-400" size={24} /> "{currentTopic || currentMode.title}"
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mode: <span className="text-slate-300 font-semibold">{currentMode.title}</span> | Audience: <span className="text-cyan-300 font-semibold capitalize">{audienceType}</span>
            {activeChallenge && <span className="ml-2 text-amber-300">| {activeChallenge.prompt}</span>}
          </p>
        </div>

        {/* Action Controls & Mute Toggle */}
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
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>{formatTime(sessionTime)}</span>
            </div>
          )}

          <button
            onClick={toggleSession}
            className={isSessionActive ? 'btn-danger flex-1 md:flex-none' : 'btn-primary flex-1 md:flex-none'}
          >
            {isSessionActive ? (
              <>
                <Square size={18} /> Complete & Analyze Session
              </>
            ) : (
              <>
                <Play size={18} /> Start Live Practice
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Metrics HUD (WPM, Fillers, Pause, Live Waveform, Voice Status, AI Attention) */}
      {isSessionActive && (
        <LiveMetricsHUD
          wpm={wpm}
          fillers={fillers}
          pauseInfo={pauseInfo}
          volume={volume}
          isMicActive={isMicActive}
          powerWordsCount={powerWords.length}
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

      {/* Real-time Side-by-Side Strengths vs Growth HUD */}
      {isSessionActive && (
        <LiveAnalysisHUD
          wordsAnalyzed={wordsAnalyzed}
          fillers={fillers}
          powerWords={powerWords}
          jargon={jargon}
          wpm={wpm}
          visualData={visualData}
        />
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

      {/* Camera Feed & Interactive Transcript Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <CameraFeed
            videoRef={videoRef}
            isCameraActive={isCameraActive}
            onToggleCamera={handleToggleCamera}
            visualData={visualData}
            isMicActive={isMicActive}
          />
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
        onCompleteRetry={handleRetryComplete}
      />
    </div>
  );
}
