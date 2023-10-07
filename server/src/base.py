import os
import sys
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import uuid
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv()
base_dir = os.path.dirname(os.path.abspath(__file__))
AUDIO_FOLDER = os.path.join(base_dir, "./audio/output")
CHUNK_SIZE = 1024

# Create the folder if it doesn't exist
if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

# Retrieve environment variables
url = os.environ["ELEVENLABS_URL"]
xi_api_key = os.environ["XI_API_KEY"]

headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": xi_api_key,
}


@app.route("/generate_audio", methods=["POST"])
def generate_audio():
    print("Generating audio...")  # Debug print to confirm the endpoint is hit

    data = request.get_json()
    text = data.get("text", "")

    response = request_audio_conversion(text)

    print(f"Response status code: {response.status_code}")  # Debug print
    print(f"Response headers: {response.headers}")  # Debug print
    print(
        f"First 100 bytes of response: {response.content[:100]}"
    )  # Debug print, just to check content type

    audio_filename = handle_audio_response(response)

    print(f"Audio saved as: {audio_filename}")  # Debug print

    return jsonify({"message": f"Audio saved as {audio_filename}"})


def request_audio_conversion(text):
    data = { #set paramters for the voice AI conversion
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.37,
            "similarity_boost": 0.69,
            "style": 0.30,
            "use_speaker_boost": True,
        },
    }
    return requests.post(url, json=data, headers=headers)


def handle_audio_response(response):
    if response.status_code != 200:
        print(f"Error: Received status code {response.status_code}")
        print(response.text)
        sys.exit(1)

    if response.headers.get("Content-Type") != "audio/mpeg":
        print(f"Unexpected content type: {response.headers.get('Content-Type')}")
        sys.exit(1)

    # Generate a unique filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = uuid.uuid4().hex
    audio_filename = f"{timestamp}_{random_str}.mp3"

    # Save the audio file to the defined folder
    audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
    with open(audio_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)

    return audio_filename


if __name__ == "__main__":
    app.run(debug=True)
