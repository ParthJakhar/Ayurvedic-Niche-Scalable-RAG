import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_ENV_PATH = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=ROOT_ENV_PATH)

OVERPASS_URL = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
RADIUS = int(os.getenv("RADIUS", 5000))
RESULT_LIMIT = int(os.getenv("RESULT_LIMIT", 10))