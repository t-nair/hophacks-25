import os
video_path














"""import subprocess
import os
import re

MODEL = 'medium'
WHISPER_DIR = '/Users/ujjwalkaur/Documents/HopHacks/whisper.cpp'

audio_path = os.path.abspath('whisper.cpp/HopHacks_1.wav')

result = subprocess.run(
    ['./build/bin/whisper-cli',
        '-m', f'./models/ggml-{MODEL}.en.bin',
        '-f', audio_path],
    cwd=WHISPER_DIR,
    capture_output=True,
    text=True
)

lines = result.stdout.splitlines()
clean_lines = [re.sub(r'^\[.*?\]\s*', '', line).strip() for line in lines if line.strip()]
transcription = ' '.join(clean_lines)

print(transcription)"""
