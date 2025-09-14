import React, { useState, useEffect, useRef } from 'react';
// Add axios for API calls
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import CalendarHeatmap from './CalendarHeatmap';
import {
  Video, Mic, MicOff, Play, Pause, Plus, Calendar, TrendingUp, Heart, Brain,
  FileText, Camera, Target, Bell, User, Home, BarChart3, Settings, Upload,
  CheckCircle, Clock, Zap, Send, StopCircle
} from 'lucide-react';

// CSS Styles
const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  sidebar: {
    width: '256px',
    background: 'linear-gradient(180deg, #581c87 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  logo: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(45deg, #ec4899 0%, #8b5cf6 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500'
  },
  navButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  navButtonInactive: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  mainContent: {
    flex: 1,
    padding: '32px'
  },
  welcomeHeader: {
    background: 'linear-gradient(45deg, #8b5cf6 0%, #ec4899 100%)',
    color: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  },
  welcomeTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    margin: '0 0 8px 0'
  },
  welcomeSubtitle: {
    color: 'rgba(147, 51, 234, 0.3)',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid'
  },
  statCardBlue: { borderLeftColor: '#3b82f6' },
  statCardPink: { borderLeftColor: '#ec4899' },
  statCardGreen: { borderLeftColor: '#10b981' },
  statCardYellow: { borderLeftColor: '#f59e0b' },
  statCardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0 0 4px 0'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  recordingCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    maxWidth: '800px',
    margin: '0 auto'
  },
  recordingHeader: {
    background: 'linear-gradient(45deg, #ef4444 0%, #ec4899 100%)',
    color: 'white',
    padding: '24px'
  },
  recordingTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 8px 0'
  },
  recordingSubtitle: {
    color: 'rgba(239, 68, 68, 0.3)',
    margin: 0
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#111827',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
    minHeight: '256px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  video: {
    width: '100%',
    height: '256px',
    objectFit: 'cover',
    transform: 'scaleX(-1)'
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  recordingIndicator: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500'
  },
  recordingDot: {
    width: '12px',
    height: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: '50%',
    animation: 'pulse 1s ease-in-out infinite'
  },
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
  },
  recordButton: {
    background: 'linear-gradient(45deg, #ef4444 0%, #ec4899 100%)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    fontWeight: '500'
  },
  stopButton: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    fontWeight: '500'
  },
  entriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  entryCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  entryCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  entryTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  sentimentBadge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500'
  },
  sentimentPositive: { backgroundColor: '#10b981' },
  sentimentNegative: { backgroundColor: '#ef4444' },
  sentimentNeutral: { backgroundColor: '#6b7280' },
  entryContent: {
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  entryMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#9ca3af'
  },
  emotionTags: {
    marginTop: '16px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  emotionTag: {
    padding: '2px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: '12px',
    borderRadius: '9999px'
  },
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  goalCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  goalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  goalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  progressContainer: {
    marginBottom: '16px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '14px',
    color: '#6b7280'
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '500'
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '12px'
  },
  progressFill: {
    height: '12px',
    borderRadius: '9999px',
    transition: 'all 0.5s ease'
  },
  categoryBadge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px'
  },
  categoryHealth: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  categoryWork: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  categoryLearning: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6'
  },
  categoryDefault: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  actionButton: {
    background: 'linear-gradient(45deg, #8b5cf6 0%, #ec4899 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  spaceY: {
    '& > * + *': {
      marginTop: '24px'
    }
  }
};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  .entry-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  }
  
  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }
  
  .record-button:hover {
    background: linear-gradient(45deg, #dc2626 0%, #be185d 100%) !important;
  }
  
  .stop-button:hover {
    background-color: #111827 !important;
  }
  
  .action-button:hover {
    background: linear-gradient(45deg, #7c3aed 0%, #be185d 100%) !important;
  }
`;
document.head.appendChild(styleSheet);

function App() {
  // Add Goal Modal State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('health');
  const goalInputRef = useRef(null);
  useEffect(() => {
    if (showGoalModal && goalInputRef.current) {
      goalInputRef.current.focus();
    }
  }, [showGoalModal, newGoalName]);
  // State Management
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'BlueJay', preferences: {} });
  // Start on entry screen
  const [activeScreen, setActiveScreen] = useState('entry');
  // Entry/Landing Screen
  const EntryScreen = () => (
    <div className="entry-landing-bg" style={{height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
      <style>{`
        .entry-landing-bg {
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          position: relative;
        }
        .entry-landing-bg::before {
          content: '';
          position: absolute;
          left: 0; top: 0; right: 0; bottom: 0;
          background: #fff;
          opacity: 1;
          animation: fadeOutOverlay 1.5s cubic-bezier(.4,0,.2,1) forwards;
          z-index: 2;
        }
        @keyframes fadeOutOverlay {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-120px); }
        }
        @keyframes sineWaveText {
          0% { letter-spacing: 24px; opacity: 0; transform: translateY(0); }
          30% { opacity: 1; }
          50% { letter-spacing: 2px; transform: translateY(-12px); }
          70% { letter-spacing: 2px; transform: translateY(12px); }
          100% { letter-spacing: 2px; opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: 12}}>
          <div style={{width: 72, height: 72, borderRadius: 18, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px #0002', marginRight: 24}}>
            <Brain size={44} color="#fff" />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <h1 style={{fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: 2, margin: 0, position: 'relative', animation: 'sineWaveText 1.6s cubic-bezier(.4,0,.2,1)'}}>
              sine
              <div style={{position: 'absolute', left: 0, right: 0, top: 60, width: '160px', margin: '0 auto', display: 'flex', justifyContent: 'center'}}>
                <svg width="160" height="32" viewBox="0 0 160 32">
                  <path d="M0 16 Q 20 0, 40 16 T 80 16 T 120 16 T 160 16" stroke="#fff" strokeWidth="4" fill="none" />
                </svg>
              </div>
            </h1>
          </div>
        </div>
        <h2 style={{fontSize: 32, fontWeight: 400, color: '#fff', opacity: 0.85, marginBottom: 40, letterSpacing: 1, textShadow: '0 2px 12px #8b5cf655'}}>find your rhythm</h2>
        <button
          style={{padding: '18px 56px', fontSize: 22, fontWeight: 600, borderRadius: 14, background: '#000', color: '#fff', border: 'none', boxShadow: '0 4px 16px #0002', cursor: 'pointer', transition: 'all 0.2s', marginTop: 12, letterSpacing: 1}}
          onClick={() => setActiveScreen('home')}
        >
          Enter Dashboard
        </button>
      </div>
      {/* Decorative animated background waves */}
      <svg width="100%" height="120" viewBox="0 0 1440 120" style={{position: 'absolute', bottom: 0, left: 0, zIndex: 1}}>
        <path d="M0,40 Q360,120 720,40 T1440,40" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="8" />
        <path d="M0,80 Q360,0 720,80 T1440,80" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="6" />
      </svg>
    </div>
  );
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  // Remove textEntry and textAreaRef from App, move to RecordScreen
  const [videoEntryStatus, setVideoEntryStatus] = useState('');
  const [goals, setGoals] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Video/Audio Recording
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);

  // Mock data for demonstration
  const mockAnalytics = {
    moodTrends: [
      { date: '2025-09-07', mood: 7.2, energy: 6.8, confidence: 7.5 },
      { date: '2025-09-08', mood: 8.1, energy: 7.2, confidence: 8.0 },
      { date: '2025-09-09', mood: 6.5, energy: 6.0, confidence: 6.8 },
      { date: '2025-09-10', mood: 8.5, energy: 8.2, confidence: 8.7 },
      { date: '2025-09-11', mood: 7.8, energy: 7.5, confidence: 8.1 },
      { date: '2025-09-12', mood: 9.2, energy: 8.8, confidence: 9.0 },
      { date: '2025-09-13', mood: 8.7, energy: 8.3, confidence: 8.9 }
    ],
    sentimentDistribution: [
      { name: 'Positive', value: 65, color: '#10B981' },
      { name: 'Neutral', value: 25, color: '#6B7280' },
      { name: 'Negative', value: 10, color: '#EF4444' }
    ],
    goalProgress: [
      { goal: 'Daily Exercise', progress: 85, target: 100, category: 'health' },
      { goal: 'Read 30 Minutes', progress: 70, target: 100, category: 'learning' },
      { goal: 'Meditation Practice', progress: 90, target: 100, category: 'wellness' },
      { goal: 'Project Completion', progress: 45, target: 100, category: 'work' }
    ],
    dailySummaries: [
      {
        date: 'Today',
        primaryEmotion: 'joy',
        keyWords: ['productive', 'energized', 'focused'],
        goalMentions: 3,
        sentimentScore: 8.7
      },
      {
        date: 'Yesterday',
        primaryEmotion: 'satisfaction',
        keyWords: ['accomplished', 'grateful', 'progress'],
        goalMentions: 2,
        sentimentScore: 8.2
      }
    ]
  };

  const mockEntries = [
    {
      _id: '1',
      title: 'Morning Reflection',
      timestamp: new Date('2025-09-13T08:00:00'),
      sentiment: { overall: 'positive', confidence: 0.87, emotions: { joy: 0.8, calm: 0.7 } },
      transcript: 'Today started beautifully. I woke up feeling energized and ready to tackle my goals...'
    },
    {
      _id: '2',
      title: 'Evening Wrap-up',
      timestamp: new Date('2025-09-12T20:30:00'),
      sentiment: { overall: 'positive', confidence: 0.92, emotions: { satisfaction: 0.9, gratitude: 0.8 } },
      transcript: 'What a productive day! I managed to complete my workout and made significant progress on my project...'
    }
  ];

  // Fetch entries from backend on mount
  useEffect(() => {
    setAnalytics(mockAnalytics);
    fetchEntries();
    // Load goals from backend
    axios.get('http://localhost:5000/goals')
      .then(res => {
        if (Array.isArray(res.data)) setGoals(res.data);
      })
      .catch(() => setGoals([]));
  }, []);

  // Fetch entries from backend
  // Simple sentiment analysis function
  function getSentiment(text) {
    const positiveWords = ["happy", "joy", "excited", "content", "hopeful", "grateful", "proud", "confident", "loving", "playful", "calm", "relaxed", "peaceful", "productive", "energized", "focused", "accomplished", "progress", "satisfaction", "gratitude", "motivated", "determined", "nice", "good", "harder"];
    const negativeWords = ["sad", "lonely", "hurt", "angry", "frustrated", "anxious", "nervous", "insecure", "overwhelmed", "jealous", "confused", "awkward", "embarrassed", "ashamed", "regretful", "resentful", "envious", "exhausted", "stressed"];
    let score = 0;
    const textLower = text.toLowerCase();
    positiveWords.forEach(word => { if (textLower.includes(word)) score += 1; });
    negativeWords.forEach(word => { if (textLower.includes(word)) score -= 1; });
    if (score > 0) return "positive";
    if (score < 0) return "negative";
    return "neutral";
  }

  // Gemini-based scoring (mock implementation)
  async function getGeminiScores(text) {
  // Gemini prompt for therapist/career coach response
  // You are a compassionate therapist and reflective career coach with over 12 years of industry experience helping people progress in their career, mental health, and well-being. Read the following entry from your client and respond with a single empathetic paragraph that blends emotional reflection and gentle, constructive advice. Do not use explicit section labels like 'Summary', 'Advice', or 'MotivationalWords' in your output. Do not include the user's original message in your output and follow the style guide provided.
  // For now, this is a mock implementation. Replace with Gemini API call for real use.
  // ...existing mock scoring logic...
  const positiveWords = ["happy", "joy", "excited", "content", "hopeful", "grateful", "proud", "confident", "loving", "playful", "calm", "relaxed", "peaceful", "productive", "energized", "focused", "accomplished", "progress", "satisfaction", "gratitude", "motivated", "determined"];
  const negativeWords = ["sad", "lonely", "hurt", "angry", "frustrated", "anxious", "nervous", "insecure", "overwhelmed", "jealous", "confused", "awkward", "embarrassed", "guilty", "ashamed", "regretful", "resentful", "envious", "exhausted", "stressed"];
  const stressWords = ["stressed", "anxious", "overwhelmed", "nervous", "exhausted", "frustrated", "angry", "confused"];
  const energyWords = ["energized", "active", "productive", "focused", "excited", "motivated", "determined", "accomplished"];
  const textLower = text.toLowerCase();
  // Mood
  let mood = 5;
  positiveWords.forEach(word => { if (textLower.includes(word)) mood += 0.3; });
  negativeWords.forEach(word => { if (textLower.includes(word)) mood -= 0.3; });
  mood = Math.max(1, Math.min(10, mood));
  // Stress
  let stress = 5;
  stressWords.forEach(word => { if (textLower.includes(word)) stress += 0.5; });
  positiveWords.forEach(word => { if (textLower.includes(word)) stress -= 0.2; });
  stress = Math.max(1, Math.min(10, stress));
  // Energy
  let energy = 5;
  energyWords.forEach(word => { if (textLower.includes(word)) energy += 0.4; });
  negativeWords.forEach(word => { if (textLower.includes(word)) energy -= 0.2; });
  energy = Math.max(1, Math.min(10, energy));
  return { mood, stress, energy };
  }

  // Calculate daily averages using Gemini scores
  async function calculateDailyMoodTrends(entries) {
    // Get today's date string
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // Filter entries for today
    const todayEntries = entries.filter(entry => {
      const entryDate = entry.timestamp instanceof Date ? entry.timestamp.toISOString().slice(0,10) : new Date(entry.timestamp).toISOString().slice(0,10);
      return entryDate === todayStr;
    });

    // Calculate today's averages
    let todayMood = 7, todayStress = 5, todayEnergy = 6;
    if (todayEntries.length > 0) {
      const scoresArr = await Promise.all(todayEntries.map(e => getGeminiScores(e.transcript)));
      todayMood = scoresArr.reduce((a,b) => a+b.mood, 0) / scoresArr.length;
      todayStress = scoresArr.reduce((a,b) => a+b.stress, 0) / scoresArr.length;
      todayEnergy = scoresArr.reduce((a,b) => a+b.energy, 0) / scoresArr.length;
    }

    // Generate dummy data for previous 6 days
    const dummyTrends = [];
    for (let i = 6; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dummyTrends.push({
        date: d.toISOString().slice(0, 10),
        mood: Math.round(5 + Math.random() * 5 * 100) / 100,
        stress: Math.round(3 + Math.random() * 4 * 100) / 100,
        energy: Math.round(4 + Math.random() * 5 * 100) / 100
      });
    }

    // Add today
    dummyTrends.push({
      date: todayStr,
      mood: Number(todayMood.toFixed(2)),
      stress: Number(todayStress.toFixed(2)),
      energy: Number(todayEnergy.toFixed(2))
    });

    return dummyTrends;
  }

  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/entries');
      // Convert backend entries to frontend format
      const backendEntries = res.data.map((entry, idx) => {
        // Detect video entry by absence of text and presence of filename
        const isVideo = entry.filename !== undefined;
        const sentiment = getSentiment(entry.text || "");
        return {
          _id: idx + 1000,
          title: entry.text ? 'Text Entry' : 'Video Entry',
          timestamp: new Date(entry.timestamp),
          sentiment: { overall: sentiment, confidence: 1, emotions: {} },
          transcript: entry.text || (isVideo ? '(Video entry uploaded)' : ''),
          highlight: entry.highlight || '',
          filename: entry.filename,
          videoUrl: isVideo ? `http://localhost:5000/videos/${entry.filename}` : undefined
        };
      });
      const allEntries = [...backendEntries, ...mockEntries];
      setEntries(allEntries);
      // Update analytics sentiment distribution
      const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
      backendEntries.forEach(e => { sentimentCounts[e.sentiment.overall] += 1; });
      // Calculate Gemini-based mood trends
      calculateDailyMoodTrends(allEntries).then(moodTrends => {
        setAnalytics(a => ({
          ...a,
          sentimentDistribution: [
            { name: 'Positive', value: sentimentCounts.positive, color: '#10B981' },
            { name: 'Neutral', value: sentimentCounts.neutral, color: '#6B7280' },
            { name: 'Negative', value: sentimentCounts.negative, color: '#EF4444' }
          ],
          moodTrends
        }));
      });
    } catch (err) {
      setEntries([...mockEntries]);
    }
  };

  // Submit text entry to backend
  // Remove handleTextSubmit from App, move to RecordScreen

  // Upload video entry to backend
  const handleVideoUpload = async () => {
    if (!recordedChunks.length) return;
    setVideoEntryStatus('Uploading...');
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'entry.webm');
    try {
      await axios.post('http://localhost:5000/upload_video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRecordedChunks([]);
      setVideoEntryStatus('Video uploaded!');
      fetchEntries();
    } catch (err) {
      setVideoEntryStatus('Upload failed');
    }
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Ensure video preview always shows camera stream
      const setVideoStream = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
        } else {
          // Try again after a short delay if ref not ready
          setTimeout(setVideoStream, 100);
        }
      };
      setVideoStream();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setStream(stream);

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
      }, 300000); // Max 5 minutes

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const NavigationSidebar = () => (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <div style={styles.logo}>
          <Brain size={24} />
        </div>
        <h1 style={styles.logoTitle}>sine</h1>
      </div>
      
      <nav style={styles.nav}>
        {[
          { id: 'home', icon: Home, label: 'Dashboard' },
          { id: 'record', icon: Video, label: 'Record Entry' },
          { id: 'entries', icon: FileText, label: 'My Entries' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'goals', icon: Target, label: 'Goals' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveScreen(id)}
            className="nav-button"
            style={{
              ...styles.navButton,
              ...(activeScreen === id ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

  const DashboardScreen = () => (
    <div>
      {/* Welcome Header */}
      <div style={styles.welcomeHeader}>
        <h1 style={styles.welcomeTitle}>Welcome back, {currentUser.name}! ✨</h1>
        <p style={styles.welcomeSubtitle}>Ready to reflect on your journey today?</p>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Entries This Week', value: '5', icon: FileText, style: styles.statCardBlue },
          { label: 'Current Mood', value: '8.7/10', icon: Heart, style: styles.statCardPink },
          { label: 'Goals Progress', value: '72%', icon: Target, style: styles.statCardGreen },
          { label: 'Streak', value: '12 days', icon: Zap, style: styles.statCardYellow }
        ].map((stat, index) => (
          <div key={index} style={{...styles.statCard, ...stat.style}}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statLabel}>{stat.label}</p>
                <p style={styles.statValue}>{stat.value}</p>
              </div>
              <stat.icon size={32} color={stat.style.borderLeftColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={styles.twoColumnGrid}>
        {/* Mood Trend Preview */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <TrendingUp size={20} color="#3b82f6" />
            Mood Trend (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics?.moodTrends || []}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Area type="monotone" dataKey="mood" stroke="#8884d8" fillOpacity={1} fill="url(#moodGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Entry Preview */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Latest Entry</h3>
          {entries[0] && (
            <div>
              <h4 style={{...styles.goalTitle, marginBottom: '12px'}}>{entries[0].title}</h4>
              <p style={{...styles.entryContent, marginBottom: '12px'}}>{entries[0].transcript}</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px'}}>
                <span style={{
                  ...styles.sentimentBadge,
                  ...(entries[0].sentiment.overall === 'positive' ? styles.sentimentPositive : 
                     entries[0].sentiment.overall === 'negative' ? styles.sentimentNegative : styles.sentimentNeutral)
                }}>
                  {entries[0].sentiment.overall}
                </span>
                <span style={{color: '#9ca3af'}}>
                  {entries[0].timestamp.toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function RecordScreen() {
    const [textEntry, setTextEntry] = useState('');
    const textAreaRef = useRef(null);
    const handleTextSubmit = async (e) => {
      e.preventDefault();
      if (!textEntry.trim()) return;
      setTextEntry('');
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
      try {
        // Save entry to backend and get highlight immediately
        const res = await axios.post('http://localhost:5000/submit_text', { text: textEntry });
        if (res.data && res.data.entry) {
          setEntries(prev => [res.data.entry, ...prev]);
        }
      } catch (err) {
        alert('Failed to submit text entry');
      }
    };
    return (
      <div>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <div style={styles.recordingCard}>
            <div style={styles.recordingHeader}>
              <h2 style={styles.recordingTitle}>Record Your Journal Entry</h2>
              <p style={styles.recordingSubtitle}>Share your thoughts, feelings, and reflections</p>
            </div>
            <div style={{padding: '24px'}}>
              {/* Text Entry Form */}
              <form onSubmit={handleTextSubmit} style={{marginBottom: '24px'}}>
                <textarea
                  ref={textAreaRef}
                  value={textEntry}
                  onChange={e => setTextEntry(e.target.value)}
                  placeholder="Write your journal entry..."
                  rows={4}
                  style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
                />
                <button type="submit" style={styles.actionButton}>Submit Text Entry</button>
              </form>
              {/* Video Preview with Orb Overlay when Recording, Orb with Get Started when Idle */}
              <div style={styles.videoContainer}>
                {isRecording ? (
                  <>
                    {/* Hidden video element for recording only */}
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{display: 'none'}}
                    />
                    {/* Animated orb overlay while recording */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #8b5cf6 0%, #ec4899 100%)',
                        boxShadow: '0 0 40px 12px #8b5cf655',
                        animation: 'orbPulse 2.2s cubic-bezier(.4,0,.2,1) infinite',
                        marginBottom: '12px'
                      }}></div>
                      <span style={{color: '#fff', fontSize: '18px', fontWeight: 500, textShadow: '0 2px 8px #000'}}>I'm here to listen</span>
                      <style>{`
                        @keyframes orbPulse {
                          0% { transform: scale(1); box-shadow: 0 0 40px 12px #8b5cf655; }
                          40% { transform: scale(1.08); box-shadow: 0 0 56px 20px #ec489955; }
                          60% { transform: scale(1.15); box-shadow: 0 0 64px 24px #ec489955; }
                          100% { transform: scale(1); box-shadow: 0 0 40px 12px #8b5cf655; }
                        }
                      `}</style>
                    </div>
                    <div style={styles.recordingIndicator}>
                      <div style={styles.recordingDot}></div>
                      <span>REC {formatTime(recordingTime)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{height: '256px', background: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #8b5cf6 0%, #ec4899 100%)',
                      boxShadow: '0 0 40px 12px #8b5cf655',
                      marginBottom: '16px'
                    }}></div>
                    <span style={{color: '#fff', fontSize: '18px', fontWeight: 500, textShadow: '0 2px 8px #000'}}>I'm here to listen</span>
                  </div>
                )}
              </div>
              <div style={styles.controlsContainer}>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    style={styles.recordButton}
                    className="record-button"
                  >
                    <Video size={20} />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    style={styles.stopButton}
                    className="stop-button"
                  >
                    <StopCircle size={20} />
                    Stop Recording
                  </button>
                )}
                {/* Upload button after recording */}
                {recordedChunks.length > 0 && !isRecording && (
                  <button onClick={handleVideoUpload} style={styles.actionButton}>Upload Video Entry</button>
                )}
              </div>
              {/* Video upload status */}
              {videoEntryStatus && (
                <div style={{marginTop: '16px', color: '#1d4ed8'}}>{videoEntryStatus}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const AnalyticsScreen = () => (
    <div>
      <h2 style={styles.sectionTitle}>Analytics Dashboard</h2>
      {/* Sentiment Distribution & Goal Progress */}
      <div style={styles.twoColumnGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.sentimentDistribution || []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {(analytics?.sentimentDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Goal Progress</h3>
          <div>
            {(analytics?.goalProgress || []).map((goal, index) => (
              <div key={index} style={{marginBottom: '16px'}}>
                <div style={styles.progressHeader}>
                  <span style={{...styles.progressLabel, fontWeight: '500', color: '#374151'}}>{goal.goal}</span>
                  <span style={styles.progressLabel}>{goal.progress}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      background: 'linear-gradient(45deg, #3b82f6 0%, #8b5cf6 100%)',
                      width: `${goal.progress}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Heatmap Visual */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Monthly Mood Heatmap</h3>
        {/* Demo heatmap colors for September 2025 */}
        {(() => {
          const heatmapColors = {};
          for (let d = 1; d <= 28; d++) {
            const dateStr = `2025-09-${String(d).padStart(2, '0')}`;
            if (d % 5 === 0) heatmapColors[dateStr] = '#10B981'; // green
            else if (d % 3 === 0) heatmapColors[dateStr] = '#EF4444'; // red
            else if (d % 2 === 0) heatmapColors[dateStr] = '#F59E0B'; // yellow
            else heatmapColors[dateStr] = '#6B7280'; // gray
          }
          return <CalendarHeatmap colors={heatmapColors} />;
        })()}
      </div>
      {/* Detailed Mood Trends */}
      <div style={{...styles.chartCard, marginBottom: '24px'}}>
        <h3 style={styles.chartTitle}>Detailed Mood Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analytics?.moodTrends || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={3} />
            <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} />
            <Line type="monotone" dataKey="energy" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Daily Summaries */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Daily Insights</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px'}}>
          {(analytics?.dailySummaries || []).map((summary, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <h4 style={{margin: 0, fontWeight: '600'}}>{summary.date}</h4>
                <span style={{fontSize: '24px'}}>😊</span>
              </div>
              <div style={{fontSize: '14px', lineHeight: '1.5'}}>
                <p style={{margin: '0 0 8px 0'}}><span style={{fontWeight: '500'}}>Primary Emotion:</span> {summary.primaryEmotion}</p>
                <p style={{margin: '0 0 8px 0'}}><span style={{fontWeight: '500'}}>Key Words:</span> {summary.keyWords.join(', ')}</p>
                <p style={{margin: '0 0 8px 0'}}><span style={{fontWeight: '500'}}>Goals Mentioned:</span> {summary.goalMentions}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontWeight: '500'}}>Sentiment Score:</span>
                  <div style={{flex: 1, backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px'}}>
                    <div 
                      style={{
                        backgroundColor: '#10b981',
                        height: '8px',
                        borderRadius: '9999px',
                        width: `${(summary.sentimentScore / 10) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span>{summary.sentimentScore}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EntriesScreen = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>My Journal Entries</h2>
        <button
          onClick={() => setActiveScreen('record')}
          style={styles.actionButton}
          className="action-button"
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      <div style={styles.entriesGrid}>
        {entries.map((entry) => {
          const sentiment = entry.sentiment || {};
          const overall = sentiment.overall || 'neutral';
          const confidence = typeof sentiment.confidence === 'number' ? sentiment.confidence : 1;
          return (
            <div key={entry._id} style={styles.entryCard} className="entry-card" onClick={() => setSelectedEntry(entry)}>
              <div style={styles.entryCardHeader}>
                <h3 style={styles.entryTitle}>{entry.title}</h3>
                <span style={{
                  ...styles.sentimentBadge,
                  ...(overall === 'positive' ? styles.sentimentPositive : 
                     overall === 'negative' ? styles.sentimentNegative : styles.sentimentNeutral)
                }}>
                  {overall}
                </span>
              </div>
              {/* If video entry, show thumbnail */}
              {entry.transcript === '(Video entry uploaded)' && entry.videoUrl ? (
                <div style={{position: 'relative', marginBottom: '16px'}}>
                  <video
                    src={entry.videoUrl}
                    style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', background: '#111827'}}
                    controls
                  />
                </div>
              ) : (
                <p style={styles.entryContent}>{entry.transcript}</p>
              )}
              <div style={styles.entryMeta}>
                <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Heart size={16} color="#ef4444" />
                  <span>{Math.round(confidence * 100)}% confidence</span>
                </div>
              </div>
              {/* Emotion indicators */}
              <div style={styles.emotionTags}>
                {Object.entries(sentiment.emotions || {}).map(([emotion, score]) => (
                  <span key={emotion} style={styles.emotionTag}>
                    {emotion}: {Math.round(score * 10)}/10
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlight Modal */}
      {selectedEntry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setSelectedEntry(null)}>
          <div style={{background: 'white', padding: '32px', borderRadius: '16px', minWidth: '400px', maxWidth: '600px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)'}} onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom: '16px'}}>Gemini Highlight</h2>
            {/* If video entry, show playable video */}
            {selectedEntry.videoUrl ? (
              <div style={{marginBottom: '16px'}}>
                <video
                  src={selectedEntry.videoUrl}
                  controls
                  style={{width: '100%', borderRadius: '8px', background: '#111827'}}
                />
              </div>
            ) : null}
            {!selectedEntry.highlight ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80px'}}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '4px solid #8b5cf6',
                  borderTop: '4px solid #ec4899',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '12px'
                }}></div>
                <span style={{color: '#8b5cf6'}}>Loading highlight...</span>
              </div>
            ) : (
              <>
                <p style={{fontWeight: 'bold', color: '#8b5cf6', marginBottom: '16px'}}>{selectedEntry.highlight}</p>
                {/* Extract advice from Gemini highlight and show as insights */}
                {(() => {
                  // Try to extract advice from the highlight
                  const adviceMatch = selectedEntry.highlight.match(/(?:Advice:|advice:|\d\.|\n2\.|- |• )(.*)/i);
                  let advice = adviceMatch ? adviceMatch[1] : null;
                  // If multiple pieces of advice, split by common delimiters
                  let adviceList = advice ? advice.split(/\.|\n|;|,|•|-/).map(a => a.trim()).filter(a => a.length > 0) : [];
                  return (
                    <div style={{marginTop: '16px'}}>
                      <h4 style={{color: '#1e3a8a'}}>Advice / Insights</h4>
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        {adviceList.length > 0
                          ? adviceList.slice(0,3).map((ad, idx) => (
                              <span key={idx} style={{background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px'}}>{ad}</span>
                            ))
                          : <span style={{color: '#6b7280'}}>No advice found.</span>
                        }
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
            <button style={{marginTop: '32px', background: 'linear-gradient(45deg, #8b5cf6 0%, #ec4899 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500'}} onClick={() => setSelectedEntry(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );

  const GoalsScreen = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>My Goals</h2>
        <button
          style={{...styles.actionButton, background: 'linear-gradient(45deg, #10b981 0%, #3b82f6 100%)'}}
          className="action-button"
          onClick={() => setShowGoalModal(true)}
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>
      <div style={styles.goalsGrid}>
        {goals.map((goal, index) => (
          <div key={index} style={styles.goalCard}>
            <div style={styles.goalHeader}>
              <h3 style={styles.goalTitle}>{goal.goal}</h3>
              <Target size={20} color="#3b82f6" />
            </div>
            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Progress</span>
                <span style={styles.progressValue}>{goal.progress}%</span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    backgroundColor:
                      goal.progress >= 80 ? '#10b981'
                      : goal.progress >= 50 ? '#f59e0b'
                      : '#ef4444',
                    width: `${goal.progress}%`
                  }}
                />
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{
                ...styles.categoryBadge,
                ...(goal.category === 'health' ? styles.categoryHealth
                  : goal.category === 'work' ? styles.categoryWork
                  : goal.category === 'learning' ? styles.categoryLearning
                  : styles.categoryDefault)
              }}>
                {goal.category}
              </span>
              <button style={{color: '#3b82f6', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px'}}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Add Goal Modal */}
      {showGoalModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={() => setShowGoalModal(false)}>
          <div style={{background: 'white', padding: '32px', borderRadius: '16px', minWidth: '320px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)'}} onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom: '16px'}}>Add a New Goal</h2>
            {/* Input will stay focused after typing due to useEffect in App */}
            <form onSubmit={async e => {
              e.preventDefault();
              if (!newGoalName.trim()) return;
              // Save to backend
              try {
                await axios.post('http://localhost:5000/add_goal', {
                  goal: newGoalName,
                  progress: 0,
                  target: 100,
                  category: newGoalCategory
                });
                // Reload goals from backend
                const res = await axios.get('http://localhost:5000/goals');
                if (Array.isArray(res.data)) setGoals(res.data);
              } catch {
                // Fallback: add locally
                setGoals(prev => [
                  ...prev,
                  {
                    goal: newGoalName,
                    progress: 0,
                    target: 100,
                    category: newGoalCategory
                  }
                ]);
              }
              setShowGoalModal(false);
              setNewGoalName('');
              setNewGoalCategory('health');
            }}>
              <div style={{marginBottom: '16px'}}>
                <label style={{fontWeight: 500, marginBottom: 4, display: 'block'}}>Goal Name</label>
                <input
                  ref={goalInputRef}
                  type="text"
                  value={newGoalName}
                  onChange={e => setNewGoalName(e.target.value)}
                  style={{width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd'}}
                  placeholder="Enter your goal..."
                  required
                />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{fontWeight: 500, marginBottom: 4, display: 'block'}}>Category</label>
                <select
                  value={newGoalCategory}
                  onChange={e => setNewGoalCategory(e.target.value)}
                  style={{width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd'}}
                >
                  <option value="health">Health</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="wellness">Wellness</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit" style={{...styles.actionButton, width: '100%', marginTop: '8px'}}>Add Goal</button>
            </form>
            <button style={{marginTop: '16px', background: '#eee', color: '#333', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500'}} onClick={() => setShowGoalModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderScreen = () => {
    switch(activeScreen) {
      case 'entry': return <EntryScreen />;
      case 'home': return <DashboardScreen />;
      case 'record': return <RecordScreen />;
      case 'entries': return <EntriesScreen />;
      case 'analytics': return <AnalyticsScreen />;
      case 'goals': return <GoalsScreen />;
      default: return <DashboardScreen />;
    }
  };

  if (activeScreen === 'entry') {
    return renderScreen();
  }
  return (
    <div style={styles.app}>
      <NavigationSidebar />
      <div style={styles.mainContent}>
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
