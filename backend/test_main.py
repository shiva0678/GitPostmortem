import sys
import unittest
from pathlib import Path
from fastapi.testclient import TestClient
from unittest.mock import patch

backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from backend.main import app


class AnalyzeEndpointTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_analyze_endpoint_returns_schema_when_gemini_fails(self):
        repo_data = {
            "repository_summary": {
                "repo_name": "react",
                "total_commits": 10,
                "contributors": 4,
                "most_modified_module": "src/",
            },
            "timeline": [{"date": "2024-01-01", "commits": 2}],
        }

        with patch("backend.main.get_repo_data", return_value=repo_data), patch(
            "backend.main.analyze_repository",
            side_effect=RuntimeError("Gemini unavailable"),
        ):
            response = self.client.post(
                "/api/analyze",
                json={"repoUrl": "https://github.com/facebook/react"},
            )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["repository_summary"]["repo_name"], "react")
        self.assertEqual(body["timeline"], [{"date": "2024-01-01", "commits": 2}])
        self.assertIsInstance(body["hotspots"], list)
        self.assertIsInstance(body["failure_patterns"], list)
        self.assertIsInstance(body["blind_spots"], list)
        self.assertIsInstance(body["code_review_rules"], list)
        self.assertIn(body["risk_assessment"]["level"], {"Low", "Medium", "High"})

    def test_analyze_endpoint_returns_non_zero_fallback_when_analysis_fails(self):
        repo_data = {
            "repository_summary": {
                "repo_name": "react",
                "total_commits": 10,
                "contributors": 4,
                "most_modified_module": "src/",
            },
            "timeline": [{"date": "2024-01-01", "commits": 2}],
            "file_change_patterns": [{"file": "src/app.jsx", "changes": 5}],
            "commit_history": [{"message": "fix"}],
            "contributors": [{"login": "octocat"}],
        }

        with patch("backend.main.get_repo_data", return_value=repo_data), patch(
            "backend.main.analyze_repository",
            side_effect=RuntimeError("Gemini unavailable"),
        ):
            response = self.client.post(
                "/api/analyze",
                json={"repoUrl": "https://github.com/facebook/react"},
            )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertGreater(body["risk_assessment"]["score"], 0)
        self.assertTrue(body["failure_patterns"])
        self.assertTrue(body["blind_spots"])
        self.assertTrue(body["code_review_rules"])


if __name__ == "__main__":
    unittest.main()
