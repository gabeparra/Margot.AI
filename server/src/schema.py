from mongoengine import Document, StringField, connect
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.environ["MONGODB"]

# Connect to MongoDB
db = connect(host=uri, alias="default",db="MargotAI")

# Define the schema for the Users collection
class User(Document):
    meta = {'collection': 'Users', 'db_alias': 'default'}  # Specify the collection name
    user = StringField(required=True)
    password = StringField(required=True)

# Define the schema for the Translations collection
class Words(Document):
    meta = {'collection': 'Words', 'db_alias': 'default'}  # Specify the collection name
    english = StringField(required=True)
    spanish = StringField(required=True)