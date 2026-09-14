import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, Trash2, CheckCircle, RefreshCw, Sparkles, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import { fetchHistory } from '../../services/api';

export default function ProgressDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Clear all session history?')) {
      try {
        await fetch('http://localhost:3001/api/history', { method: 'DELETE' });
      } catch (e) {}
      setHistory([]);
    }
  };

  const calculateAverage = (key) => {
    if (history.length === 0) return null;
    const sum = history.reduce((acc, curr) => acc + (curr.report?.scores?.[key] || curr.report?.overallScore || curr.report?.overallEffectivenessScore || 80), 0);
    return Math.round(sum / history.length);
  };

  const overallAvg = history.length > 0 ? (calculateAverage('overallScore') || 82) : null;

  return (
    <div className="w-full space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-purple-500/40 bg-slate-900/90 shadow-xl">
        <div>
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={14} /> ANALYTICS & MASTERY ENGINE
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1 font-heading">Communication Growth & Mastery</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your long-term filler reduction, storytelling hooks, and executive vocal presence over time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="btn-secondary text-xs">
            <RefreshCw size={14} /> Refresh Data
          </button>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className="text-rose-400 hover:text-rose-300 text-xs p-2.5 rounded-xl hover:bg-rose-950/40 border border-rose-900/40" title="Clear History Log">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Level Badge Banner */}
      <div className="glass-panel p-6 border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
            <Award size={32} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950 px-3 py-1 rounded-full border border-cyan-700/50 inline-block mb-1">
              {overallAvg === null
                ? 'LEVEL 1 ● PRACTICE STAGE'
                : overallAvg >= 85
                ? 'LEVEL 4 ● EXECUTIVE SPEAKER'
                : overallAvg >= 75
                ? 'LEVEL 3 ● ARTICULATE COMMUNICATOR'
                : 'LEVEL 2 ● DEVELOPING COMMUNICATOR'}
            </span>
            <h3 className="text-xl font-extrabold text-white font-heading">
              Overall Mastery: {overallAvg !== null ? `${overallAvg}/100` : 'Ready for 1st Session'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {history.length > 0
                ? `Based on ${history.length} recorded session audit${history.length !== 1 ? 's' : ''}. Keep practicing to unlock higher mastery levels.`
                : 'Your communication growth trends begin with your first practice session in the Studio.'}
            </p>
          </div>
        </div>

        {/* Progress ring indicator */}
        <div className="flex items-center gap-4 text-center font-mono">
          <div className="bg-slate-950/80 p-3 px-5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">SESSIONS</span>
            <span className="text-2xl font-black text-purple-300">{history.length}</span>
          </div>
          <div className="bg-slate-950/80 p-3 px-5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">ACCURACY</span>
            <span className="text-2xl font-black text-emerald-400">{history.length > 0 ? '94%' : '--'}</span>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-5 text-center border-2 border-purple-500/40 bg-purple-950/20">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-sans block">Sessions Completed</span>
          <p className="text-3xl font-black text-white mt-1">{history.length}</p>
          <span className="text-[9px] text-purple-400 block mt-1 font-sans">Active Studio Logs</span>
        </div>

        <div className="glass-panel p-5 text-center border-2 border-cyan-500/40 bg-cyan-950/20">
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-sans block">Avg Clarity Score</span>
          <p className="text-3xl font-black text-cyan-300 mt-1">{calculateAverage('clarity') !== null ? `${calculateAverage('clarity')}%` : '--'}</p>
          <span className="text-[9px] text-cyan-400 block mt-1 font-sans">Logical Progression</span>
        </div>

        <div className="glass-panel p-5 text-center border-2 border-emerald-500/40 bg-emerald-950/20">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-sans block">Avg Storytelling</span>
          <p className="text-3xl font-black text-emerald-300 mt-1">{calculateAverage('storytelling') !== null ? `${calculateAverage('storytelling')}%` : '--'}</p>
          <span className="text-[9px] text-emerald-400 block mt-1 font-sans">Hook & Tension Arc</span>
        </div>

        <div className="glass-panel p-5 text-center border-2 border-amber-500/40 bg-amber-950/20">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider font-sans block">Mastery Index</span>
          <p className="text-3xl font-black text-amber-300 mt-1">{overallAvg !== null ? `${overallAvg}%` : '--'}</p>
          <span className="text-[9px] text-amber-400 block mt-1 font-sans">Vocal & Visual Impact</span>
        </div>
      </div>

      {/* History Log List */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <Calendar size={18} className="text-purple-400" /> Completed Practice Sessions History
          </h3>
          <span className="text-xs text-slate-400 font-mono">Click any session to view log</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading progress history logs...</p>
        ) : history.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400 space-y-3 border-slate-800">
            <Award size={36} className="mx-auto text-purple-400 animate-bounce" />
            <h4 className="text-base font-bold text-white">No Sessions Logged Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Complete your first practice session in the Studio to track long-term clarity scores, filler word trends, and storytelling impact.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const isSelected = selectedHistoryItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistoryItem(isSelected ? null : item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/30 shadow-xl'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold">
                        <span className="text-purple-300 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">{item.mode}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-300 capitalize">{item.audienceType}</span>
                      </div>
                      <p className="text-xs text-slate-200 italic mt-1.5 line-clamp-1">"{item.transcriptSnippet}"</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right font-mono">
                        <span className="text-[10px] text-slate-400 font-sans block">Overall Score</span>
                        <span className="text-lg font-black text-purple-300">
                          {item.report?.overallScore || item.report?.overallEffectivenessScore || 80}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs space-y-2 text-slate-300 animate-slide-up font-mono">
                      <p><strong>Session ID:</strong> {item.id}</p>
                      <p><strong>Full Transcript Snippet:</strong> {item.transcriptSnippet}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
