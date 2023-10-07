import os
import sys
from flask import Flask, request, jsonify, send_from_directory
import requests
from dotenv import load_dotenv
import uuid
from datetime import datetime

app = Flask(__name__)
load_dotenv()

CHUNK_SIZE = 1024

# Retrieve environment variables
url = os.environ["ELEVENLABS_URL"]
xi_api_key = os.environ["XI_API_KEY"]

headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": xi_api_key,
}

@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    data = request.get_json()
    text = data.get('text', '')
    
    audio_filename = convert_text_to_audio(text)

    # Return the path to the generated audio
    return jsonify({"audio_path": f"/audio/{audio_filename}"})


def convert_text_to_audio(text):
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.37,
            "similarity_boost": 0.69,
            "style": 0.30,
            "use_speaker_boost": True,
        },
    }

    response = requests.post(url, json=data, headers=headers)
    # Generate a unique filename
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = uuid.uuid4().hex
    audio_filename = f"audio_{timestamp}_{random_str}.mp3"
    with open(audio_filename, "wb") as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)
    
    return audio_filename


@app.route('/audio/<filename>', methods=['GET'])
def serve_audio(filename):
    return send_from_directory('.', filename)


if __name__ == '__main__':
    app.run(debug=True)
