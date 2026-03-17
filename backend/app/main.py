from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.hospital_routes import router as hospital_router

app = FastAPI(title="Nearby Hospital Tracker API")

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hospital_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "API is running 🚀"}