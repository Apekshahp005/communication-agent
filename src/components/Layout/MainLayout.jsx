import React, { useState } from 'react';
import {
  Sparkles, Video, Grid, Target, TrendingUp, Brain, Settings, Volume2, VolumeX, Menu, X, Flame, ShieldCheck, Compass
} from 'lucide-react';

export default function MainLayout({ activeTab, onTabChange, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'studio', label: 'Practice Studio', icon: Video, badge: 'LIVE' },
    { id: 'topic', label: 'Topic & Timer Setup', icon: Compass },
    { id: 'modes', label: 'Practice Environments', icon: Grid },
    { id: 'challenges', label: 'Targeted Drills', icon: Target },
    { id: 'progress', label: 'Progress & Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-100 bg-slate-950 overflow-x-hidden">
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/80 m-4 p-5 space-y-6 shrink-0 bg-slate-900/80 backdrop-blur-2xl">
        {/* Logo Badge */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white font-heading">AI Communication Coach</h1>
            <p className="text-[10px] font-mono text-purple-400 font-bold tracking-wider uppercase mt-0.5">
              Speak • Analyze • Improve
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-3 block mb-1">
            AI STUDIO WORKSPACE
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60 shadow-lg shadow-purple-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-purple-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* QUICK WARMUP CTA */}
        <div className="glass-panel p-4 border-purple-500/40 bg-purple-950/20 space-y-2 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 font-heading">
            <Flame size={14} className="text-amber-400" />
            <span>60s Executive Warmup</span>
          </div>
          <p className="text-[10px] text-slate-400">Train thesis clarity before your next meeting.</p>
          <button
            onClick={() => onTabChange('challenges')}
            className="btn-primary text-[11px] font-bold py-1.5 px-3 w-full justify-center shadow-md shadow-purple-500/20"
          >
            Start Warmup Drill →
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">AI MULTIMODAL ENGINE</span>
          </div>
          <p className="text-[10px] text-slate-500">Vision + Speech Recognition Active</p>
        </div>
      </aside>

      {/* MOBILE STICKY TOP HEADER */}
      <div className="md:hidden sticky top-0 z-30 flex justify-between items-center p-3.5 glass-panel border-b border-slate-800/80 m-2 bg-slate-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="font-bold text-sm text-white font-heading block">AI Communication Coach</span>
            <span className="text-[9px] font-mono text-purple-400 font-semibold block">Speak • Analyze • Improve</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel m-2 p-4 space-y-2 animate-slide-up z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold font-heading ${
                  activeTab === item.id ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50' : 'text-slate-300'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col p-3 md:p-6 max-w-7xl mx-auto w-full mb-20 md:mb-0">
        {children}
      </div>

      {/* MOBILE BOTTOM GLASS NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-800/80 p-2 flex justify-around items-center z-40 bg-slate-950/95 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold font-heading transition-all ${
                isActive ? 'text-purple-400 font-extrabold scale-105' : 'text-slate-500'
              }`}
            >
              <Icon size={20} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
