import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function AudioWaveform({ volume = 0, isMicActive, onToggleMic, pauseInfo }) {
  const bars = [15, 30, 60, 90, 45, 80, 100, 70, 50, 85, 40, 20, 65, 95, 35];

  return (
    <div className="w-full glass-panel p-4 flex items-center justify-between gap-4 border border-slate-800">
      {/* Mic Status Toggle */}
      <button
        onClick={onToggleMic}
        className={`p-3 rounded-xl flex items-center justify-center transition-all ${
          isMicActive
            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20 hover:bg-purple-600/40'
            : 'bg-rose-950/40 text-rose-400 border border-rose-800/60 hover:bg-rose-900/50'
        }`}
        title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
      >
        {isMicActive ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* Dynamic Waveform Bars */}
      <div className="flex-1 flex items-center justify-center gap-1.5 h-10 px-2">
        {bars.map((baseHeight, idx) => {
          const activeHeight = isMicActive ? Math.max(8, (volume / 100) * baseHeight) : 4;
          return (
            <div
              key={idx}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${activeHeight}%`,
                background: isMicActive
                  ? `linear-gradient(to top, #8b5cf6, ${volume > 70 ? '#f43f5e' : '#06b6d4'})`
                  : '#334155',
                opacity: isMicActive ? 0.7 + (volume / 200) : 0.3
              }}
            />
          );
        })}
      </div>

      {/* Volume & Pause Status Indicator */}
      <div className="flex flex-col items-end text-xs font-mono">
        <div className="flex items-center gap-1 text-slate-300">
          <Volume2 size={14} className={isMicActive && volume > 10 ? 'text-cyan-400 animate-pulse' : 'text-slate-500'} />
          <span>{isMicActive ? `${volume}%` : 'Muted'}</span>
        </div>
        {pauseInfo && (
          <span className={`text-[10px] mt-0.5 font-semibold ${
            pauseInfo.type === 'long_hesitation' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {pauseInfo.type === 'long_hesitation' ? `Pause ${pauseInfo.durationSec}s` : 'Intentional Pause'}
          </span>
        )}
      </div>
    </div>
  );
}
