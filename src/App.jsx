import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import StudioView from './components/Studio/StudioView';
import TopicAndTimerFlow from './components/Flow/TopicAndTimerFlow';
import ModeSelector, { COMMUNICATION_MODES } from './components/Modes/ModeSelector';
import ChallengeCardGrid from './components/Challenges/ChallengeCardGrid';
import ProgressDashboard from './components/Progress/ProgressDashboard';
import MasterReportSuite from './components/Report/MasterReportSuite';
import WordDetailModal from './components/Studio/WordDetailModal';
import { generatePostSessionReport } from './services/api';
import { Sparkles, Video, Grid, Target, TrendingUp, Brain } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'topic' | 'modes' | 'challenges' | 'progress'
  const [selectedMode, setSelectedMode] = useState(COMMUNICATION_MODES[0]);
  const [selectedAudience, setSelectedAudience] = useState('curious listener');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('Explain AGI to a beginner.');

  // Interactive Word Click Modal state
  const [selectedWordObj, setSelectedWordObj] = useState(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [fullSessionTranscript, setFullSessionTranscript] = useState('');

  // Post Session Master Report state
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
    const matchingMode = COMMUNICATION_MODES.find(m => m.id === 'impromptu') || COMMUNICATION_MODES[0];
    setSelectedMode(matchingMode);
    setActiveTab('studio');
  };

  const handleWordClick = (wordObj) => {
    setSelectedWordObj(wordObj);
    setIsWordModalOpen(true);
  };

  const handleFinishSession = async (sessionPayload) => {
    setIsGeneratingReport(true);
    setIsReportOpen(true);
    setFullSessionTranscript(sessionPayload.fullTranscript || '');

    try {
      const fullData = await generatePostSessionReport(sessionPayload);
      setReportData({
        sessionMode: currentTopic || sessionPayload.sessionMode,
        audienceType: sessionPayload.audienceType,
        fullTranscript: sessionPayload.fullTranscript,
        powerWords: sessionPayload.powerWords,
        detectedFillers: sessionPayload.detectedFillers,
        jargon: sessionPayload.jargon,
        report: fullData.report
      });
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* 1. STUDIO VIEW */}
      {activeTab === 'studio' && (
        <StudioView
          currentMode={selectedMode}
          audienceType={selectedAudience}
          activeChallenge={activeChallenge}
          currentTopic={currentTopic}
          onFinishSession={handleFinishSession}
          onWordClick={handleWordClick}
        />
      )}

      {/* 2. TOPIC & TIMER FLOW VIEW */}
      {activeTab === 'topic' && (
        <TopicAndTimerFlow
          currentTopic={currentTopic}
          onSelectTopic={setCurrentTopic}
          onReadyToSpeak={() => setActiveTab('studio')}
        />
      )}

      {/* 3. PRACTICE MODES VIEW */}
      {activeTab === 'modes' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
            <h2 className="text-xl font-bold text-white">Select Practice Environment</h2>
            <p className="text-xs text-slate-400 mt-1">
              Choose from 8 real-world practice environments and configure your audience persona.
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

      {/* 4. PRACTICE DRILLS & CHALLENGES VIEW */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 border-l-4 border-l-purple-500">
            <h2 className="text-xl font-bold text-white font-heading">Targeted Practice Drills</h2>
            <p className="text-xs text-slate-400 mt-1">
              Train 60-second storytelling hooks, zero jargon clarity, and 20-second pressure answers.
            </p>
          </div>
          <ChallengeCardGrid onLaunchChallenge={handleLaunchChallenge} />
        </div>
      )}

      {/* 5. ANALYTICS & PROGRESS VIEW */}
      {activeTab === 'progress' && (
        <ProgressDashboard />
      )}

      {/* INTERACTIVE WORD DETAIL INSPECTION MODAL */}
      <WordDetailModal
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        selectedWordObj={selectedWordObj}
        fullTranscript={fullSessionTranscript}
      />

      {/* MASTER POST-SESSION REPORT MODAL */}
      {isGeneratingReport ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl text-white p-6 space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold">Generating Master Communication Audit...</h3>
            <p className="text-xs text-slate-400">Gemini is parsing storytelling hooks, Story Memory, Pacing Timelines, and Word Frequency.</p>
          </div>
        </div>
      ) : (
        <MasterReportSuite
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          reportData={reportData}
          onLaunchNextChallenge={(ch) => {
            setIsReportOpen(false);
            handleLaunchChallenge(ch);
          }}
          onLaunchNextSession={() => {
            setIsReportOpen(false);
            setActiveTab('topic');
          }}
          onWordClick={handleWordClick}
        />
      )}
    </MainLayout>
  );
}
