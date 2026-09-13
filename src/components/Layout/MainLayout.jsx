import React, { useState } from 'react';
import {
  Sparkles, Video, Grid, Target, TrendingUp, Brain, Settings, Volume2, VolumeX, Menu, X
} from 'lucide-react';

export default function MainLayout({ activeTab, onTabChange, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'studio', label: 'Live Studio', icon: Video },
    { id: 'topic', label: 'Topic & Timer', icon: Brain },
    { id: 'modes', label: '8 Practice Modes', icon: Grid },
    { id: 'challenges', label: 'Practice Drills', icon: Target },
    { id: 'progress', label: 'Analytics History', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-100 bg-slate-950 overflow-x-hidden">
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/80 m-4 p-5 space-y-8 shrink-0">
        {/* Logo Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-heading">Antigravity</h1>
            <p className="text-[10px] font-mono text-purple-400 font-bold tracking-wider uppercase">
              Communication Agent
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">
            PRACTICE WORKSPACE
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-purple-400' : 'text-slate-500'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">Gemini 2.5 Flash Engine</p>
          <p className="text-[10px]">Real-Time Multimodal Voice & Vision</p>
        </div>
      </aside>

      {/* MOBILE STICKY TOP HEADER */}
      <div className="md:hidden sticky top-0 z-30 flex justify-between items-center p-3.5 glass-panel border-b border-slate-800/80 m-2 bg-slate-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="font-bold text-sm text-white font-heading block">Communication Agent</span>
            <span className="text-[9px] font-mono text-purple-400 font-semibold block">Speak • Improve • Grow</span>
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
