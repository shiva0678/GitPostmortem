import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.main import app
from backend.analyzer import analyze_repository

client = TestClient(app)

class TestAnalyzer(unittest.TestCase):
    def setUp(self):
        # Sample repository data matching the backend's expected structure
        self.sample_data = {
            "repository_summary": {
                "repo_name": "TestRepo",
                "total_commits": 50,
                "contributors": 3,
                "most_modified_module": "auth"
            },
            "commit_history": [
                {
                    "commit_hash": "a1b2c3d",
                    "author": "Alice",
                    "date": "2026-06-10",
                    "message": "fix security bug in auth module",
                    "changed_files": ["auth/login.py", "auth/utils.py"]
                },
                {
                    "commit_hash": "e5f6g7h",
                    "author": "Bob",
                    "date": "2026-06-11",
                    "message": "refactor payment module",
                    "changed_files": ["payment/processor.py"]
                }
            ],
            "contributors": [
                {"name": "Alice", "commits": 30, "impact": "High"},
                {"name": "Bob", "commits": 15, "impact": "Medium"},
                {"name": "Charlie", "commits": 5, "impact": "Low"}
            ],
            "file_change_patterns": [
                {"file": "auth/login.py", "changes": 15},
                {"file": "payment/processor.py", "changes": 8}
            ]
        }

        # Expected structured mock response
        self.mock_analysis_result = {
            "hotspots": [
                {
                    "module": "auth",
                    "changes": 15,
                    "risk_score": 8.5
                }
            ],
            "failure_patterns": [
                {
                    "title": "Auth Security Regression",
                    "description": "Frequent fixes in auth/login.py indicate recurring vulnerabilities."
                }
            ],
            "blind_spots": ["payment/processor.py solely maintained by Bob"],
            "code_review_rules": ["Ensure all auth changes are audited by security team"],
            "risk_assessment": {
                "score": 65,
                "level": "Medium"
            }
        }

    @patch('backend.analyzer.genai.Client')
    def test_analyze_repository_mocked(self, mock_client_class):
        # Set up the mock client and its generate_content response
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client
        
        mock_response = MagicMock()
        import json
        mock_response.text = json.dumps(self.mock_analysis_result)
        mock_client.models.generate_content.return_value = mock_response

        # Execute the analyzer function with mocked API
        with patch.dict('os.environ', {'GEMINI_API_KEY': 'fake-api-key'}):
            result = analyze_repository(self.sample_data)

        # Assert output matches the mock result
        self.assertEqual(result["hotspots"][0]["module"], "auth")
        self.assertEqual(result["risk_assessment"]["level"], "Medium")
        self.assertEqual(len(result["failure_patterns"]), 1)
        self.assertEqual(result["failure_patterns"][0]["title"], "Auth Security Regression")
        self.assertIn("payment/processor.py solely maintained by Bob", result["blind_spots"])

    @patch('backend.main.analyze_repository')
    def test_api_endpoint_analyze(self, mock_analyze):
        # Mock the analyzer output for FastAPI TestClient
        mock_analyze.return_value = self.mock_analysis_result

        # Request to the endpoint
        response = client.post("/analyze", json=self.sample_data)

        # Assert response status and schema elements
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertIn("hotspots", json_data)
        self.assertIn("failure_patterns", json_data)
        self.assertIn("blind_spots", json_data)
        self.assertIn("code_review_rules", json_data)
        self.assertIn("risk_assessment", json_data)
        
        # Verify specific fields inside risk assessment
        self.assertEqual(json_data["risk_assessment"]["score"], 65)
        self.assertEqual(json_data["risk_assessment"]["level"], "Medium")
