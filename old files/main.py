from flask import Flask, render_template, request, redirect, url_for
import os
import tempfile
import subprocess
import re
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "/Users/ujjwalkaur/Documents/hophacks-25/input/"

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # max 100MB uploads
MODEL = 'medium'
WHISPER_DIR = '/Users/ujjwalkaur/Documents/hophacks-25/whisper.cpp'

# Blackbox function placeholder
def extract_audio(video_path):
    """
    Replace this function with actual video-to-text processing.
    video_path: path to the uploaded video file
    Returns: text extracted from the video
    """
    print("Does the video exist? ", os.path.exists(video_path))
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    print('Base name: ', base_name)
    audio_filename = f"audio/{base_name}.wav"
    current_directory = os.getcwd()
    print('Current Directory: ', current_directory)
    audio_path = os.path.join(WHISPER_DIR, audio_filename)
    print('Audio path after first step: ', audio_path)
    print('Does Audio Path exist? ', os.path.exists(audio_path))
    #audio_path = os.path.abspath("whisper.cpp/audio/please_work.wav")
    #print('Audio path after second step: ', audio_path)
    #print('Does Audio Path exist? ', os.path.exists(audio_path))

    command = [
        "ffmpeg",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-y",
        audio_path
    ]

    subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("FFMPEG was succesful!")
    print('Does Audio Path exist? ', os.path.exists(audio_path))

    try:
        result = transcribe(audio_path)
        transcription = "Transcription was successful: ", transcribe(audio_path)
    except Exception as e:
        transcription = e

    return f"Transcription: {transcription}"

def transcribe(audio_path, whisper_dir=WHISPER_DIR):
    result = subprocess.run(
        ['./build/bin/whisper-cli',
         '-m', f'./models/ggml-{MODEL}.en.bin',
         '-f', audio_path],
        cwd=whisper_dir,
        capture_output=True,
        text=True
    )

    lines = result.stdout.splitlines()
    #error = result.stderr

    clean_lines = [re.sub(r'^\[.*?\]\s*', '', line).strip() for line in lines if line.strip()]
    transcription = ' '.join(clean_lines)
    return transcription

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/', methods=['GET', 'POST'])
def upload_video():
    if request.method == 'POST':
        if 'video' not in request.files:
            return "No file part", 400

        video_file = request.files['video']

        if video_file.filename == '':
            return "No selected file", 400
        print('Video file submitted: ', type(video_file))

        video_filename = secure_filename(video_file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, video_filename)
        video_file.save(save_path)

        journal_text = extract_audio(save_path)

        return f"<h2>Journal Entry Text:</h2><p>{journal_text}</p>"

    # GET request: show upload form
    return '''
        <h1>Video Journal Entry</h1>
        <form method="post" enctype="multipart/form-data">
            <label>Upload your video journal:</label><br>
            <input type="file" name="video" accept="video/*" required><br><br>
            <input type="submit" value="Submit">
        </form>
    '''

if __name__ == '__main__':
    app.run(debug=True)
