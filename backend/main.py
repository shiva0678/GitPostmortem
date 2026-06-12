from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List
from backend.analyzer import analyze_repository

app = FastAPI(
    title="GitPostmortem API",
    description="API for analyzing Git repository health, failure patterns, and risk using Gemini.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Flexible input schema to avoid strict type validation issues with raw backend payloads
class AnalysisRequest(BaseModel):
    repository_summary: Dict[str, Any] = Field(
        default_factory=dict,
        description="General repository statistics (e.g. name, total commits, contributors)"
    )
    commit_history: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of commits containing hash, author, date, message, and changed files"
    )
    contributors: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of contributor profiles and contribution metrics"
    )
    file_change_patterns: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Frequencies of changes per file"
    )

@app.get("/")
def read_root():
    return {"status": "ok", "service": "GitPostmortem API"}

@app.post("/analyze")
async def analyze_repo(payload: AnalysisRequest):
    """
    Analyzes the Git repository data and returns hotspots, failure patterns,
    blind spots, code review recommendations, and risk assessment.
    """
    try:
        data = payload.model_dump()
        result = analyze_repository(data)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
