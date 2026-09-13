import React from 'react';
import { Target, Timer, Flame, Sparkles, Compass, Lightbulb, Clock, ShieldAlert } from 'lucide-react';

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
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="text-purple-400" size={20} /> Targeted Practice Challenges
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a timed challenge to train specific communication reflexes under pressure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRACTICE_CHALLENGES.map((challenge) => {
          const Icon = challenge.icon;
          return (
            <div
              key={challenge.id}
              onClick={() => onLaunchChallenge(challenge)}
              className="glass-panel p-5 cursor-pointer hover:border-purple-500/60 hover:bg-slate-900/80 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    challenge.difficulty === 'Extreme' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    challenge.difficulty === 'Hard' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {challenge.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  "{challenge.prompt}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono flex items-center gap-1">
                  <Clock size={12} /> {challenge.timeLimitSec}s
                </span>
                <span className="btn-primary text-[11px] py-1 px-2.5">Launch &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
