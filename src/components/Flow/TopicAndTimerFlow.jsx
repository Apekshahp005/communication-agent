import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Mic, Clock, ArrowRight, RefreshCw, Layers, CheckCircle2, Play } from 'lucide-react';

export const TOPIC_CATEGORIES = [
  {
    id: 'ai',
    name: 'AI & Future',
    icon: Sparkles,
    color: 'from-purple-600 to-indigo-600',
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
    color: 'from-cyan-600 to-blue-600',
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
    color: 'from-emerald-600 to-teal-600',
    suggestions: [
      'Pitch your current project in 30 seconds.',
      'What is your biggest professional achievement and why?',
      'How do you handle disagreement with a stakeholder?'
    ]
  },
  {
    id: 'personal',
    name: 'Personal Experience',
    icon: Clock,
    color: 'from-amber-600 to-orange-600',
    suggestions: [
      'Tell a story about a failure that changed your perspective.',
      'Describe a moment when you had to step out of your comfort zone.',
      'What is one lesson you learned the hard way?'
    ]
  },
  {
    id: 'interviews',
    name: 'Interviews',
    icon: RefreshCw,
    color: 'from-rose-600 to-pink-600',
    suggestions: [
      'Why should we hire you for this role?',
      'Tell me about a time you led under tight deadlines.',
      'How do you prioritize competing tasks?'
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
    <div className="w-full space-y-6 animate-slide-up">
      {/* PHASE 1: CHOOSE TOPIC */}
      {phase === 'choose' && (
        <div className="glass-panel p-6 border-l-4 border-l-purple-500 space-y-6">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain size={14} /> STEP 1: SELECT YOUR TOPIC
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">What would you like to speak about?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose a suggested topic below or enter a custom prompt to practice your storytelling and structure.
              </p>
            </div>
          </div>

          {/* Custom Topic Entry Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter your own topic (e.g. Explain AGI to a beginner)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 font-medium"
            />
            <button
              onClick={() => customTopic.trim() && handleStartThink(customTopic.trim())}
              disabled={!customTopic.trim()}
              className="btn-primary text-sm shrink-0 disabled:opacity-50"
            >
              Start 30s Think <ArrowRight size={16} />
            </button>
          </div>

          {/* Category Tabs & Suggestions */}
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-heading whitespace-nowrap transition-all ${
                    selectedCategory.id === cat.id
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Topic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedCategory.suggestions.map((topicStr, idx) => (
                <div
                  key={idx}
                  onClick={() => handleStartThink(topicStr)}
                  className="glass-panel p-5 cursor-pointer hover:border-purple-500/60 hover:bg-slate-900/80 transition-all flex flex-col justify-between group"
                >
                  <p className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 leading-relaxed">
                    "{topicStr}"
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>Select Topic</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: 30-SECOND THINK TIMER */}
      {phase === 'think' && (
        <div className="glass-panel p-8 text-center space-y-6 border-2 border-purple-500/60 bg-gradient-to-b from-slate-900 via-purple-950/30 to-slate-950 relative overflow-hidden animate-slide-up">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest animate-pulse">
              STEP 2: THINK & PREPARE
            </span>
            <h2 className="text-2xl font-bold text-white">"{currentTopic}"</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Take a moment. Organize your main message, key hook, and closing takeaway.
            </p>
          </div>

          {/* Circular Countdown Timer */}
          <div className="relative w-40 h-40 mx-auto flex flex-col items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#8b5cf6"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * (30 - thinkSeconds)) / 30}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black font-mono text-white tracking-tighter">
                {formatSecs(thinkSeconds)}
              </span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">THINKING</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button onClick={handleSkipThink} className="btn-primary text-xs">
              <Mic size={16} /> I'm Ready to Speak Now
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: READY / SPEAKING */}
      {phase === 'ready' && (
        <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Active Speaking Topic:</span>
              <p className="text-sm font-bold text-white">"{currentTopic}"</p>
            </div>
          </div>

          <button
            onClick={() => setPhase('choose')}
            className="btn-secondary text-xs"
          >
            Change Topic
          </button>
        </div>
      )}
    </div>
  );
}
