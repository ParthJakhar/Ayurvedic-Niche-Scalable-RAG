import multiprocessing


from .server import app
import uvicorn
from dotenv import load_dotenv

load_dotenv()

def main():
    multiprocessing.freeze_support()
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()