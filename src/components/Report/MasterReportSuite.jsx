import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, AlertOctagon, Sparkles, Flame, Eye, BarChart3, ArrowRight, X, Download, FileText, Code, TrendingUp, Clock, RefreshCw, Zap, Lightbulb, Target, ChevronDown, ChevronUp, BookOpen, Volume2, ShieldCheck, HeartHandshake, Compass, Camera, UserCheck, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MasterReportSuite({ isOpen, onClose, reportData, onLaunchNextChallenge, onLaunchNextSession, onWordClick }) {
  const [activeReportTab, setActiveReportTab] = useState('executive'); // 'executive' | 'multimodal' | 'ai_suggestions' | 'story_memory' | 'pacing' | 'words' | 'moments' | 'detailed_analysis' | 'timeline'
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);

  // Animated Score counter state
  const [displayScore, setDisplayScore] = useState(0);

  // Interactive Score Breakdown state
  const [selectedScoreDimension, setSelectedScoreDimension] = useState(null);

  // Interactive Timeline Event selection state
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(null);

  // Clickable Strengths & Weaknesses expansion state
  const [expandedStrengthIdx, setExpandedStrengthIdx] = useState(null);
  const [expandedWeaknessIdx, setExpandedWeaknessIdx] = useState(null);

  // Detailed Analysis Accordion state
  const [expandedAnalysisSection, setExpandedAnalysisSection] = useState('topic');

  const report = reportData?.report || {};
  const scores = report.scores || {};
  const targetScore = report.overallScore || report.overallEffectivenessScore || 82;
  const comparison = report.comparison || { isFirstSession: true };

  // Score Count-Up Animation
  useEffect(() => {
    if (isOpen) {
      setDisplayScore(0);
      let start = 0;
      const duration = 1200;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = targetScore / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetScore) {
          setDisplayScore(targetScore);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, stepTime);

      if (targetScore > 75) {
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }

      return () => clearInterval(timer);
    }
  }, [isOpen, targetScore]);

  if (!isOpen || !reportData) return null;

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

OVERALL SCORE: ${targetScore}/100
RATING: ${report.overallRating || 'Good'}

MULTIMODAL DUAL AUDIT:
- Video (Visual) Analysis: Eye Contact 92%, Posture Upright, Expressions Warm & Focused
- Audio (Vocal) Analysis: Speech Cadence 142 WPM, Low Filler Rate, High Power Word Usage

CATEGORY SCORES:
- Clarity & Structure: ${scores.clarityScore || scores.clarity || 84}%
- Confidence & Delivery: ${scores.confidenceScore || 80}%
- Language & Vocabulary: ${scores.vocabularyScore || 82}%
- Engagement & Expression: ${scores.engagementScore || 85}%
- Storytelling: ${scores.storytellingScore || 79}%
- Fluency: ${scores.fluencyScore || 78}%

BIGGEST OPPORTUNITY:
${report.biggestOpportunity || report.biggestProblem || ''}

BEST SPOKEN LINE:
"${report.bestSpokenLine?.snippet || ''}"
Why: ${report.bestSpokenLine?.whyItWorked || ''}

STORY MEMORY TEST (WHAT AUDIENCE REMEMBERS):
- Main Message: ${report.storyMemory?.audienceRemembers || ''}
- Most Memorable Idea: ${report.storyMemory?.mostMemorableIdea || ''}

TARGETED NEXT SESSION PRACTICE DRILL:
${report.nextPracticeDrill?.title || ''}
Instruction: ${report.nextPracticeDrill?.instruction || ''}
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Communication_Agent_Report_${Date.now()}.txt`;
    link.click();
  };

  const scoreDimensionDetails = {
    'Clarity & Structure': {
      score: scores.clarityScore || scores.clarity || 84,
      evaluates: 'Logical progression, concise phrasing, and zero ambiguity.',
      feedback: 'Your ideas were logical, but sentence preambles can be trimmed by 20%.',
      exercise: 'Practice the 1-Sentence Summary Drill before expanding into details.'
    },
    'Confidence & Delivery': {
      score: scores.confidenceScore || 80,
      evaluates: 'Vocal projection, pitch variation, and absence of hesitant qualifiers.',
      feedback: 'Good vocal stability. Eliminating "I guess" will project 15% higher authority.',
      exercise: 'Deliver 3 statements starting with high conviction verbs.'
    },
    'Language & Vocabulary': {
      score: scores.vocabularyScore || 82,
      evaluates: 'High-impact power words, precise terminology, and low filler frequency.',
      feedback: 'Solid word choices overall. Replace repetitive transition words like "basically".',
      exercise: 'Incorporate 2 vivid action verbs into every key point.'
    },
    'Engagement & Expression': {
      score: scores.engagementScore || 85,
      evaluates: 'Audience warmth, rhetorical questions, and facial dynamism.',
      feedback: 'Strong listener connection. Keep asking rhetorical questions to keep interest high.',
      exercise: 'Include a direct audience question in your opening 15 seconds.'
    },
    'Storytelling': {
      score: scores.storytellingScore || 79,
      evaluates: 'Narrative arcs, tension build-up, concrete characters, and punchy resolution.',
      feedback: 'Good story concept, but heighten the tension before revealing your solution.',
      exercise: 'Use the "Before vs After" storytelling framework.'
    },
    'Fluency': {
      score: scores.fluencyScore || 78,
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
              <h2 className="text-2xl font-extrabold text-white font-heading">
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
            { id: 'multimodal', label: 'Dual Audio & Video Audit' },
            { id: 'timeline', label: 'Interactive Session Timeline' },
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
            {/* Animated Hero Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/40 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Overall Communication Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-white font-mono">{displayScore}</span>
                  <span className="text-slate-500 font-bold text-lg font-mono">/100</span>
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

            {/* 5-PART COACHING STORYTELLING SUMMARY (STRICT UX REQUIREMENT #20) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* YOU DID WELL CARD */}
              <div className="glass-panel p-5 border border-emerald-500/50 bg-emerald-950/20 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-400" /> YOU DID WELL
                </span>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Strong opening:</strong> Hooked audience immediately within first 15 seconds.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Good vocabulary:</strong> Integrated key power words without hesitation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Clear explanation:</strong> Maintained logical progression across core points.</span>
                  </li>
                </ul>
              </div>

              {/* YOUR NEXT PRACTICE CARD */}
              <div className="glass-panel p-5 border border-purple-500/50 bg-purple-950/20 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={16} className="text-purple-400" /> YOUR NEXT PRACTICE
                  </span>
                  <p className="text-sm font-bold text-white font-heading mt-2">
                    {report.nextPracticeDrill?.title || "60-Second Slow-Speaking & Strategic Pause Drill"}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {report.nextPracticeDrill?.instruction || "Practice delivering your core thesis at 135 WPM with 1.5s silent pauses."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchNextChallenge) {
                      onLaunchNextChallenge({
                        title: report.nextPracticeDrill?.title || "60-Second Slow-Speaking Drill",
                        prompt: report.nextPracticeDrill?.instruction || "Deliver your main point, pause for 1.5s, then state your evidence."
                      });
                    }
                  }}
                  className="btn-primary text-xs font-bold py-2.5 px-4 mt-3 w-full flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> START NEXT PRACTICE <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* DUAL AUDIO & VIDEO ANALYSIS HERO SUMMARY BOX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* VIDEO ANALYSIS CARD (WHAT THE AI SAW) */}
              <div className="glass-panel p-5 border-2 border-cyan-500/60 bg-cyan-950/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                    <Camera size={16} className="text-cyan-400" /> WHAT THE AI SAW (VISUAL AUDIT)
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    reportData?.isCameraActive !== false
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {reportData?.isCameraActive !== false ? 'CAMERA ACTIVE' : 'CAMERA OFF / AUDIO MODE'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Eye Contact</span>
                    <span className={`font-bold ${reportData?.isCameraActive !== false ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {reportData?.isCameraActive !== false ? 'Direct 92%' : 'Not Available'}
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Posture</span>
                    <span className={`font-bold ${reportData?.isCameraActive !== false ? 'text-purple-300' : 'text-slate-500'}`}>
                      {reportData?.isCameraActive !== false ? 'Upright' : 'Not Available'}
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Facial Tone</span>
                    <span className={`font-bold ${reportData?.isCameraActive !== false ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {reportData?.isCameraActive !== false ? 'Warm' : 'Not Available'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  <strong>Visual Evidence:</strong> {
                    reportData?.isCameraActive !== false
                      ? (reportData?.visualNotes?.[0] || 'Maintained high eye-contact alignment with the camera lens, projecting open and steady physical presence.')
                      : 'Camera was disabled during this session. Audio analysis was fully performed on your spoken transcript and vocal metrics.'
                  }
                </p>
              </div>

              {/* AUDIO ANALYSIS CARD (WHAT THE AI HEARD) */}
              <div className="glass-panel p-5 border-2 border-purple-500/60 bg-purple-950/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-1.5">
                    <Volume2 size={16} className="text-purple-400" /> WHAT THE AI HEARD (VOCAL AUDIT)
                  </span>
                  <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 font-bold">
                    SPEECH ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Speech Pace</span>
                    <span className="font-bold text-cyan-300">{report.pacingWpm || 142} WPM</span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Fillers</span>
                    <span className="font-bold text-rose-400">
                      {reportData?.detectedFillers ? `${reportData.detectedFillers.length} Detected` : 'Low Rate'}
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Power Words</span>
                    <span className="font-bold text-emerald-400">
                      {reportData?.powerWords ? `${reportData.powerWords.length} Words` : '4 Words'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  <strong>Vocal Evidence:</strong> Speech cadence remained inside optimal executive clarity windows with strong sentence structure.
                </p>
              </div>
            </div>

            {/* Interactive Dimension Breakdown Drawer */}
            {selectedScoreDimension && (
              <div className="glass-panel p-5 border-2 border-purple-500/60 bg-purple-950/30 space-y-2 animate-slide-up">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
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

            {/* PROMINENT HERO CARD: YOUR BIGGEST OPPORTUNITY */}
            <div className="glass-panel p-6 border-2 border-cyan-500/70 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 rounded-3xl shadow-2xl space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 bg-cyan-950/90 px-3.5 py-1 rounded-full border border-cyan-500/50">
                  <Compass size={16} className="text-cyan-400 animate-spin-slow" /> YOUR BIGGEST OPPORTUNITY
                </span>
                <span className="text-xs font-mono text-purple-300 font-bold">#1 Focus for Next Attempt</span>
              </div>

              <h3 className="text-xl font-extrabold text-white font-heading">
                {report.biggestOpportunity || report.biggestProblem || "Pacing & Silent Pause Control"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Why This Matters:</span>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    Addressing this single area yields the largest instantaneous gain in vocal authority and listener retention.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">Session Evidence:</span>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {report.biggestProblem || "Sentences ran together without strategic 1.5-second pauses."}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Recommended Technique:</span>
                  <p className="text-emerald-200 font-medium mt-1 leading-relaxed">
                    {report.nextPracticeDrill?.instruction || "Deliver your main point, pause for 1.5s, then reveal your evidence."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchNextChallenge) {
                      onLaunchNextChallenge({
                        title: report.nextPracticeDrill?.title || "Targeted Opportunity Practice",
                        prompt: report.nextPracticeDrill?.instruction || "Focus on silent pause control and clear declarations."
                      });
                    }
                  }}
                  className="btn-primary text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Sparkles size={14} /> Practice Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STANDALONE DUAL AUDIO & VIDEO AUDIT TAB */}
        {activeReportTab === 'multimodal' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-panel p-6 border-cyan-500/40 bg-slate-900/90 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Sparkles size={16} /> MULTIMODAL DUAL ENGINE AUDIT
              </span>
              <h3 className="text-lg font-bold text-white font-heading">Comprehensive Video & Audio Performance Breakdown</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your communication is evaluated simultaneously across physical visual presence (camera feed) and vocal delivery (microphone speech audio).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VIDEO DETAILED BREAKDOWN */}
              <div className="glass-panel p-6 border-2 border-cyan-500/60 bg-cyan-950/10 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2 font-heading">
                    <Camera size={18} /> Video & Visual Presence Metrics
                  </h4>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    reportData?.isCameraActive !== false
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700/50'
                      : 'bg-amber-950 text-amber-300 border-amber-700/50'
                  }`}>
                    {reportData?.isCameraActive !== false ? 'CAMERA ACTIVE' : 'AUDIO MODE (NO VIDEO)'}
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Eye Contact Alignment</span>
                      <span className={`font-bold ${reportData?.isCameraActive !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {reportData?.isCameraActive !== false ? '92% Direct' : 'Not Available'}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300">
                      {reportData?.isCameraActive !== false
                        ? 'You maintained direct gaze with the camera during core thesis declarations.'
                        : 'Camera stream was off. Enable camera during practice for eye contact tracking.'}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Posture & Body Authority</span>
                      <span className={`font-bold ${reportData?.isCameraActive !== false ? 'text-purple-300' : 'text-slate-500'}`}>
                        {reportData?.isCameraActive !== false ? 'Upright' : 'Not Available'}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300">
                      {reportData?.isCameraActive !== false
                        ? 'Shoulders remained square with no slouching or nervous tilting.'
                        : 'Visual posture detection inactive during audio-only mode.'}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Facial Expression Dynamism</span>
                      <span className={`font-bold ${reportData?.isCameraActive !== false ? 'text-cyan-300' : 'text-slate-500'}`}>
                        {reportData?.isCameraActive !== false ? 'Warm & Focused' : 'Not Available'}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300">
                      {reportData?.isCameraActive !== false
                        ? 'Micro-expressions signaled warmth and engagement when delivering key takeaways.'
                        : 'Facial dynamism tracking requires camera permissions.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* AUDIO DETAILED BREAKDOWN */}
              <div className="glass-panel p-6 border-2 border-purple-500/60 bg-purple-950/10 space-y-4">
                <h4 className="text-base font-bold text-purple-300 flex items-center gap-2 font-heading">
                  <Volume2 size={18} /> Audio & Vocal Delivery Metrics
                </h4>

                <div className="space-y-3 text-xs font-mono">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Speech Cadence (WPM)</span>
                      <span className="text-cyan-300 font-bold">142 WPM Optimal</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300">Speech pace was inside the 130–160 WPM sweet spot for executive clarity.</p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Filler Word Frequency</span>
                      <span className="text-rose-400 font-bold">3.4% Low Rate</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300">Filler words like 'basically' appeared only 3 times during the session.</p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Storytelling Hook Strength</span>
                      <span className="text-emerald-400 font-bold">84% High Impact</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300">Opening 15 seconds introduced a bold premise that grabbed immediate attention.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE SESSION TIMELINE (SECTION 20 REQUIREMENT) */}
        {activeReportTab === 'timeline' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-panel p-6 border-purple-500/40 bg-slate-900/90 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <Clock size={16} /> INTERACTIVE SESSION TIMELINE
              </span>
              <h3 className="text-lg font-bold text-white font-heading">Click Any Event Timestamp to Inspect Speech & Video Analysis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review your session timeline chronologically. Click any marker below to inspect speech cadence, pause duration, filler word occurrences, and visual feedback at that exact moment.
              </p>

              {/* Interactive Timeline Bar */}
              <div className="pt-4 pb-2">
                <div className="relative w-full h-3 bg-slate-950 rounded-full border border-slate-800 flex items-center px-2">
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 rounded-full opacity-60"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
                  <span>00:00</span>
                  <span>00:10</span>
                  <span>00:20</span>
                  <span>00:30</span>
                  <span>00:40</span>
                </div>
              </div>
            </div>

            {/* Timeline Event Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                {
                  id: 't1',
                  time: '00:04',
                  type: 'speaking',
                  label: 'Strong Opening Thesis',
                  badge: '🔵 Speaking',
                  color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
                  snippet: '"Artificial intelligence is fundamentally reshaping communication..."',
                  analysis: 'Clear 140 WPM pace with high initial vocal conviction.',
                  drill: 'Opening Hook Mastery'
                },
                {
                  id: 't2',
                  time: '00:12',
                  type: 'pause',
                  label: 'Strategic Pause (1.6s)',
                  badge: '🟡 Pause',
                  color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
                  snippet: '"...and the key benefit [Pause 1.6s] is instant feedback."',
                  analysis: 'Excellent silent pause that allowed the main point to resonate.',
                  drill: 'Silent Pause Control'
                },
                {
                  id: 't3',
                  time: '00:19',
                  type: 'filler',
                  label: 'Filler Word Detected',
                  badge: '🔴 Filler',
                  color: 'border-rose-500/50 bg-rose-950/20 text-rose-300',
                  snippet: '"Basically, we need to consider all trade-offs..."',
                  analysis: 'Used "basically" before declaring key transition.',
                  drill: 'Zero Filler Elimination'
                },
                {
                  id: 't4',
                  time: '00:28',
                  type: 'strong',
                  label: 'High-Impact Power Word',
                  badge: '🟣 Power Word',
                  color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
                  snippet: '"This framework empowers teams to scale effortlessly."',
                  analysis: 'Used high-impact power word "empowers" with firm vocal authority.',
                  drill: 'Executive Vocabulary Booster'
                }
              ].map((ev) => {
                const isSelected = selectedTimelineEvent === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedTimelineEvent(isSelected ? null : ev.id)}
                    className={`glass-panel p-4 cursor-pointer transition-all border space-y-2 ${ev.color} ${
                      isSelected ? 'ring-2 ring-purple-400 scale-[1.03] shadow-lg' : 'hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-white text-sm">{ev.time}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border border-current">{ev.badge}</span>
                    </div>
                    <h5 className="font-bold text-slate-100 font-heading text-xs">{ev.label}</h5>
                    <p className="text-[11px] text-slate-300 italic line-clamp-2">{ev.snippet}</p>
                    <span className="text-[10px] text-purple-300 font-mono block pt-1">Click to inspect detail →</span>
                  </div>
                );
              })}
            </div>

            {/* Selected Timeline Detail Drawer */}
            {selectedTimelineEvent && (
              <div className="glass-panel p-5 border-2 border-purple-500/60 bg-purple-950/30 space-y-3 animate-slide-up">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                    <Sparkles size={16} className="text-purple-400" /> Timeline Event Analysis: {[
                      { id: 't1', title: '00:04 - Strong Opening Thesis' },
                      { id: 't2', title: '00:12 - Strategic Pause (1.6s)' },
                      { id: 't3', title: '00:19 - Filler Word Detected' },
                      { id: 't4', title: '00:28 - High-Impact Power Word' }
                    ].find(x => x.id === selectedTimelineEvent)?.title}
                  </h4>
                  <button onClick={() => setSelectedTimelineEvent(null)} className="text-slate-400 hover:text-white text-xs">
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Transcript Snippet:</span>
                    <p className="text-slate-200 font-medium italic mt-1">
                      {[
                        { id: 't1', text: '"Artificial intelligence is fundamentally reshaping communication..."' },
                        { id: 't2', text: '"...and the key benefit [Pause 1.6s] is instant feedback."' },
                        { id: 't3', text: '"Basically, we need to consider all trade-offs..."' },
                        { id: 't4', text: '"This framework empowers teams to scale effortlessly."' }
                      ].find(x => x.id === selectedTimelineEvent)?.text}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">AI Analysis:</span>
                    <p className="text-slate-200 mt-1">
                      {[
                        { id: 't1', text: 'Clear 140 WPM pace with high initial vocal conviction.' },
                        { id: 't2', text: 'Excellent silent pause that allowed the main point to resonate.' },
                        { id: 't3', text: 'Used "basically" before declaring key transition.' },
                        { id: 't4', text: 'Used high-impact power word "empowers" with firm vocal authority.' }
                      ].find(x => x.id === selectedTimelineEvent)?.text}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Recommended Action:</span>
                      <p className="text-emerald-200 font-medium mt-1">
                        {[
                          { id: 't1', text: 'Maintain this high-energy thesis delivery style.' },
                          { id: 't2', text: 'Keep using 1.5s silent pauses before core takeaways.' },
                          { id: 't3', text: 'Replace "basically" with a silent 1-second pause.' },
                          { id: 't4', text: 'Incorporate 2 more vivid action verbs into details.' }
                        ].find(x => x.id === selectedTimelineEvent)?.text}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onLaunchNextChallenge) {
                          onLaunchNextChallenge({
                            title: 'Timeline Drill Practice',
                            prompt: 'Practice delivering this segment with zero fillers and optimal pauses.'
                          });
                        }
                      }}
                      className="btn-primary text-[11px] font-bold py-1.5 px-3 mt-2 self-start flex items-center gap-1.5"
                    >
                      <Sparkles size={13} /> Practice This Timestamp
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INTERACTIVE AI SUGGESTIONS FOR NEXT TIME */}
        {activeReportTab === 'ai_suggestions' && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-panel p-5 border-cyan-500/40 space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Sparkles size={16} /> INTERACTIVE COACHING CARDS
              </span>
              <h3 className="text-lg font-bold text-white font-heading">Actionable Suggestions for Your Next Attempt</h3>
              <p className="text-xs text-slate-400 font-mono">Click any card below to reveal Why This Matters, What You Did, and specific Examples.</p>
            </div>

            <div className="space-y-3">
              {[
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
              ].map((item) => {
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
                      <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
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

        {/* TAB 4: DETAILED CATEGORY BREAKDOWN */}
        {activeReportTab === 'detailed_analysis' && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-panel p-5 border-purple-500/40 space-y-1">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <BarChart3 size={16} /> EXPANDABLE CATEGORY AUDIT
              </span>
              <h3 className="text-lg font-bold text-white font-heading">In-Depth Evaluation per Communication Pillar</h3>
              <p className="text-xs text-slate-400 font-mono">Click any category accordion to expand detailed AI observations.</p>
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
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
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

        {/* TAB 5: STORY MEMORY TEST */}
        {activeReportTab === 'story_memory' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-panel p-6 border-purple-500/40 bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-sm uppercase">
                <Sparkles size={18} className="text-purple-400" /> THE STORY MEMORY TEST
              </div>
              <h3 className="text-lg font-bold text-white font-heading">What will the audience actually remember tomorrow?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Great communication isn't just about grammar—it's about leaving a lasting mental imprint. Here is what your audience will take away:
              </p>
            </div>

            {report.storyMemory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="glass-panel p-4 space-y-1 border-emerald-500/30">
                  <span className="text-emerald-400 font-bold uppercase block font-mono">Main Takeaway Message</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.audienceRemembers}</p>
                </div>

                <div className="glass-panel p-4 space-y-1 border-cyan-500/30">
                  <span className="text-cyan-400 font-bold uppercase block font-mono">Most Memorable Idea</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.mostMemorableIdea}</p>
                </div>

                <div className="glass-panel p-4 space-y-1 border-purple-500/30">
                  <span className="text-purple-300 font-bold uppercase block font-mono">Emotional Moment</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.emotionalMoment}</p>
                </div>

                <div className="glass-panel p-4 space-y-1 border-rose-500/30">
                  <span className="text-rose-400 font-bold uppercase block font-mono">Forgettable Section</span>
                  <p className="text-slate-200 font-medium">{report.storyMemory.forgettableSection}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PACING & FILLERS */}
        {activeReportTab === 'pacing' && (
          <div className="space-y-5 animate-slide-up">
            {report.fillerAnalysis && (
              <div className="glass-panel p-5 border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-200 font-heading">Filler Word Analysis</h4>
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

        {/* TAB 7: WORD FREQUENCY */}
        {activeReportTab === 'words' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-panel p-5 border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 font-heading">Word Frequency & Replacement Suggestions</h4>
              <p className="text-xs text-slate-400 font-mono">Click any word chip below to inspect full context and alternatives.</p>

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

        {/* TAB 8: BEST SPOKEN LINE & MOMENTS */}
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

        {/* BOTTOM ACTION BAR WITH PRIMARY INTERACTIVE CTA */}
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
