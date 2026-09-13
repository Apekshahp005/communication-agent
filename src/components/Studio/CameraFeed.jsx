import React from 'react';
import { Camera, CameraOff, Eye, UserCheck, Activity, AlertCircle } from 'lucide-react';

export default function CameraFeed({
  videoRef,
  isCameraActive,
  onToggleCamera,
  visualData,
  isMicActive
}) {
  return (
    <div className="relative w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden glass-panel border border-slate-700/60 bg-slate-950 flex flex-col justify-center items-center">
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isCameraActive ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
        }`}
      />

      {/* Prominent Camera Off Alert & Placeholder */}
      {!isCameraActive && (
        <div className="flex flex-col items-center gap-3 text-slate-300 p-6 text-center z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-950/40 animate-pulse">
            <CameraOff size={32} />
          </div>

          <div className="space-y-1 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 text-amber-300 border border-amber-600/60 text-xs font-mono font-bold uppercase">
              <AlertCircle size={14} /> Video Disabled Alert
            </div>
            <h3 className="font-bold text-white text-lg">Camera is Currently OFF</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are practicing in <strong className="text-amber-300">Audio-Only Mode</strong>. Body language, eye contact, and posture analysis are paused until video is enabled.
            </p>
          </div>

          <button
            onClick={onToggleCamera}
            className="mt-2 btn-primary text-sm shadow-lg shadow-purple-500/30"
          >
            <Camera size={16} /> Turn On Camera & Video Analysis
          </button>
        </div>
      )}

      {/* HUD Framing Grid & Visual Status Bar when Camera is Active */}
      {isCameraActive && (
        <>
          {/* Subtle Grid Frame Overlay */}
          <div className="absolute inset-0 pointer-events-none border-2 border-white/5 rounded-2xl m-3 flex flex-col justify-between p-4">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-300 border border-slate-700/50 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                LIVE VISION FEED
              </span>
              {visualData?.eyeContact && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border ${
                  visualData.eyeContact.includes('Direct')
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  <Eye size={13} /> {visualData.eyeContact}
                </span>
              )}
            </div>

            {/* Bottom HUD Bar */}
            <div className="flex justify-between items-end text-xs">
              <div className="flex gap-2">
                {visualData?.postureQuality && (
                  <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-300 border border-slate-800 flex items-center gap-1">
                    <UserCheck size={12} className="text-purple-400" /> {visualData.postureQuality}
                  </span>
                )}
                {visualData?.expressionTone && (
                  <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-300 border border-slate-800 flex items-center gap-1">
                    <Activity size={12} className="text-cyan-400" /> {visualData.expressionTone}
                  </span>
                )}
              </div>

              <button
                onClick={onToggleCamera}
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 p-2 rounded-full border border-slate-700 backdrop-blur-md transition-all"
                title="Turn Off Camera"
              >
                <CameraOff size={16} />
              </button>
            </div>
          </div>

          {/* Floating Visual Toast over Video */}
          {visualData?.visualFeedbackToast && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-purple-950/90 border border-purple-500/50 text-purple-200 text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md animate-toast flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
              {visualData.visualFeedbackToast}
            </div>
          )}
        </>
      )}
    </div>
  );
}
