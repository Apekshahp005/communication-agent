import React, { useState } from 'react';
import { RefreshCw, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
      <div className="w-full max-w-xl glass-panel-glow bg-slate-900 border-2 border-purple-500/60 p-6 rounded-2xl shadow-2xl relative space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <RefreshCw size={24} className="animate-spin-slow text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-purple-400 uppercase">
              STORYTELLING RETRY LOOP
            </span>
            <h3 className="text-xl font-bold text-white">Immediate Practice Opportunity</h3>
          </div>
        </div>

        {/* Challenge prompt box */}
        <div className="bg-slate-950/80 border border-purple-500/30 p-4 rounded-xl space-y-2">
          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wide">Coach Directive:</p>
          <p className="text-base text-purple-100 font-medium">{retryPrompt || "That part is important, but difficult to follow. Try it again in one simple sentence."}</p>
        </div>

        {/* Attempt 1 vs Attempt 2 input */}
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-slate-400">
            <span className="text-xs font-bold text-rose-400 uppercase block mb-1">Attempt 1 (Weak / Unclear):</span>
            <p className="italic">"{weakSnippet || fullTranscript.slice(-120) || 'Previous explanation'}"</p>
          </div>

          {!evaluationResult ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase block">
                Attempt 2 (Your Improved Practice):
              </label>
              <textarea
                value={attempt2Text}
                onChange={(e) => setAttempt2Text(e.target.value)}
                placeholder="Type or speak your improved sentence here..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={onClose} className="btn-secondary text-sm">
                  Skip Practice
                </button>
                <button
                  onClick={handleRunEvaluation}
                  disabled={!attempt2Text.trim() || isEvaluating}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  {isEvaluating ? 'Evaluating Retry...' : 'Evaluate Attempt 2'} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Result Evaluation Box */
            <div className="space-y-4 bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl animate-slide-up">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 size={20} />
                <span>Evaluation: {evaluationResult.attempt2Rating}</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                <strong className="text-purple-300">Why Attempt 2 Worked Better:</strong> {evaluationResult.keyImprovementWhy}
              </p>
              <p className="text-emerald-300 text-xs italic bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-800/40">
                "{evaluationResult.encouragement}"
              </p>
              <div className="flex justify-end">
                <button onClick={onClose} className="btn-primary text-sm">
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
