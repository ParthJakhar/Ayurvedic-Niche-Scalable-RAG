import multiprocessing
from pathlib import Path


from server import app
import uvicorn
from dotenv import load_dotenv

ROOT_ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ROOT_ENV_PATH)

def main():
    multiprocessing.freeze_support()
    uvicorn.run(app, host="0.0.0.0", port=8010)

if __name__ == "__main__":
    main()