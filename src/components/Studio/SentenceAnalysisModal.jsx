import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Wand2, RefreshCw } from 'lucide-react';

export default function SentenceAnalysisModal({ isOpen, onClose, selectedSentence }) {
  if (!isOpen || !selectedSentence) return null;

  // Derive scores and improvement suggestion for the selected sentence
  const clarity = Math.min(95, Math.max(65, 85 - (selectedSentence.length > 90 ? 12 : 0)));
  const confidence = Math.min(98, Math.max(70, 80 + (selectedSentence.includes('discovered') || selectedSentence.includes('key') ? 10 : 0)));
  const vocabulary = Math.min(95, Math.max(60, 78 + (selectedSentence.length > 50 ? 8 : 0)));
  const conciseness = selectedSentence.length > 80 ? 68 : 88;

  // Generate AI Improved sentence suggestion
  const generateImprovedSentence = (text) => {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/\b(basically|literally|honestly|actually|you know|like)\b/gi, '').replace(/\s+/g, ' ');
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    return cleaned;
  };

  const improvedSentence = generateImprovedSentence(selectedSentence);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-slide-up">
      <div className="w-full max-w-xl glass-panel-glow bg-slate-900 border-2 border-purple-500/60 p-6 rounded-3xl shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <Wand2 size={20} className="text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              SENTENCE-LEVEL ANALYSIS
            </span>
            <h3 className="text-xl font-extrabold text-white">Linguistic & Delivery Breakdown</h3>
          </div>
        </div>

        {/* 4 Score Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans uppercase block">Clarity</span>
            <span className="text-lg font-bold text-purple-300">{clarity}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans uppercase block">Confidence</span>
            <span className="text-lg font-bold text-cyan-300">{confidence}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans uppercase block">Vocabulary</span>
            <span className="text-lg font-bold text-emerald-400">{vocabulary}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans uppercase block">Conciseness</span>
            <span className="text-lg font-bold text-amber-400">{conciseness}%</span>
          </div>
        </div>

        {/* Original Spoken Sentence */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Original Spoken Line:</span>
          <p className="text-sm italic text-slate-200 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
            "{selectedSentence}"
          </p>
        </div>

        {/* AI Improved Version */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-1">
            <Sparkles size={14} /> Recommended Clearer Phrasing:
          </span>
          <p className="text-sm font-bold text-emerald-200 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40 leading-relaxed">
            "{improvedSentence}"
          </p>
        </div>

        {/* Coach Explanation */}
        <div className="bg-purple-950/40 border border-purple-500/30 p-3.5 rounded-xl text-xs text-purple-200 space-y-1">
          <span className="font-bold text-purple-300 uppercase font-mono block">Why This Refinement Works:</span>
          <p className="leading-relaxed">
            Removing unnecessary preamble filler words makes your sentence punchy and allows listeners to process your main idea immediately.
          </p>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs">
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
