import React, { useState, useEffect, useRef } from 'react';
// Add axios for API calls
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
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
    marginBottom: '24px'
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
  // State Management
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'Alex', preferences: {} });
  const [activeScreen, setActiveScreen] = useState('home');
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [textEntry, setTextEntry] = useState('');
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
    setGoals(mockAnalytics.goalProgress);
    fetchEntries();
  }, []);

  // Fetch entries from backend
  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/entries');
      // Convert backend entries to frontend format
      const backendEntries = res.data.map((entry, idx) => ({
        _id: idx + 1000,
        title: entry.text ? 'Text Entry' : 'Video Entry',
        timestamp: new Date(entry.timestamp),
        sentiment: { overall: 'neutral', confidence: 0.5, emotions: {} },
        transcript: entry.text || '(Video entry uploaded)',
        highlight: entry.highlight || ''
      }));
      setEntries([...backendEntries, ...mockEntries]);
    } catch (err) {
      setEntries([...mockEntries]);
    }
  };

  // Submit text entry to backend
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textEntry.trim()) return;
    try {
      await axios.post('http://localhost:5000/submit_text', { text: textEntry });
      setTextEntry('');
      fetchEntries();
    } catch (err) {
      alert('Failed to submit text entry');
    }
  };

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
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
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
        <h1 style={styles.logoTitle}>SuperJournal</h1>
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

  const RecordScreen = () => (
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
              value={textEntry}
              onChange={e => setTextEntry(e.target.value)}
              placeholder="Write your journal entry..."
              rows={4}
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
            />
            <button type="submit" style={styles.actionButton}>Submit Text Entry</button>
          </form>
          {/* Video Preview */}
          <div style={styles.videoContainer}>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={styles.video}
            />
            {!isRecording && (
              <div style={styles.videoOverlay}>
                <div style={{textAlign: 'center', color: 'white'}}>
                  <Camera size={64} style={{margin: '0 auto 16px', opacity: 0.5}} />
                  <p style={{fontSize: '18px', margin: 0}}>Click record to start your entry</p>
                </div>
              </div>
            )}
            {isRecording && (
              <div style={styles.recordingIndicator}>
                <div style={styles.recordingDot}></div>
                <span>REC {formatTime(recordingTime)}</span>
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
  );

  const AnalyticsScreen = () => (
    <div>
      <h2 style={styles.sectionTitle}>Analytics Dashboard</h2>
      
      {/* Sentiment Distribution */}
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

        {/* Goal Progress */}
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
            <Line type="monotone" dataKey="energy" stroke="#82ca9d" strokeWidth={3} />
            <Line type="monotone" dataKey="confidence" stroke="#ffc658" strokeWidth={3} />
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
        {entries.map((entry) => (
          <div key={entry._id} style={styles.entryCard} className="entry-card" onClick={() => setSelectedEntry(entry)}>
            <div style={styles.entryCardHeader}>
              <h3 style={styles.entryTitle}>{entry.title}</h3>
              <span style={{
                ...styles.sentimentBadge,
                ...(entry.sentiment.overall === 'positive' ? styles.sentimentPositive : 
                   entry.sentiment.overall === 'negative' ? styles.sentimentNegative : styles.sentimentNeutral)
              }}>
                {entry.sentiment.overall}
              </span>
            </div>
            <p style={styles.entryContent}>{entry.transcript}</p>
            <div style={styles.entryMeta}>
              <span>{entry.timestamp.toLocaleDateString()}</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Heart size={16} color="#ef4444" />
                <span>{Math.round(entry.sentiment.confidence * 100)}% confidence</span>
              </div>
            </div>
            {/* Emotion indicators */}
            <div style={styles.emotionTags}>
              {Object.entries(entry.sentiment.emotions || {}).map(([emotion, score]) => (
                <span key={emotion} style={styles.emotionTag}>
                  {emotion}: {Math.round(score * 10)}/10
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Highlight Modal */}
      {selectedEntry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setSelectedEntry(null)}>
          <div style={{background: 'white', padding: '32px', borderRadius: '16px', minWidth: '400px', maxWidth: '600px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)'}} onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom: '16px'}}>Gemini Highlight</h2>
            <p style={{fontWeight: 'bold', color: '#8b5cf6', marginBottom: '16px'}}>{selectedEntry.highlight || 'No highlight available.'}</p>
            {/* Extract top words/insight if present in highlight */}
            {selectedEntry.highlight && (
              <div style={{marginTop: '16px'}}>
                <h4 style={{color: '#1e3a8a'}}>Top Words / Insight</h4>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  {selectedEntry.highlight.split(/[,.;\n]/).filter(w => w.trim().length > 0).slice(0,5).map((word, idx) => (
                    <span key={idx} style={{background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px'}}>{word.trim()}</span>
                  ))}
                </div>
              </div>
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
        <button style={{...styles.actionButton, background: 'linear-gradient(45deg, #10b981 0%, #3b82f6 100%)'}} className="action-button">
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
                    backgroundColor: goal.progress >= 80 ? '#10b981' : 
                                   goal.progress >= 50 ? '#f59e0b' : '#ef4444',
                    width: `${goal.progress}%`
                  }}
                ></div>
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{
                ...styles.categoryBadge,
                ...(goal.category === 'health' ? styles.categoryHealth :
                   goal.category === 'work' ? styles.categoryWork :
                   goal.category === 'learning' ? styles.categoryLearning :
                   styles.categoryDefault)
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
    </div>
  );

  const renderScreen = () => {
    switch(activeScreen) {
      case 'home': return <DashboardScreen />;
      case 'record': return <RecordScreen />;
      case 'entries': return <EntriesScreen />;
      case 'analytics': return <AnalyticsScreen />;
      case 'goals': return <GoalsScreen />;
      default: return <DashboardScreen />;
    }
  };

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
