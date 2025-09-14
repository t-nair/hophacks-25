from flask import Flask, render_template, request, redirect, url_for
import os
import tempfile
import subprocess
import re
from werkzeug.utils import secure_filename
from speech_to_text import extract_audio

UPLOAD_FOLDER = "/Users/ujjwalkaur/Documents/hophacks-25/input/"

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # max 100MB uploads

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/upload', methods=['GET', 'POST'])
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

        #return f"<h2>Journal Entry Text:</h2><p>{journal_text}</p>"
        return render_template("journal.html", journal_text=journal_text)

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
