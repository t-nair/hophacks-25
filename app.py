from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from bson import ObjectId
from datetime import datetime
import os

# MongoDB setup
from pymongo import MongoClient

# ENVIRONMENT VARIABLES (set as needed)
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "./uploads")

client = MongoClient(MONGO_URI)
db = client.superjournal

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

# Helper functions

def analyze_sentiment(transcript):
    # --- Placeholder: Implement with HuggingFace, OpenAI, etc. ---
    # Return structure similar to frontend expectation!
    return {
        "overall": "positive",
        "confidence": 0.85,
        "emotions": {"joy": 0.7, "satisfaction": 0.6, "calm": 0.5},
        "keyPhrases": ["productive", "energized", "progress"]
    }

def analyze_goals(transcript):
    # --- Placeholder: Implement your custom LLM/ML model here ---
    return {
        "identifiedGoals": ["fitness improvement", "project completion"],
        "actionableSteps": [
            "Continue daily workout routine",
            "Set project milestones"
        ],
        "calendarSuggestions": [
            {"task": "Workout", "time": "07:00", "recurring": True},
            {"task": "Project review", "time": "18:00", "recurring": False}
        ]
    }

def transcript_from_video(file_path):
    # --- Placeholder: hook into Google STT / Whisper/etc. here ---
    # Should return transcript string.
    return "Today was really productive. I managed to complete my workout routine and felt energized throughout the day..."

# ROUTES

@app.route('/api/journal', methods=['POST'])
def create_journal_entry():
    # Handles video upload and initiates processing
    user_id = request.form.get('user_id')
    title = request.form.get('title')
    text = request.form.get('text')
    video_file = request.files.get('video')

    # Save video file if exists
    video_url = None
    transcript = text
    if video_file:
        fname = secure_filename(video_file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        video_file.save(save_path)
        video_url = f"/uploads/{fname}"
        transcript = transcript_from_video(save_path)

    # Sentiment & goal analysis
    sentiment = analyze_sentiment(transcript)
    goals = analyze_goals(transcript)

    journal_doc = {
        "user_id": user_id,
        "title": title,
        "video_url": video_url,
        "transcript": transcript,
        "sentiment": sentiment,
        "goals": goals,
        "timestamp": datetime.utcnow(),
        "processed": True
    }
    db.journals.insert_one(journal_doc)
    return jsonify({"success": True, "entry": journal_doc})

@app.route('/api/journal', methods=['GET'])
def get_journal_entries():
    user_id = request.args.get('user_id')
    entries = list(db.journals.find({"user_id": user_id}).sort("timestamp", -1))
    for e in entries:
        e['_id'] = str(e['_id'])
    return jsonify(entries)

@app.route('/api/analytics', methods=['GET'])
def analytics():
    user_id = request.args.get('user_id')
    timeframe = int(request.args.get('days', 30))

    # Data aggregation for mood trends
    cursor = db.journals.find({"user_id": user_id}).sort("timestamp", -1).limit(timeframe)
    moodTrends = []
    sentimentDistribution = {"positive": 0, "neutral": 0, "negative": 0}
    goalProgress = []
    dailySummaries = []

    # Aggregate data
    for entry in cursor:
        s = entry.get('sentiment', {})
        moodTrends.append({
            "date": entry["timestamp"].strftime("%Y-%m-%d"),
            "mood": s.get("emotions", {}).get("joy", 5.0),  # Example mapping
            "energy": s.get("emotions", {}).get("satisfaction", 5.0),
            "confidence": s.get("emotions", {}).get("calm", 5.0),
            "entries": 1
        })
        sentimentDistribution[s.get("overall", "neutral")] += 1
        dailySummaries.append({
            "date": entry["timestamp"].strftime("%a, %b %d"),
            "primaryEmotion": max(s.get('emotions', {}), key=lambda k: s.get('emotions', {})[k]),
            "keyWords": s.get('keyPhrases', []),
            "goalMentions": len(entry.get('goals', {}).get('identifiedGoals', [])),
            "sentimentScore": s.get('confidence', 5.0)
        })

    # Goal Progress aggregation (for simplicity just random + best effort here)
    raw_goals = db.goals.find({"user_id": user_id})
    goalProgress = []
    for goal in raw_goals:
        goalProgress.append({
            "goal": goal.get("title"),
            "progress": goal.get("progress", 60),
            "target": goal.get("target", 100),
            "category": goal.get("category", "personal"),
        })
    # In reality, aggregate this with journal-linked goals.

    # Pie chart mapping frontend
    pieData = [
        {"name": "Positive", "value": sentimentDistribution["positive"], "color": "#10B981"},
        {"name": "Neutral", "value": sentimentDistribution["neutral"], "color": "#6B7280"},
        {"name": "Negative", "value": sentimentDistribution["negative"], "color": "#EF4444"},
    ]

    resp = {
        "moodTrends": moodTrends,
        "sentimentDistribution": pieData,
        "goalProgress": goalProgress,
        "dailySummaries": dailySummaries
    }
    return jsonify(resp)

@app.route('/api/goals', methods=['GET', 'POST'])
def goals():
    user_id = request.args.get('user_id')
    if request.method == 'POST':
        data = request.get_json()
        goal_doc = {
            "user_id": user_id,
            "title": data.get("title"),
            "progress": data.get("progress", 0),
            "target": data.get("target", 100),
            "category": data.get("category", "personal"),
            "createdAt": datetime.utcnow()
        }
        db.goals.insert_one(goal_doc)
        return jsonify({"success": True, "goal": goal_doc})

    # GET
    goals = list(db.goals.find({"user_id": user_id}).sort("createdAt", -1))
    for g in goals:
        g['_id'] = str(g['_id'])
    return jsonify(goals)

@app.route('/api/notifications', methods=['GET'])
def notifications():
    # Placeholder for positive reinforcement notifications
    user_id = request.args.get('user_id')
    # In reality, associate notifications by user & timing
    notifications = [
        {
            "id": "1",
            "type": "positive",
            "message": "Great energy today! Your positive outlook is helping you progress toward your goals.",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]
    return jsonify(notifications)

# User endpoints (minimal, expand as needed)
@app.route('/api/user/register', methods=['POST'])
def register_user():
    data = request.get_json()
    user_doc = {
        "name": data.get("name"),
        "email": data.get("email"),
        "preferences": data.get("preferences", {}),
        "createdAt": datetime.utcnow()
    }
    db.users.insert_one(user_doc)
    return jsonify({"success": True, "user": user_doc})

@app.route('/api/user/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get("email")
    user = db.users.find_one({"email": email})
    if user:
        # Add authentication logic (password check/JWT etc.)
        return jsonify({"success": True, "user": {"id": str(user["_id"]), "name": user["name"], "preferences": user.get("preferences", {})}})
    return jsonify({"success": False}), 401

# Serve uploaded videos (development only)
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return app.send_from_directory(app.config['UPLOAD_FOLDER'], filename)



@app.route('/api/analytics/<user_id>', methods=['GET'])
def get_analytics(user_id):
    # Fetch data from DB and compute analytics
    # For now return mock structure to match frontend
    data = {
        "moodTrends": [],  # fill with DB stats
        "sentimentDistribution": [
            {"name": "Positive", "value": 65, "color": "#10B981"},
            {"name": "Neutral", "value": 25, "color": "#6B7280"},
            {"name": "Negative", "value": 10, "color": "#EF4444"}
        ],
        "goalProgress": [],
        "dailySummaries": []
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
