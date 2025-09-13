import subprocess
import os
import re
import tempfile

MODEL = 'medium'
WHISPER_DIR = '/Users/ujjwalkaur/Documents/hophacks-25/whisper.cpp'
AUDIO_DIR = os.path.join(WHISPER_DIR, 'audio')

def transcribe(audio_path, whisper_dir=WHISPER_DIR):
    """
    Transcribe an audio file using whisper.cpp medium model.
    Supports .wav files. Returns clean text without timestamps.
    """

    audio_path = os.path.abspath(audio_path)

    result = subprocess.run(
        ['./build/bin/whisper-cli',
         '-m', f'./models/ggml-{MODEL}.en.bin',
         '-f', audio_path],
        cwd=whisper_dir,
        capture_output=True,
        text=True
    )

    lines = result.stdout.splitlines()

    clean_lines = [re.sub(r'^\[.*?\]\s*', '', line).strip() for line in lines if line.strip()]
    transcription = ' '.join(clean_lines)

    return transcription

print(transcribe('HopHacks_1.wav'))

def upload_video(video_file):
    """
    Process a video:
      - Extracts audio to whisper.cpp/audio/
      - Takes screenshots at 0s, 5s, 10s
      - Returns transcription and screenshot paths
    """
    video_path = os.path.join('videos', video_file)
    base_name = os.path.splitext(os.path.basename(video_file))[0]

    # Audio output path
    audio_path = os.path.join(AUDIO_DIR, f'{base_name}.wav')
    print('Audio path: ', audio_path)

    #adding a comment
    # Extract audio
    result = subprocess.run([
        'ffmpeg', '-y', '-i', video_path,
        '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', audio_path
    ], capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg audio extraction failed: {result.stderr}")

    # Take screenshots at 0s, 5s, 10s
    screenshots = []
    for t in [0, 5, 10]:
        img_path = os.path.join(f'{base_name}_screenshot_{t}.png')
        subprocess.run([
            'ffmpeg', '-y', '-ss', str(t), '-i', video_path,
            '-frames:v', '1', img_path
        ], capture_output=True)
        screenshots.append(img_path)

    # Transcribe
    transcription = transcribe(audio_path)

    return {
        "transcription": transcription,
        "screenshots": screenshots,
        "audio_path": audio_path
    }

#result = upload_video('sample_hophacks.mp4')
#print(result)

#print(transcribe('sample_hophacks.mp4'))