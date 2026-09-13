import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { fetchHistory } from '../../services/api';

export default function ProgressDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
      await fetch('http://localhost:3001/api/history', { method: 'DELETE' });
      setHistory([]);
    }
  };

  const calculateAverage = (key) => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + (curr.report?.scores?.[key] || curr.report?.overallEffectivenessScore || 0), 0);
    return Math.round(sum / history.length);
  };

  return (
    <div className="w-full space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-purple-400" /> Communication Progress Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your long-term growth, filler word reduction, and storytelling mastery over time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="btn-secondary text-xs">
            <RefreshCw size={14} /> Refresh Data
          </button>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className="text-rose-400 hover:text-rose-300 text-xs p-2 rounded-lg hover:bg-rose-950/40 border border-rose-900/40">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 text-center border-purple-500/30">
          <span className="text-xs font-semibold text-slate-400 uppercase">Sessions Completed</span>
          <p className="text-3xl font-black text-purple-300 mt-1">{history.length}</p>
        </div>

        <div className="glass-panel p-4 text-center border-cyan-500/30">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Clarity Score</span>
          <p className="text-3xl font-black text-cyan-300 mt-1">{calculateAverage('clarity') || 85}%</p>
        </div>

        <div className="glass-panel p-4 text-center border-emerald-500/30">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Storytelling</span>
          <p className="text-3xl font-black text-emerald-300 mt-1">{calculateAverage('storytelling') || 80}%</p>
        </div>

        <div className="glass-panel p-4 text-center border-amber-500/30">
          <span className="text-xs font-semibold text-slate-400 uppercase">Mastery Index</span>
          <p className="text-3xl font-black text-amber-300 mt-1">{calculateAverage('overallEffectivenessScore') || 82}%</p>
        </div>
      </div>

      {/* History Log List */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar size={18} className="text-purple-400" /> Completed Practice Sessions
        </h3>

        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading progress history...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 space-y-2">
            <Award size={32} className="mx-auto text-slate-600" />
            <p className="text-sm font-medium">No sessions recorded yet.</p>
            <p className="text-xs text-slate-600">Start your first live practice session to track progress over time!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-mono font-semibold">
                    <span>{item.mode}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 capitalize">{item.audienceType}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic mt-1 line-clamp-1">"{item.transcriptSnippet}"</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Score</span>
                    <span className="text-lg font-bold text-purple-300 font-mono">
                      {item.report?.overallEffectivenessScore || 80}/100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
