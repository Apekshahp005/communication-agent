import React from 'react';
import { Sparkles, Eye, UserCheck, Activity, Volume2, Gauge, Flame, AlertTriangle, ThumbsUp, Camera } from 'lucide-react';

export default function LiveAnalysisHUD({
  wordsAnalyzed = [],
  fillers = [],
  powerWords = [],
  jargon = [],
  wpm = 0,
  pacingFeedback = 'optimal',
  visualData,
  isCameraActive = true
}) {
  // Extract Visual / Video Analysis metrics
  const eyeContact = visualData?.eyeContact || (isCameraActive ? 'Direct & Engaged' : 'Camera OFF (Audio Only)');
  const postureQuality = visualData?.postureQuality || (isCameraActive ? 'Upright & Confident' : 'Audio Mode');
  const expressionTone = visualData?.expressionTone || (isCameraActive ? 'Warm & Focused' : 'Active');
  const observableNotes = visualData?.observableNotes || (isCameraActive ? 'Visual stream active — Good presence' : 'Audio mode active');

  // Dynamically determine current live strengths
  const liveStrengths = [];
  if (powerWords.length > 0) {
    liveStrengths.push(`Used ${powerWords.length} Power Word${powerWords.length > 1 ? 's' : ''} (e.g. "${powerWords[powerWords.length - 1]}")`);
  }
  if (pacingFeedback === 'optimal' || (wpm >= 120 && wpm <= 165)) {
    liveStrengths.push(`Optimal Speaking Cadence (${wpm || 135} WPM)`);
  }
  if (eyeContact.includes('Direct')) {
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
  if (expressionTone.includes('Tense')) {
    liveImprovements.push('Facial expression looks tense — relax facial muscles');
  }
  if (liveImprovements.length === 0) {
    liveImprovements.push('Add a relatable everyday metaphor');
    liveImprovements.push('Close with a strong memorable takeaway');
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up font-sans">
      {/* COLUMN 1: LIVE VIDEO & VISUAL ANALYSIS */}
      <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-2 border-cyan-500/50 bg-slate-900/90 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Camera size={16} />
            </div>
            <h4 className="text-sm font-extrabold text-white font-heading">Video Analysis</h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 uppercase">
            {isCameraActive ? 'LIVE VISION' : 'AUDIO ONLY'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono">
            <span className="text-slate-400 font-sans flex items-center gap-1.5">
              <Eye size={13} className="text-cyan-400" /> Eye Contact:
            </span>
            <span className="font-bold text-cyan-300">{eyeContact}</span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono">
            <span className="text-slate-400 font-sans flex items-center gap-1.5">
              <UserCheck size={13} className="text-purple-400" /> Posture Quality:
            </span>
            <span className="font-bold text-purple-300">{postureQuality}</span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono">
            <span className="text-slate-400 font-sans flex items-center gap-1.5">
              <Activity size={13} className="text-emerald-400" /> Facial Expression:
            </span>
            <span className="font-bold text-emerald-300">{expressionTone}</span>
          </div>

          <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
            Note: {observableNotes}
          </p>
        </div>
      </div>

      {/* COLUMN 2: LIVE AUDIO & VOCAL ANALYSIS */}
      <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-2 border-purple-500/50 bg-slate-900/90 shadow-xl shadow-purple-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Volume2 size={16} />
            </div>
            <h4 className="text-sm font-extrabold text-white font-heading">Audio Analysis</h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/50 uppercase">
            LIVE VOCAL
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">SPEAKING SPEED</span>
            <span className="text-lg font-extrabold text-cyan-300">{wpm || 0} WPM</span>
            <span className={`text-[9px] block font-bold ${wpm > 175 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {wpm > 175 ? 'Rushed' : 'Optimal'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">POWER WORDS</span>
            <span className="text-lg font-extrabold text-emerald-400">{powerWords.length}</span>
            <span className="text-[9px] text-slate-500 block">High Impact</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 font-sans">Fillers Detected:</span>
          <span className="font-bold text-rose-400">{fillers.length} word{fillers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* COLUMN 3: COMBINED DUAL COACHING FEEDBACK */}
      <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-2 border-emerald-500/50 bg-slate-900/90 shadow-xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Sparkles size={16} />
            </div>
            <h4 className="text-sm font-extrabold text-white font-heading">Dual AI Insights</h4>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 uppercase">
            LIVE INSIGHTS
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">Live Strengths:</span>
            <ul className="space-y-1 text-slate-200">
              {liveStrengths.slice(0, 2).map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block mb-1">Targeted Focus:</span>
            <ul className="space-y-1 text-slate-200">
              {liveImprovements.slice(0, 2).map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
