import json
import logging
import os
from pathlib import Path
from typing import Any, Dict

import requests
from dotenv import load_dotenv
from requests.exceptions import RequestException

try:
    from google import genai as google_genai
except ImportError:  # pragma: no cover - optional dependency
    google_genai = None

logger = logging.getLogger("GitPostmortemAnalyzer")

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH, override=False)


def _default_analysis() -> Dict[str, Any]:
    return {
        "hotspots": [],
        "failure_patterns": [],
        "blind_spots": [],
        "code_review_rules": [],
        "risk_assessment": {"score": 0, "level": "Low"},
    }


def _build_fallback_analysis(data: Dict[str, Any]) -> Dict[str, Any]:
    summary = data.get("repository_summary") or {}
    timeline = data.get("timeline") or []
    file_patterns = data.get("file_change_patterns") or []
    commits = data.get("commit_history") or []
    contributors = data.get("contributors") or []

    top_files = [
        item.get("file")
        for item in file_patterns[:5]
        if isinstance(item, dict) and item.get("file")
    ]
    repo_name = summary.get("repo_name") or "repository"
    hotspot_modules = top_files[:3] or ["core", "src"]

    analysis = {
        "hotspots": [
            {"module": module, "signal": "frequently modified in recent commits"}
            for module in hotspot_modules
        ],
        "failure_patterns": [
            {
                "pattern": "High change concentration",
                "evidence": f"{len(top_files)} files showed repeated edits in {repo_name}",
            }
        ],
        "blind_spots": [
            f"Review coverage for {repo_name} should be expanded around high-churn modules",
            "Monitor contributor handoffs where change volume is concentrated",
        ],
        "code_review_rules": [
            "Prioritize review of frequently changed modules first",
            "Require ownership confirmation for high-risk file changes",
            "Validate rollback readiness before merging broad changes",
        ],
        "risk_assessment": {
            "score": min(100, 35 + len(commits) // 2 + len(contributors) + len(top_files)),
            "level": "High" if len(commits) > 8 else "Medium",
        },
    }

    if not timeline:
        analysis["blind_spots"].append("Historical activity timeline is sparse; add more commit context")
    return analysis


def _normalize_analysis(payload: Dict[str, Any]) -> Dict[str, Any]:
    normalized = _default_analysis()
    if not isinstance(payload, dict):
        return normalized

    hotspots = payload.get("hotspots")
    normalized["hotspots"] = hotspots if isinstance(hotspots, list) else []

    failure_patterns = payload.get("failure_patterns")
    normalized["failure_patterns"] = (
        failure_patterns if isinstance(failure_patterns, list) else []
    )

    blind_spots = payload.get("blind_spots")
    if isinstance(blind_spots, list):
        normalized["blind_spots"] = [str(item) for item in blind_spots if item is not None]
    else:
        normalized["blind_spots"] = []

    code_review_rules = payload.get("code_review_rules")
    if isinstance(code_review_rules, list):
        normalized["code_review_rules"] = [str(item) for item in code_review_rules if item is not None]
    else:
        normalized["code_review_rules"] = []

    risk_assessment = payload.get("risk_assessment", {})
    if isinstance(risk_assessment, dict):
        score = risk_assessment.get("score", 0)
        level = risk_assessment.get("level", "Low")
        try:
            normalized_score = int(score)
        except (TypeError, ValueError):
            normalized_score = 0
        normalized["risk_assessment"] = {
            "score": max(0, min(100, normalized_score)),
            "level": str(level) if str(level).strip() else "Low",
        }

    return normalized


def _extract_text_from_response(body: Any) -> str:
    if not isinstance(body, dict):
        return ""

    candidates = body.get("candidates", [])
    if not isinstance(candidates, list):
        return ""

    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        content = candidate.get("content", {})
        parts = content.get("parts", [])
        if not isinstance(parts, list):
            continue
        for part in parts:
            if isinstance(part, dict) and part.get("text"):
                return str(part["text"])
    return ""


def _call_gemini(prompt: str, api_key: str) -> str:
    logger.info("Gemini analysis started")
    if google_genai is not None:
        try:
            client = google_genai.Client(api_key=api_key)
            response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            text = getattr(response, "text", "") or ""
            logger.info("Gemini response received")
            return text
        except Exception as exc:
            logger.exception("Gemini SDK error: %s", exc)
            raise

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        body = response.json()
        text = _extract_text_from_response(body)
        logger.info("Gemini response received")
        return text
    except (RequestException, ValueError, KeyError, TypeError) as exc:
        logger.exception("Gemini API error: %s", exc)
        raise


def analyze_repository(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create repository analysis from available data and only use Gemini when it is available."""
    if not isinstance(data, dict):
        logger.warning("Fallback analysis used: invalid repository payload")
        return _build_fallback_analysis({})

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("Fallback analysis used: GEMINI_API_KEY is not set")
        return _build_fallback_analysis(data)

    prompt = (
        "You are analyzing a software repository. Return valid JSON only with the following keys: "
        "hotspots, failure_patterns, blind_spots, code_review_rules, risk_assessment. "
        "Each list should contain concise objects or strings. risk_assessment should include score and level. "
        f"Repository data: {json.dumps(data, indent=2)}"
    )

    try:
        text = _call_gemini(prompt, api_key)
        if not text:
            logger.warning("Fallback analysis used: Gemini returned no usable content")
            return _build_fallback_analysis(data)

        cleaned_text = text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]

        parsed = json.loads(cleaned_text)
        return _normalize_analysis(parsed)
    except (json.JSONDecodeError, TypeError, ValueError) as exc:
        logger.warning("Fallback analysis used: invalid Gemini response: %s", exc)
        return _build_fallback_analysis(data)
    except Exception as exc:
        logger.warning("Fallback analysis used: %s", exc)
        return _build_fallback_analysis(data)
