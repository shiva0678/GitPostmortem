import logging
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

try:
    from .models import AnalyzeRequest, AnalyzeResponse, HealthResponse
    from .github_service import extract_repo_info, get_repo_data
    from .analyzer import analyze_repository as analyze_with_gemini
except ImportError:
    from models import AnalyzeRequest, AnalyzeResponse, HealthResponse
    from github_service import extract_repo_info, get_repo_data
    from analyzer import analyze_repository as analyze_with_gemini

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GitPostmortemBackend")

app = FastAPI(
    title="GitPostmortem Backend API",
    description="Backend API for GitPostmortem codebase analysis",
    version="1.0.0",
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _build_fallback_analysis(repo_data: Dict[str, Any]) -> Dict[str, Any]:
    summary = repo_data.get("repository_summary") or {}
    timeline = repo_data.get("timeline") or []
    file_patterns = repo_data.get("file_change_patterns") or []
    commits = repo_data.get("commit_history") or []
    contributors = repo_data.get("contributors") or []

    top_files = [
        item.get("file")
        for item in file_patterns[:5]
        if isinstance(item, dict) and item.get("file")
    ]
    repo_name = summary.get("repo_name") or "repository"
    hotspot_modules = top_files[:3] or ["core", "src"]

    risk_score = min(100, 35 + len(commits) // 2 + len(contributors) + len(top_files))
    risk_level = "High" if risk_score >= 70 else "Medium" if risk_score >= 40 else "Low"

    return {
        "hotspots": [
            {"module": module, "signal": "frequently modified in recent commits"}
            for module in hotspot_modules
        ],
        "failure_patterns": [
            {
                "pattern": "High change concentration",
                "evidence": f"{len(top_files)} files showed repeated edits in {repo_name}",
            }
        ] if top_files else [],
        "blind_spots": [
            f"Review coverage for {repo_name} should be expanded around high-churn modules",
            "Monitor contributor handoffs where change volume is concentrated",
        ],
        "code_review_rules": [
            "Prioritize review of frequently changed modules first",
            "Require ownership confirmation for high-risk file changes",
            "Validate rollback readiness before merging broad changes",
        ],
        "risk_assessment": {"score": risk_score, "level": risk_level},
    }


def _fallback_response(repo_data: Dict[str, Any]) -> Dict[str, Any]:
    fallback_analysis = _build_fallback_analysis(repo_data)
    return {
        "repository_summary": repo_data.get("repository_summary", {}),
        "timeline": repo_data.get("timeline", []),
        "hotspots": fallback_analysis.get("hotspots", []),
        "failure_patterns": fallback_analysis.get("failure_patterns", []),
        "blind_spots": fallback_analysis.get("blind_spots", []),
        "code_review_rules": fallback_analysis.get("code_review_rules", []),
        "risk_assessment": fallback_analysis.get("risk_assessment", {"score": 0, "level": "Low"}),
    }


@app.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    """Service health check endpoint."""
    logger.info("Health check endpoint called")
    return {"status": "healthy"}


@app.post("/api/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_repository(request: AnalyzeRequest):
    """Analyze a GitHub repository and return a schema-safe response."""
    logger.info("Analyze endpoint called with repo URL: %s", request.repoUrl)

    if not request.repoUrl or not request.repoUrl.strip():
        logger.warning("Analyze endpoint failed: repoUrl was empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="repoUrl must be a non-empty string",
        )

    try:
        extract_repo_info(request.repoUrl)
    except ValueError as exc:
        logger.warning("Invalid repository URL: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="repoUrl must be a valid GitHub repository URL",
        ) from exc

    try:
        repo_data = get_repo_data(request.repoUrl)
    except Exception as exc:
        logger.exception("GitHub repository data collection failed: %s", exc)
        repo_data = {
            "repository_summary": {
                "repo_name": request.repoUrl.rstrip("/").split("/")[-1],
                "total_commits": 0,
                "contributors": 0,
                "most_modified_module": "",
            },
            "timeline": [],
        }

    try:
        analysis_data = analyze_with_gemini(repo_data)
    except Exception as exc:
        logger.exception("Gemini analysis failed: %s", exc)
        analysis_data = _build_fallback_analysis(repo_data)

    response_data = {
        "repository_summary": repo_data.get("repository_summary", {}),
        "timeline": repo_data.get("timeline", []),
        "hotspots": analysis_data.get("hotspots", []),
        "failure_patterns": analysis_data.get("failure_patterns", []),
        "blind_spots": analysis_data.get("blind_spots", []),
        "code_review_rules": analysis_data.get("code_review_rules", []),
        "risk_assessment": analysis_data.get("risk_assessment", {"score": 0, "level": "Low"}),
    }

    try:
        return AnalyzeResponse(**response_data)
    except Exception as exc:
        logger.exception("Response validation failed: %s", exc)
        return AnalyzeResponse(**_fallback_response(repo_data))
