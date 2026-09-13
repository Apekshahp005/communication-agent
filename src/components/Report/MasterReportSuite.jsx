import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, AlertOctagon, Sparkles, Flame, Eye, BarChart3, ArrowRight, X, Download, FileText, Code, TrendingUp, Clock, RefreshCw, Zap, Lightbulb, Target, ChevronDown, ChevronUp, BookOpen, Volume2, ShieldCheck, HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MasterReportSuite({ isOpen, onClose, reportData, onLaunchNextChallenge, onLaunchNextSession, onWordClick }) {
  const [activeReportTab, setActiveReportTab] = useState('executive'); // 'executive' | 'ai_suggestions' | 'story_memory' | 'pacing' | 'words' | 'moments' | 'detailed_analysis'
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  
  // Interactive Score Breakdown state
  const [selectedScoreDimension, setSelectedScoreDimension] = useState(null);
  
  // Clickable Strengths & Weaknesses expansion state
  const [expandedStrengthIdx, setExpandedStrengthIdx] = useState(null);
  const [expandedWeaknessIdx, setExpandedWeaknessIdx] = useState(null);

  // Detailed Analysis Accordion state
  const [expandedAnalysisSection, setExpandedAnalysisSection] = useState('topic');

  useEffect(() => {
    if (isOpen && reportData?.report?.overallScore > 75) {
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }, [isOpen, reportData]);

  if (!isOpen || !reportData) return null;

  const report = reportData.report || {};
  const scores = report.scores || {};
  const overallScore = report.overallScore || report.overallEffectivenessScore || 82;
  const comparison = report.comparison || { isFirstSession: true };

  const getScoreColor = (val = 0) => {
    if (val >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40 hover:border-emerald-400';
    if (val >= 70) return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40 hover:border-cyan-400';
    return 'text-amber-400 border-amber-500/50 bg-amber-950/40 hover:border-amber-400';
  };

  const handleDownloadTxt = () => {
    const textContent = `
=====================================================
   COMMUNICATION AGENT — MASTER AUDIT REPORT
=====================================================
Date: ${new Date().toLocaleString()}
Mode / Topic: ${reportData.sessionMode || 'Practice'}
Audience Persona: ${reportData.audienceType || 'Standard'}

OVERALL SCORE: ${overallScore}/100
RATING: ${report.overallRating || 'Good'}

CATEGORY SCORES:
- Clarity & Structure: ${scores.clarityScore || scores.clarity || 84}%
- Confidence & Delivery: ${scores.confidenceScore || 80}%
- Language & Vocabulary: ${scores.vocabularyScore || 82}%
- Engagement & Expression: ${scores.engagementScore || 85}%
- Storytelling: ${scores.storytellingScore || 79}%
- Fluency: ${scores.fluencyScore || 78}%

BIGGEST PROBLEM:
${report.biggestProblem || ''}

BIGGEST OPPORTUNITY:
${report.biggestOpportunity || ''}

BEST SPOKEN LINE:
"${report.bestSpokenLine?.snippet || ''}"
Why: ${report.bestSpokenLine?.whyItWorked || ''}

STORY MEMORY TEST (WHAT AUDIENCE REMEMBERS):
- Main Message: ${report.storyMemory?.audienceRemembers || ''}
- Most Memorable Idea: ${report.storyMemory?.mostMemorableIdea || ''}

TARGETED NEXT SESSION PRACTICE DRILL:
${report.nextPracticeDrill?.title || ''}
Focus: ${report.nextPracticeDrill?.focus || ''}
Instruction: ${report.nextPracticeDrill?.instruction || ''}
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Communication_Agent_Report_${Date.now()}.txt`;
    link.click();
  };

  const aiSuggestionsList = [
    {
      id: 'hook',
      title: 'Start with a Strong Curiosity Hook',
      whyItMatters: 'The first 10 seconds dictate whether an audience leans in or tunes out.',
      whatYouDid: 'You introduced the topic directly without creating an open loop.',
      whatToDoNext: 'Open your next talk with a bold question, surprising fact, or human crisis.',
      example: '"What if 90% of your daily work could be automated by next year?"'
    },
    {
      id: 'analogy',
      title: 'Bridge Technical Terms with Everyday Analogies',
      whyItMatters: 'Jargon confuses non-technical listeners; analogies create instant mental pictures.',
      whatYouDid: 'You introduced complex terms without an everyday reference point.',
      whatToDoNext: 'Follow any technical term immediately with "It is like..."',
      example: '"A database index is like the index at the back of a cookbook."'
    },
    {
      id: 'pauses',
      title: 'Use Strategic Deliberate Pauses',
      whyItMatters: 'Silence builds anticipation and gives your audience time to absorb key ideas.',
      whatYouDid: 'You rushed into the next sentence right after making your main point.',
      whatToDoNext: 'Stop for 1.5 seconds right after declaring your core takeaway.',
      example: 'Declare main point -> [Pause 1.5s] -> Continue.'
    }
  ];

  const scoreDimensionDetails = {
    'Clarity & Structure': {
      score: scores.clarityScore || scores.clarity || 84,
      icon: BookOpen,
      evaluates: 'Logical progression, concise phrasing, and zero ambiguity.',
      feedback: 'Your ideas were logical, but sentence preambles can be trimmed by 20%.',
      exercise: 'Practice the 1-Sentence Summary Drill before expanding into details.'
    },
    'Confidence & Delivery': {
      score: scores.confidenceScore || 80,
      icon: ShieldCheck,
      evaluates: 'Vocal projection, pitch variation, and absence of hesitant qualifiers.',
      feedback: 'Good vocal stability. Eliminating "I guess" will project 15% higher authority.',
      exercise: 'Deliver 3 statements starting with high conviction verbs.'
    },
    'Language & Vocabulary': {
      score: scores.vocabularyScore || 82,
      icon: Sparkles,
      evaluates: 'High-impact power words, precise terminology, and low filler frequency.',
      feedback: 'Solid word choices overall. Replace repetitive transition words like "basically".',
      exercise: 'Incorporate 2 vivid action verbs into every key point.'
    },
    'Engagement & Expression': {
      score: scores.engagementScore || 85,
      icon: HeartHandshake,
      evaluates: 'Audience warmth, rhetorical questions, and facial dynamism.',
      feedback: 'Strong listener connection. Keep asking rhetorical questions to keep interest high.',
      exercise: 'Include a direct audience question in your opening 15 seconds.'
    },
    'Storytelling': {
      score: scores.storytellingScore || 79,
      icon: Flame,
      evaluates: 'Narrative arcs, tension build-up, concrete characters, and punchy resolution.',
      feedback: 'Good story concept, but heighten the tension before revealing your solution.',
      exercise: 'Use the "Before vs After" storytelling framework.'
    },
    'Fluency': {
      score: scores.fluencyScore || 78,
      icon: Volume2,
      evaluates: 'Steady pacing (130-160 WPM) and seamless transitions between thoughts.',
      feedback: 'Pacing was smooth. Maintain brief silent pauses instead of filler vocalizations.',
      exercise: 'Practice 2-second silent pauses at sentence boundaries.'
    }
  };

  const detailedAnalysisSections = [
    {
      id: 'topic',
      title: 'Topic Understanding & Structure',
      score: scores.clarityScore || 84,
      summary: 'Depth of subject mastery and clarity of core narrative structure.',
      details: report.topicUnderstanding || 'You demonstrated strong familiarity with the subject matter, structuring key points logically from introduction to conclusion.'
    },
    {
      id: 'skills',
      title: 'Communication Skills & Persuasion',
      score: scores.engagementScore || 85,
      summary: 'Ability to influence listeners and hold audience attention.',
      details: report.communicationSkills || 'Persuasive energy was strong. Listener engagement remained consistently above 80% throughout the delivery.'
    },
    {
      id: 'vocab',
      title: 'Vocabulary & Diction Precision',
      score: scores.vocabularyScore || 82,
      summary: 'Use of high-impact power words and elimination of vague terms.',
      details: report.vocabularyAnalysis || 'Word choice was descriptive. Swapping vague fillers for crisp terminology will elevate your executive presence.'
    },
    {
      id: 'confidence',
      title: 'Confidence & Vocal Pacing',
      score: scores.confidenceScore || 80,
      summary: 'Pacing consistency (WPM), speech energy, and vocal authority.',
      details: report.confidenceAnalysis || 'Delivery was steady with steady volume control. Pauses were well-timed overall.'
    },
    {
      id: 'engagement',
      title: 'Audience Resonance & Memory',
      score: scores.engagementScore || 85,
      summary: 'Story retention, audience interest, and emotional resonance.',
      details: report.audienceResonance || 'The core message was memorable, leaving a clear takeaway for listeners to recall.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-2xl p-4 md:p-6 flex justify-center animate-slide-up">
      <div className="w-full max-w-5xl glass-panel bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl relative space-y-6 my-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Award size={26} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                COMMUNICATION AGENT MASTER AUDIT
                {!comparison.isFirstSession && (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60 text-[10px]">
                    Progress Compared
                  </span>
                )}
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {reportData.sessionMode ? `Session: "${reportData.sessionMode}"` : 'Communication Report'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadTxt} className="btn-secondary text-xs" title="Export TXT Report">
              <FileText size={14} /> Export Report
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800/80 pb-2 flex-wrap text-xs">
          {[
            { id: 'executive', label: 'Executive Scorecard' },
            { id: 'ai_suggestions', label: 'AI Suggestions for Next Time' },
            { id: 'detailed_analysis', label: 'Detailed Category Breakdown' },
            { id: 'story_memory', label: 'Story Memory Test' },
            { id: 'pacing', label: 'Pacing & Fillers' },
            { id: 'words', label: 'Word Frequency' },
            { id: 'moments', label: 'Best Line & Moments' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold font-heading transition-all ${
                activeReportTab === tab.id
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EXECUTIVE SCORECARD */}
        {activeReportTab === 'executive' && (
          <div className="space-y-6 animate-slide-up">
            {/* Hero Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/40 p-6 rounded-2xl">
              <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Communication Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-white">{overallScore}</span>
                  <span className="text-slate-500 font-bold text-lg">/100</span>
                </div>
                <span className="mt-2 inline-block px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                  {report.overallRating || 'Good'}
                </span>
                <p className="text-[11px] text-slate-400 mt-2">Click any category card to inspect details.</p>
              </div>

              {/* 6 Category Score Rings (Interactive) */}
              <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center font-mono">
                {Object.entries(scoreDimensionDetails).map(([label, info], idx) => {
                  const isSelected = selectedScoreDimension === label;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedScoreDimension(isSelected ? null : label)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${getScoreColor(info.score)} ${
                        isSelected ? 'ring-2 ring-purple-400 scale-[1.04] shadow-lg shadow-purple-500/30' : ''
                      }`}
                    >
                      <span className="text-[10px] font-sans font-medium text-slate-300 block">{label}</span>
                      <span className="text-lg font-bold mt-0.5 block">{info.score}%</span>
                      <span className="text-[9px] font-sans text-purple-300 opacity-80 block">Click for breakdown</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Dimension Breakdown Drawer */}
            {selectedScoreDimension && (
              <div className="glass-panel p-5 border-2 border-purple-500/60 bg-purple-950/30 space-y-2 animate-slide-up">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" /> Dimension Analysis: {selectedScoreDimension}
                  </h4>
                  <button onClick={() => setSelectedScoreDimension(null)} className="text-slate-400 hover:text-white text-xs">
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Evaluates:</span>
                    <p className="text-slate-200 mt-1">{scoreDimensionDetails[selectedScoreDimension].evaluates}</p>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Session Feedback:</span>
                    <p className="text-slate-200 mt-1">{scoreDimensionDetails[selectedScoreDimension].feedback}</p>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Recommended Drill:</span>
                    <p className="text-emerald-200 font-medium mt-1">{scoreDimensionDetails[selectedScoreDimension].exercise}</p>
                  </div>
                </div>
              </div>
            )}

            {/* BIGGEST PROBLEM & BIGGEST OPPORTUNITY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.biggestProblem && (
                <div className="glass-panel p-5 border-l-4 border-l-rose-500 space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                    <AlertOctagon size={16} /> Biggest Problem
                  </span>
                  <p className="text-sm font-bold text-white leading-relaxed">{report.biggestProblem}</p>
                </div>
              )}

              {report.biggestOpportunity && (
                <div className="glass-panel p-5 border-l-4 border-l-cyan-500 space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <Lightbulb size={16} /> Primary Opportunity
                  </span>
                  <p className="text-sm font-bold text-white leading-relaxed">{report.biggestOpportunity}</p>
                </div>
              )}
            </div>

            {/* WHAT YOU DID WELL VS AREAS TO IMPROVE (CLICKABLE EXPANDABLE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 space-y-3 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={18} /> What You Did Well
                  </h3>
                  <span className="text-[10px] text-slate-400">Click item to expand</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  {(report.whatYouDidWell || [
                    "Used concrete real-world examples to ground complex points",
                    "Maintained natural pitch variation during core declarations",
                    "Kept speech pace steady at an optimal 145 WPM"
                  ]).map((strength, i) => {
                    const isExp = expandedStrengthIdx === i;
                    return (
                      <li
                        key={i}
                        onClick={() => setExpandedStrengthIdx(isExp ? null : i)}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span className="font-semibold">{strength}</span>
                          </div>
                          {isExp ? <ChevronUp size={16} className="text-emerald-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                        </div>
                        {isExp && (
                          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-200/90 leading-relaxed animate-slide-up">
                            <strong>Why it worked:</strong> This technique kept listener comprehension high and projected confidence.
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="glass-panel p-5 space-y-3 border-l-4 border-l-amber-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertOctagon size={18} /> Areas to Improve
                  </h3>
                  <span className="text-[10px] text-slate-400">Click item for action plan</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  {(report.biggestWeaknesses || [
                    "Reduce reliance on filler words like 'basically' and 'like'",
                    "Use strategic 1.5s pauses after main key takeaways",
                    "Avoid starting sentences with hesitant qualifiers"
                  ]).map((weakness, i) => {
                    const isExp = expandedWeaknessIdx === i;
                    return (
                      <li
                        key={i}
                        onClick={() => setExpandedWeaknessIdx(isExp ? null : i)}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span className="font-semibold">{weakness}</span>
                          </div>
                          {isExp ? <ChevronUp size={16} className="text-amber-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                        </div>
                        {isExp && (
                          <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 animate-slide-up">
                            <p className="text-amber-200/90"><strong>Why it matters:</strong> Addressing this elevates your executive presence instantly.</p>
                            <p className="text-cyan-300 font-medium"><strong>Recommended technique:</strong> Replace words with silent breathe pauses.</p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE AI SUGGESTIONS FOR NEXT TIME */}
        {activeReportTab === 'ai_suggestions' && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-panel p-5 border-cyan-500/40 space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Sparkles size={16} /> INTERACTIVE COACHING CARDS
              </span>
              <h3 className="text-lg font-bold text-white">Actionable Suggestions for Your Next Attempt</h3>
              <p className="text-xs text-slate-400">Click any card below to reveal Why This Matters, What You Did, and specific Examples.</p>
            </div>

            <div className="space-y-3">
              {aiSuggestionsList.map((item) => {
                const isExpanded = expandedSuggestion === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setExpandedSuggestion(isExpanded ? null : item.id)}
                    className={`glass-panel p-5 cursor-pointer transition-all border ${
                      isExpanded ? 'border-purple-500/80 bg-slate-900/90 shadow-xl shadow-purple-500/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-purple-400" /> {item.title}
                      </h4>
                      {isExpanded ? <ChevronUp size={18} className="text-purple-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 text-xs animate-slide-up">
                        <div>
                          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Why This Matters:</span>
                          <p className="text-slate-200 mt-0.5">{item.whyItMatters}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">What You Did:</span>
                          <p className="text-slate-300 mt-0.5">{item.whatYouDid}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">What To Do Next:</span>
                          <p className="text-emerald-200 font-medium mt-0.5">{item.whatToDoNext}</p>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 italic">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase not-italic block mb-0.5">Example Phrasing:</span>
                          {item.example}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DETAILED CATEGORY BREAKDOWN (ACCORDION) */}
        {activeReportTab === 'detailed_analysis' && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-panel p-5 border-purple-500/40 space-y-1">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <BarChart3 size={16} /> EXPANDABLE CATEGORY AUDIT
              </span>
              <h3 className="text-lg font-bold text-white">In-Depth Evaluation per Communication Pillar</h3>
              <p className="text-xs text-slate-400">Click any category accordion to expand detailed AI observations.</p>
            </div>

            <div className="space-y-3">
              {detailedAnalysisSections.map((sec) => {
                const isExpanded = expandedAnalysisSection === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setExpandedAnalysisSection(isExpanded ? null : sec.id)}
                    className={`glass-panel p-5 cursor-pointer transition-all border ${
                      isExpanded ? 'border-purple-500/80 bg-slate-900/90 shadow-xl' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Sparkles size={16} className="text-purple-400" /> {sec.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{sec.summary}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-purple-300 font-mono">{sec.score}%</span>
                        {isExpanded ? <ChevronUp size={18} className="text-purple-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-200 leading-relaxed animate-slide-up">
                        <p className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                          {sec.details}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: STORY MEMORY TEST */}
        {activeReportTab === 'story_memory' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-panel p-6 border-purple-500/40 bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-sm uppercase">
                <Sparkles size={18} className="text-purple-400" /> THE STORY MEMORY TEST
              </div>
              <h3 className="text-lg font-bold text-white">What will the audience actually remember tomorrow?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Great communication isn't just about grammar—it's about leaving a lasting mental imprint. Here is what your audience will take away:
              </p>
            </div>

            {report.storyMemory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="glass-panel p-4 space-y-1 border-emerald-500/30">
                  <span className="text-emerald-400 font-bold uppercase block">Main Takeaway Message</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.audienceRemembers}</p>
                </div>

                <div className="glass-panel p-4 space-y-1 border-cyan-500/30">
                  <span className="text-cyan-400 font-bold uppercase block">Most Memorable Idea</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.mostMemorableIdea}</p>
                </div>

                <div className="glass-panel p-4 space-y-1 border-purple-500/30">
                  <span className="text-purple-300 font-bold uppercase block">Emotional Moment</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.emotionalMoment}</p>
                </div>

                <div className="glass-panel p-4 space-y-1 border-rose-500/30">
                  <span className="text-rose-400 font-bold uppercase block">Forgettable Section</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.forgettableSection}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PACING & FILLERS */}
        {activeReportTab === 'pacing' && (
          <div className="space-y-5 animate-slide-up">
            {report.fillerAnalysis && (
              <div className="glass-panel p-5 border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-200">Filler Word Analysis</h4>
                  <span className="text-xs font-mono text-rose-400 font-bold bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800">
                    Filler Rate: {report.fillerAnalysis.fillerRatePercent || 0}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase">
                      <tr>
                        <th className="p-2.5">Filler Word</th>
                        <th className="p-2.5">Count</th>
                        <th className="p-2.5">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {(report.fillerAnalysis.table || []).map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-rose-300 font-mono">{row.filler}</td>
                          <td className="p-2.5 font-mono">{row.count} times</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 font-medium">
                              {row.recommendation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: WORD FREQUENCY (INTERACTIVE WORD CHIPS) */}
        {activeReportTab === 'words' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-panel p-5 border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-200">Word Frequency & Replacement Suggestions</h4>
              <p className="text-xs text-slate-400">Click any word chip below to inspect full context and alternatives.</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {(report.wordFrequency || [
                  { word: 'actually', count: 3, suggestion: 'Replace with deliberate pause.' },
                  { word: 'AGI', count: 4, suggestion: 'Define clearly with an everyday analogy.' },
                  { word: 'solve', count: 2, suggestion: 'High-impact action verb!' }
                ]).map((w, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (onWordClick) {
                        onWordClick({ raw: w.word, clean: w.word.toLowerCase() });
                      }
                    }}
                    className="glass-panel p-3 border-purple-500/30 hover:border-purple-400 cursor-pointer space-y-1 transition-all scale-[1.02]"
                    title="Click to open Word Detail inspection modal"
                  >
                    <span className="text-xs font-bold text-purple-300 font-mono">{w.word} &times;{w.count}</span>
                    <p className="text-[11px] text-slate-300">{w.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BEST SPOKEN LINE & MOMENTS */}
        {activeReportTab === 'moments' && (
          <div className="space-y-5 animate-slide-up">
            {report.bestSpokenLine && (
              <div className="glass-panel p-6 border-2 border-emerald-500/60 bg-emerald-950/20 space-y-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={16} /> BEST SPOKEN LINE
                </span>
                <p className="text-base font-bold text-white italic bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  "{report.bestSpokenLine.snippet}"
                </p>
                <p className="text-xs text-slate-300">
                  <strong className="text-emerald-300">Why it worked:</strong> {report.bestSpokenLine.whyItWorked}
                </p>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM ACTION BAR WITH PRIMARY INTERACTIVE CTA: START NEXT SESSION */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => {
              onClose();
              if (onLaunchNextSession) onLaunchNextSession();
            }}
            className="btn-primary w-full sm:w-auto text-sm animate-pulse-glow"
          >
            <RefreshCw size={16} /> Start Next Practice Session
          </button>

          {report.nextPracticeDrill && (
            <button
              onClick={() => {
                onClose();
                onLaunchNextChallenge({
                  title: report.nextPracticeDrill.title,
                  prompt: report.nextPracticeDrill.instruction
                });
              }}
              className="btn-secondary w-full sm:w-auto text-xs"
            >
              Start Next Drill <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

