import React from 'react';
import { Gauge, AlertCircle, Clock, Activity, Eye, Zap } from 'lucide-react';

export default function LiveMetricsHUD({
  wpm = 0,
  fillers = [],
  pauseInfo,
  volume = 0,
  isMicActive = true,
  powerWordsCount = 0
}) {
  // Voice Status calculation
  let voiceStatus = 'Silent';
  if (isMicActive && volume > 10) {
    if (wpm > 175) voiceStatus = 'Rushed';
    else voiceStatus = 'Speaking';
  } else if (isMicActive) {
    voiceStatus = 'Listening / Paused';
  } else {
    voiceStatus = 'Muted';
  }

  // AI Audience Attention estimate (0 - 100%)
  let attentionEstimate = 75;
  if (wpm >= 120 && wpm <= 165) attentionEstimate += 10;
  if (powerWordsCount > 2) attentionEstimate += 10;
  if (fillers.length > 3) attentionEstimate -= 15;
  if (wpm > 180) attentionEstimate -= 10;
  attentionEstimate = Math.max(40, Math.min(98, attentionEstimate));

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-3 animate-slide-up font-mono">
      {/* 1. Speech Pace */}
      <div className="glass-panel p-3.5 border-slate-800 text-center flex flex-col justify-between">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">Speech Pace</span>
        <div>
          <span className="text-2xl font-black text-cyan-300 block">{wpm || 0}</span>
          <span className="text-[10px] text-slate-500 block">WPM</span>
        </div>
        <span className={`text-[10px] font-bold ${
          wpm > 175 ? 'text-amber-400' : wpm < 100 && wpm > 0 ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {wpm > 175 ? 'Rushed' : wpm < 100 && wpm > 0 ? 'Slow' : 'Optimal'}
        </span>
      </div>

      {/* 2. Fillers Used */}
      <div className="glass-panel p-3.5 border-slate-800 text-center flex flex-col justify-between">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">Fillers Used</span>
        <div>
          <span className="text-2xl font-black text-rose-400 block">{fillers.length}</span>
          <span className="text-[10px] text-slate-500 block">Words</span>
        </div>
        <span className="text-[10px] text-slate-400 truncate">
          {fillers.length > 0 ? fillers[fillers.length - 1] : 'Clean'}
        </span>
      </div>

      {/* 3. Pause Timer */}
      <div className="glass-panel p-3.5 border-slate-800 text-center flex flex-col justify-between">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">Pause Duration</span>
        <div>
          <span className="text-2xl font-black text-purple-300 block">
            {pauseInfo?.durationSec ? `${pauseInfo.durationSec}s` : '0.0s'}
          </span>
          <span className="text-[10px] text-slate-500 block">Last Pause</span>
        </div>
        <span className="text-[10px] text-emerald-400">
          {pauseInfo?.type === 'intentional_pause' ? 'Intentional' : 'Normal'}
        </span>
      </div>

      {/* 4. Mic Energy */}
      <div className="glass-panel p-3.5 border-slate-800 text-center flex flex-col justify-between">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">Mic Energy</span>
        <div className="h-6 flex items-center justify-center gap-1 my-auto">
          {[30, 60, 100, 45, 80].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all bg-purple-500"
              style={{
                height: `${isMicActive ? Math.max(20, (volume / 100) * h) : 10}%`,
                opacity: isMicActive ? 0.8 : 0.2
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-400">{volume}% Vol</span>
      </div>

      {/* 5. Voice Status */}
      <div className="glass-panel p-3.5 border-slate-800 text-center flex flex-col justify-between">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">Voice Status</span>
        <div>
          <span className={`text-sm font-bold block ${
            voiceStatus === 'Speaking' ? 'text-emerald-400' :
            voiceStatus === 'Rushed' ? 'text-amber-400' : 'text-slate-400'
          }`}>
            {voiceStatus}
          </span>
        </div>
        <span className="text-[10px] text-slate-500">Live Detector</span>
      </div>

      {/* 6. AI Audience Attention */}
      <div className="glass-panel p-3.5 border-slate-800 text-center flex flex-col justify-between bg-gradient-to-b from-slate-900 to-purple-950/40 border-purple-500/30">
        <span className="text-[10px] text-purple-300 font-bold uppercase block">AI Attention</span>
        <div>
          <span className="text-2xl font-black text-white block">{attentionEstimate}%</span>
          <span className="text-[10px] text-purple-400 block">Lean-In Ratio</span>
        </div>
        <span className="text-[9px] text-slate-500 italic">AI Estimate</span>
      </div>
    </div>
  );
}
