import os
import logging
import time
from typing import List, Dict, Any, Tuple

import requests
from requests.exceptions import RequestException

from pathlib import Path
from dotenv import load_dotenv

# ----------------------------------------------------------------------
# Logger configuration
# ----------------------------------------------------------------------
logger = logging.getLogger("GitPostmortemGitHubService")
# Load environment variables from .env (if present)
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# ----------------------------------------------------------------------
# Constants
# ----------------------------------------------------------------------
GITHUB_API_URL = "https://api.github.com"


def _auth_headers() -> Dict[str, str]:
    """Return authentication headers if a GitHub token is set."""
    token = os.getenv("GITHUB_TOKEN")
    auth = {"Authorization": f"token {token}"} if token else {}
    # Log authentication usage
    logger.info(f"GitHub request authenticated: {bool(token)}")
    return auth

# New helper to print current rate limit status
def print_rate_limit_status():
    """Fetch and log the current GitHub API rate limit status.

    Uses the /rate_limit endpoint and logs the remaining core limit.
    """
    try:
        response = requests.get(f"{GITHUB_API_URL}/rate_limit", headers=_auth_headers())
        response.raise_for_status()
        data = response.json()
        core = data.get("resources", {}).get("core", {})
        remaining = core.get("remaining")
        limit = core.get("limit")
        reset = core.get("reset")
        logger.info(
            f"GitHub rate limit – limit: {limit}, remaining: {remaining}, reset epoch: {reset}"
        )
    except Exception as e:
        logger.warning(f"Failed to retrieve rate limit status: {e}")


def extract_repo_info(repo_url: str) -> Tuple[str, str]:
    """
    Extract owner and repository name from a GitHub URL.

    Supported formats:
        https://github.com/owner/repo
        https://github.com/owner/repo.git
        git@github.com:owner/repo.git
    """
    import re

    pattern = r"(?:github\.com[:/])([^/]+)/([^/.]+)(?:\.git)?$"
    match = re.search(pattern, repo_url)
    if not match:
        raise ValueError(f"Invalid GitHub repository URL: {repo_url}")
    return match.group(1), match.group(2)


def _request_with_rate_handling(url: str, params: Dict[str, Any] = None) -> requests.Response:
    """
    Perform a GET request with simple retry logic.

    - Retries up to 3 times on network errors.
    - If a 403 rate‑limit response is received, log a warning and
      propagate the exception so callers can return partial data.
    """
    headers = _auth_headers()
    attempts = 0
    while attempts < 3:
        try:
            response = requests.get(url, headers=headers, params=params)
            # Log remaining rate limit if present
            remaining = response.headers.get("X-RateLimit-Remaining")
            if remaining is not None:
                logger.info(f"Rate limit remaining: {remaining}")
            if response.status_code == 403:
                logger.warning(f"GitHub rate limit hit for {url}. Returning partial data.")
                response.raise_for_status()
            response.raise_for_status()
            return response
        except RequestException as e:
            attempts += 1
            logger.warning(f"GitHub request failed (attempt {attempts}/3): {e}")
            if attempts >= 3:
                raise
            # No sleep – immediate retry for hackathon speed
    raise RuntimeError("Unreachable code in _request_with_rate_handling")


def _paginate(url: str, params: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """
    Collect all pages of a GitHub list endpoint.

    The GitHub API uses the `Link` header for pagination.
    """
    results: List[Dict[str, Any]] = []
    while url:
        try:
            resp = _request_with_rate_handling(url, params)
        except RequestException:
            logger.warning("Stopping pagination due to request failure (possible rate limit).")
            break
        data = resp.json()
        if isinstance(data, list):
            results.extend(data)
        else:
            logger.error("Unexpected pagination data shape")
            break

        # Parse `Link` header for the next page URL
        link = resp.headers.get("Link", "")
        next_url = None
        for part in link.split(","):
            if 'rel="next"' in part:
                start = part.find("<")
                end = part.find(">")
                if start != -1 and end != -1:
                    next_url = part[start + 1 : end]
        url = next_url
        params = None  # Subsequent pages already contain query params in the URL
    return results


def get_commits(owner: str, repo: str) -> List[Dict[str, Any]]:
    """
    Fetch the most recent 10 commits in a single API request.

    Avoids pagination entirely so large repos (e.g. facebook/react) do not
    block the process fetching thousands of pages.
    """
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/commits"
    try:
        resp = _request_with_rate_handling(url, params={"per_page": 10})
        commits_raw = resp.json()
        if not isinstance(commits_raw, list):
            logger.error("Unexpected response shape from commits endpoint")
            return []
    except RequestException as e:
        logger.error(f"Failed to fetch commits for {owner}/{repo}: {e}")
        return []
    commits: List[Dict[str, Any]] = []

    for idx, item in enumerate(commits_raw):
        sha = item.get("sha")
        commit_info = item.get("commit", {})
        author = commit_info.get("author", {}).get("name")
        date = commit_info.get("author", {}).get("date")
        message = commit_info.get("message")
        changed_files: List[str] = []

        # Limit file analysis to first 5 commits
        if idx < 5:
            try:
                files_resp = _request_with_rate_handling(
                    f"{GITHUB_API_URL}/repos/{owner}/{repo}/commits/{sha}"
                )
                files_data = files_resp.json().get("files", [])
                changed_files = [f.get("filename") for f in files_data]
            except RequestException as e:
                logger.error(f"Failed to fetch files for commit {sha}: {e}")

        commits.append(
            {
                "commit_hash": sha,
                "author": author,
                "date": date,
                "message": message,
                "changed_files": changed_files,
            }
        )
    logger.info(f"Fetched {len(commits)} commits for {owner}/{repo}")
    return commits


def get_contributors(owner: str, repo: str) -> List[Dict[str, Any]]:
    """Retrieve the top 20 contributors in a single API request."""
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/contributors"
    try:
        resp = _request_with_rate_handling(url, params={"per_page": 20, "anon": "true"})
        contributors_raw = resp.json()
        if not isinstance(contributors_raw, list):
            logger.error("Unexpected response shape from contributors endpoint")
            return []
    except RequestException as e:
        logger.error(f"Failed to fetch contributors for {owner}/{repo}: {e}")
        return []
    contributors: List[Dict[str, Any]] = []

    for c in contributors_raw:
        contributors.append(
            {
                "login": c.get("login") or c.get("name"),
                "contributions": c.get("contributions", 0),
            }
        )
    logger.info(f"Fetched {len(contributors)} contributors for {owner}/{repo}")
    return contributors


def _aggregate_file_changes(commits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Count file change frequencies across commits."""
    from collections import Counter

    counter: Counter = Counter()
    for commit in commits:
        for f in commit.get("changed_files", []):
            if f:
                counter[f] += 1
    return [{"file": file, "changes": cnt} for file, cnt in counter.most_common()]


def _build_timeline(commits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Create a simple daily commit timeline."""
    from collections import defaultdict

    timeline_map: Dict[str, int] = defaultdict(int)
    for c in commits:
        date = c.get("date")
        if date:
            day = date.split("T")[0]
            timeline_map[day] += 1
    return [{"date": d, "commits": cnt} for d, cnt in sorted(timeline_map.items())]


def get_repo_data(repo_url: str) -> Dict[str, Any]:
    """
    Aggregate repository data required by the API response schema.
    """
    owner, repo = extract_repo_info(repo_url)
    logger.info(f"Collecting data for {owner}/{repo}")

    try:
        commits = get_commits(owner, repo)
        contributors = get_contributors(owner, repo)
    except Exception as e:
        logger.error(f"Failed to fetch GitHub data: {e}")
        # Minimal fallback response
        return {
            "repository_summary": {
                "repo_name": repo,
                "total_commits": 0,
                "contributors": 0,
                "most_modified_module": "",
            },
            "commit_history": [],
            "contributors": [],
            "file_change_patterns": [],
            "timeline": [],
        }

    file_change_patterns = _aggregate_file_changes(commits)
    most_modified_module = file_change_patterns[0]["file"] if file_change_patterns else ""
    timeline = _build_timeline(commits)

    return {
        "repository_summary": {
            "repo_name": repo,
            "total_commits": len(commits),
            "contributors": len(contributors),
            "most_modified_module": most_modified_module,
        },
        "commit_history": commits,
        "contributors": contributors,
        "file_change_patterns": file_change_patterns,
        "timeline": timeline,
    }
