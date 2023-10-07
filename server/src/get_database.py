from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.environ["MONGODB"]

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def get_database():
    # Replace "database_name" with the name of your database
    return client["MargotAI"]

if __name__ == "__main__":
    dbname = get_database()