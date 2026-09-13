import React from 'react';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';

export default function AudioWaveform({ volume = 0, isMicActive, onToggleMic, pauseInfo }) {
  // 24 dynamic waveform bar factors
  const barFactors = [
    25, 45, 75, 95, 60, 40, 85, 100, 70, 50, 90, 65,
    30, 55, 80, 100, 75, 45, 85, 60, 40, 70, 50, 30
  ];

  const isSpeaking = isMicActive && volume > 10;

  return (
    <div className="w-full glass-panel p-4 flex items-center justify-between gap-4 border border-slate-800/80 shadow-xl">
      {/* Mic Status Toggle Button */}
      <button
        onClick={onToggleMic}
        className={`p-3 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          isMicActive
            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20 hover:bg-purple-600/40'
            : 'bg-rose-950/50 text-rose-400 border border-rose-800/60 hover:bg-rose-900/60'
        }`}
        title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
      >
        {isMicActive ? <Mic size={20} className={isSpeaking ? 'animate-pulse text-purple-400' : ''} /> : <MicOff size={20} />}
      </button>

      {/* Real-time Dynamic Waveform Canvas / Bars */}
      <div className="flex-1 flex items-center justify-center gap-1 h-12 px-2 overflow-hidden">
        {barFactors.map((baseHeight, idx) => {
          const activeHeight = isMicActive ? Math.max(6, (volume / 100) * baseHeight) : 4;
          return (
            <div
              key={idx}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${activeHeight}%`,
                background: isMicActive
                  ? volume > 75
                    ? 'linear-gradient(to top, #8b5cf6, #f43f5e)'
                    : 'linear-gradient(to top, #6366f1, #06b6d4)'
                  : '#334155',
                opacity: isMicActive ? (isSpeaking ? 0.9 : 0.4) : 0.2
              }}
            />
          );
        })}
      </div>

      {/* Live Volume & Pause Status Badge */}
      <div className="flex flex-col items-end text-xs font-mono shrink-0">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold">
          <Volume2 size={15} className={isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-500'} />
          <span>{isMicActive ? `${volume}%` : 'Muted'}</span>
        </div>
        {pauseInfo ? (
          <span className={`text-[10px] mt-0.5 font-bold px-2 py-0.5 rounded-md border ${
            pauseInfo.type === 'long_hesitation'
              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
          }`}>
            {pauseInfo.type === 'long_hesitation' ? `Pause ${pauseInfo.durationSec}s` : 'Intentional Pause'}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Activity size={10} /> {isSpeaking ? 'Speaking' : 'Silent'}
          </span>
        )}
      </div>
    </div>
  );
}
