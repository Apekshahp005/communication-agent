import React from 'react';
import { Target, Timer, Flame, Sparkles, Compass, Lightbulb, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export const PRACTICE_CHALLENGES = [
  {
    id: 'story_60s',
    title: '60-Second Story Challenge',
    icon: Timer,
    difficulty: 'Medium',
    timeLimitSec: 60,
    category: 'Storytelling',
    prompt: 'Tell a complete story with a beginning, tension, and ending in under 60 seconds.',
    hint: 'Start with the setting or vivid action right away. Avoid backstory fluff.'
  },
  {
    id: 'hook_challenge',
    title: 'Curiosity Hook Challenge',
    icon: Sparkles,
    difficulty: 'Hard',
    timeLimitSec: 45,
    category: 'Hooks',
    prompt: 'Start a story or argument without revealing the outcome for the first 30 seconds.',
    hint: 'Create an open loop that makes the listener lean in and wonder "what happens next?".'
  },
  {
    id: 'analogy_challenge',
    title: 'Everyday Analogy Challenge',
    icon: Compass,
    difficulty: 'Medium',
    timeLimitSec: 60,
    category: 'Simplification',
    prompt: 'Explain a complex concept (e.g. quantum computing, database indexes, or inflation) using an everyday metaphor.',
    hint: 'Pick an object or situation everyone knows (e.g., a library catalog, kitchen recipe).'
  },
  {
    id: 'wit_challenge',
    title: 'Natural Wit Challenge',
    icon: Lightbulb,
    difficulty: 'Hard',
    timeLimitSec: 45,
    category: 'Wit & Tone',
    prompt: 'Respond to an unexpected or dry situation with a clever, relatable observation without telling a canned joke.',
    hint: 'Use light self-aware humor or unexpected contrast.'
  },
  {
    id: 'clarity_challenge',
    title: 'Zero Jargon Challenge',
    icon: Target,
    difficulty: 'Easy',
    timeLimitSec: 60,
    category: 'Clarity',
    prompt: 'Explain your current project or career without using a single acronym or technical buzzword.',
    hint: 'Focus on who benefits and what problem is actually solved.'
  },
  {
    id: 'pressure_20s',
    title: '20-Second Pressure Challenge',
    icon: Clock,
    difficulty: 'Extreme',
    timeLimitSec: 20,
    category: 'Conciseness',
    prompt: 'You have exactly 20 seconds. Answer: "Why should anyone listen to your idea?"',
    hint: 'State the single most compelling benefit in 1 punchy sentence.'
  },
  {
    id: 'audience_recovery',
    title: 'Confused Audience Recovery',
    icon: ShieldAlert,
    difficulty: 'Hard',
    timeLimitSec: 45,
    category: 'Adaptability',
    prompt: 'Your audience looks visibly lost. Stop your current point and recover using a fresh concrete example.',
    hint: 'Acknowledge the complexity: "To picture how this actually works..."'
  },
  {
    id: 'memory_challenge',
    title: 'Memorability Challenge',
    icon: Flame,
    difficulty: 'Hard',
    timeLimitSec: 60,
    category: 'Impact',
    prompt: 'Explain an idea so vividly that someone listening can repeat it to a friend tomorrow.',
    hint: 'Use a memorable rule of thumb, visual image, or strong emotional contrast.'
  }
];

export default function ChallengeCardGrid({ onLaunchChallenge }) {
  return (
    <div className="w-full space-y-6 animate-slide-up">
      <div className="glass-panel p-6 border-l-4 border-l-purple-500 bg-slate-900/90 shadow-xl space-y-1">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target size={16} /> HIGH-INTENSITY DRILL ARENA
          </span>
          <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
            8 Timed Drills Ready
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white font-heading">Targeted Communication Refined under Pressure</h2>
        <p className="text-xs text-slate-400">
          Select any challenge card below to immediately enter the coaching studio with timed goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRACTICE_CHALLENGES.map((challenge) => {
          const Icon = challenge.icon;
          return (
            <div
              key={challenge.id}
              onClick={() => onLaunchChallenge(challenge)}
              className="glass-panel p-5 cursor-pointer hover:border-purple-500/80 hover:bg-slate-900/95 transition-all duration-250 flex flex-col justify-between group shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/90 border border-purple-500/50 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shadow-md">
                    <Icon size={20} />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono border ${
                    challenge.difficulty === 'Extreme' ? 'bg-rose-950 text-rose-300 border-rose-700/60 shadow-md shadow-rose-950/40' :
                    challenge.difficulty === 'Hard' ? 'bg-amber-950 text-amber-300 border-amber-700/60 shadow-md shadow-amber-950/40' :
                    'bg-slate-900 text-slate-300 border-slate-700'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors font-heading">
                    {challenge.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed italic">
                    "{challenge.prompt}"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono flex items-center gap-1.5 font-bold">
                  <Clock size={13} className="text-cyan-400" /> {challenge.timeLimitSec}s Limit
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchChallenge(challenge);
                  }}
                  className="btn-primary text-[11px] font-bold py-1.5 px-3 flex items-center gap-1 shadow-md shadow-purple-500/20"
                >
                  <Sparkles size={12} /> Start Drill <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
