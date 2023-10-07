import requests
import os
import sys
from dotenv import load_dotenv

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

data = {
    "text": "Hello I am Maria.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.37,
        "similarity_boost": 0.69,
        "style": 0.30,
        "use_speaker_boost": True,
    },
}

response = requests.post(url, json=data, headers=headers)

if response.status_code != 200:
    print(f"Error: Received status code {response.status_code}")
    print(response.text)
    sys.exit(1)

if response.headers.get("Content-Type") != "audio/mpeg":
    print(f"Unexpected content type: {response.headers.get('Content-Type')}")
    sys.exit(1)

with open("testmaria.mp3", "wb") as f:
    for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
        if chunk:
            f.write(chunk)
