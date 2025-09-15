# sine 🧠🎶  
*Find your rhythm. Reflect, record, and grow.*  

[![sine Intro Video](<img width="776" height="406" alt="sinelogo" src="https://github.com/user-attachments/assets/1bbf36c8-7453-422b-9688-9e4f62be46df" />
)](https://www.youtube.com/watch?v=LHiZnb56LXI "sine Intro Video - Click to watch!")

## 🌟 Overview  
**sine** is a reflective journaling and analytics platform that helps users track their mental, emotional, and personal growth. Through text and video entries, real-time sentiment analysis, and AI-powered highlights, sine transforms raw reflections into actionable insights and empowering feedback.  

## ✨ Key Features  
- **📓 Journaling Modes**  
  - Text entries with instant Gemini-generated highlights (summary, advice, motivational words).  
  - Video entries with seamless recording and upload support.  

- **📊 Analytics Dashboard**  
  - Mood, stress, and energy trends (7-day and detailed views).  
  - Sentiment distribution visualized with interactive charts.  
  - Daily insights summarizing primary emotions, keywords, and goal mentions.  

- **🎯 Goal Tracking**  
  - Add and categorize personal goals (health, work, learning, wellness, other).  
  - Progress bars and color-coded status indicators.  
  - Persistent storage via backend JSON database.  

- **🤖 AI-Powered Highlights**  
  - Uses Google Gemini to generate empathetic summaries and tailored advice for each entry.  
  - Generates motivational keywords and overall insights across entries.  

- **📈 Visualizations**  
  - Built with Recharts (line, bar, area, and pie charts).  
  - Clean, responsive UI styled with modern gradients and animations.  

## 🛠️ Tech Stack  
- **Frontend**: React (Hooks + Recharts + Lucide icons), Axios for API calls  
- **Backend**: Flask + Flask-CORS (Python)  
- **AI**: Google Gemini API for generating highlights & insights  
- **Storage**: JSON files (`entries.json`, `goals.json`, `insights.json`) for lightweight persistence  
- **Video Handling**: HTML5 MediaRecorder API + Flask static serving  

## 🚀 Getting Started  

### Prerequisites  
- Node.js & npm  
- Python 3.8+  
- Google Gemini API key  

### Installation  

1. **Clone Repo**  
   ```bash
   git clone https://github.com/yourusername/sine.git
   cd sine

### Backend Setup

```bash
    cd backend
    pip install -r requirements.txt
    python backend1.py
```
### Frontend Setup

```bash
  cd frontend
  npm install
  npm start
```
Access app at http://localhost:3000 with backend running on http://localhost:5000.

## 🎥 Demo Flow
* Land on sine splash screen → click Enter Dashboard.

* Record or type a journal entry.

* View AI-powered highlights and motivational insights.

* Track sentiment, emotions, and goals over time.

## 🏗️ Architecture
<img width="656" height="497" alt="sine_architecture" src="https://github.com/user-attachments/assets/b41cd89b-c10b-44aa-88f4-a93bc257a37b" />

## 🧠 Highlighted Features
Tackles mental health and productivity with empathy and actionable data.

Provides a seamless journaling experience that blends text, video, and analytics.

Demonstrates strong AI + UX integration with a working full-stack prototype.
