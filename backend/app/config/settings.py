import os
from dotenv import load_dotenv

load_dotenv()

OVERPASS_URL = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
RADIUS = int(os.getenv("RADIUS", 5000))
RESULT_LIMIT = int(os.getenv("RESULT_LIMIT", 10))