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

# Set your Gemini API key here
GEMINI_API_KEY = "YOUR_API_KEY"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

@app.route("/submit_text", methods=["POST"])
def submit_text():
    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    entries = load_entries()
    entry = {"type": "text", "text": text, "timestamp": datetime.now().isoformat()}

    # Generate highlight
    try:
        prompt = (
            "You are a compassionate therapist and reflective coach. "
            "Read the following journal entry and respond with:\n"
            "Summary: (~50-word empathetic summary)\n"
            "Advice: (1–2 constructive tips)\n"
            "MotivationalWords: (3–5 uplifting words)\n\n"
            f"Journal entry:\n{text}"
        )
        response = model.generate_content(prompt)
        entry["highlight"] = response.text
    except Exception as e:
        entry["highlight"] = f"Error generating highlight: {str(e)}"

    entries.append(entry)
    save_entries(entries)

    # Generate overall insights
    try:
        all_text = "\n".join([e.get("text", "") for e in entries if e["type"] == "text"])
        prompt = f"Provide key insights and a summary for these journal entries:\n{all_text}"
        response = model.generate_content(prompt)
        insights = response.text
        save_insights({"insights": insights, "timestamp": datetime.now().isoformat()})
    except Exception as e:
        save_insights({"error": str(e), "timestamp": datetime.now().isoformat()})

    return jsonify({"message": "Text entry saved", "entry": entry})

# ----------------------------
# VIDEO UPLOADS
# ----------------------------
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

    # Save video entry
    entries = load_entries()
    entry = {
        "type": "video",
        "filename": filename,
        "timestamp": datetime.now().isoformat(),
        "highlight": "Video entry uploaded."
    }
    entries.append(entry)
    save_entries(entries)

    return jsonify({"message": "Video uploaded successfully", "filename": filename})

# ----------------------------
# ENTRIES
# ----------------------------
@app.route("/entries", methods=["GET"])
def get_entries():
    entries = load_entries()
    overall_highlight = None
    if os.path.exists(INSIGHTS_FILE):
        with open(INSIGHTS_FILE, "r") as f:
            data = json.load(f)
            overall_highlight = data.get("insights")

    for entry in entries:
        if not entry.get("highlight"):
            entry["highlight"] = overall_highlight or "No highlight available."

    entries_sorted = sorted(entries, key=lambda e: e["timestamp"], reverse=True)
    return jsonify(entries_sorted)

# Serve video files
@app.route("/videos/<filename>")
def get_video(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)
