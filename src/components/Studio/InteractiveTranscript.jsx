import React, { useRef, useEffect, useState } from 'react';
import { MessageSquareText, AlertCircle, Copy, Check, Filter, Zap, Flame, Sparkles } from 'lucide-react';
import { FILLER_WORDS, POWER_WORDS, JARGON_WORDS, VAGUE_WORDS } from '../../services/speechRecognition';

export default function InteractiveTranscript({
  fullTranscript,
  interimTranscript,
  wpm = 0,
  totalWords = 0,
  fillers = [],
  powerWords = [],
  onWordClick,
  onSentenceClick
}) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [fullTranscript, interimTranscript]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render sentences as clickable blocks for Sentence-Level Analysis
  const renderSentences = () => {
    if (!fullTranscript) return null;

    // Split transcript by sentence punctuation (. ! ?)
    const sentences = fullTranscript.match(/[^.!?]+[.!?]+/g) || [fullTranscript];

    return sentences.map((sentence, sIdx) => {
      const words = sentence.split(/(\s+)/);

      return (
        <span
          key={sIdx}
          className="sentence-hover inline relative mr-1"
          onClick={(e) => {
            // If user didn't click a specific word tag, trigger sentence analysis
            if (onSentenceClick && e.target.tagName !== 'SPAN' || e.target.classList.contains('sentence-hover')) {
              onSentenceClick(sentence.trim());
            }
          }}
          title="Click sentence for Original vs Improved AI breakdown"
        >
          {words.map((chunk, idx) => {
            const clean = chunk.toLowerCase().replace(/[^a-z]/g, '');
            if (!clean) return <span key={idx}>{chunk}</span>;

            const isFiller = FILLER_WORDS.includes(clean);
            const isPower = POWER_WORDS.includes(clean);
            const isJargon = JARGON_WORDS.includes(clean);
            const isVague = VAGUE_WORDS.includes(clean);

            if (filterMode === 'fillers' && !isFiller) return <span key={idx} className="opacity-30">{chunk}</span>;
            if (filterMode === 'power' && !isPower) return <span key={idx} className="opacity-30">{chunk}</span>;

            let tagClass = 'hover:bg-slate-800 rounded px-0.5 cursor-pointer transition-colors';
            if (isFiller) tagClass = 'filler-tag mx-0.5 inline-block cursor-pointer animate-pulse';
            else if (isPower) tagClass = 'power-tag mx-0.5 inline-block cursor-pointer font-bold';
            else if (isJargon) tagClass = 'jargon-tag mx-0.5 inline-block cursor-pointer';
            else if (isVague) tagClass = 'vague-tag mx-0.5 inline-block cursor-pointer';

            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onWordClick({ raw: chunk, clean });
                }}
                className={tagClass}
                title="Click word to inspect frequency & suggestions"
              >
                {chunk}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <div className="w-full glass-panel p-5 flex flex-col h-[380px] md:h-[440px] border border-slate-800 relative">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-800 gap-2 mb-3">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <MessageSquareText size={18} className="text-purple-400" />
          <span>Interactive Speech Stream</span>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap font-mono">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            {totalWords} Words
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold flex items-center gap-1">
            <Flame size={12} /> {powerWords.length} Power
          </span>
          {fillers.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 font-bold flex items-center gap-1">
              <AlertCircle size={12} /> {fillers.length} Fillers
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!fullTranscript}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30"
            title="Copy Full Transcript"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 text-[11px] font-mono flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Words' },
            { id: 'power', label: 'Power Words' },
            { id: 'fillers', label: 'Fillers' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id)}
              className={`px-2.5 py-0.5 rounded-md border transition-all ${
                filterMode === f.id
                  ? 'bg-purple-600/30 text-purple-200 border-purple-500/60 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-purple-300 text-[10px] font-semibold flex items-center gap-1">
          <Sparkles size={12} /> Click word or sentence to analyze
        </span>
      </div>

      {/* Transcript Scroll Window */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-3 font-sans text-sm leading-relaxed text-slate-100"
      >
        {!fullTranscript && !interimTranscript ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
            <Zap size={24} className="text-slate-600 mb-1" />
            <p className="text-sm font-semibold text-slate-400">Listening for speech...</p>
            <p className="text-xs text-slate-600 max-w-xs">
              Click any highlighted word for word chips or click any sentence for Original vs Improved AI analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-2 whitespace-pre-wrap">
            {renderSentences()}
            {interimTranscript && (
              <span className="text-cyan-300/70 italic border-b border-cyan-500/30 ml-1">
                {interimTranscript}...
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center font-mono">
        <span>Click word or sentence for AI breakdown</span>
        <span>{wpm > 0 ? `${wpm} WPM` : 'Ready'}</span>
      </div>
    </div>
  );
}
