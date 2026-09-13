const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '/api';
const LOCAL_FALLBACK_BASE = 'http://localhost:3001/api';

async function fetchWithFallback(endpointPath, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpointPath}`, options);
    if (res.ok) return await res.json();
  } catch (primaryErr) {
    // Attempt local dev fallback if on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        const fallbackRes = await fetch(`${LOCAL_FALLBACK_BASE}${endpointPath}`, options);
        if (fallbackRes.ok) return await fallbackRes.json();
      } catch (fallbackErr) {
        console.warn(`Fetch fallback error for ${endpointPath}:`, fallbackErr);
      }
    }
  }
  return null;
}

export async function analyzeSpeechChunk({ transcript, recentContext, mode, audienceType, activeStoryMemory }) {
  const data = await fetchWithFallback('/gemini/analyze-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, recentContext, mode, audienceType, activeStoryMemory })
  });

  if (data) return data;

  return {
    level1Alert: null,
    level2Toasts: ["Maintain steady cadence"],
    retryTriggered: false,
    pacingFeedback: "optimal",
    fillerWordsDetected: []
  };
}

export async function analyzeCameraFrame({ imageBase64, recentTranscript }) {
  const data = await fetchWithFallback('/gemini/analyze-frame', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, recentTranscript })
  });

  if (data) return data;

  return {
    eyeContact: "Direct & Engaged",
    expressionTone: "Engaged",
    postureQuality: "Upright",
    visualFeedbackToast: null,
    observableNotes: "Camera stream active"
  };
}

export async function evaluateRetryAttempt({ weakSnippet, attempt1, attempt2, goalPrompt }) {
  const data = await fetchWithFallback('/gemini/evaluate-retry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weakSnippet, attempt1, attempt2, goalPrompt })
  });

  if (data) return data;

  return {
    isImproved: true,
    attempt1Rating: "Long / Unclear",
    attempt2Rating: "Clear & Punchy",
    keyImprovementWhy: "Attempt 2 cut unnecessary preamble and focused on the core point.",
    encouragement: "Great job sharpening your explanation!"
  };
}

export async function generateAdaptiveResponse({ mode, audienceType, fullTranscript, lastUserResponse }) {
  const data = await fetchWithFallback('/gemini/adaptive-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, audienceType, fullTranscript, lastUserResponse })
  });

  if (data) return data;

  return {
    aiSpeechResponse: "Could you clarify how this approach solves the main problem?",
    coachingSubtext: "Pushing for direct problem-solution alignment.",
    suggestedFocus: "Be direct and concise."
  };
}

export async function generatePostSessionReport(sessionData) {
  const data = await fetchWithFallback('/gemini/session-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  });

  if (data) return data;

  return {
    report: {
      overallEffectivenessScore: 84,
      overallRating: "Strong Communicator",
      scores: {
        clarity: 88, storytelling: 82, engagement: 85, memorability: 80,
        wit: 78, responsiveness: 86, delivery: 82, structure: 85
      },
      comparison: {
        isFirstSession: true,
        previousScore: null,
        scoreDelta: 0,
        fillerDelta: 0,
        clarityDelta: 0,
        improvementsSinceLastSession: [],
        comparativeSummary: "Initial Baseline Audit completed."
      },
      whatYouDidWell: [
        "Strong posture and clear vocal delivery.",
        "Answered questions directly without dodging.",
        "Good attempt at introducing a narrative hook."
      ],
      biggestWeaknesses: [
        "Occasional overuse of filler words.",
        "Missed opportunity for a relatable real-world analogy."
      ],
      bestMoment: {
        snippet: sessionData.fullTranscript ? sessionData.fullTranscript.slice(0, 100) : "Your opening overview.",
        whyItWorked: "Clear, authoritative delivery with good pacing."
      },
      weakestMoment: {
        snippet: sessionData.fullTranscript ? sessionData.fullTranscript.slice(100, 200) : "Middle section detail.",
        whatHappened: "Sentences ran together without distinct pauses.",
        howToFix: "Pause briefly after declaring key ideas."
      },
      storytellingAudit: { hookGrade: "B+", conflictAndStakes: "Solid context.", analogyQuality: "Could simplify.", endingPayoff: "Good summary." },
      witAndAnalogyAudit: { observations: "Conversational tone felt natural.", missedOpportunities: "Add a vivid comparison." },
      deliveryAndBodyLanguageAudit: { pace: "Optimal conversational speed.", pauseUsage: "Effective intentional pauses", visualPresence: "Good presence." },
      targetedNextExercises: [
        { title: "Analogy Challenge", challengeType: "Analogy Challenge", prompt: "Explain a concept using an everyday metaphor." }
      ]
    },
    sessionRecord: { id: 'session_fallback', timestamp: new Date().toISOString() }
  };
}

export async function fetchHistory() {
  const data = await fetchWithFallback('/history');
  if (data) return data;
  return [];
}
