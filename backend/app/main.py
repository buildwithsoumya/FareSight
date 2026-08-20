"""FareSight FastAPI application.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the backend package is importable when running from the repo root.
BACKEND_PATH = Path(__file__).resolve().parents[1]
if str(BACKEND_PATH) not in sys.path:
    sys.path.insert(0, str(BACKEND_PATH))

from app.api.routes import router  # noqa: E402


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="FareSight API",
    description=(
        "Backend for FareSight — an AI travel fare analyst. "
        "Predict flight fares from raw flight characteristics and "
        "explore historical price analytics."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {
            "name": "System",
            "description": "Root and health endpoints.",
        },
        {
            "name": "Prediction",
            "description": "Fare prediction from raw flight inputs.",
        },
        {
            "name": "Analytics",
            "description": "Historical dataset analytics derived from verified EDA results.",
        },
    ],
)

# ============================================================
# CORS
# ============================================================
# Development: allow all origins. Restrict this list for production.
# e.g. ALLOWED_ORIGINS = ["https://faresight.app"]

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# ROOT
# ============================================================

@app.get(
    "/",
    tags=["System"],
    summary="Root endpoint",
    description="Welcome message and API status.",
)
async def root():
    return {"message": "Welcome to FareSight API", "status": "running"}


# ============================================================
# ROUTES
# ============================================================

app.include_router(router)
