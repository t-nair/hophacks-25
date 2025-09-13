const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superjournal';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('📊 Connected to MongoDB');
});

// MongoDB Schemas
const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  preferences: {
    journalFrequency: { type: String, default: 'daily' },
    notificationsEnabled: { type: Boolean, default: true },
    reminderTime: { type: String, default: '20:00' },
    dataRetention: { type: Number, default: 365 }, // days
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const EntrySchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  userId: { type: String, required: true, ref: 'User' },
  type: { type: String, enum: ['video', 'audio', 'text'], required: true },
  
  // Raw content
  videoPath: String,
  audioPath: String,
  textContent: String,
  
  // AI Processing Results
  transcript: String,
  
  // Sentiment Analysis Results (placeholder for AI model integration)
  sentiment: {
    overall: { type: String, enum: ['positive', 'negative', 'neutral'] },
    confidence: { type: Number, min: 0, max: 1 },
    emotions: {
      joy: { type: Number, min: 0, max: 1, default: 0 },
      sadness: { type: Number, min: 0, max: 1, default: 0 },
      anger: { type: Number, min: 0, max: 1, default: 0 },
      fear: { type: Number, min: 0, max: 1, default: 0 },
      surprise: { type: Number, min: 0, max: 1, default: 0 },
      disgust: { type: Number, min: 0, max: 1, default: 0 },
      anticipation: { type: Number, min: 0, max: 1, default: 0 },
      trust: { type: Number, min: 0, max: 1, default: 0 }
    },
    keyPhrases: [String],
    moodScore: { type: Number, min: 0, max: 10 }
  },
  
  // Goal Analysis Results (placeholder for LLM integration)
  goalAnalysis: {
    identifiedGoals: [String],
    actionableSteps: [String],
    calendarSuggestions: [{
      task: String,
      time: String,
      date: Date,
      recurring: Boolean,
      priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    }],
    progressMetrics: [{
      goalId: String,
      progressValue: Number,
      unit: String
    }]
  },
  
  // Processing metadata
  processing: {
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    sttModel: String, // e.g., 'whisper-1', 'google-speech-v1'
    sentimentModel: String, // e.g., 'huggingface-roberta', 'openai-gpt-4'
    goalModel: String, // e.g., 'custom-llm-v1', 'openai-gpt-4'
    processingTime: Number, // milliseconds
    errorMessage: String
  },
  
  timestamp: { type: Date, default: Date.now },
  metadata: {
    duration: Number, // seconds for video/audio
    fileSize: Number, // bytes
    wordCount: Number,
    readingTime: Number, // minutes
    device: String,
    location: String // optional geolocation
  }
});

const GoalSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  
  progress: {
    current: { type: Number, default: 0 },
    target: { type: Number, required: true },
    unit: { type: String, default: 'percent' }
  },
  
  timeline: {
    startDate: { type: Date, default: Date.now },
    targetDate: Date,
    completedDate: Date
  },
  
  status: { type: String, enum: ['active', 'completed', 'paused', 'cancelled'], default: 'active' },
  
  // AI-extracted insights
  relatedEntries: [{ type: String, ref: 'Entry' }],
  mentionCount: { type: Number, default: 0 },
  sentimentTrend: [{ date: Date, sentiment: Number }],
  
  // Calendar integration
  calendarEvents: [{
    eventId: String,
    platform: String, // 'google', 'outlook', etc.
    title: String,
    scheduledTime: Date
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  userId: { type: String, required: true, ref: 'User' },
  type: { type: String, enum: ['positive_reinforcement', 'goal_reminder', 'journal_prompt', 'achievement'], required: true },
  title: String,
  message: { type: String, required: true },
  
  // Trigger conditions
  triggerData: {
    sentimentThreshold: Number,
    goalProgress: Number,
    daysSinceLastEntry: Number,
    streakCount: Number
  },
  
  status: { type: String, enum: ['pending', 'sent', 'read'], default: 'pending' },
  scheduledFor: Date,
  sentAt: Date,
  readAt: Date,
  
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Entry = mongoose.model('Entry', EntrySchema);
const Goal = mongoose.model('Goal', GoalSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `uploads/${req.user.id}/`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm|mp3|wav|ogg|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.userId });
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

// AI Service Integration Layer (Placeholder for actual AI models)
class AIService {
  // Speech-to-Text Integration
  static async speechToText(audioFilePath, options = {}) {
    try {
      // INTEGRATION POINT: Replace with actual STT service
      // Examples: OpenAI Whisper, Google Speech-to-Text, Azure Speech Services
      
      // Mock implementation for development
      const mockTranscripts = [
        "Today was an incredibly productive day. I managed to complete my morning workout routine which gave me so much energy for the rest of the day. I'm feeling really positive about the progress I'm making on my fitness goals.",
        "I've been feeling a bit overwhelmed with work lately. There are so many deadlines coming up and I'm worried I won't be able to meet them all. I need to find better ways to manage my stress.",
        "Had the most wonderful time with my family today. We went to the park and had a picnic. Moments like these remind me of what's truly important in life. I feel so grateful.",
        "I'm excited about the new project I'm starting tomorrow. It's something I've been passionate about for a while now and finally getting the chance to work on it feels amazing.",
        "Reflection on my meditation practice - I've been consistent for 30 days now and I can really feel the difference in my mental clarity and emotional stability."
      ];
      
      const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      
      return {
        transcript,
        confidence: 0.95,
        language: 'en-US',
        duration: Math.random() * 120 + 30, // 30-150 seconds
        model: options.model || 'whisper-1'
      };
      
      // Actual implementation would look like:
      /*
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: 'whisper-1',
        language: options.language || 'en',
        response_format: 'json',
        temperature: 0.2
      });
      return transcription;
      */
      
    } catch (error) {
      console.error('STT Error:', error);
      throw new Error('Speech-to-text processing failed');
    }
  }

  // Sentiment Analysis Integration
  static async analyzeSentiment(text) {
    try {
      // INTEGRATION POINT: Replace with actual sentiment analysis model
      // Examples: Hugging Face Transformers, Google Cloud Natural Language, OpenAI GPT-4
      
      // Enhanced mock sentiment analysis
      const positiveWords = [
        'happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'good', 'best', 'awesome',
        'fantastic', 'excellent', 'perfect', 'beautiful', 'grateful', 'blessed', 'proud', 'accomplished',
        'successful', 'peaceful', 'content', 'optimistic', 'hopeful', 'energized', 'motivated', 'confident',
        'thrilled', 'delighted', 'pleased', 'satisfied', 'inspiring', 'uplifting', 'positive', 'brilliant'
      ];
      
      const negativeWords = [
        'sad', 'angry', 'hate', 'terrible', 'awful', 'bad', 'worst', 'depressed', 'anxious', 'worried',
        'stressed', 'frustrated', 'disappointed', 'lonely', 'tired', 'exhausted', 'overwhelmed', 'confused',
        'scared', 'afraid', 'upset', 'annoyed', 'irritated', 'devastated', 'heartbroken', 'miserable',
        'hopeless', 'desperate', 'furious', 'disgusted', 'bitter', 'resentful', 'defeated'
      ];

      const emotionKeywords = {
        joy: ['happy', 'joy', 'delighted', 'thrilled', 'ecstatic', 'cheerful', 'elated'],
        sadness: ['sad', 'depressed', 'melancholy', 'grief', 'sorrow', 'heartbroken', 'devastated'],
        anger: ['angry', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'livid'],
        fear: ['scared', 'afraid', 'anxious', 'worried', 'nervous', 'terrified', 'panic'],
        surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'bewildered'],
        disgust: ['disgusted', 'revolted', 'repulsed', 'sick', 'nauseated'],
        anticipation: ['excited', 'eager', 'looking forward', 'anticipating', 'expecting'],
        trust: ['trust', 'confident', 'secure', 'safe', 'reliable', 'dependable']
      };

      const words = text.toLowerCase().split(/\s+/).map(word => word.replace(/[^\w]/g, ''));
      let positiveCount = 0;
      let negativeCount = 0;
      const detectedEmotions = {};
      const keyPhrases = [];

      // Initialize emotion scores
      Object.keys(emotionKeywords).forEach(emotion => {
        detectedEmotions[emotion] = 0;
      });

      // Analyze words
      words.forEach(word => {
        if (positiveWords.includes(word)) {
          positiveCount++;
          keyPhrases.push(word);
        }
        if (negativeWords.includes(word)) {
          negativeCount++;
          keyPhrases.push(word);
        }

        // Check emotions
        Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
          if (keywords.includes(word)) {
            detectedEmotions[emotion] += 0.2;
          }
        });
      });

      const totalWords = words.length;
      const positiveScore = positiveCount / totalWords;
      const negativeScore = negativeCount / totalWords;
      const netScore = positiveScore - negativeScore;

      let overall, confidence;
      if (netScore > 0.05) {
        overall = 'positive';
        confidence = Math.min(netScore * 5, 1);
      } else if (netScore < -0.05) {
        overall = 'negative';
        confidence = Math.min(Math.abs(netScore) * 5, 1);
      } else {
        overall = 'neutral';
        confidence = 0.8;
      }

      // Calculate mood score (0-10 scale)
      const moodScore = Math.max(0, Math.min(10, 5 + (netScore * 15)));

      return {
        overall,
        confidence,
        emotions: detectedEmotions,
        keyPhrases: keyPhrases.slice(0, 10),
        moodScore: Math.round(moodScore * 10) / 10,
        scores: {
          positive: positiveScore,
          negative: negativeScore,
          neutral: 1 - positiveScore - negativeScore
        }
      };

      // Actual implementation with Hugging Face would look like:
      /*
      const response = await fetch('https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest', {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        method: 'POST',
        body: JSON.stringify({ inputs: text })
      });
      const result = await response.json();
      return processHuggingFaceResponse(result);
      */

    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      throw new Error('Sentiment analysis failed');
    }
  }

  // Goal Analysis with LLM Integration
  static async analyzeGoals(text, userGoals = []) {
    try {
      // INTEGRATION POINT: Replace with actual LLM service
      // Examples: OpenAI GPT-4, Claude, Custom trained models
      
      // Mock goal analysis
      const goalKeywords = {
        'fitness': ['workout', 'exercise', 'gym', 'run', 'fitness', 'health', 'diet', 'weight'],
        'career': ['work', 'job', 'project', 'meeting', 'deadline', 'promotion', 'career', 'professional'],
        'learning': ['read', 'study', 'learn', 'course', 'book', 'skill', 'knowledge', 'education'],
        'relationships': ['family', 'friend', 'relationship', 'love', 'social', 'connect', 'people'],
        'mindfulness': ['meditation', 'mindful', 'peace', 'calm', 'reflection', 'gratitude', 'present'],
        'creativity': ['create', 'art', 'write', 'music', 'creative', 'inspire', 'imagination'],
        'travel': ['travel', 'trip', 'vacation', 'explore', 'adventure', 'journey', 'visit']
      };

      const identifiedGoals = [];
      const actionableSteps = [];
      const calendarSuggestions = [];

      const words = text.toLowerCase().split(/\s+/);
      
      // Identify potential goals
      Object.entries(goalKeywords).forEach(([category, keywords]) => {
        const matchCount = keywords.filter(keyword => 
          words.some(word => word.includes(keyword))
        ).length;
        
        if (matchCount > 0) {
          identifiedGoals.push(`${category} improvement`);
          
          // Generate actionable steps based on category
          switch (category) {
            case 'fitness':
              actionableSteps.push('Schedule daily 30-minute workout');
              actionableSteps.push('Track weekly progress measurements');
              calendarSuggestions.push({
                task: 'Morning workout',
                time: '07:00',
                recurring: true,
                priority: 'high'
              });
              break;
            case 'learning':
              actionableSteps.push('Set aside 1 hour daily for reading');
              actionableSteps.push('Join online course or workshop');
              calendarSuggestions.push({
                task: 'Learning session',
                time: '19:00',
                recurring: true,
                priority: 'medium'
              });
              break;
            case 'mindfulness':
              actionableSteps.push('Practice 10-minute daily meditation');
              actionableSteps.push('Keep gratitude journal');
              calendarSuggestions.push({
                task: 'Meditation practice',
                time: '06:30',
                recurring: true,
                priority: 'high'
              });
              break;
          }
        }
      });

      return {
        identifiedGoals: identifiedGoals.slice(0, 3),
        actionableSteps: actionableSteps.slice(0, 5),
        calendarSuggestions: calendarSuggestions.slice(0, 2),
        progressMetrics: identifiedGoals.map(goal => ({
          goalId: goal.replace(/\s+/g, '-').toLowerCase(),
          progressValue: Math.random() * 20 + 5, // Mock progress
          unit: 'percent'
        }))
      };

      // Actual implementation with OpenAI would look like:
      /*
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Analyze the journal entry and extract goals, actionable steps, and calendar suggestions. Return structured JSON."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      });
      return JSON.parse(completion.choices[0].message.content);
      */

    } catch (error) {
      console.error('Goal Analysis Error:', error);
      throw new Error('Goal analysis failed');
    }
  }
}

// Positive Reinforcement System
class ReinforcementSystem {
  static async generateInsights(userId, entries, goals) {
    try {
      const recentEntries = entries.slice(0, 7); // Last 7 entries
      const positiveEntries = recentEntries.filter(e => e.sentiment?.overall === 'positive');
      const streak = this.calculatePositiveStreak(entries);
      
      const insights = [];
      
      // Positive trend detection
      if (positiveEntries.length >= 4) {
        insights.push({
          type: 'positive_reinforcement',
          title: '🌟 Great Progress!',
          message: `You've had ${positiveEntries.length} positive journal entries this week. Your optimistic outlook is helping you achieve your goals!`,
          priority: 'high'
        });
      }
      
      // Goal progress celebration
      const progressingGoals = goals.filter(g => g.progress?.current > 50);
      if (progressingGoals.length > 0) {
        insights.push({
          type: 'achievement',
          title: '🎯 Goal Achievement',
          message: `Amazing! You're making great progress on ${progressingGoals.length} of your goals. Keep up the momentum!`,
          priority: 'medium'
        });
      }
      
      // Consistency reward
      if (streak >= 7) {
        insights.push({
          type: 'positive_reinforcement',
          title: '🔥 Journal Streak!',
          message: `Incredible! You've maintained a positive journaling streak for ${streak} days. This consistency is building lasting positive habits!`,
          priority: 'high'
        });
      }
      
      return insights;
    } catch (error) {
      console.error('Insight Generation Error:', error);
      return [];
    }
  }
  
  static calculatePositiveStreak(entries) {
    let streak = 0;
    for (const entry of entries) {
      if (entry.sentiment?.overall === 'positive') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
  
  static async scheduleNotifications(userId, insights) {
    try {
      const notifications = insights.map(insight => ({
        userId,
        type: insight.type,
        title: insight.title,
        message: insight.message,
        scheduledFor: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000), // Random time within 24 hours
        triggerData: {
          sentimentThreshold: 0.7,
          streakCount: this.calculatePositiveStreak(entries)
        }
      }));
      
      await Notification.insertMany(notifications);
      return notifications;
    } catch (error) {
      console.error('Notification Scheduling Error:', error);
      return [];
    }
  }
}

// AUTHENTICATION ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    user.lastActive = new Date();
    await user.save();
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// JOURNAL ENTRY ROUTES
app.post('/api/entries', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const { type = 'video', textContent, deviceInfo, location } = req.body;
    
    // Create initial entry
    const entry = new Entry({
      userId: req.user.id,
      type,
      textContent,
      processing: { status: 'pending' },
      metadata: {
        device: deviceInfo,
        location: location,
        fileSize: req.files?.video?.[0]?.size || req.files?.audio?.[0]?.size || 0
      }
    });

    // Handle file uploads
    if (req.files?.video) {
      entry.videoPath = req.files.video[0].path;
      entry.metadata.duration = req.body.duration || 0;
    }
    if (req.files?.audio) {
      entry.audioPath = req.files.audio[0].path;
      entry.metadata.duration = req.body.duration || 0;
    }

    await entry.save();

    // Start AI processing pipeline (async)
    processEntryAsync(entry.id);

    res.status(201).json({
      success: true,
      data: entry,
      message: 'Entry created successfully. AI processing started.'
    });

  } catch (error) {
    console.error('Entry Creation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create entry'
    });
  }
});

// Async processing function
async function processEntryAsync(entryId) {
  try {
    const entry = await Entry.findOne({ id: entryId });
    if (!entry) return;

    entry.processing.status = 'processing';
    await entry.save();

    const startTime = Date.now();
    let transcript = entry.textContent || '';

    // Step 1: Speech-to-Text (if video/audio)
    if (entry.videoPath || entry.audioPath) {
      const audioPath = entry.audioPath || entry.videoPath;
      const sttResult = await AIService.speechToText(audioPath);
      transcript = sttResult.transcript;
      entry.transcript = transcript;
      entry.processing.sttModel = sttResult.model;
    }

    // Step 2: Sentiment Analysis
    const sentimentResult = await AIService.analyzeSentiment(transcript);
    entry.sentiment = sentimentResult;
    entry.processing.sentimentModel = 'custom-sentiment-v1';

    // Step 3: Goal Analysis
    const userGoals = await Goal.find({ userId: entry.userId, status: 'active' });
    const goalResult = await AIService.analyzeGoals(transcript, userGoals);
    entry.goalAnalysis = goalResult;
    entry.processing.goalModel = 'custom-goal-llm-v1';

    // Update metadata
    entry.metadata.wordCount = transcript.split(/\s+/).length;
    entry.metadata.readingTime = Math.ceil(entry.metadata.wordCount / 200);
    entry.processing.status = 'completed';
    entry.processing.processingTime = Date.now() - startTime;

    await entry.save();

    // Step 4: Update related goals
    await updateGoalProgress(entry.userId, goalResult);

    // Step 5: Generate positive reinforcement
    const allEntries = await Entry.find({ userId: entry.userId }).sort({ timestamp: -1 });
    const insights = await ReinforcementSystem.generateInsights(entry.userId, allEntries, userGoals);
    await ReinforcementSystem.scheduleNotifications(entry.userId, insights);

  } catch (error) {
    console.error('Processing Error:', error);
    await Entry.updateOne(
      { id: entryId },
      { 
        $set: { 
          'processing.status': 'failed',
          'processing.errorMessage': error.message
        }
      }
    );
  }
}

async function updateGoalProgress(userId, goalAnalysis) {
  try {
    for (const identifiedGoal of goalAnalysis.identifiedGoals) {
      let goal = await Goal.findOne({ 
        userId, 
        title: { $regex: identifiedGoal, $options: 'i' },
        status: 'active'
      });

      if (!goal) {
        // Create new goal
        goal = new Goal({
          userId,
          title: identifiedGoal,
          category: 'Personal',
          progress: { current: 5, target: 100 },
          timeline: {
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
          }
        });
      } else {
        // Update existing goal
        goal.mentionCount += 1;
        goal.progress.current = Math.min(goal.progress.target, goal.progress.current + 2);
        goal.sentimentTrend.push({
          date: new Date(),
          sentiment: Math.random() * 2 + 3 // Mock sentiment score
        });
      }

      goal.updatedAt = new Date();
      await goal.save();
    }
  } catch (error) {
    console.error('Goal Update Error:', error);
  }
}

app.get('/api/entries', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { userId: req.user.id };
    if (type) query.type = type;
    if (status) query['processing.status'] = status;
    
    const entries = await Entry.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Entry.countDocuments(query);
    
    res.json({
      success: true,
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Fetch Entries Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch entries'
    });
  }
});

app.get('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await Entry.findOne({ 
      id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    res.json({
      success: true,
      data: entry
    });
    
  } catch (error) {
    console.error('Fetch Entry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch entry'
    });
  }
});

app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await Entry.findOne({ 
      id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    // Clean up files
    if (entry.videoPath && fs.existsSync(entry.videoPath)) {
      fs.unlinkSync(entry.videoPath);
    }
    if (entry.audioPath && fs.existsSync(entry.audioPath)) {
      fs.unlinkSync(entry.audioPath);
    }
    
    await Entry.deleteOne({ id: req.params.id });
    
    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete Entry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete entry'
    });
  }
});

// GOALS ROUTES
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    
    const goals = await Goal.find({ 
      userId: req.user.id,
      ...(status && { status })
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: goals
    });
    
  } catch (error) {
    console.error('Fetch Goals Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch goals'
    });
  }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, target, unit, targetDate } = req.body;
    
    if (!title || !category || !target) {
      return res.status(400).json({
        success: false,
        error: 'Title, category, and target are required'
      });
    }
    
    const goal = new Goal({
      userId: req.user.id,
      title,
      description,
      category,
      progress: { current: 0, target, unit: unit || 'percent' },
      timeline: {
        targetDate: targetDate ? new Date(targetDate) : null
      }
    });
    
    await goal.save();
    
    res.status(201).json({
      success: true,
      data: goal,
      message: 'Goal created successfully'
    });
    
  } catch (error) {
    console.error('Create Goal Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create goal'
    });
  }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, progress, status, targetDate } = req.body;
    
    const goal = await Goal.findOne({ 
      id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    // Update fields
    if (title) goal.title = title;
    if (description) goal.description = description;
    if (category) goal.category = category;
    if (progress) goal.progress = { ...goal.progress, ...progress };
    if (status) goal.status = status;
    if (targetDate) goal.timeline.targetDate = new Date(targetDate);
    
    goal.updatedAt = new Date();
    await goal.save();
    
    res.json({
      success: true,
      data: goal,
      message: 'Goal updated successfully'
    });
    
  } catch (error) {
    console.error('Update Goal Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update goal'
    });
  }
});

// ANALYTICS ROUTES
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    let startDate = new Date();
    if (timeframe === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (timeframe === '90d') {
      startDate.setDate(startDate.getDate() - 90);
    } else if (timeframe === '1y') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    // Get entries within timeframe
    const entries = await Entry.find({
      userId: req.user.id,
      timestamp: { $gte: startDate },
      'processing.status': 'completed'
    }).sort({ timestamp: 1 });
    
    // Get goals
    const goals = await Goal.find({ userId: req.user.id });
    
    // Calculate mood trends
    const dailyMoods = {};
    entries.forEach(entry => {
      const date = entry.timestamp.toISOString().split('T')[0];
      if (!dailyMoods[date]) {
        dailyMoods[date] = {
          date,
          moods: [],
          energyLevels: [],
          entryCount: 0
        };
      }
      dailyMoods[date].moods.push(entry.sentiment?.moodScore || 5);
      dailyMoods[date].energyLevels.push(Math.random() * 4 + 3); // Mock energy data
      dailyMoods[date].entryCount++;
    });
    
    const moodTrends = Object.values(dailyMoods).map(day => ({
      date: day.date,
      mood: day.moods.reduce((a, b) => a + b, 0) / day.moods.length,
      energy: day.energyLevels.reduce((a, b) => a + b, 0) / day.energyLevels.length,
      confidence: Math.random() * 2 + 4, // Mock confidence data
      entries: day.entryCount
    }));
    
    // Sentiment distribution
    const sentimentCounts = {
      positive: entries.filter(e => e.sentiment?.overall === 'positive').length,
      neutral: entries.filter(e => e.sentiment?.overall === 'neutral').length,
      negative: entries.filter(e => e.sentiment?.overall === 'negative').length
    };
    
    const sentimentDistribution = [
      { name: 'Positive', value: sentimentCounts.positive, color: '#10B981' },
      { name: 'Neutral', value: sentimentCounts.neutral, color: '#6B7280' },
      { name: 'Negative', value: sentimentCounts.negative, color: '#EF4444' }
    ];
    
    // Goal progress
    const goalProgress = goals.map(goal => ({
      goal: goal.title,
      progress: goal.progress.current,
      target: goal.progress.target,
      category: goal.category
    }));
    
    // Daily summaries
    const dailySummaries = entries.slice(-7).map(entry => ({
      date: entry.timestamp.toDateString(),
      primaryEmotion: Object.entries(entry.sentiment?.emotions || {})
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral',
      keyWords: entry.sentiment?.keyPhrases?.slice(0, 3) || [],
      goalMentions: entry.goalAnalysis?.identifiedGoals?.length || 0,
      sentimentScore: entry.sentiment?.moodScore || 5
    }));
    
    // Emotion histogram data
    const emotionHistogram = {};
    entries.forEach(entry => {
      Object.entries(entry.sentiment?.emotions || {}).forEach(([emotion, score]) => {
        if (!emotionHistogram[emotion]) emotionHistogram[emotion] = [];
        emotionHistogram[emotion].push(score);
      });
    });
    
    const emotionHistogramData = Object.entries(emotionHistogram).map(([emotion, scores]) => ({
      emotion,
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      frequency: scores.length
    }));
    
    // Weekly stats
    const weeklyStats = {
      totalEntries: entries.length,
      avgMood: entries.reduce((sum, e) => sum + (e.sentiment?.moodScore || 5), 0) / entries.length || 5,
      avgConfidence: Math.random() * 2 + 6, // Mock confidence average
      totalWords: entries.reduce((sum, e) => sum + (e.metadata?.wordCount || 0), 0),
      activeGoals: goals.filter(g => g.status === 'active').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      positiveStreak: ReinforcementSystem.calculatePositiveStreak(entries)
    };
    
    res.json({
      success: true,
      data: {
        moodTrends,
        sentimentDistribution,
        goalProgress,
        dailySummaries,
        emotionHistogram: emotionHistogramData,
        weeklyStats,
        timeframe
      }
    });
    
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// NOTIFICATIONS ROUTES
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { status, type, limit = 20 } = req.query;
    
    let query = { userId: req.user.id };
    if (status) query.status = status;
    if (type) query.type = type;
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: notifications
    });
    
  } catch (error) {
    console.error('Fetch Notifications Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      id: req.params.id,
      userId: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    notification.status = 'read';
    notification.readAt = new Date();
    await notification.save();
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
    
  } catch (error) {
    console.error('Update Notification Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification'
    });
  }
});

// CALENDAR INTEGRATION ROUTES
app.get('/api/calendar/events', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get user's goals with calendar suggestions
    const goals = await Goal.find({ userId: req.user.id, status: 'active' });
    const entries = await Entry.find({
      userId: req.user.id,
      'processing.status': 'completed',
      ...(startDate && endDate && {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
    });
    
    const calendarEvents = [];
    
    // Extract calendar suggestions from entries
    entries.forEach(entry => {
      if (entry.goalAnalysis?.calendarSuggestions) {
        entry.goalAnalysis.calendarSuggestions.forEach(suggestion => {
          calendarEvents.push({
            id: `entry-${entry.id}-${Date.now()}`,
            title: suggestion.task,
            scheduledTime: suggestion.time,
            recurring: suggestion.recurring,
            priority: suggestion.priority,
            source: 'ai_suggestion',
            entryId: entry.id
          });
        });
      }
    });
    
    // Add existing calendar events from goals
    goals.forEach(goal => {
      goal.calendarEvents?.forEach(event => {
        calendarEvents.push({
          id: event.eventId,
          title: event.title,
          scheduledTime: event.scheduledTime,
          platform: event.platform,
          source: 'manual',
          goalId: goal.id
        });
      });
    });
    
    res.json({
      success: true,
      data: calendarEvents.slice(0, 50) // Limit results
    });
    
  } catch (error) {
    console.error('Calendar Events Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calendar events'
    });
  }
});

// SEARCH ROUTES
app.get('/api/search', authenticateToken, async (req, res) => {
  try {
    const { 
      q, 
      sentiment, 
      type, 
      startDate, 
      endDate,
      goalCategory,
      limit = 20 
    } = req.query;
    
    let query = { userId: req.user.id };
    
    // Text search
    if (q) {
      query.$or = [
        { transcript: { $regex: q, $options: 'i' } },
        { textContent: { $regex: q, $options: 'i' } },
        { 'sentiment.keyPhrases': { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    // Filter by sentiment
    if (sentiment) {
      query['sentiment.overall'] = sentiment;
    }
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const entries = await Entry.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    // Also search in goals if goalCategory is specified
    let goals = [];
    if (goalCategory) {
      goals = await Goal.find({
        userId: req.user.id,
        category: { $regex: goalCategory, $options: 'i' }
      }).limit(10);
    }
    
    res.json({
      success: true,
      data: {
        entries,
        goals,
        total: entries.length + goals.length
      },
      query: req.query
    });
    
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search'
    });
  }
});

// EXPORT ROUTES
app.get('/api/export/:format', authenticateToken, async (req, res) => {
  try {
    const { format } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user.id };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const entries = await Entry.find(query).sort({ timestamp: -1 });
    const goals = await Goal.find({ userId: req.user.id });
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=superjournal-export.json');
      res.json({
        exportDate: new Date().toISOString(),
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        },
        entries,
        goals,
        summary: {
          totalEntries: entries.length,
          totalGoals: goals.length,
          dateRange: { startDate, endDate }
        }
      });
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=superjournal-export.csv');
      
      const csvHeader = 'ID,Date,Type,Transcript,Sentiment,Mood Score,Goals Identified,Key Phrases,Processing Status\n';
      const csvRows = entries.map(entry => 
        `"${entry.id}","${entry.timestamp}","${entry.type}","${(entry.transcript || '').replace(/"/g, '""')}","${entry.sentiment?.overall || ''}","${entry.sentiment?.moodScore || ''}","${(entry.goalAnalysis?.identifiedGoals || []).join('; ')}","${(entry.sentiment?.keyPhrases || []).join('; ')}","${entry.processing?.status || ''}"`
      ).join('\n');
      
      res.send(csvHeader + csvRows);
    } else {
      res.status(400).json({
        success: false,
        error: 'Unsupported format. Use json or csv.'
      });
    }
    
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export data'
    });
  }
});

// USER PREFERENCES ROUTES
app.get('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch preferences'
    });
  }
});

app.put('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const { journalFrequency, notificationsEnabled, reminderTime, dataRetention } = req.body;
    
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (journalFrequency) user.preferences.journalFrequency = journalFrequency;
    if (typeof notificationsEnabled === 'boolean') user.preferences.notificationsEnabled = notificationsEnabled;
    if (reminderTime) user.preferences.reminderTime = reminderTime;
    if (dataRetention) user.preferences.dataRetention = dataRetention;
    
    await user.save();
    
    res.json({
      success: true,
      data: user.preferences,
      message: 'Preferences updated successfully'
    });
    
  } catch (error) {
    console.error('Update Preferences Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

// HEALTH CHECK & STATUS
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SuperJournal API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    features: [
      'Video/Audio Processing',
      'AI Sentiment Analysis',
      'Goal Tracking',
      'Positive Reinforcement',
      'Data Visualization',
      'Calendar Integration'
    ]
  });
});

app.get('/api/processing-status/:entryId', authenticateToken, async (req, res) => {
  try {
    const entry = await Entry.findOne({ 
      id: req.params.entryId, 
      userId: req.user.id 
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        status: entry.processing.status,
        processingTime: entry.processing.processingTime,
        errorMessage: entry.processing.errorMessage,
        models: {
          stt: entry.processing.sttModel,
          sentiment: entry.processing.sentimentModel,
          goal: entry.processing.goalModel
        }
      }
    });
    
  } catch (error) {
    console.error('Processing Status Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch processing status'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 100MB.'
      });
    }
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SuperJournal API server running on port ${PORT}`);
  console.log(`📊 MongoDB connected to ${MONGODB_URI}`);
  console.log(`🎯 API endpoints:`);
  console.log(`   - Auth: /api/auth/register, /api/auth/login`);
  console.log(`   - Entries: /api/entries (POST/GET/DELETE)`);
  console.log(`   - Analytics: /api/analytics`);
  console.log(`   - Goals: /api/goals`);
  console.log(`   - Search: /api/search`);
  console.log(`   - Export: /api/export/json or /api/export/csv`);
  console.log(`   - Health: /api/health`);
  console.log(`🤖 AI Integration points ready for:`);
  console.log(`   - STT: AIService.speechToText()`);
  console.log(`   - Sentiment: AIService.analyzeSentiment()`);
  console.log(`   - Goals: AIService.analyzeGoals()`);
});

module.exports = app;
