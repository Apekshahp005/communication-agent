import React from 'react';
import { Camera, CameraOff, Eye, UserCheck, Activity, AlertTriangle, RefreshCw, Volume2, ShieldAlert, Mic, MicOff, Pause, Play, Square, Sparkles } from 'lucide-react';

export default function CameraFeed({
  videoRef,
  isCameraActive,
  cameraStatus = 'idle', // 'granted' | 'denied' | 'not_found' | 'unsupported' | 'error' | 'idle' | 'loading'
  cameraError = null,
  onToggleCamera,
  onRetryCamera,
  visualData,
  isMicActive,
  onToggleMic,
  isSessionActive,
  isSessionPaused,
  onTogglePause,
  onRestartSession,
  onFinishSession,
  volume = 0
}) {
  const isSpeaking = isMicActive && volume > 15;

  return (
    <div
      className={`relative w-full h-[480px] md:h-[620px] rounded-3xl overflow-hidden glass-panel border transition-all duration-300 flex flex-col justify-center items-center ${
        isSpeaking
          ? 'stage-speaking-active shadow-[0_0_50px_rgba(139,92,246,0.45)]'
          : 'border-white/10 shadow-2xl bg-slate-950'
      }`}
    >
      {/* Real WebRTC Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-all duration-500 ${
          isCameraActive && cameraStatus === 'granted' ? 'opacity-100 scale-100' : 'opacity-0 absolute pointer-events-none scale-95'
        }`}
      />

      {/* STATE 1: CAMERA DISABLED BY USER */}
      {!isCameraActive && (
        <div className="flex flex-col items-center gap-3 text-slate-300 p-6 text-center z-10 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-purple-400 shadow-xl">
            <CameraOff size={32} />
          </div>

          <div className="space-y-1 max-w-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-mono font-bold uppercase">
              AUDIO-ONLY PRACTICE STAGE
            </span>
            <h3 className="font-extrabold text-white text-lg font-heading">Camera Feed Disabled</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Microphone audio analysis is active. Turn on camera for visual posture and gaze evaluation.
            </p>
          </div>

          <button
            onClick={onToggleCamera}
            className="mt-2 btn-primary text-sm shadow-lg shadow-purple-500/30"
          >
            <Camera size={16} /> Enable Camera Stream
          </button>
        </div>
      )}

      {/* STATE 2: CAMERA PERMISSION DENIED OR BLOCKED */}
      {isCameraActive && cameraStatus === 'denied' && (
        <div className="flex flex-col items-center gap-3 text-slate-300 p-6 text-center z-10 animate-slide-up max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/90 border-2 border-rose-500/80 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/50">
            <ShieldAlert size={30} />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono font-bold uppercase">
              CAMERA ACCESS BLOCKED
            </span>
            <h3 className="font-extrabold text-white text-lg font-heading">Camera Permission Required</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browser permission was denied. Please allow camera access in your browser address bar.
            </p>
          </div>

          <div className="flex gap-2 pt-2 flex-wrap justify-center">
            <button onClick={onRetryCamera} className="btn-primary text-xs">
              <RefreshCw size={14} /> Try Again
            </button>
            <button onClick={onToggleCamera} className="btn-secondary text-xs">
              Audio-Only Mode
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: NO CAMERA HARDWARE DETECTED */}
      {isCameraActive && cameraStatus === 'not_found' && (
        <div className="flex flex-col items-center gap-3 text-slate-300 p-6 text-center z-10 animate-slide-up max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/90 border-2 border-amber-500/80 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-950/50">
            <AlertTriangle size={30} />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold uppercase">
              NO WEBCAM DETECTED
            </span>
            <h3 className="font-extrabold text-white text-lg font-heading">Camera Unavailable</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No active webcam detected. Speech audio metrics remain fully functional.
            </p>
          </div>

          <button onClick={onToggleCamera} className="btn-secondary text-xs mt-2">
            Continue in Audio Mode
          </button>
        </div>
      )}

      {/* STATE 4: LOADING STREAM */}
      {isCameraActive && cameraStatus === 'loading' && (
        <div className="flex flex-col items-center gap-3 text-slate-300 p-6 text-center z-10 animate-slide-up">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
            Initializing WebRTC Camera...
          </span>
        </div>
      )}

      {/* HUD OVERLAYS WHEN CAMERA IS ACTIVE AND GRANTED */}
      {isCameraActive && cameraStatus === 'granted' && (
        <>
          {/* Top Stage Indicator */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs z-10 pointer-events-none">
            <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-slate-200 border border-white/10 flex items-center gap-2 font-mono font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              LIVE VISION STAGE
            </span>

            {visualData?.eyeContact && (
              <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Eye size={13} /> {visualData.eyeContact}
              </span>
            )}
          </div>
        </>
      )}

      {/* FLOATING CONTROL DOCK AT BOTTOM OF CAMERA STAGE (SECTION 10 REQUIREMENT) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 p-2 px-4 rounded-full bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-2xl">
        {/* Mic Control */}
        <button
          onClick={onToggleMic}
          className={`p-3 rounded-full transition-all ${
            isMicActive
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/60 shadow-md'
              : 'bg-rose-950/80 text-rose-400 border border-rose-800'
          }`}
          title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicActive ? <Mic size={18} /> : <MicOff size={18} />}
        </button>

        {/* Camera Control */}
        <button
          onClick={onToggleCamera}
          className={`p-3 rounded-full transition-all ${
            isCameraActive
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/60 shadow-md'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
          title={isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraActive ? <Camera size={18} /> : <CameraOff size={18} />}
        </button>

        {/* Pause / Resume Control */}
        {isSessionActive && (
          <button
            onClick={onTogglePause}
            className={`p-3 rounded-full transition-all ${
              isSessionPaused
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/60'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
            title={isSessionPaused ? 'Resume Practice' : 'Pause Practice'}
          >
            {isSessionPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        )}

        {/* Restart Control */}
        {isSessionActive && (
          <button
            onClick={onRestartSession}
            className="p-3 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
            title="Restart Practice Session"
          >
            <RefreshCw size={18} />
          </button>
        )}

        {/* Finish Session CTA (Visually Distinct) */}
        {isSessionActive && (
          <button
            onClick={onFinishSession}
            className="btn-danger text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-2 shadow-lg shadow-rose-500/30 ml-1"
            title="Complete & Analyze Session"
          >
            <Square size={14} /> Finish & Analyze
          </button>
        )}
      </div>
    </div>
  );
}
