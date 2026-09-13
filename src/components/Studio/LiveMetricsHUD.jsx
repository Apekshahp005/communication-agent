import React, { useState } from 'react';
import { Gauge, AlertCircle, Clock, Activity, Eye, Zap, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LiveMetricsHUD({
  wpm = 0,
  fillers = [],
  pauseInfo,
  volume = 0,
  isMicActive = true,
  powerWordsCount = 0,
  onLaunchPracticeDrill
}) {
  const [selectedMetricKey, setSelectedMetricKey] = useState(null);

  // Voice Status calculation
  let voiceStatus = 'Silent';
  if (isMicActive && volume > 10) {
    if (wpm > 175) voiceStatus = 'Rushed';
    else voiceStatus = 'Speaking';
  } else if (isMicActive) {
    voiceStatus = 'Listening / Paused';
  } else {
    voiceStatus = 'Muted';
  }

  // AI Audience Attention estimate (0 - 100%)
  let attentionEstimate = 75;
  if (wpm >= 120 && wpm <= 165) attentionEstimate += 10;
  if (powerWordsCount > 2) attentionEstimate += 10;
  if (fillers.length > 3) attentionEstimate -= 15;
  if (wpm > 180) attentionEstimate -= 10;
  attentionEstimate = Math.max(40, Math.min(98, attentionEstimate));

  const metricDetailsMap = {
    pace: {
      title: 'Speech Pace Analysis',
      current: `${wpm || 0} WPM`,
      target: '130 – 160 WPM',
      status: wpm > 175 ? 'Rushed' : wpm < 100 && wpm > 0 ? 'Slow' : 'Optimal',
      explanation: 'Speaking at 130–160 WPM ensures listeners absorb complex ideas without feeling rushed or bored.',
      recommendation: wpm > 175 ? 'Slow down by taking 1.5s silent pauses at sentence ends.' : 'Maintain your current steady cadence.'
    },
    fillers: {
      title: 'Filler Words Usage',
      current: `${fillers.length} Fillers`,
      target: '< 2 per minute',
      status: fillers.length > 3 ? 'High Usage' : 'Clean',
      explanation: 'Filler words ("um", "basically", "like") weaken authority and disrupt the flow of thoughts.',
      recommendation: 'Swap filler words with a deliberate silent pause.'
    },
    pause: {
      title: 'Pause Duration & Hesitancy',
      current: pauseInfo?.durationSec ? `${pauseInfo.durationSec}s` : '0.0s',
      target: '1.0 – 2.0s',
      status: pauseInfo?.type === 'intentional_pause' ? 'Intentional' : 'Normal',
      explanation: 'Strategic 1.5-second pauses build anticipation and signal strong conviction.',
      recommendation: 'Pause right after delivering your core takeaway.'
    },
    mic: {
      title: 'Microphone Vocal Energy',
      current: `${volume}% Volume`,
      target: '40% – 85%',
      status: volume > 10 ? 'Active' : 'Quiet',
      explanation: 'Vocal volume projection reflects enthusiasm and confidence to your audience.',
      recommendation: 'Project from your chest with full breath support.'
    },
    voice: {
      title: 'Voice Status & Rhythm',
      current: voiceStatus,
      target: 'Steady Flow',
      status: voiceStatus === 'Speaking' ? 'Good' : 'Paused',
      explanation: 'Smooth speech transitions keep listener engagement high.',
      recommendation: 'Vary your pitch slightly to emphasize key nouns.'
    },
    attention: {
      title: 'AI Listener Attention Ratio',
      current: `${attentionEstimate}%`,
      target: '> 80%',
      status: attentionEstimate > 80 ? 'High Lean-In' : 'Moderate',
      explanation: 'Combined AI score measuring pace consistency, power word frequency, and minimal filler distraction.',
      recommendation: 'Incorporate vivid storytelling hooks to boost listener attention.'
    }
  };

  return (
    <div className="w-full space-y-3 font-mono">
      {/* 6 Interactive Metric Glass Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* 1. Speech Pace */}
        <div
          onClick={() => setSelectedMetricKey(selectedMetricKey === 'pace' ? null : 'pace')}
          className={`glass-panel p-3.5 text-center flex flex-col justify-between cursor-pointer transition-all ${
            selectedMetricKey === 'pace' ? 'border-cyan-400 ring-2 ring-cyan-500/40 scale-[1.03] shadow-lg' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Speech Pace</span>
          <div>
            <span className="text-2xl font-black text-cyan-300 block">{wpm || 0}</span>
            <span className="text-[10px] text-slate-500 block">WPM</span>
          </div>
          <span className={`text-[10px] font-bold ${
            wpm > 175 ? 'text-amber-400' : wpm < 100 && wpm > 0 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {wpm > 175 ? 'Rushed' : wpm < 100 && wpm > 0 ? 'Slow' : 'Optimal'}
          </span>
        </div>

        {/* 2. Fillers Used */}
        <div
          onClick={() => setSelectedMetricKey(selectedMetricKey === 'fillers' ? null : 'fillers')}
          className={`glass-panel p-3.5 text-center flex flex-col justify-between cursor-pointer transition-all ${
            selectedMetricKey === 'fillers' ? 'border-rose-400 ring-2 ring-rose-500/40 scale-[1.03] shadow-lg' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Fillers Used</span>
          <div>
            <span className="text-2xl font-black text-rose-400 block">{fillers.length}</span>
            <span className="text-[10px] text-slate-500 block">Words</span>
          </div>
          <span className="text-[10px] text-slate-400 truncate">
            {fillers.length > 0 ? fillers[fillers.length - 1] : 'Clean'}
          </span>
        </div>

        {/* 3. Pause Timer */}
        <div
          onClick={() => setSelectedMetricKey(selectedMetricKey === 'pause' ? null : 'pause')}
          className={`glass-panel p-3.5 text-center flex flex-col justify-between cursor-pointer transition-all ${
            selectedMetricKey === 'pause' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.03] shadow-lg' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pause Duration</span>
          <div>
            <span className="text-2xl font-black text-purple-300 block">
              {pauseInfo?.durationSec ? `${pauseInfo.durationSec}s` : '0.0s'}
            </span>
            <span className="text-[10px] text-slate-500 block">Last Pause</span>
          </div>
          <span className="text-[10px] text-emerald-400">
            {pauseInfo?.type === 'intentional_pause' ? 'Intentional' : 'Normal'}
          </span>
        </div>

        {/* 4. Mic Energy */}
        <div
          onClick={() => setSelectedMetricKey(selectedMetricKey === 'mic' ? null : 'mic')}
          className={`glass-panel p-3.5 text-center flex flex-col justify-between cursor-pointer transition-all ${
            selectedMetricKey === 'mic' ? 'border-indigo-400 ring-2 ring-indigo-500/40 scale-[1.03] shadow-lg' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Mic Energy</span>
          <div className="h-6 flex items-center justify-center gap-1 my-auto">
            {[30, 60, 100, 45, 80].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all bg-purple-500"
                style={{
                  height: `${isMicActive ? Math.max(20, (volume / 100) * h) : 10}%`,
                  opacity: isMicActive ? 0.8 : 0.2
                }}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400">{volume}% Vol</span>
        </div>

        {/* 5. Voice Status */}
        <div
          onClick={() => setSelectedMetricKey(selectedMetricKey === 'voice' ? null : 'voice')}
          className={`glass-panel p-3.5 text-center flex flex-col justify-between cursor-pointer transition-all ${
            selectedMetricKey === 'voice' ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-[1.03] shadow-lg' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Voice Status</span>
          <div>
            <span className={`text-sm font-bold block ${
              voiceStatus === 'Speaking' ? 'text-emerald-400' :
              voiceStatus === 'Rushed' ? 'text-amber-400' : 'text-slate-400'
            }`}>
              {voiceStatus}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Live Detector</span>
        </div>

        {/* 6. AI Audience Attention */}
        <div
          onClick={() => setSelectedMetricKey(selectedMetricKey === 'attention' ? null : 'attention')}
          className={`glass-panel p-3.5 text-center flex flex-col justify-between bg-gradient-to-b from-slate-900 to-purple-950/40 cursor-pointer transition-all ${
            selectedMetricKey === 'attention' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.03] shadow-lg' : 'border-purple-500/30 hover:border-purple-500/60'
          }`}
        >
          <span className="text-[10px] text-purple-300 font-bold uppercase block">AI Attention</span>
          <div>
            <span className="text-2xl font-black text-white block">{attentionEstimate}%</span>
            <span className="text-[10px] text-purple-400 block">Lean-In Ratio</span>
          </div>
          <span className="text-[9px] text-slate-500 italic">Click to Inspect</span>
        </div>
      </div>

      {/* Interactive Detail Drawer when a metric is clicked */}
      {selectedMetricKey && (
        <div className="glass-panel p-5 border-2 border-purple-500/60 bg-purple-950/40 space-y-3 animate-slide-up">
          <div className="flex justify-between items-center border-b border-purple-800/40 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
              <Sparkles size={16} className="text-purple-400" />
              {metricDetailsMap[selectedMetricKey].title}
            </h4>
            <button
              onClick={() => setSelectedMetricKey(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current vs Target:</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {metricDetailsMap[selectedMetricKey].current}
                <span className="text-slate-400 text-xs font-normal ml-2">(Target: {metricDetailsMap[selectedMetricKey].target})</span>
              </p>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-purple-400 font-bold uppercase block">Why It Matters:</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed">{metricDetailsMap[selectedMetricKey].explanation}</p>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Coach Recommendation:</span>
              <p className="text-emerald-200 font-medium mt-0.5 leading-relaxed">{metricDetailsMap[selectedMetricKey].recommendation}</p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                const metricTitle = metricDetailsMap[selectedMetricKey].title;
                setSelectedMetricKey(null);
                if (onLaunchPracticeDrill) {
                  onLaunchPracticeDrill(metricTitle);
                }
              }}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              Practice {metricDetailsMap[selectedMetricKey].title.split(' ')[0]} Drill <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
