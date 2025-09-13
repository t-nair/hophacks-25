from flask import Flask, render_template, request, redirect, url_for
import os
import tempfile
import subprocess
import re

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
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    audio_filename = f"{base_name}.wav"
    audio_path = os.path.join(WHISPER_DIR, audio_filename)
    audio_path = os.path.abspath("whisper.cpp/audio/please_work.wav")

    command = [
        "ffmpeg",
        "-i", "input/sample_hophacks.mp4",
        "-vn",
        "-acodec", "pcm_s16le",
        "-y",
        "whisper.cpp/audio/please_work.wav"
    ]

    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        print("FFmpeg failed:", e.stderr.decode())
        raise

    try:
        result, error = transcribe(audio_path)
        transcription = "Transcription was successful: ", transcribe(audio_path)
    except Exception as e:
        transcription = e

    return f"Transcription: {transcription}"

def transcribe(audio_path, whisper_dir=WHISPER_DIR):
    audio_path = "whisper.cpp/audio/please_work.wav"
    result = subprocess.run(
        ['./build/bin/whisper-cli',
         '-m', f'./models/ggml-{MODEL}.en.bin',
         '-f', audio_path],
        cwd=whisper_dir,
        capture_output=True,
        text=True
    )

    lines = result.stdout.splitlines()
    error = result.stderr

    clean_lines = [re.sub(r'^\[.*?\]\s*', '', line).strip() for line in lines if line.strip()]
    transcription = ' '.join(clean_lines)
    return transcription, error


@app.route('/', methods=['GET', 'POST'])
def upload_video():
    if request.method == 'POST':
        if 'video' not in request.files:
            return "No file part", 400

        video_file = request.files['video']

        if video_file.filename == '':
            return "No selected file", 400

        # Save the video to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
            video_file.save(tmp_file.name)
            tmp_file.close()
            temp_path = tmp_file.name

        try:
            # Process the video
            journal_text = extract_audio(temp_path)
        finally:
            # Remove the temporary file
            os.remove(temp_path)

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
