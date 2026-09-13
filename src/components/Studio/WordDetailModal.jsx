import React from 'react';
import { X, Sparkles, AlertCircle, Flame, Compass, RefreshCw } from 'lucide-react';
import { POWER_WORDS, JARGON_WORDS, FILLER_WORDS, VAGUE_WORDS } from '../../services/speechRecognition';

export default function WordDetailModal({ isOpen, onClose, selectedWordObj, fullTranscript }) {
  if (!isOpen || !selectedWordObj) return null;

  const rawWord = selectedWordObj.raw || selectedWordObj.word || '';
  const cleanWord = rawWord.toLowerCase().replace(/[^a-z]/g, '');

  let typeLabel = 'Normal Word';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
  let suggestion = 'This word adds standard conversational value.';

  if (FILLER_WORDS.includes(cleanWord)) {
    typeLabel = 'Filler / Unnecessary Word';
    badgeColor = 'bg-rose-950/90 text-rose-300 border-rose-500/60';
    suggestion = 'Try replacing this filler word with a short deliberate pause to increase authority.';
  } else if (POWER_WORDS.includes(cleanWord)) {
    typeLabel = 'High-Impact Power Word';
    badgeColor = 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60';
    suggestion = 'Excellent storytelling choice! High-impact words create vivid mental pictures.';
  } else if (JARGON_WORDS.includes(cleanWord)) {
    typeLabel = 'Technical Jargon';
    badgeColor = 'bg-amber-950/90 text-amber-300 border-amber-500/60';
    suggestion = 'Consider simplifying or introducing an everyday metaphor right after this term.';
  } else if (VAGUE_WORDS.includes(cleanWord)) {
    typeLabel = 'Vague Phrasing';
    badgeColor = 'bg-purple-950/90 text-purple-300 border-purple-500/60';
    suggestion = 'Be specific. Swap vague phrases ("stuff", "things") with precise concrete examples.';
  }

  // Count total occurrences in full transcript
  const regex = new RegExp(`\\b${cleanWord}\\b`, 'gi');
  const count = fullTranscript ? (fullTranscript.match(regex) || []).length : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
      <div className="w-full max-w-md glass-panel-glow bg-slate-900 border-2 border-purple-500/60 p-6 rounded-2xl shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        {/* Word Header */}
        <div className="space-y-1">
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${badgeColor}`}>
            {typeLabel}
          </span>
          <h3 className="text-3xl font-black text-white tracking-tight mt-2">"{rawWord}"</h3>
        </div>

        {/* Word Stats */}
        <div className="grid grid-cols-2 gap-3 text-center py-2">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Usage</span>
            <span className="text-xl font-bold text-purple-300 font-mono">{count} time{count > 1 ? 's' : ''}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Impact Rating</span>
            <span className="text-xl font-bold text-cyan-300 font-mono">
              {typeLabel.includes('Power') ? 'High Impact' : typeLabel.includes('Filler') ? 'Low Impact' : 'Standard'}
            </span>
          </div>
        </div>

        {/* Actionable Suggestion */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Coach Recommendation:</span>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">{suggestion}</p>
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
