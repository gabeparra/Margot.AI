from flask import Flask, request, jsonify, send_file, send_from_directory, Response
import os
import sys
import requests
from dotenv import load_dotenv
import uuid
from datetime import datetime
from flask_cors import CORS
from mongoengine import Document, StringField, connect


app = Flask(__name__)
CORS(app) # This will allow all origins. You can customize this for more security.

load_dotenv()
base_dir = os.path.dirname(os.path.abspath(__file__))
AUDIO_FOLDER = os.path.join(base_dir, "./audio/output")
CHUNK_SIZE = 1024

uri = os.environ["MONGODB"]

# Connect to MongoDB
db = connect(host=uri, alias="default",db="MargotAI")

# Define the schema for the Translations collection
class Words(Document):
    meta = {'collection': 'Words', 'db_alias': 'default'}  # Specify the collection name
    english = StringField(required=True)
    spanish = StringField(required=True)

# Define the schema for the Users collection
class User(Document):
    meta = {'collection': 'Users', 'db_alias': 'default'}  # Specify the collection name
    user = StringField(required=True)
    password = StringField(required=True)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Fetch the user from the database
    user = User.objects(user=username).first()

    # If user doesn't exist or password doesn't match, return 401 Unauthorized
    if not user or user.password != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"})

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

@app.route('/users')
def get_users():
    users = User.objects.all()
    return jsonify(users)

@app.route('/words')
def get_words():
    words = Words.objects.all()
    words_list = [{"english": word.english, "spanish": word.spanish} for word in words]
    return jsonify(words_list)

@app.route("/generate_audio", methods=["POST"])
def generate_audio():
    print("Generating audio...")  # Debug print to confirm the endpoint is hit

    data = request.get_json()
    wordEnglish = data.get("wordEnglish", "")
    text = data.get("text", "")
    wordSpanish = data.get("wordSpanish", "")


    response = request_audio_conversion(text)
    response2= request_audio_conversion("Correct. The Spanish word for "+wordEnglish+" is ")

    print(
        f"First 100 bytes of response: {response.content[:100]}"
    )  

    if response.status_code == 200 and response.headers.get("Content-Type") == "audio/mpeg":
        return Response(response2.content+response.content, content_type="audio/mpeg")
    else:
        return jsonify({"error": "Failed to generate audio"}), 500
    

@app.route("/load_audio", methods=["POST"])
def load_audio():
    print("Generating audio...")

    data = request.get_json()
    wordEnglish = data.get("wordEnglish", "")
    wordSpanish = data.get("wordSpanish", "")


    response = request_audio_conversion(wordSpanish)
    response2 = request_audio_conversion("How do you spell?")

    if response.status_code == 200 and response.headers.get("Content-Type") == "audio/mpeg":
        return Response(response2.content + response.content, content_type="audio/mpeg")
    else:
        return jsonify({"error": "Failed to generate audio"}), 500
@app.route("/generar_audio", methods=["POST"])
def generar_audio():
    print("Generando audio...")  # Debug print to confirm the endpoint is hit

    data = request.get_json()
    wordEnglish = data.get("wordEnglish", "")
    text = data.get("text", "")
    wordSpanish = data.get("wordSpanish", "")


    response = request_audio_conversion(text)
    response2= request_audio_conversion("Correcto. La palabra en ingles para "+wordSpanish+" es ")

    print(
        f"First 100 bytes of response: {response.content[:100]}"
    )  

    if response.status_code == 200 and response.headers.get("Content-Type") == "audio/mpeg":
        return Response(response2.content+response.content, content_type="audio/mpeg")
    else:
        return jsonify({"error": "Failed to generate audio"}), 500
    

@app.route("/cargar_audio", methods=["POST"])
def cargar_audio():
    print("Generating audio...")

    data = request.get_json()
    wordEnglish = data.get("wordEnglish", "")
    wordSpanish = data.get("wordSpanish", "")


    response = request_audio_conversion(wordEnglish)
    response2 = request_audio_conversion("Como se escribe?")

    if response.status_code == 200 and response.headers.get("Content-Type") == "audio/mpeg":
        return Response(response2.content + response.content, content_type="audio/mpeg")
    else:
        return jsonify({"error": "Failed to generate audio"}), 500


def request_audio_conversion(text):
    data = { #set paramters for the voice AI conversion
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.56,
            "similarity_boost": 0.89,
            "style": 0.31,
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
    app.run(host="0.0.0.0", port="5000", debug=True)
