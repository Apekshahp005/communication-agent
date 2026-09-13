import React, { useRef, useEffect, useState } from 'react';
import { MessageSquareText, AlertCircle, Copy, Check, Zap, Flame, Compass, Filter } from 'lucide-react';
import { FILLER_WORDS, POWER_WORDS, JARGON_WORDS, VAGUE_WORDS } from '../../services/speechRecognition';

export default function LiveTranscriptBox({
  fullTranscript,
  interimTranscript,
  wordsAnalyzed = [],
  fillers = [],
  powerWords = [],
  jargon = [],
  vague = [],
  wpm = 0,
  totalWords = 0
}) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'fillers' | 'power' | 'jargon'

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [fullTranscript, interimTranscript, wordsAnalyzed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Advanced word-by-word classification renderer
  const renderWordByWord = () => {
    if (!fullTranscript) return null;

    const words = fullTranscript.split(/(\s+)/);

    return words.map((chunk, idx) => {
      const clean = chunk.toLowerCase().replace(/[^a-z]/g, '');
      if (!clean) return <span key={idx}>{chunk}</span>;

      const isFiller = FILLER_WORDS.includes(clean);
      const isPower = POWER_WORDS.includes(clean);
      const isJargon = JARGON_WORDS.includes(clean);
      const isVague = VAGUE_WORDS.includes(clean);

      if (filterMode === 'fillers' && !isFiller) return <span key={idx} className="opacity-40">{chunk}</span>;
      if (filterMode === 'power' && !isPower) return <span key={idx} className="opacity-40">{chunk}</span>;
      if (filterMode === 'jargon' && !isJargon) return <span key={idx} className="opacity-40">{chunk}</span>;

      if (isFiller) {
        return (
          <span key={idx} className="filler-tag mx-0.5 inline-block animate-pulse" title="Filler Word">
            {chunk}
          </span>
        );
      }
      if (isPower) {
        return (
          <span key={idx} className="power-tag mx-0.5 inline-block font-bold" title="High-Impact Power Word">
            {chunk}
          </span>
        );
      }
      if (isJargon) {
        return (
          <span key={idx} className="jargon-tag mx-0.5 inline-block" title="Technical Jargon">
            {chunk}
          </span>
        );
      }
      if (isVague) {
        return (
          <span key={idx} className="vague-tag mx-0.5 inline-block" title="Vague Phrasing">
            {chunk}
          </span>
        );
      }

      return <span key={idx}>{chunk}</span>;
    });
  };

  return (
    <div className="w-full glass-panel p-5 flex flex-col h-[380px] md:h-[440px] border border-slate-800 relative">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-800 gap-2 mb-3">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <MessageSquareText size={18} className="text-purple-400" />
          <span>Word-by-Word Live Analysis</span>
        </div>

        {/* Live Word Metrics Bar */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
            {totalWords} Words
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono font-bold flex items-center gap-1">
            <Flame size={12} /> {powerWords.length} Power
          </span>
          {fillers.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 font-mono font-bold flex items-center gap-1">
              <AlertCircle size={12} /> {fillers.length} Fillers
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!fullTranscript}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 ml-1"
            title="Copy Full Transcript"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Filter Mode Selector Pills */}
      <div className="flex items-center gap-2 mb-3 text-[11px] font-mono">
        <span className="text-slate-500 flex items-center gap-1">
          <Filter size={12} /> Filter Highlights:
        </span>
        {[
          { id: 'all', label: 'All Words' },
          { id: 'power', label: 'Power Words' },
          { id: 'fillers', label: 'Fillers' },
          { id: 'jargon', label: 'Jargon' }
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

      {/* Transcript Stream */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-3 font-sans text-sm leading-relaxed text-slate-100"
      >
        {!fullTranscript && !interimTranscript ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-1">
              <Zap size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-400">Listening for live speech...</p>
            <p className="text-xs text-slate-600 max-w-xs">
              Every word spoken is classified live into Power Words, Fillers, Jargon, and Vague Phrases.
            </p>
          </div>
        ) : (
          <div className="space-y-2 whitespace-pre-wrap">
            {renderWordByWord()}
            {interimTranscript && (
              <span className="text-cyan-300/70 italic border-b border-cyan-500/30 ml-1">
                {interimTranscript}...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Real-Time Word Stream
        </span>
        <span>{wpm > 0 ? `${wpm} WPM` : 'Ready'}</span>
      </div>
    </div>
  );
}
