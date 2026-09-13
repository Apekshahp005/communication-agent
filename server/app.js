import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeSpeechChunk,
  analyzeCameraFrame,
  evaluateRetryAttempt,
  generateAdaptiveResponse,
  generatePostSessionReport
} from './services/geminiClient.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Temp directory history storage fallback for serverless environment
const HISTORY_FILE = path.join(process.env.TMPDIR || '/tmp', 'history_db.json');

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading history file:', err);
    return [];
  }
}

function saveHistory(historyData) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing history file:', err);
  }
}

// Router mapping for both Express server and Netlify Function redirects
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Communication Coach Netlify Backend', timestamp: new Date().toISOString() });
});

router.post('/gemini/analyze-speech', async (req, res) => {
  try {
    const { transcript, recentContext, mode, audienceType, activeStoryMemory } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'transcript is required' });
    }
    const result = await analyzeSpeechChunk({ transcript, recentContext, mode, audienceType, activeStoryMemory });
    res.json(result);
  } catch (err) {
    console.error('API analyze-speech error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/analyze-frame', async (req, res) => {
  try {
    const { imageBase64, recentTranscript } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }
    const result = await analyzeCameraFrame({ imageBase64, recentTranscript });
    res.json(result);
  } catch (err) {
    console.error('API analyze-frame error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/evaluate-retry', async (req, res) => {
  try {
    const { weakSnippet, attempt1, attempt2, goalPrompt } = req.body;
    const result = await evaluateRetryAttempt({ weakSnippet, attempt1, attempt2, goalPrompt });
    res.json(result);
  } catch (err) {
    console.error('API evaluate-retry error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/adaptive-response', async (req, res) => {
  try {
    const { mode, audienceType, fullTranscript, lastUserResponse } = req.body;
    const result = await generateAdaptiveResponse({ mode, audienceType, fullTranscript, lastUserResponse });
    res.json(result);
  } catch (err) {
    console.error('API adaptive-response error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/session-report', async (req, res) => {
  try {
    const { sessionMode, audienceType, fullTranscript, detectedFillers, visualNotes, retriesPerformed, isCameraActive } = req.body;
    
    const history = loadHistory();
    const previousSessionRecord = history.length > 0 ? history[0] : null;

    const report = await generatePostSessionReport({
      sessionMode,
      audienceType,
      fullTranscript,
      detectedFillers,
      visualNotes,
      retriesPerformed,
      previousSessionRecord,
      isCameraActive
    });

    const sessionRecord = {
      id: 'session_' + Date.now(),
      timestamp: new Date().toISOString(),
      mode: sessionMode,
      audienceType,
      report,
      transcriptSnippet: (fullTranscript || '').slice(0, 150) + '...'
    };

    history.unshift(sessionRecord);
    saveHistory(history);

    res.json({ report, sessionRecord });
  } catch (err) {
    console.error('API session-report error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', (req, res) => {
  const history = loadHistory();
  res.json(history);
});

router.delete('/history', (req, res) => {
  saveHistory([]);
  res.json({ status: 'cleared' });
});

// Mount router under /api and root (for Netlify Function rewrites)
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/', router);
