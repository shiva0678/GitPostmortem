import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir.parent))

from backend.github_service import _request_with_rate_handling


def test_request_with_rate_handling_sets_github_headers(monkeypatch):
    captured = {}

    class DummyResponse:
        status_code = 200
        headers = {}

        def raise_for_status(self):
            return None

        def json(self):
            return []

    def fake_get(url, headers=None, params=None, timeout=None):
        captured["url"] = url
        captured["headers"] = headers
        captured["params"] = params
        captured["timeout"] = timeout
        return DummyResponse()

    monkeypatch.setattr("backend.github_service.requests.get", fake_get)

    _request_with_rate_handling("https://api.github.com/repos/facebook/react/commits")

    assert captured["url"].startswith("https://api.github.com/")
    assert captured["headers"]["User-Agent"].startswith("GitPostmortem")
    assert captured["headers"]["Accept"] == "application/vnd.github+json"
    assert captured["timeout"] == 20
