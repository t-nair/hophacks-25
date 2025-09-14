import React, { useState, useEffect, useRef } from 'react';
// Add axios for API calls
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import {
  Video, Plus, Calendar, TrendingUp, Heart, Brain,
  FileText, Camera, Target, User, Home, BarChart3, Zap, StopCircle
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

function App() {
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'Alex', preferences: {} });
  const [activeScreen, setActiveScreen] = useState('home');
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [textEntry, setTextEntry] = useState('');
  const [videoEntryStatus, setVideoEntryStatus] = useState('');
  const [goals, setGoals] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);

  // Always preview camera when Record screen is mounted
  useEffect(() => {
    async function initCamera() {
      try {
        const previewStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = previewStream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    if (activeScreen === 'record') initCamera();
  }, [activeScreen]);

  const startRecording = async () => {
    try {
      const recStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = recStream;
        videoRef.current.play().catch(() => {});
      }
      const mediaRecorder = new MediaRecorder(recStream);
      mediaRecorderRef.current = mediaRecorder;
      setStream(recStream);

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      mediaRecorder.onstop = () => setRecordedChunks(chunks);

      mediaRecorder.start();
      setIsRecording(true);
      const timer = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      setTimeout(() => clearInterval(timer), 300000);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (stream) stream.getTracks().forEach(track => track.stop());
    }
  };

  const RecordScreen = () => (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <div style={styles.recordingCard}>
        <div style={styles.recordingHeader}>
          <h2 style={styles.recordingTitle}>Record Your Journal Entry</h2>
          <p style={styles.recordingSubtitle}>Share your thoughts, feelings, and reflections</p>
        </div>
        <div style={{padding: '24px'}}>
          <div style={styles.videoContainer}>
            <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
            {!stream && (
              <div style={styles.videoOverlay}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <Camera size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '18px', margin: 0 }}>Loading camera...</p>
                </div>
              </div>
            )}
            {isRecording && (
              <div style={styles.recordingIndicator}>
                <div style={styles.recordingDot}></div>
                <span>REC {recordingTime}s</span>
              </div>
            )}
          </div>
          <div style={styles.controlsContainer}>
            {!isRecording ? (
              <button onClick={startRecording} style={styles.recordButton}>
                <Video size={20} /> Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} style={styles.stopButton}>
                <StopCircle size={20} /> Stop Recording
              </button>
            )}
          </div>
          {videoEntryStatus && <div>{videoEntryStatus}</div>}
        </div>
      </div>
    </div>
  );

  // ... other screens unchanged

  const renderScreen = () => {
    switch (activeScreen) {
      case 'record': return <RecordScreen />;
      default: return <div>Other screens</div>;
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.mainContent}>{renderScreen()}</div>
    </div>
  );
}

export default App;
