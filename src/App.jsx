import React, { useState } from 'react';
import StudioView from './components/Studio/StudioView';
import ModeSelector, { COMMUNICATION_MODES } from './components/Modes/ModeSelector';
import ChallengeCardGrid from './components/Challenges/ChallengeCardGrid';
import ProgressDashboard from './components/Progress/ProgressDashboard';
import PostSessionReportModal from './components/Report/PostSessionReportModal';
import { generatePostSessionReport } from './services/api';
import { Sparkles, Video, Grid, Target, TrendingUp, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'modes' | 'challenges' | 'progress'
  const [selectedMode, setSelectedMode] = useState(COMMUNICATION_MODES[0]);
  const [selectedAudience, setSelectedAudience] = useState('curious listener');
  const [activeChallenge, setActiveChallenge] = useState(null);

  // Post Session Report state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setActiveChallenge(null);
    setActiveTab('studio');
  };

  const handleLaunchChallenge = (challenge) => {
    setActiveChallenge(challenge);
    // Find matching mode or default to impromptu
    const matchingMode = COMMUNICATION_MODES.find(m => m.id === 'impromptu') || COMMUNICATION_MODES[0];
    setSelectedMode(matchingMode);
    setActiveTab('studio');
  };

  const handleFinishSession = async (sessionPayload) => {
    setIsGeneratingReport(true);
    setIsReportOpen(true);
    try {
      const fullData = await generatePostSessionReport(sessionPayload);
      setReportData({
        sessionMode: sessionPayload.sessionMode,
        audienceType: sessionPayload.audienceType,
        report: fullData.report
      });
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <header className="glass-panel app-header border border-slate-800">
        <div className="logo-badge flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Antigravity AI</h1>
            <p className="text-[10px] font-mono text-purple-400 font-semibold tracking-wider uppercase">
              Real-Time Communication Coach
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="tab-nav">
          <button
            onClick={() => setActiveTab('studio')}
            className={`tab-btn flex items-center gap-1.5 ${activeTab === 'studio' ? 'active' : ''}`}
          >
            <Video size={16} /> Studio
          </button>
          <button
            onClick={() => setActiveTab('modes')}
            className={`tab-btn flex items-center gap-1.5 ${activeTab === 'modes' ? 'active' : ''}`}
          >
            <Grid size={16} /> 8 Modes
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`tab-btn flex items-center gap-1.5 ${activeTab === 'challenges' ? 'active' : ''}`}
          >
            <Target size={16} /> Challenges
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`tab-btn flex items-center gap-1.5 ${activeTab === 'progress' ? 'active' : ''}`}
          >
            <TrendingUp size={16} /> Analytics
          </button>
        </nav>
      </header>

      {/* Main App Content Views */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {activeTab === 'studio' && (
          <StudioView
            currentMode={selectedMode}
            audienceType={selectedAudience}
            activeChallenge={activeChallenge}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeTab === 'modes' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
              <h2 className="text-xl font-bold text-white">Select Communication Environment</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose from 8 real-world practice environments and configure your audience persona to simulate real situations.
              </p>
            </div>
            <ModeSelector
              selectedMode={selectedMode}
              onSelectMode={handleSelectMode}
              selectedAudience={selectedAudience}
              onSelectAudience={setSelectedAudience}
            />
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 border-l-4 border-l-purple-500">
              <h2 className="text-xl font-bold text-white">Dynamic Practice Challenges</h2>
              <p className="text-xs text-slate-400 mt-1">
                Train storytelling hooks, zero jargon clarity, 20-second pressure answers, and witty analogies.
              </p>
            </div>
            <ChallengeCardGrid onLaunchChallenge={handleLaunchChallenge} />
          </div>
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard />
        )}
      </main>

      {/* Post-Session Report Modal */}
      {isGeneratingReport ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md text-white p-6 space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold">Generating Deep Communication Audit...</h3>
            <p className="text-xs text-slate-400">Gemini is evaluating storytelling hooks, wit, clarity, body language, and delivery rhythm.</p>
          </div>
        </div>
      ) : (
        <PostSessionReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          reportData={reportData}
          onLaunchNextChallenge={(ch) => {
            setIsReportOpen(false);
            handleLaunchChallenge(ch);
          }}
        />
      )}
    </div>
  );
}
