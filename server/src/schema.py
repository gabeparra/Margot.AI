from mongoengine import Document, StringField, connect
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.environ["MONGODB"]

# Connect to MongoDB
connect(host=uri, alias="ma719439")

# Define the schema for the Users collection
class User(Document):
    meta = {'collection': 'Users'}  # Specify the collection name
    user = StringField(required=True)
    password = StringField(required=True)

# Define the schema for the Translations collection
class Words(Document):
    meta = {'collection': 'Words'}  # Specify the collection name
    english = StringField(required=True)
    spanish = StringField(required=True)

if __name__ == "__main__":
    # Example usage
    # Create a new user
    new_user = User(user="JohnDoe", password="secure_password")
    new_user.save()
    
    # Create a new translation
    new_translation = Words(english="hello", spanish="hola")
    new_translation.save()
