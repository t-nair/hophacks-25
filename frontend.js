import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Video, Mic, MicOff, Play, Pause, Plus, Calendar, TrendingUp, Heart, Brain, FileText, Camera, Target, Bell, User, Home, BarChart3, Settings, Upload, CheckCircle, Clock, Zap } from 'lucide-react';

const SuperJournalApp = () => {
  // State Management
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'Alex', preferences: {} });
  const [activeScreen, setActiveScreen] = useState('home');
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Video/Audio Recording
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  
  // Timer for recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Mock API Integration Points (replace with actual API calls)
  const apiService = {
    // Video processing pipeline
    processVideo: async (videoBlob) => {
      setProcessingStatus('uploading');
      // Simulate video upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStatus('transcribing');
      // STT Pipeline - integrate with Google Speech-to-Text, Whisper, etc.
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transcript = "Today was really productive. I managed to complete my workout routine and felt energized throughout the day. I'm excited about the project I'm working on and feel like I'm making good progress towards my fitness goals.";
      
      setProcessingStatus('analyzing');
      // Sentiment Analysis - integrate with Hugging Face, OpenAI, etc.
      await new Promise(resolve => setTimeout(resolve, 1500));
      const sentimentResult = {
        overall: 'positive',
        confidence: 0.87,
        emotions: { joy: 0.6, excitement: 0.4, satisfaction: 0.8 },
        keyPhrases: ['productive', 'workout routine', 'energized', 'good progress']
      };
      
      // Goal Analysis - integrate with custom LLM
      const goalAnalysis = {
        identifiedGoals: ['fitness improvement', 'project completion'],
        actionableSteps: [
          'Continue daily workout routine',
          'Set specific project milestones',
          'Track energy levels post-workout'
        ],
        calendarSuggestions: [
          { task: 'Morning workout', time: '07:00', recurring: true },
          { task: 'Project check-in', time: '15:00', recurring: false }
        ]
      };
      
      setProcessingStatus('completed');
      
      return {
        transcript,
        sentiment: sentimentResult,
        goals: goalAnalysis,
        timestamp: new Date().toISOString()
      };
    },

    // Analytics data
    getAnalytics: async (timeframe = '30d') => {
      // Replace with actual API call
      return {
        moodTrends: generateMockMoodData(),
        sentimentDistribution: [
          { name: 'Positive', value: 65, color: '#10B981' },
          { name: 'Neutral', value: 25, color: '#6B7280' },
          { name: 'Negative', value: 10, color: '#EF4444' }
        ],
        goalProgress: generateMockGoalProgress(),
        dailySummaries: generateMockDailySummaries()
      };
    }
  };

  // Mock data generators
  const generateMockMoodData = () => {
    return Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        mood: Math.random() * 4 + 3, // 3-7 range
        energy: Math.random() * 4 + 3,
        confidence: Math.random() * 4 + 3,
        entries: Math.floor(Math.random() * 3) + 1
      };
    });
  };

  const generateMockGoalProgress = () => [
    { goal: 'Daily Exercise', progress: 78, target: 100, category: 'Health' },
    { goal: 'Read 12 Books', progress: 45, target: 100, category: 'Learning' },
    { goal: 'Meditation Practice', progress: 89, target: 100, category: 'Mindfulness' },
    { goal: 'Project Completion', progress: 62, target: 100, category: 'Career' }
  ];

  const generateMockDailySummaries = () => {
    return Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toDateString(),
        primaryEmotion: ['joy', 'satisfaction', 'excitement', 'calm'][Math.floor(Math.random() * 4)],
        keyWords: ['productive', 'energized', 'focused', 'grateful'].slice(0, Math.floor(Math.random() * 3) + 2),
        goalMentions: Math.floor(Math.random() * 3) + 1,
        sentimentScore: Math.random() * 2 + 3
      };
    });
  };

  // Video Recording Functions
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
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        processVideoEntry(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordedChunks(chunks);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Camera access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVideoEntry = async (videoBlob) => {
    try {
      const result = await apiService.processVideo(videoBlob);
      
      const newEntry = {
        id: Date.now().toString(),
        type: 'video',
        videoBlob,
        transcript: result.transcript,
        sentiment: result.sentiment,
        goals: result.goals,
        timestamp: result.timestamp,
        processed: true
      };
      
      setEntries(prev => [newEntry, ...prev]);
      
      // Update goals based on analysis
      if (result.goals.identifiedGoals.length > 0) {
        result.goals.identifiedGoals.forEach(goalText => {
          const existingGoal = goals.find(g => g.title.toLowerCase().includes(goalText.toLowerCase()));
          if (!existingGoal) {
            setGoals(prev => [...prev, {
              id: Date.now().toString() + Math.random(),
              title: goalText,
              progress: 0,
              target: 100,
              category: 'Personal',
              createdAt: new Date().toISOString()
            }]);
          }
        });
      }
      
      // Trigger positive reinforcement
      if (result.sentiment.overall === 'positive') {
        setNotifications(prev => [...prev, {
          id: Date.now().toString(),
          type: 'positive',
          message: `Great energy today! Your positive outlook is helping you progress toward your goals.`,
          timestamp: new Date().toISOString()
        }]);
      }
      
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingStatus('error');
    }
  };

  // Screen Components
  const HomeScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name}!</h2>
        <p className="text-gray-600 mt-2">How are you feeling today?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveScreen('record')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Video className="w-8 h-8" />
          <span className="font-semibold">Record Journal</span>
        </button>
        
        <button
          onClick={() => setActiveScreen('analytics')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <BarChart3 className="w-8 h-8" />
          <span className="font-semibold">View Insights</span>
        </button>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Today's Summary
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{entries.filter(e => {
              const today = new Date().toDateString();
              return new Date(e.timestamp).toDateString() === today;
            }).length}</div>
            <div className="text-sm text-gray-600">Entries</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">7.2</div>
            <div className="text-sm text-gray-600">Avg Mood</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{goals.length}</div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Positive Insights
          </h4>
          {notifications.slice(0, 2).map(notification => (
            <p key={notification.id} className="text-green-700 text-sm">
              {notification.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const RecordScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Daily Reflection</h2>
        <p className="text-gray-600 mt-2">Record your thoughts and experiences</p>
      </div>

      {/* Video Recording Interface */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="aspect-video bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror effect
          />
          
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-colors"
            >
              <Video className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Stop Recording
            </button>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {processingStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <div className="font-semibold text-blue-800">
                {processingStatus === 'uploading' && 'Uploading video...'}
                {processingStatus === 'transcribing' && 'Converting speech to text...'}
                {processingStatus === 'analyzing' && 'Analyzing sentiment and goals...'}
                {processingStatus === 'completed' && 'Analysis complete!'}
                {processingStatus === 'error' && 'Processing error'}
              </div>
              <div className="text-sm text-blue-600">
                {processingStatus === 'completed' ? 'Your journal entry has been processed successfully!' : 'Please wait while we process your journal entry...'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const AnalyticsScreen = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    
    useEffect(() => {
      apiService.getAnalytics().then(setAnalyticsData);
    }, []);

    if (!analyticsData) {
      return (
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Analytics</h2>

        {/* Mood Trend Graph */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Mood Trends (30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.moodTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Area type="monotone" dataKey="mood" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="energy" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analyticsData.sentimentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.sentimentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Goal Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
          <div className="space-y-4">
            {analyticsData.goalProgress.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{goal.goal}</span>
                  <span className="text-sm text-gray-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Summary Cards */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Insights</h3>
          <div className="space-y-4">
            {analyticsData.dailySummaries.slice(0, 3).map((summary, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800">{summary.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    summary.sentimentScore > 6 ? 'bg-green-100 text-green-700' :
                    summary.sentimentScore < 4 ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {summary.primaryEmotion}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Key themes: {summary.keyWords.join(', ')}
                </div>
                <div className="text-sm text-gray-600">
                  Goals mentioned: {summary.goalMentions}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const GoalsScreen = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                <span className="text-sm text-gray-500">{goal.category}</span>
              </div>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                View Details
              </button>
              <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Log Progress
              </button>
            </div>
          </div>
        ))}
        
        {goals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No goals yet. Start journaling to discover and track your goals!</p>
          </div>
        )}
      </div>
    </div>
  );

  // Main App Render
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SuperJournal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            )}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'record' && <RecordScreen />}
        {activeScreen === 'analytics' && <AnalyticsScreen />}
        {activeScreen === 'goals' && <GoalsScreen />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeScreen === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveScreen('record')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeScreen === 'record' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-xs">Record</span>
          </button>
          
          <button
            onClick={() => setActiveScreen('analytics')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeScreen === 'analytics' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Insights</span>
          </button>
          
          <button
            onClick={() => setActiveScreen('goals')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeScreen === 'goals' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-xs">Goals</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperJournalApp;
