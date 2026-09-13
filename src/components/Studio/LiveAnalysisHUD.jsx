import React from 'react';
import { Sparkles, ThumbsUp, AlertTriangle, Gauge, Flame, BookOpen, Layers } from 'lucide-react';

export default function LiveAnalysisHUD({
  wordsAnalyzed = [],
  fillers = [],
  powerWords = [],
  jargon = [],
  wpm = 0,
  pacingFeedback = 'optimal',
  visualData
}) {
  // Dynamically determine current live strengths
  const liveStrengths = [];
  if (powerWords.length > 0) {
    liveStrengths.push(`Used ${powerWords.length} Power Word${powerWords.length > 1 ? 's' : ''} (e.g. "${powerWords[powerWords.length - 1]}")`);
  }
  if (pacingFeedback === 'optimal' || (wpm >= 120 && wpm <= 165)) {
    liveStrengths.push(`Optimal Speaking Cadence (${wpm || 135} WPM)`);
  }
  if (visualData?.eyeContact?.includes('Direct')) {
    liveStrengths.push('Strong Eye Contact Alignment');
  }
  if (jargon.length === 0 && wordsAnalyzed.length > 20) {
    liveStrengths.push('Zero Jargon — Clear Everyday Language');
  }
  if (liveStrengths.length === 0) {
    liveStrengths.push('Maintaining steady baseline structure');
    liveStrengths.push('Active vocal engagement');
  }

  // Dynamically determine current areas to improve
  const liveImprovements = [];
  if (fillers.length > 0) {
    liveImprovements.push(`Reduce Filler Words (${fillers.length} detected: "${fillers[fillers.length - 1]}")`);
  }
  if (wpm > 175) {
    liveImprovements.push(`Speaking Fast (${wpm} WPM) — Pause between ideas`);
  } else if (wpm > 0 && wpm < 100) {
    liveImprovements.push(`Pacing Slow (${wpm} WPM) — Build vocal energy`);
  }
  if (jargon.length > 0) {
    liveImprovements.push(`Replace Jargon ("${jargon[jargon.length - 1]}") with an analogy`);
  }
  if (visualData?.expressionTone?.includes('Tense')) {
    liveImprovements.push('Facial expression looks tense — relax facial muscles');
  }
  if (liveImprovements.length === 0) {
    liveImprovements.push('Add a relatable everyday metaphor');
    liveImprovements.push('Close with a strong memorable takeaway');
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
      {/* CARD 1: WHAT YOU ARE GOOD AT (STRENGTHS) */}
      <div className="glass-panel glass-panel-emerald p-5 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ThumbsUp size={16} />
            </div>
            <h4 className="text-sm font-extrabold text-white tracking-tight">What You Are Good At</h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 uppercase">
            LIVE STRENGTHS
          </span>
        </div>

        <ul className="space-y-2 text-xs text-slate-200">
          {liveStrengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
              <span className="font-medium">{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CARD 2: WHAT TO IMPROVE (GROWTH) */}
      <div className="glass-panel border-amber-500/40 p-5 space-y-3 relative overflow-hidden shadow-lg shadow-amber-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <AlertTriangle size={16} />
            </div>
            <h4 className="text-sm font-extrabold text-white tracking-tight">What To Improve</h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50 uppercase">
            LIVE FOCUS
          </span>
        </div>

        <ul className="space-y-2 text-xs text-slate-200">
          {liveImprovements.map((imp, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-amber-400 font-bold text-sm leading-none">•</span>
              <span className="font-medium">{imp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CARD 3: SPEECH METRICS & PACING SPEEDOMETER */}
      <div className="glass-panel glass-panel-cyan p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Gauge size={16} />
            </div>
            <h4 className="text-sm font-extrabold text-white tracking-tight">Real-Time Metrics</h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
            CADENCE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center my-auto">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">SPEAKING SPEED</span>
            <span className="text-xl font-extrabold text-cyan-300 font-mono">{wpm || 0}</span>
            <span className="text-[10px] text-slate-500 block">WPM</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">POWER WORDS</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{powerWords.length}</span>
            <span className="text-[10px] text-slate-500 block">Impactful</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800/80">
          <span>Pace Target: 130-160 WPM</span>
          <span className={`font-bold ${wpm > 175 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {wpm > 175 ? 'Too Fast' : wpm < 100 && wpm > 0 ? 'Too Slow' : 'Optimal'}
          </span>
        </div>
      </div>
    </div>
  );
}
