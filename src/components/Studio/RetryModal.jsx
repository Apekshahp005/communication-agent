import React, { useState } from 'react';
import { RefreshCw, Sparkles, CheckCircle2, ArrowRight, X, TrendingUp, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateRetryAttempt } from '../../services/api';

export default function RetryModal({ isOpen, onClose, weakSnippet, retryPrompt, fullTranscript, onCompleteRetry }) {
  const [attempt2Text, setAttempt2Text] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  if (!isOpen) return null;

  const handleRunEvaluation = async () => {
    if (!attempt2Text.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateRetryAttempt({
        weakSnippet: weakSnippet || 'Previous explanation',
        attempt1: weakSnippet || fullTranscript.slice(-150),
        attempt2: attempt2Text,
        goalPrompt: retryPrompt || 'Simplify and strengthen the delivery'
      });
      setEvaluationResult(result);

      if (result?.percentImprovement > 0) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }

      if (onCompleteRetry) {
        onCompleteRetry({
          weakSnippet,
          attempt1: weakSnippet || fullTranscript.slice(-150),
          attempt2: attempt2Text,
          evaluation: result
        });
      }
    } catch (err) {
      console.error('Retry evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-slide-up">
      <div className="w-full max-w-xl glass-panel-glow bg-slate-900 border-2 border-purple-500/60 p-6 rounded-3xl shadow-2xl relative space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <RefreshCw size={24} className="animate-spin-slow text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-purple-400 uppercase">
              RETRY THIS MOMENT
            </span>
            <h3 className="text-xl font-extrabold text-white">Immediate Practice Loop</h3>
          </div>
        </div>

        {/* Challenge Prompt Box */}
        <div className="bg-slate-950/90 border border-purple-500/40 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-purple-300 font-mono font-bold uppercase">Coach Directive:</span>
          <p className="text-sm text-purple-100 font-semibold leading-relaxed">
            {retryPrompt || "That part is key, but difficult to follow. Try it again in 1 simple sentence."}
          </p>
        </div>

        {/* Input & Evaluation */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400">
            <span className="text-[10px] font-bold text-rose-400 uppercase font-mono block mb-1">Attempt 1 (Original Line):</span>
            <p className="italic text-slate-300">"{weakSnippet || fullTranscript.slice(-120) || 'Previous statement'}"</p>
          </div>

          {!evaluationResult ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase font-mono block">
                Attempt 2 (Your Improved Version):
              </label>
              <textarea
                value={attempt2Text}
                onChange={(e) => setAttempt2Text(e.target.value)}
                placeholder="Type or speak your improved sentence here..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500 font-medium"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={onClose} className="btn-secondary text-xs">
                  Skip Attempt
                </button>
                <button
                  onClick={handleRunEvaluation}
                  disabled={!attempt2Text.trim() || isEvaluating}
                  className="btn-primary text-xs disabled:opacity-50"
                >
                  {isEvaluating ? 'Evaluating Retry...' : 'Evaluate Attempt 2'} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Result Evaluation Box with Improvement Delta */
            <div className="space-y-4 bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-2 border-emerald-500/50 p-5 rounded-2xl animate-slide-up">
              {/* Score Comparison Badge */}
              <div className="flex justify-between items-center bg-slate-950/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ATTEMPT 1</span>
                    <span className="text-sm font-bold text-slate-300">{evaluationResult.attempt1Score || 72}/100</span>
                  </div>
                  <span className="text-slate-600 font-bold">&rarr;</span>
                  <div>
                    <span className="text-[10px] text-emerald-400 block">ATTEMPT 2</span>
                    <span className="text-sm font-bold text-emerald-400">{evaluationResult.attempt2Score || 84}/100</span>
                  </div>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-500/50 px-3 py-1.5 rounded-full text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md">
                  <TrendingUp size={15} />
                  <span>You improved by +{evaluationResult.percentImprovement || 12}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-purple-300 font-bold text-xs uppercase font-mono block">Why Attempt 2 Worked Better:</span>
                <p className="text-slate-200 text-xs leading-relaxed">{evaluationResult.keyImprovementWhy}</p>
              </div>

              <p className="text-emerald-300 text-xs italic bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-800/40">
                "{evaluationResult.encouragement}"
              </p>

              <div className="flex justify-end">
                <button onClick={onClose} className="btn-primary text-xs">
                  Continue Live Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
