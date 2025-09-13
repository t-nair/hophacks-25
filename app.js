  import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import {
  Video, Mic, MicOff, Play, Pause, Plus, Calendar, TrendingUp, Heart, Brain,
  FileText, Camera, Target, Bell, User, Home, BarChart3, Settings, Upload,
  CheckCircle, Clock, Zap, Send, StopCircle
} from 'lucide-react';

function App() {
  // State Management
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'Alex', preferences: {} });
  const [activeScreen, setActiveScreen] = useState('home');
  const [entries, setEntries] = useState([]);
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

  useEffect(() => {
    setAnalytics(mockAnalytics);
    setEntries(mockEntries);
    setGoals(mockAnalytics.goalProgress);
  }, []);

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
    <div className="w-64 bg-gradient-to-b from-purple-900 to-blue-900 text-white p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold">SuperJournal</h1>
      </div>
      
      <nav className="space-y-2">
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeScreen === id 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

  const DashboardScreen = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}! ✨</h1>
        <p className="text-purple-100">Ready to reflect on your journey today?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Entries This Week', value: '5', icon: FileText, color: 'blue' },
          { label: 'Current Mood', value: '8.7/10', icon: Heart, color: 'pink' },
          { label: 'Goals Progress', value: '72%', icon: Target, color: 'green' },
          { label: 'Streak', value: '12 days', icon: Zap, color: 'yellow' }
        ].map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${stat.color}-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Preview */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
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
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Latest Entry</h3>
          {entries[0] && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">{entries[0].title}</h4>
              <p className="text-gray-600 text-sm line-clamp-3">{entries[0].transcript}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-white ${
                  entries[0].sentiment.overall === 'positive' ? 'bg-green-500' : 
                  entries[0].sentiment.overall === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {entries[0].sentiment.overall}
                </span>
                <span className="text-gray-500">
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Recording Interface */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Record Your Journal Entry</h2>
          <p className="text-red-100">Share your thoughts, feelings, and reflections</p>
        </div>
        
        <div className="p-6">
          {/* Video Preview */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-64 object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Click record to start your entry</p>
                </div>
              </div>
            )}
            
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg flex items-center gap-3"
              >
                <Video className="w-5 h-5" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-800 text-white px-8 py-4 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg flex items-center gap-3"
              >
                <StopCircle className="w-5 h-5" />
                Stop Recording
              </button>
            )}
          </div>

          {/* Processing Status */}
          {processingStatus && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-blue-700">{processingStatus}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AnalyticsScreen = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
      
      {/* Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sentiment Distribution</h3>
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
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Goal Progress</h3>
          <div className="space-y-4">
            {(analytics?.goalProgress || []).map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{goal.goal}</span>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Mood Trends */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Detailed Mood Trends</h3>
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
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Daily Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(analytics?.dailySummaries || []).map((summary, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">{summary.date}</h4>
                <span className="text-2xl">😊</span>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Primary Emotion:</span> {summary.primaryEmotion}</p>
                <p><span className="font-medium">Key Words:</span> {summary.keyWords.join(', ')}</p>
                <p><span className="font-medium">Goals Mentioned:</span> {summary.goalMentions}</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sentiment Score:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(summary.sentimentScore / 10) * 100}%` }}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">My Journal Entries</h2>
        <button
          onClick={() => setActiveScreen('record')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{entry.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm text-white ${
                entry.sentiment.overall === 'positive' ? 'bg-green-500' : 
                entry.sentiment.overall === 'negative' ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                {entry.sentiment.overall}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">{entry.transcript}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{entry.timestamp.toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{Math.round(entry.sentiment.confidence * 100)}% confidence</span>
              </div>
            </div>
            
            {/* Emotion indicators */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {Object.entries(entry.sentiment.emotions || {}).map(([emotion, score]) => (
                <span key={emotion} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {emotion}: {Math.round(score * 10)}/10
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GoalsScreen = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">My Goals</h2>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{goal.goal}</h3>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    goal.progress >= 80 ? 'bg-green-500' : 
                    goal.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${
                goal.category === 'health' ? 'bg-green-100 text-green-800' :
                goal.category === 'work' ? 'bg-blue-100 text-blue-800' :
                goal.category === 'learning' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {goal.category}
              </span>
              <button className="text-blue-500 hover:text-blue-700 text-sm">
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
    <div className="min-h-screen bg-gray-50 flex">
      <NavigationSidebar />
      <div className="flex-1 p-8">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
