import subprocess
import os
import re
from gemini import get_gemini_response

feelings = ["overwhelmed", "sad", "stressed"]
sleep = 6
j_habit = "not journaled"
business = "very"
advice = "does"
purpose = "to feel better about life"
journal_text = "I am not having a good day. I am so tired. I have to finish this project or everything is over. I can't take this anymore."

MODEL = 'medium'
WHISPER_DIR = '/Users/ujjwalkaur/Documents/hophacks-25/whisper.cpp'

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

    response = get_gemini_response(journal_text, feelings, sleep, j_habit, business, advice, purpose)

    return f"Transcription: {response}"

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