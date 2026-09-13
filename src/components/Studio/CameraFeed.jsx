import React from 'react';
import { Camera, CameraOff, Eye, UserCheck, Activity, AlertTriangle, RefreshCw, Volume2, ShieldAlert } from 'lucide-react';

export default function CameraFeed({
  videoRef,
  isCameraActive,
  cameraStatus = 'idle', // 'granted' | 'denied' | 'not_found' | 'unsupported' | 'error' | 'idle' | 'loading'
  cameraError = null,
  onToggleCamera,
  onRetryCamera,
  visualData,
  isMicActive,
  volume = 0
}) {
  const isSpeaking = isMicActive && volume > 15;

  return (
    <div
      className={`relative w-full h-[380px] md:h-[440px] rounded-3xl overflow-hidden glass-panel border transition-all duration-300 flex flex-col justify-center items-center ${
        isSpeaking
          ? 'border-purple-500/80 shadow-[0_0_50px_rgba(139,92,246,0.45)] ring-2 ring-purple-500/50'
          : 'border-slate-800/80 shadow-2xl bg-slate-950'
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
              AUDIO-ONLY PRACTICE MODE
            </span>
            <h3 className="font-extrabold text-white text-lg font-heading">Camera is OFF</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your voice & audio feedback are actively analyzed. Turn on your camera for posture, gesture, and eye contact evaluation.
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
              CAMERA BLOCKED BY BROWSER
            </span>
            <h3 className="font-extrabold text-white text-lg font-heading">Camera Access Needed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browser permission was blocked. Please click the camera icon in your address bar to allow access, or try again.
            </p>
          </div>

          <div className="flex gap-2 pt-2 flex-wrap justify-center">
            <button onClick={onRetryCamera} className="btn-primary text-xs">
              <RefreshCw size={14} /> Try Again
            </button>
            <button onClick={onToggleCamera} className="btn-secondary text-xs">
              Continue Without Camera
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
              NO CAMERA DETECTED
            </span>
            <h3 className="font-extrabold text-white text-lg font-heading">No Camera Hardware Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No physical webcam was detected on this device. You can seamlessly practice in Audio-Only mode.
            </p>
          </div>

          <button onClick={onToggleCamera} className="btn-secondary text-xs mt-2">
            Continue in Audio-Only Mode
          </button>
        </div>
      )}

      {/* STATE 4: LOADING / REQUESTING CAMERA PERMISSION */}
      {isCameraActive && cameraStatus === 'loading' && (
        <div className="flex flex-col items-center gap-3 text-slate-300 p-6 text-center z-10 animate-slide-up">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
            Initializing Camera Stream...
          </span>
        </div>
      )}

      {/* HUD OVERLAYS WHEN CAMERA IS ACTIVE AND GRANTED */}
      {isCameraActive && cameraStatus === 'granted' && (
        <>
          {/* Top HUD Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs z-10 pointer-events-none">
            <span className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full text-slate-200 border border-slate-800 flex items-center gap-2 font-mono font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              LIVE VISION STAGE
            </span>

            {visualData?.eyeContact && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border ${
                visualData.eyeContact.includes('Direct')
                  ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-950/85 text-amber-300 border-amber-500/50'
              }`}>
                <Eye size={13} /> {visualData.eyeContact}
              </span>
            )}
          </div>

          {/* Bottom HUD Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs z-10 pointer-events-none">
            <div className="flex gap-2 flex-wrap">
              {visualData?.postureQuality && (
                <span className="bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-slate-300 border border-slate-800 flex items-center gap-1.5 text-[11px]">
                  <UserCheck size={13} className="text-purple-400" /> {visualData.postureQuality}
                </span>
              )}
              {visualData?.expressionTone && (
                <span className="bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-slate-300 border border-slate-800 flex items-center gap-1.5 text-[11px]">
                  <Activity size={13} className="text-cyan-400" /> {visualData.expressionTone}
                </span>
              )}
            </div>

            {isSpeaking && (
              <span className="bg-purple-950/90 text-purple-200 border border-purple-500/60 px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                <Volume2 size={12} /> Speaking
              </span>
            )}
          </div>

          {/* Floating Visual Feedback Toast */}
          {visualData?.visualFeedbackToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-purple-950/90 border border-purple-500/50 text-purple-200 text-xs px-4 py-1.5 rounded-full shadow-xl backdrop-blur-md animate-toast flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              {visualData.visualFeedbackToast}
            </div>
          )}
        </>
      )}
    </div>
  );
}
