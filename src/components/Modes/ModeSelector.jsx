import React from 'react';
import {
  Mic2, Presentation, Radio, Video, TrendingUp, Briefcase, Zap, HelpCircle, Users, ArrowRight, CheckCircle2, Sparkles
} from 'lucide-react';

export const COMMUNICATION_MODES = [
  {
    id: 'public_speaking',
    title: 'Public Speaking',
    icon: Mic2,
    badge: 'Stage & Keynote',
    color: 'from-purple-600 to-indigo-600',
    description: 'Simulate stage keynotes, speeches, and large audience presentations. Master hooks, opening presence, and memorable endings.',
    promptFocus: 'opening hook, audience engagement, storytelling tension, vocal rhythm, memorable closing'
  },
  {
    id: 'presentation',
    title: 'Project Presentation',
    icon: Presentation,
    badge: 'Slide & Pitch',
    color: 'from-cyan-600 to-blue-600',
    description: 'Present an idea, slide outline, or project. Coach clarity, transitions between points, technical depth without boring the audience.',
    promptFocus: 'clarity, slide transition, bridging complex technical ideas to simple analogies, Q&A readiness'
  },
  {
    id: 'podcast',
    title: 'Podcast Conversation',
    icon: Radio,
    badge: 'Natural Wit & Flow',
    color: 'from-emerald-600 to-teal-600',
    description: 'Simulate a spontaneous podcast interview. Train conversational storytelling, active listening, witty observations, and natural callbacks.',
    promptFocus: 'spontaneous responses, natural wit, relatable analogies, avoiding robotic script answers'
  },
  {
    id: 'video_meeting',
    title: 'Video Meeting',
    icon: Video,
    badge: 'Team & Leadership',
    color: 'from-indigo-600 to-purple-600',
    description: 'Simulate daily team updates, project introductions, disagreeing professionally, and getting straight to the point in remote meetings.',
    promptFocus: 'concise updates, direct problem stating, professional tone, engaging team members'
  },
  {
    id: 'sales',
    title: 'Sales & Persuasion',
    icon: TrendingUp,
    badge: 'Pitch & Objections',
    color: 'from-amber-600 to-orange-600',
    description: 'Train persuasive communication, explaining value propositions, asking strategic questions, handling tough objections, and closing confidently.',
    promptFocus: 'value proposition, objection handling, empathy, persuasive closing, concise explanation'
  },
  {
    id: 'interview',
    title: 'Job & Technical Interview',
    icon: Briefcase,
    badge: 'Behavioral & Tech',
    color: 'from-rose-600 to-pink-600',
    description: 'AI acts as the interviewer asking behavioral, technical, and unexpected follow-up questions. No memorized scripts allowed.',
    promptFocus: 'STAR response structure, direct answers, specific examples, confidence under pressure'
  },
  {
    id: 'impromptu',
    title: 'Impromptu Speaking',
    icon: Zap,
    badge: '60s Challenge',
    color: 'from-yellow-500 to-amber-600',
    description: 'Get random topics with immediate countdown timers. Train fast thinking, rapid structure, and clear delivery under time constraints.',
    promptFocus: 'rapid organization, 60-second limit, immediate hook, smooth transition to conclusion'
  },
  {
    id: 'audience_qa',
    title: 'Audience Q&A',
    icon: HelpCircle,
    badge: '7-Step Framework',
    color: 'from-fuchsia-600 to-purple-600',
    description: 'AI simulates audience members asking confusing, skeptical, or aggressive questions. Practice the 7-step structured answer framework.',
    promptFocus: 'pause & reflect, direct answer, detailed explanation, everyday example, strong closing'
  }
];

export const AUDIENCE_TYPES = [
  { id: 'curious listener', label: 'Curious Listener (Default)', desc: 'Eager to learn, responds to strong hooks & analogies' },
  { id: 'skeptical audience', label: 'Skeptical & Challenging', desc: 'Questions assumptions, demands evidence & logic' },
  { id: 'executive', label: 'Busy Executive', desc: 'Wants bottom line upfront (BLUF), zero fluff' },
  { id: 'expert', label: 'Technical Expert', desc: 'Looks for depth, precision, and zero hand-waving' },
  { id: 'beginner', label: 'Beginner / Non-Technical', desc: 'Needs simple terms, visual metaphors, no jargon' },
  { id: 'bored audience', label: 'Distracted / Bored Audience', desc: 'Needs high energy, open loops, and dramatic contrast' },
  { id: 'interviewer', label: 'Strict Interviewer', desc: 'Evaluates conciseness, honesty, and leadership presence' }
];

export default function ModeSelector({ selectedMode, onSelectMode, selectedAudience, onSelectAudience }) {
  return (
    <div className="w-full space-y-6 animate-slide-up">
      {/* Audience Simulation Selector Bar */}
      <div className="glass-panel p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-cyan-500/40 bg-slate-900/90 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Users size={20} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white font-heading">Simulated Audience Persona</h4>
            <p className="text-xs text-slate-400">Configure how the AI coach and simulated audience react during practice.</p>
          </div>
        </div>

        <select
          value={selectedAudience}
          onChange={(e) => onSelectAudience(e.target.value)}
          className="bg-slate-950 text-cyan-200 text-xs rounded-xl px-4 py-2.5 border border-cyan-500/50 focus:outline-none focus:border-cyan-400 font-bold w-full sm:w-auto shadow-md"
        >
          {AUDIENCE_TYPES.map((aud) => (
            <option key={aud.id} value={aud.id}>
              {aud.label} — {aud.desc}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of 8 Practice Environments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMMUNICATION_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode.id === mode.id;

          return (
            <div
              key={mode.id}
              onClick={() => onSelectMode(mode)}
              className={`glass-panel p-5 cursor-pointer flex flex-col justify-between transition-all duration-250 group relative overflow-hidden ${
                isSelected
                  ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/30 bg-slate-900/95 scale-[1.02]'
                  : 'hover:border-slate-600 hover:bg-slate-900/70 hover:scale-[1.01]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
              )}

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${
                    isSelected
                      ? 'bg-purple-950 text-purple-300 border-purple-600/60 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {mode.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white font-heading group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  {mode.title}
                  {isSelected && <CheckCircle2 size={16} className="text-purple-400" />}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold font-heading">
                <span className={isSelected ? 'text-purple-300 flex items-center gap-1' : 'text-slate-400'}>
                  {isSelected ? '✓ Selected Mode' : 'Select Environment'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMode(mode);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles size={12} /> Launch →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
