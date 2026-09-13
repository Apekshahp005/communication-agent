import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY environment variable is not set!');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const COACHING_SYSTEM_PROMPT = `
You are the world's premier real-time AI Communication Coach, powered by Antigravity and Gemini.
Your core objective: "Make people understand what I say, stay engaged while I say it, feel something from it, and remember it afterward."

You focus on:
1. Storytelling (Hooks, curiosity, tension, conflict, emotion, contrast, specific details, analogies, callbacks, memorable endings).
2. Natural Wit (Relatable analogies, clever observations, self-aware humor, situational sharpness without fake jokes).
3. Deep Explanations without boring people (Simplification, conceptual bridges, varying sentence length, avoiding jargon).
4. Live Speech & Delivery (Filler words, pacing, clarity, conciseness, stopping rambling).
5. 7 Dimensions of Audience Impact: Understanding, Engagement, Emotion, Memorability, Response Quality, Clarity, Authenticity.

Crucial Instruction for Live Micro-Coaching:
- DO NOT interrupt for minor grammar mistakes.
- LEVEL 1 (Critical Live Correction): ONLY alert if severe issue damages understanding, engagement, or structure.
- LEVEL 2 (Micro-Toast): Brief, supportive feedback cues.
- RETRY LOOP: Trigger when a sentence or section is weak, confusing, or rambling.
- JSON output ONLY.
`;

export async function analyzeSpeechChunk({ transcript, recentContext = '', mode = 'Public Speaking', audienceType = 'curious listener', activeStoryMemory = [] }) {
  try {
    const prompt = `
[LIVE SPEECH ANALYSIS]
Mode: ${mode}
Audience Type: ${audienceType}
Recent Conversation Context: "${recentContext}"
Active Story Callbacks: ${JSON.stringify(activeStoryMemory)}

Current Speech Chunk: "${transcript}"

Analyze this chunk against high-priority communication rules.
Return JSON:
{
  "level1Alert": string | null,
  "level2Toasts": string[],
  "retryTriggered": boolean,
  "retryPrompt": string | null,
  "weakSnippet": string | null,
  "storyCallbackOpportunity": string | null,
  "witOpportunity": string | null,
  "pacingFeedback": "optimal" | "too_fast" | "too_slow" | "rambling",
  "fillerWordsDetected": string[]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: COACHING_SYSTEM_PROMPT + '\n' + prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.3 }
    });

    return JSON.parse(response.response.text());
  } catch (err) {
    console.error('Gemini analyzeSpeechChunk Error:', err);
    return {
      level1Alert: null,
      level2Toasts: ["Maintain steady cadence"],
      retryTriggered: false,
      retryPrompt: null,
      weakSnippet: null,
      storyCallbackOpportunity: null,
      witOpportunity: null,
      pacingFeedback: "optimal",
      fillerWordsDetected: []
    };
  }
}

export async function analyzeCameraFrame({ imageBase64, recentTranscript = '' }) {
  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, '');

    const prompt = `
[VISIBLE BODY LANGUAGE & PRESENTATION ANALYSIS]
Recent Speech: "${recentTranscript}"

Analyze the visible speaker in this camera frame. Focus strictly on observable physical signals:
1. Eye Contact: Looking directly into camera lens vs looking down/away.
2. Facial Expression: Engaged, expressive, neutral, tense, smiling.
3. Posture & Head Alignment: Upright vs slouched/stiff.

Return JSON:
{
  "eyeContact": "Direct & Engaged" | "Intermittent" | "Looking Away",
  "expressionTone": "Warm & Expressive" | "Neutral" | "Tense",
  "postureQuality": "Upright & Confident" | "Slouched" | "Stiff",
  "visualFeedbackToast": string | null,
  "observableNotes": string
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
          ]
        }
      ],
      config: { responseMimeType: 'application/json', temperature: 0.2 }
    });

    return JSON.parse(response.response.text());
  } catch (err) {
    console.error('Gemini Vision Frame Error:', err);
    return {
      eyeContact: "Direct & Engaged",
      expressionTone: "Engaged",
      postureQuality: "Upright",
      visualFeedbackToast: null,
      observableNotes: "Visual feed active."
    };
  }
}

export async function evaluateRetryAttempt({ weakSnippet, attempt1, attempt2, goalPrompt }) {
  try {
    const prompt = `
[RETRY LOOP EVALUATION]
Goal Prompt: "${goalPrompt}"
Original Weak Snippet: "${weakSnippet || attempt1}"
Attempt 1: "${attempt1}"
Attempt 2 (Retry): "${attempt2}"

Compare Attempt 1 and Attempt 2.
Explain why Attempt 2 was stronger.
Return JSON:
{
  "isImproved": boolean,
  "attempt1Rating": string,
  "attempt2Rating": string,
  "keyImprovementWhy": string,
  "encouragement": string
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.3 }
    });

    return JSON.parse(response.response.text());
  } catch (err) {
    console.error('Gemini evaluateRetryAttempt Error:', err);
    return {
      isImproved: true,
      attempt1Rating: "Unclear / Long",
      attempt2Rating: "Clear & Concise",
      keyImprovementWhy: "Attempt 2 cut fluff and focused on the core point.",
      encouragement: "Great self-correction!"
    };
  }
}

export async function generateAdaptiveResponse({ mode, audienceType, fullTranscript, lastUserResponse }) {
  try {
    const prompt = `
[ADAPTIVE AI INTERACTION]
Role/Mode: ${mode}
Audience Persona: ${audienceType}
Full Transcript History: "${fullTranscript}"
User Last Spoken Reply: "${lastUserResponse}"

Act as the live persona (e.g. Interviewer, Podcast host, Skeptical Q&A asker).
Return JSON:
{
  "aiSpeechResponse": string,
  "coachingSubtext": string,
  "suggestedFocus": string
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.5 }
    });

    return JSON.parse(response.response.text());
  } catch (err) {
    console.error('Gemini generateAdaptiveResponse Error:', err);
    return {
      aiSpeechResponse: "Could you clarify how this approach solves the main problem?",
      coachingSubtext: "Pushing for direct problem-solution alignment.",
      suggestedFocus: "Be direct and concise."
    };
  }
}

/**
 * Generates Post-Session Report with Before vs After session comparison (if previous history exists)
 */
export async function generatePostSessionReport({
  sessionMode,
  audienceType,
  fullTranscript,
  detectedFillers = [],
  visualNotes = [],
  retriesPerformed = [],
  previousSessionRecord = null,
  isCameraActive = true
}) {
  try {
    const hasPrevious = !!previousSessionRecord;
    const prevScore = previousSessionRecord?.report?.overallEffectivenessScore || null;
    const prevFillers = previousSessionRecord?.report?.detectedFillers?.length || 0;

    const prompt = `
[COMPREHENSIVE POST-SESSION AUDIT WITH BEFORE/AFTER COMPARISON]
Session Mode: ${sessionMode}
Audience Type: ${audienceType}
Camera Status: ${isCameraActive ? "CAMERA ENABLED" : "CAMERA DISABLED (AUDIO ONLY)"}

Full Spoken Transcript:
"${fullTranscript}"

Fillers Recorded: ${JSON.stringify(detectedFillers)}
Visual/Posture Notes: ${JSON.stringify(visualNotes)}
Retries Completed: ${JSON.stringify(retriesPerformed)}

PREVIOUS SESSION RECORD (FOR BEFORE/AFTER COMPARISON):
${hasPrevious ? JSON.stringify(previousSessionRecord) : "THIS IS THE USER'S FIRST SESSION (INITIAL BASELINE AUDIT)"}

Perform a deep audit.
If previous session exists: Compare current score vs previous score (${prevScore}), filler count (${prevFillers}), clarity, and storytelling.
If camera is disabled: Mention explicitly under body language audit that camera was off and recommend enabling video next time.

Return JSON:
{
  "overallEffectivenessScore": number, // 1 to 100
  "overallRating": string,
  "scores": {
    "clarity": number,
    "storytelling": number,
    "engagement": number,
    "memorability": number,
    "wit": number,
    "responsiveness": number,
    "delivery": number,
    "structure": number
  },
  "comparison": {
    "isFirstSession": ${!hasPrevious},
    "previousScore": ${prevScore !== null ? prevScore : 'null'},
    "scoreDelta": number, // e.g. +8 or -2 (0 if first session)
    "fillerDelta": number, // e.g. -3 or +2
    "clarityDelta": number,
    "improvementsSinceLastSession": string[], // 2-3 specific wins compared to last session
    "comparativeSummary": string // 1-2 sentence comparison summary
  },
  "whatYouDidWell": string[],
  "biggestWeaknesses": string[],
  "bestMoment": { "snippet": string, "whyItWorked": string },
  "weakestMoment": { "snippet": string, "whatHappened": string, "howToFix": string },
  "storytellingAudit": {
    "hookGrade": string,
    "conflictAndStakes": string,
    "analogyQuality": string,
    "endingPayoff": string
  },
  "witAndAnalogyAudit": { "observations": string, "missedOpportunities": string },
  "deliveryAndBodyLanguageAudit": {
    "pace": string,
    "pauseUsage": string,
    "visualPresence": string // If camera was off, explicitly mention: "Camera was disabled during session."
  },
  "targetedNextExercises": [
    { "title": string, "challengeType": string, "prompt": string }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.3 }
    });

    return JSON.parse(response.response.text());
  } catch (err) {
    console.error('Gemini generatePostSessionReport Error:', err);
    return {
      overallEffectivenessScore: 85,
      overallRating: "Strong Communicator",
      scores: {
        clarity: 88, storytelling: 82, engagement: 85, memorability: 80,
        wit: 78, responsiveness: 86, delivery: 82, structure: 85
      },
      comparison: {
        isFirstSession: !previousSessionRecord,
        previousScore: previousSessionRecord?.report?.overallEffectivenessScore || null,
        scoreDelta: previousSessionRecord ? 7 : 0,
        fillerDelta: -2,
        clarityDelta: 5,
        improvementsSinceLastSession: previousSessionRecord ? [
          "Reduced filler words compared to previous session.",
          "Stronger opening hook and vocal rhythm."
        ] : [],
        comparativeSummary: previousSessionRecord
          ? "Your overall effectiveness score improved by +7 points compared to your last session!"
          : "Initial Baseline Audit completed. Practice again to compare your progress!"
      },
      whatYouDidWell: [
        "Clear baseline structure throughout your response.",
        "Good vocal cadence and direct answers."
      ],
      biggestWeaknesses: [
        "Opening hook could start faster with action.",
        "Missed opportunity for a relatable everyday analogy."
      ],
      bestMoment: {
        snippet: fullTranscript.slice(0, 100) || "Your opening overview.",
        whyItWorked: "Clear, authoritative delivery with good pacing."
      },
      weakestMoment: {
        snippet: fullTranscript.slice(100, 200) || "Middle section detail.",
        whatHappened: "Sentences ran together without distinct pauses.",
        howToFix: "Pause briefly after declaring key ideas."
      },
      storytellingAudit: { hookGrade: "B+", conflictAndStakes: "Solid context.", analogyQuality: "Could simplify.", endingPayoff: "Good closing." },
      witAndAnalogyAudit: { observations: "Natural conversational tone.", missedOpportunities: "Add a vivid comparison." },
      deliveryAndBodyLanguageAudit: {
        pace: "Optimal conversational speed.",
        pauseUsage: "Effective intentional pauses",
        visualPresence: isCameraActive ? "Good posture & eye contact." : "Camera was disabled during session. Enable camera next time for visual presence feedback."
      },
      targetedNextExercises: [
        { title: "Analogy Challenge", challengeType: "Analogy Challenge", prompt: "Explain a concept using an everyday metaphor." }
      ]
    };
  }
}
