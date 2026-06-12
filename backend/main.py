from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models import AnalyzeRequest, AnalyzeResponse, HealthResponse
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GitPostmortemBackend")

app = FastAPI(
    title="GitPostmortem Backend API",
    description="Backend API for GitPostmortem codebase analysis",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    """
    Service health check endpoint.
    """
    logger.info("Health check endpoint called")
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_repository(request: AnalyzeRequest):
    """
    Endpoint to trigger repository analysis. Currently returns a dummy response matching the requested schema.
    """
    logger.info(f"Analyze endpoint called with repo URL: {request.repoUrl}")
    
    # Check if a valid repository URL was provided (basic validation)
    if not request.repoUrl or not request.repoUrl.strip():
        logger.warning("Analyze endpoint failed: repoUrl was empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="repoUrl must be a non-empty string"
        )

    try:
        dummy_response = {
            "repository_summary": {
                "repo_name": "Demo Repo",
                "total_commits": 100,
                "contributors": 5,
                "most_modified_module": "Authentication"
            },
            "timeline": [],
            "hotspots": [],
            "failure_patterns": [],
            "blind_spots": [],
            "code_review_rules": [],
            "risk_assessment": {
                "score": 50,
                "level": "Medium"
            }
        }
        return dummy_response
    except Exception as e:
        logger.error(f"Error during repository analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An internal error occurred during analysis: {str(e)}"
        )
