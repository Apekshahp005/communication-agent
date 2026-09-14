import React, { useState } from 'react';
import {
  Sparkles, Video, Grid, Target, TrendingUp, Settings, HelpCircle, X, CheckCircle2, User
} from 'lucide-react';

export default function MainLayout({ activeTab, onTabChange, children }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navCenterItems = [
    { id: 'studio', label: 'Practice', icon: Video },
    { id: 'modes', label: 'Modes', icon: Grid },
    { id: 'challenges', label: 'Drills', icon: Target },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-100 bg-[#05070D] overflow-x-hidden relative">
      {/* FLOATING GLASS PILL TOP NAVIGATION BAR */}
      <header className="sticky top-4 z-40 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-pill px-5 py-3 flex items-center justify-between border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl">
          {/* LEFT: LOGO / WORDMARK */}
          <div
            onClick={() => onTabChange('studio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-extrabold tracking-tight text-white font-heading block leading-none">
                AI Communication Coach
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-semibold tracking-wider uppercase block mt-1">
                Personal AI Studio
              </span>
            </div>
          </div>

          {/* CENTER: NAV LINKS */}
          <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-full border border-white/5">
            {navCenterItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-heading transition-all ${
                    isActive
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-500/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-purple-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: SETTINGS & HELP */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Help & Framework Guide"
            >
              <HelpCircle size={18} />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Audio & Vision Settings"
            >
              <Settings size={18} />
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-white/20 shadow-md">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* SETTINGS SHEET MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 animate-slide-up">
          <div className="glass-panel p-6 max-w-md w-full border-purple-500/50 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <Settings size={18} className="text-purple-400" /> AI Coach Studio Settings
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>WebRTC Camera Stream</span>
                <span className="text-emerald-400 font-mono font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Web Audio Amplitude Metering</span>
                <span className="text-emerald-400 font-mono font-bold">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Speech Recognition STT</span>
                <span className="text-purple-400 font-mono font-bold">Real-Time</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Gemini 2.5 Multimodal Engine</span>
                <span className="text-cyan-400 font-mono font-bold">Connected</span>
              </div>
            </div>
            <button onClick={() => setIsSettingsOpen(false)} className="btn-primary w-full text-xs justify-center">
              Done
            </button>
          </div>
        </div>
      )}

      {/* HELP & FRAMEWORK GUIDE MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 animate-slide-up">
          <div className="glass-panel p-6 max-w-md w-full border-cyan-500/50 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <HelpCircle size={18} className="text-cyan-400" /> Personal AI Coach Guide
              </h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Live Voice & Vision:</strong> Speak into your mic while keeping camera active. The AI evaluates vocal pace and visual presence simultaneously.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Clickable Insights:</strong> Every metric, filler word, and timeline marker can be clicked to open targeted practice drills.</span>
              </p>
            </div>
            <button onClick={() => setIsHelpOpen(false)} className="btn-primary w-full text-xs justify-center">
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
