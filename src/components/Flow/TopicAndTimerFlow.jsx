import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Mic, Clock, ArrowRight, Layers, CheckCircle2, Play, Flame, Compass, Users } from 'lucide-react';
import { fetchHistory } from '../../services/api';

function ProgressStrip() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().then(data => {
      setHistory(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!history || history.length === 0) {
    return (
      <div className="glass-panel p-4 px-6 border border-white/10 bg-slate-900/60 rounded-2xl flex justify-between items-center flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span className="text-slate-300 font-sans font-medium">Ready when you are. Your baseline audit begins with your first practice session.</span>
        </div>
        <span className="text-purple-400 font-bold text-[11px] font-sans">0 Sessions Logged</span>
      </div>
    );
  }

  const avgScore = Math.round(
    history.reduce((acc, item) => acc + (item.report?.overallEffectivenessScore || item.report?.overallScore || 80), 0) / history.length
  );

  return (
    <div className="glass-panel p-4 px-6 border border-white/10 bg-slate-900/60 rounded-2xl flex justify-between items-center flex-wrap gap-4 text-xs font-mono">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-400 font-sans">Current Practice:</span>
        <span className="font-bold text-white">{history.length} Session{history.length !== 1 ? 's' : ''} Completed</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-sans">Sessions Logged:</span>
        <span className="font-bold text-purple-300">{history.length}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-sans">Average Score:</span>
        <span className="font-bold text-cyan-300">{avgScore} / 100</span>
      </div>
    </div>
  );
}

export const TOPIC_CATEGORIES = [
  {
    id: 'ai',
    name: 'AI & Future',
    icon: Sparkles,
    suggestions: [
      'Explain AGI to a beginner.',
      'Will AI replace human creativity or amplify it?',
      'How will autonomous agents reshape daily work?'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: Layers,
    suggestions: [
      'Explain database indexing using an everyday analogy.',
      'Why is cybersecurity essential for every company?',
      'How does open-source software benefit society?'
    ]
  },
  {
    id: 'career',
    name: 'Career & Pitch',
    icon: Brain,
    suggestions: [
      'Pitch your current project in 30 seconds.',
      'What is your biggest professional achievement and why?',
      'How do you handle disagreement with a stakeholder?'
    ]
  }
];

export default function TopicAndTimerFlow({ onReadyToSpeak, currentTopic, onSelectTopic }) {
  const [selectedCategory, setSelectedCategory] = useState(TOPIC_CATEGORIES[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [phase, setPhase] = useState('choose'); // 'choose' | 'think' | 'ready'
  const [thinkSeconds, setThinkSeconds] = useState(30);

  // Think timer countdown
  useEffect(() => {
    let timer;
    if (phase === 'think') {
      if (thinkSeconds > 0) {
        timer = setInterval(() => setThinkSeconds((prev) => prev - 1), 1000);
      } else {
        setPhase('ready');
        onReadyToSpeak();
      }
    }
    return () => clearInterval(timer);
  }, [phase, thinkSeconds, onReadyToSpeak]);

  const handleStartThink = (topicText) => {
    onSelectTopic(topicText);
    setThinkSeconds(30);
    setPhase('think');
  };

  const handleSkipThink = () => {
    setPhase('ready');
    onReadyToSpeak();
  };

  const formatSecs = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full space-y-8 animate-slide-up max-w-4xl mx-auto py-4">
      {phase === 'choose' && (
        <>
          {/* HERO TITLE BLOCK */}
          <div className="text-center space-y-4 py-4">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-950/80 px-4 py-1.5 rounded-full border border-purple-500/40 inline-block shadow-md">
              AI COMMUNICATION COACH
            </span>
            
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-heading leading-tight max-w-2xl mx-auto">
              Your private AI coach for becoming a clearer, more confident speaker.
            </h1>
            
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Speak naturally into your microphone. Receive real-time vocal cadence, visual presence, and structure insights as you speak.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleStartThink(currentTopic || 'Explain AGI to a beginner.')}
                className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-purple-500/30 scale-105 hover:scale-110 transition-transform font-extrabold"
              >
                <Sparkles size={18} /> START PRACTICE →
              </button>
            </div>
          </div>

          {/* FLOATING GLASS TODAY'S CHALLENGE SURFACE */}
          <div className="glass-panel p-8 border-2 border-purple-500/50 bg-gradient-to-r from-purple-950/30 via-slate-900/90 to-cyan-950/30 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center flex-wrap gap-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-extrabold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                <Flame size={16} className="text-amber-400" /> TODAY'S FEATURED CHALLENGE
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
                Recommended Daily Drill
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-heading">
                "{currentTopic || 'Explain AGI to a beginner.'}"
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1 flex-wrap">
                <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Clock size={14} className="text-cyan-400" /> 2 minutes
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Users size={14} className="text-purple-400" /> Curious listener
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Compass size={14} className="text-emerald-400" /> Public Speaking
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Or enter a custom topic..."
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-medium w-full sm:w-72"
                />
                {customTopic.trim() && (
                  <button
                    onClick={() => handleStartThink(customTopic.trim())}
                    className="btn-secondary text-xs shrink-0"
                  >
                    Set Topic
                  </button>
                )}
              </div>

              <button
                onClick={() => handleStartThink(currentTopic || 'Explain AGI to a beginner.')}
                className="btn-primary text-xs font-bold px-6 py-3 shadow-lg shadow-purple-500/25 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                START PRACTICE →
              </button>
            </div>
          </div>

          {/* COMPACT PROGRESS STRIP (HONEST EMPTY STATE OR REAL HISTORY STATS) */}
          <ProgressStrip />
        </>
      )}

      {/* PHASE 2: 30-SECOND THINK TIMER */}
      {phase === 'think' && (
        <div className="glass-panel p-8 text-center space-y-6 border-2 border-purple-500/60 bg-gradient-to-b from-slate-900 via-purple-950/30 to-slate-950 relative overflow-hidden animate-slide-up rounded-3xl shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest animate-pulse">
              STEP 2: THINK & PREPARE
            </span>
            <h2 className="text-2xl font-black text-white font-heading">"{currentTopic}"</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Take a moment. Organize your main message, key hook, and closing takeaway.
            </p>
          </div>

          {/* Circular Countdown Timer */}
          <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="62" stroke="#1e293b" strokeWidth="6" fill="transparent" />
              <circle
                cx="72" cy="72" r="62" stroke="#8b5cf6" strokeWidth="6" fill="transparent"
                strokeDasharray="390" strokeDashoffset={390 - (390 * (30 - thinkSeconds)) / 30}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-white">
                {formatSecs(thinkSeconds)}
              </span>
              <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">PREPARING</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button onClick={handleSkipThink} className="btn-primary text-xs px-6 py-3">
              <Mic size={16} /> Ready to Speak Now →
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: READY / SPEAKING */}
      {phase === 'ready' && (
        <div className="glass-panel p-5 flex items-center justify-between border-l-4 border-l-emerald-500 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Active Practice Topic:</span>
              <p className="text-sm font-bold text-white">"{currentTopic}"</p>
            </div>
          </div>

          <button onClick={() => setPhase('choose')} className="btn-secondary text-xs">
            Change Topic
          </button>
        </div>
      )}
    </div>
  );
}
