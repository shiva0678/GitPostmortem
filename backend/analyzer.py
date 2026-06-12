import os
import json
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define Pydantic models for structured output matching the requested schema exactly
class Hotspot(BaseModel):
    module: str = Field(description="The name of the module, folder, or file that is frequently modified")
    changes: int = Field(description="The number of modifications or commits affecting this module")
    risk_score: float = Field(description="A risk score from 0.0 to 10.0 based on modification frequency and complexity")

class FailurePattern(BaseModel):
    title: str = Field(description="Brief title of the recurring engineering failure pattern detected")
    description: str = Field(description="Detailed explanation of the failure pattern and its evidence in the history")

class RiskAssessment(BaseModel):
    score: int = Field(description="An overall risk score for the repository, from 0 to 100")
    level: str = Field(description="The overall risk level (e.g., Low, Medium, High, Critical)")

class AnalysisResult(BaseModel):
    hotspots: List[Hotspot]
    failure_patterns: List[FailurePattern]
    blind_spots: List[str] = Field(description="A list of team blind spots (e.g., knowledge silos, single-contributor modules)")
    code_review_rules: List[str] = Field(description="Actionable rules or checklists for code reviews to prevent repeating past failures")
    risk_assessment: RiskAssessment

def analyze_repository(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the repository data using Gemini API and returns a structured post-mortem analysis.
    
    The input data has the schema:
    {
      "repository_summary": {},
      "commit_history": [],
      "contributors": [],
      "file_change_patterns": []
    }
    
    The return schema matches EXACTLY:
    {
      "hotspots": [
        {
          "module": "",
          "changes": 0,
          "risk_score": 0
        }
      ],
      "failure_patterns": [
        {
          "title": "",
          "description": ""
        }
      ],
      "blind_spots": [],
      "code_review_rules": [],
      "risk_assessment": {
        "score": 0,
        "level": ""
      }
    }
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please add it to your environment or a .env file.")

    client = genai.Client(api_key=api_key)

    # Format the input data cleanly for the LLM prompt
    data_str = json.dumps(data, indent=2)

    prompt = f"""You are an expert AI Lead and code analyst. Your task is to analyze the provided Git repository history data, identifying engineering hotspots, recurring failure patterns, team knowledge silos or blind spots, overall repository risk, and generating targeted code review guidelines.

Git Repository Metadata:
```json
{data_str}
```

Please perform a deep post-mortem analysis:
1. Identify frequently modified modules (hotspots) in the codebase.
2. Locate recurring engineering failures by scanning commit messages and file changes for patterns indicating repeat bugs, regressions, or bad practices.
3. Call out team blind spots (e.g. single contributors owning large modules, knowledge silos, or highly modified modules with low test coverage/visibility).
4. Perform an overall risk assessment (score 0-100, level: Low/Medium/High/Critical) for the repository.
5. Formulate specific code review rules (actionable rules to put in pull requests) to prevent these issues from recurring.

Ensure all outputs strictly adhere to the requested schema. Return a structured JSON response matching the target format.
"""

    try:
        # Use gemini-2.5-flash as the standard, fast reasoning model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResult,
                temperature=0.2,
            ),
        )
        
        # Parse the structured JSON response
        result = json.loads(response.text)
        return result

    except Exception as e:
        # Fallback or error handling
        raise RuntimeError(f"Error calling Gemini API: {str(e)}")
