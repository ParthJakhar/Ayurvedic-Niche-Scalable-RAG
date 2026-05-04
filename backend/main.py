import multiprocessing

import uvicorn

from server import app


def main():
    multiprocessing.freeze_support()
    uvicorn.run(app, host="0.0.0.0", port=8001)


if __name__ == "__main__":
    main()
