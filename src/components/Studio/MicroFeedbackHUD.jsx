import React from 'react';
import { AlertTriangle, Sparkles, Lightbulb, Zap } from 'lucide-react';

export default function MicroFeedbackHUD({ level1Alert, level2Toasts = [], storyOpportunity, witOpportunity }) {
  if (!level1Alert && level2Toasts.length === 0 && !storyOpportunity && !witOpportunity) {
    return null;
  }

  return (
    <div className="w-full space-y-3 animate-slide-up">
      {/* LEVEL 1 CRITICAL ALERT BANNER */}
      {level1Alert && (
        <div className="bg-gradient-to-r from-rose-950/90 via-red-900/80 to-rose-950/90 border-2 border-rose-500/80 text-rose-100 p-4 rounded-2xl shadow-xl shadow-rose-950/50 flex items-center justify-between gap-4 animate-pulse-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 shrink-0">
              <AlertTriangle size={22} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-rose-400 block">
                CRITICAL LIVE CORRECTION
              </span>
              <p className="font-bold text-base md:text-lg text-white">
                {level1Alert}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2 MICRO-FEEDBACK TOASTS */}
      {level2Toasts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {level2Toasts.map((toast, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-cyan-500/40 text-cyan-200 text-xs px-3.5 py-2 rounded-xl backdrop-blur-md shadow-md flex items-center gap-2 animate-toast"
            >
              <Zap size={14} className="text-cyan-400" />
              <span className="font-medium">{toast}</span>
            </div>
          ))}
        </div>
      )}

      {/* STORY CALLBACK / WIT OPPORTUNITY HINTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {storyOpportunity && (
          <div className="bg-purple-950/50 border border-purple-500/40 text-purple-200 text-xs p-3 rounded-xl backdrop-blur-md flex items-start gap-2.5">
            <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-300 block mb-0.5">Narrative Callback Opportunity</span>
              <p className="text-purple-200/90">{storyOpportunity}</p>
            </div>
          </div>
        )}

        {witOpportunity && (
          <div className="bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs p-3 rounded-xl backdrop-blur-md flex items-start gap-2.5">
            <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300 block mb-0.5">Wit & Analogy Suggestion</span>
              <p className="text-amber-200/90">{witOpportunity}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
