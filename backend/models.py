from pydantic import BaseModel, Field
from typing import List, Dict, Any

class AnalyzeRequest(BaseModel):
    repoUrl: str = Field(..., description="Git repository URL to analyze")

class RepositorySummary(BaseModel):
    repo_name: str = Field(..., description="Name of the repository")
    total_commits: int = Field(..., description="Total number of commits")
    contributors: int = Field(..., description="Total number of contributors")
    most_modified_module: str = Field(..., description="Module with the most modifications")

class RiskAssessment(BaseModel):
    score: int = Field(..., description="Repository risk score (0-100)")
    level: str = Field(..., description="Risk level (e.g. Low, Medium, High)")

class AnalyzeResponse(BaseModel):
    repository_summary: RepositorySummary = Field(..., description="Repository summary statistics")
    timeline: List[Dict[str, Any]] = Field(default_factory=list, description="Timeline of repository activity")
    hotspots: List[Dict[str, Any]] = Field(default_factory=list, description="Identified complex or frequently modified modules")
    failure_patterns: List[Dict[str, Any]] = Field(default_factory=list, description="Patterns of recurring engineering failures")
    blind_spots: List[str] = Field(default_factory=list, description="Identified team knowledge gaps or blind spots")
    code_review_rules: List[str] = Field(default_factory=list, description="Checklist or rules recommended for code reviews")
    risk_assessment: RiskAssessment = Field(..., description="Repository risk assessment summary")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Health status of the service")
