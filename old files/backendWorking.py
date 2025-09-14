import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

TEXT_FILE = "entries.json"
INSIGHTS_FILE = "insights.json"
GOALS_FILE = os.path.join("data", "goals.json")
def load_goals():
    if os.path.exists(GOALS_FILE):
        with open(GOALS_FILE, "r") as f:
            return json.load(f)
    return []

def save_goals(goals):
    with open(GOALS_FILE, "w") as f:
        json.dump(goals, f)
# --- GOALS ENDPOINTS ---
@app.route("/goals", methods=["GET"])
def get_goals():
    return jsonify(load_goals())

@app.route("/add_goal", methods=["POST"])
def add_goal():
    data = request.json
    goal = data.get("goal")
    category = data.get("category", "other")
    target = data.get("target", 100)
    progress = data.get("progress", 0)
    if not goal:
        return jsonify({"error": "No goal provided"}), 400
    goals = load_goals()
    goals.append({
        "goal": goal,
        "category": category,
        "target": target,
        "progress": progress,
        "timestamp": datetime.now().isoformat()
    })
    save_goals(goals)
    return jsonify({"message": "Goal saved", "goal": goal})

def load_entries():
    if os.path.exists(TEXT_FILE):
        with open(TEXT_FILE, "r") as f:
            return json.load(f)
    return []

def save_entries(entries):
    with open(TEXT_FILE, "w") as f:
        json.dump(entries, f)

def save_insights(insights):
    with open(INSIGHTS_FILE, "w") as f:
        json.dump(insights, f)

text_entries = load_entries()

# Set your Gemini API key here
GEMINI_API_KEY = "AIzaSyAEZXzXxt1SR5Xa1sTLJwmMoRRgYYd9jos"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

@app.route("/submit_text", methods=["POST"])
def submit_text():
    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Always reload entries from file to avoid losing previous entries
    entries = load_entries()
    entry = {"text": text, "timestamp": datetime.now().isoformat()}
    entries.append(entry)

    # Generate highlights using Gemini for the new entry
    try:
        prompt = (
            "You are a compassionate therapist and reflective coach. "
            "Read the following journal entry and respond with:\n"
            "Summary: (A ~50-word empathetic summary capturing the writer’s emotions, mindset, and underlying themes.)\n"
            "Advice: (One to two gentle, constructive pieces of advice tailored to their situation.)\n"
            "MotivationalWords: (A comma-separated list of 3-5 motivational words or phrases relevant to the writer's situation.)\n"
            "\nKeep the tone warm, supportive, and practical. "
            "Do not repeat the journal entry verbatim—summarize it in your own words.\n"
            f"Journal entry:\n{text}"
        )
        response = model.generate_content(prompt)
        highlight = response.text
        entry["highlight"] = highlight
    except Exception as e:
        entry["highlight"] = f"Error generating highlight: {str(e)}"

    save_entries(entries)

    # Generate overall insights for all entries
    try:
        all_text = "\n".join([e["text"] for e in entries])
        prompt = f"Provide key insights and a summary for the following journal entries:\n{all_text}"
        response = model.generate_content(prompt)
        insights = response.text
        save_insights({"insights": insights, "timestamp": datetime.now().isoformat()})
    except Exception as e:
        save_insights({"error": str(e), "timestamp": datetime.now().isoformat()})

    return jsonify({"message": "Text entry saved", "entry": entry})

@app.route("/insights", methods=["GET"])
def get_insights():
    if os.path.exists(INSIGHTS_FILE):
        with open(INSIGHTS_FILE, "r") as f:
            return jsonify(json.load(f))
    return jsonify({"error": "No insights found."}), 404


# Video upload endpoint
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload_video", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
    video = request.files["video"]
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{video.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    video.save(path)

    # Add video entry to entries.json
    entries = load_entries()
    entry = {
        "type": "video",
        "filename": filename,
        "timestamp": datetime.now().isoformat()
    }
    entries.append(entry)
    save_entries(entries)

    return jsonify({"message": "Video uploaded successfully", "filename": filename})

# Entries endpoint
@app.route("/entries", methods=["GET"])
def get_entries():
    entries = load_entries()
    # Load latest overall insight
    overall_highlight = None
    if os.path.exists(INSIGHTS_FILE):
        with open(INSIGHTS_FILE, "r") as f:
            data = json.load(f)
            overall_highlight = data.get("insights")
    # Attach highlight to each entry
    for entry in entries:
        if not entry.get("highlight"):
            entry["highlight"] = overall_highlight or "No highlight available."
    # Sort entries from most recent to least recent
    entries_sorted = sorted(entries, key=lambda e: e["timestamp"], reverse=True)
    return jsonify(entries_sorted)

# Serve video files
@app.route("/videos/<filename>")
def get_video(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)
