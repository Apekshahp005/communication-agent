import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, AlertOctagon, Sparkles, Flame, Eye, BarChart3, ArrowRight, X, Download, FileText, Code, TrendingUp, ArrowUpRight, ArrowDownRight, CameraOff, Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PostSessionReportModal({ isOpen, onClose, reportData, onLaunchNextChallenge }) {
  const [activeReportTab, setActiveReportTab] = useState('executive'); // 'executive' | 'comparison' | 'words' | 'storytelling' | 'moments'

  useEffect(() => {
    if (isOpen && reportData?.report?.overallEffectivenessScore > 75) {
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }, [isOpen, reportData]);

  if (!isOpen || !reportData) return null;

  const report = reportData.report || {};
  const scores = report.scores || {};
  const comparison = report.comparison || { isFirstSession: true };

  const getScoreColor = (val = 0) => {
    if (val >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
    if (val >= 70) return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40';
    return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
  };

  const handleDownloadTxt = () => {
    const textContent = `
=====================================================
  ANTIGRAVITY AI COMMUNICATION COACH — AUDIT REPORT
=====================================================
Date: ${new Date().toLocaleString()}
Mode: ${reportData.sessionMode || 'Practice'}
Audience Persona: ${reportData.audienceType || 'Standard'}

OVERALL EFFECTIVENESS SCORE: ${report.overallEffectivenessScore || 85}/100
RATING: ${report.overallRating || 'Strong Communicator'}

BEFORE VS AFTER COMPARISON:
---------------------------
${comparison.isFirstSession
  ? 'FIRST SESSION (INITIAL BASELINE AUDIT)'
  : `Previous Score: ${comparison.previousScore} | Current Score: ${report.overallEffectivenessScore} (Change: ${comparison.scoreDelta >= 0 ? '+' : ''}${comparison.scoreDelta})\nSummary: ${comparison.comparativeSummary}`
}

SCORES BREAKDOWN:
-----------------
- Clarity: ${scores.clarity || 85}%
- Storytelling: ${scores.storytelling || 80}%
- Engagement: ${scores.engagement || 82}%
- Memorability: ${scores.memorability || 78}%
- Wit: ${scores.wit || 75}%
- Responsiveness: ${scores.responsiveness || 85}%
- Delivery: ${scores.delivery || 82}%
- Structure: ${scores.structure || 84}%

WHAT YOU ARE GOOD AT:
---------------------
${(report.whatYouDidWell || []).map((w, idx) => `${idx + 1}. ${w}`).join('\n')}

WHAT TO IMPROVE:
----------------
${(report.biggestWeaknesses || []).map((w, idx) => `${idx + 1}. ${w}`).join('\n')}

BEST MOMENT:
------------
"${report.bestMoment?.snippet || ''}"
Why: ${report.bestMoment?.whyItWorked || ''}

SECTION TO IMPROVE:
-------------------
"${report.weakestMoment?.snippet || ''}"
Fix: ${report.weakestMoment?.howToFix || ''}
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Communication_Audit_${Date.now()}.txt`;
    link.click();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `Communication_Report_Raw_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl p-4 md:p-6 flex justify-center animate-slide-up">
      <div className="w-full max-w-4xl glass-panel bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl relative space-y-6 my-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Award size={26} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                ANTIGRAVITY COMMUNICATION AUDIT
                {!comparison.isFirstSession && (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                    Before/After Compared
                  </span>
                )}
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {comparison.isFirstSession ? 'Initial Baseline Performance Audit' : 'Progressive Comparison Audit'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadTxt} className="btn-secondary text-xs" title="Export TXT Report">
              <FileText size={14} /> Text
            </button>
            <button onClick={handleDownloadJSON} className="btn-secondary text-xs" title="Export Raw JSON">
              <Code size={14} /> JSON
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800/80 pb-2 flex-wrap">
          {[
            { id: 'executive', label: 'Executive Scorecard' },
            { id: 'comparison', label: comparison.isFirstSession ? 'Baseline Info' : 'Before vs After Comparison' },
            { id: 'words', label: 'Word-by-Word Analysis' },
            { id: 'storytelling', label: 'Storytelling & Wit' },
            { id: 'moments', label: 'Key Moments Replay' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all ${
                activeReportTab === tab.id
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BEFORE VS AFTER COMPARISON BANNER (Always visible top highlight if multi-session) */}
        {!comparison.isFirstSession && (
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-purple-950/70 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">BEFORE VS AFTER PROGRESSION</span>
                <p className="text-sm font-bold text-white">{comparison.comparativeSummary || "You made noticeable gains compared to your previous session!"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold shrink-0">
              <span>Score Delta:</span>
              <span className={`flex items-center ${comparison.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {comparison.scoreDelta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {comparison.scoreDelta >= 0 ? `+${comparison.scoreDelta}` : comparison.scoreDelta} pts
              </span>
            </div>
          </div>
        )}

        {/* TAB 1: EXECUTIVE SCORECARD */}
        {activeReportTab === 'executive' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/40 p-6 rounded-2xl">
              <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Communication Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-white">{report.overallEffectivenessScore || 85}</span>
                  <span className="text-slate-500 font-bold text-lg">/100</span>
                </div>
                <span className="mt-2 inline-block px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                  {report.overallRating || 'Strong Communicator'}
                </span>
              </div>

              <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: 'Clarity', score: scores.clarity || 85 },
                  { label: 'Storytelling', score: scores.storytelling || 80 },
                  { label: 'Engagement', score: scores.engagement || 82 },
                  { label: 'Memorability', score: scores.memorability || 78 },
                  { label: 'Wit', score: scores.wit || 75 },
                  { label: 'Responsiveness', score: scores.responsiveness || 85 },
                  { label: 'Delivery', score: scores.delivery || 82 },
                  { label: 'Structure', score: scores.structure || 84 }
                ].map((s, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl border ${getScoreColor(s.score)}`}>
                    <span className="text-[11px] font-medium text-slate-300 block">{s.label}</span>
                    <span className="text-lg font-bold">{s.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 space-y-3 border-l-4 border-l-emerald-500">
                <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={18} /> What You Are Good At
                </h3>
                <ul className="space-y-2 text-xs text-slate-200">
                  {(report.whatYouDidWell || []).map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-5 space-y-3 border-l-4 border-l-amber-500">
                <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertOctagon size={18} /> What To Improve Next
                </h3>
                <ul className="space-y-2 text-xs text-slate-200">
                  {(report.biggestWeaknesses || []).map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BEFORE VS AFTER COMPARISON / FIRST-TIME BASELINE */}
        {activeReportTab === 'comparison' && (
          <div className="space-y-5 animate-slide-up">
            {comparison.isFirstSession ? (
              <div className="glass-panel p-6 border-purple-500/40 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mx-auto">
                  <Award size={30} />
                </div>
                <h3 className="text-lg font-bold text-white">First-Time Initial Baseline Audit</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Congratulations on completing your first practice session! This report establishes your baseline scores. Complete a second session to see your <strong>Before vs. After</strong> score comparison, filler word reduction curves, and storytelling progression.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="glass-panel p-4 border-purple-500/30">
                    <span className="text-xs text-slate-400 font-mono uppercase">Previous Score</span>
                    <p className="text-3xl font-black text-slate-400 mt-1">{comparison.previousScore || 78}</p>
                  </div>
                  <div className="glass-panel p-4 border-emerald-500/30">
                    <span className="text-xs text-slate-400 font-mono uppercase">Current Score</span>
                    <p className="text-3xl font-black text-emerald-400 mt-1">{report.overallEffectivenessScore}</p>
                  </div>
                  <div className="glass-panel p-4 border-cyan-500/30">
                    <span className="text-xs text-slate-400 font-mono uppercase">Score Delta</span>
                    <p className={`text-3xl font-black mt-1 flex items-center justify-center ${
                      comparison.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {comparison.scoreDelta >= 0 ? `+${comparison.scoreDelta}` : comparison.scoreDelta}
                    </p>
                  </div>
                </div>

                {comparison.improvementsSinceLastSession && comparison.improvementsSinceLastSession.length > 0 && (
                  <div className="glass-panel p-5 border-emerald-500/30 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp size={18} /> Direct Improvements Since Last Session
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-200">
                      {comparison.improvementsSinceLastSession.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WORD-BY-WORD ANALYSIS */}
        {activeReportTab === 'words' && (
          <div className="space-y-5 animate-slide-up">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-4 text-center border-purple-500/30">
                <span className="text-xs text-slate-400 uppercase font-mono block">Total Words Spoken</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {reportData.fullTranscript ? reportData.fullTranscript.split(' ').length : 0}
                </span>
              </div>
              <div className="glass-panel p-4 text-center border-emerald-500/30">
                <span className="text-xs text-slate-400 uppercase font-mono block">Power Words Used</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {reportData.powerWords ? reportData.powerWords.length : 0}
                </span>
              </div>
              <div className="glass-panel p-4 text-center border-rose-500/30">
                <span className="text-xs text-slate-400 uppercase font-mono block">Fillers Detected</span>
                <span className="text-2xl font-black text-rose-400 mt-1 block">
                  {reportData.detectedFillers ? reportData.detectedFillers.length : 0}
                </span>
              </div>
              <div className="glass-panel p-4 text-center border-amber-500/30">
                <span className="text-xs text-slate-400 uppercase font-mono block">Jargon Terms</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  {reportData.jargon ? reportData.jargon.length : 0}
                </span>
              </div>
            </div>

            <div className="glass-panel p-5 space-y-3 border-slate-800">
              <h4 className="text-sm font-bold text-slate-200">Full Spoken Transcript Audit</h4>
              <p className="text-xs text-slate-300 italic bg-slate-950/80 p-4 rounded-xl border border-slate-800 leading-relaxed max-h-60 overflow-y-auto">
                "{reportData.fullTranscript || 'No transcript recorded.'}"
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: STORYTELLING & WIT AUDIT */}
        {activeReportTab === 'storytelling' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
            <div className="glass-panel p-5 space-y-3 border-purple-500/30">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Sparkles size={16} /> Storytelling Mechanics
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p>Opening Hook Grade: <strong className="text-white font-mono">{report.storytellingAudit?.hookGrade || 'B+'}</strong></p>
                <p>Conflict & Stakes: {report.storytellingAudit?.conflictAndStakes}</p>
                <p>Analogy Quality: {report.storytellingAudit?.analogyQuality}</p>
                <p>Ending Payoff: {report.storytellingAudit?.endingPayoff}</p>
              </div>
            </div>

            <div className="glass-panel p-5 space-y-3 border-cyan-500/30">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Flame size={16} /> Natural Wit & Conversational Tone
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p>Clever Observations: {report.witAndAnalogyAudit?.observations}</p>
                <p>Missed Opportunities: {report.witAndAnalogyAudit?.missedOpportunities}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: KEY MOMENTS REPLAY */}
        {activeReportTab === 'moments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
            {report.bestMoment && (
              <div className="glass-panel p-5 space-y-2 border-emerald-500/40 bg-emerald-950/20">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Sparkles size={14} /> Strongest Communication Moment
                </span>
                <p className="text-xs italic text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  "{report.bestMoment.snippet}"
                </p>
                <p className="text-xs text-slate-300">
                  <strong className="text-emerald-300">Why it worked:</strong> {report.bestMoment.whyItWorked}
                </p>
              </div>
            )}

            {report.weakestMoment && (
              <div className="glass-panel p-5 space-y-2 border-rose-500/40 bg-rose-950/20">
                <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <Flame size={14} /> Section Needing Refinement
                </span>
                <p className="text-xs italic text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  "{report.weakestMoment.snippet}"
                </p>
                <p className="text-xs text-slate-300">
                  <strong className="text-rose-300">How to fix next time:</strong> {report.weakestMoment.howToFix}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recommended Next Challenge */}
        {report.targetedNextExercises && report.targetedNextExercises.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/50 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono text-purple-300 font-bold uppercase">Recommended Practice Challenge</span>
              <h4 className="text-base font-bold text-white mt-0.5">{report.targetedNextExercises[0].title}</h4>
              <p className="text-xs text-purple-200 mt-1">{report.targetedNextExercises[0].prompt}</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onLaunchNextChallenge(report.targetedNextExercises[0]);
              }}
              className="btn-primary text-xs shrink-0 whitespace-nowrap"
            >
              Launch Challenge <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
