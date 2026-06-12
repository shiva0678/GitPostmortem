import json
import sys
from pathlib import Path

# Ensure the backend package can be imported when running from the backend directory
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir.parent))

from backend.github_service import (
    extract_repo_info,
    get_commits,
    get_contributors,
    _aggregate_file_changes,
    _build_timeline,
)


def main():
    print("\n[DEBUG] === Starting test ===")

    repo_url = "https://github.com/facebook/react"

    # ── Step 1: Extract repo info ──────────────────────────────────────────
    print(f"\n[DEBUG] Extracting repo info from: {repo_url}")
    owner, repo = extract_repo_info(repo_url)
    print(f"[DEBUG] Done – owner={owner!r}, repo={repo!r}")

    # ── Step 2: Fetch commits ──────────────────────────────────────────────
    print(f"\n[DEBUG] Fetching commits for {owner}/{repo} ...")
    commits = get_commits(owner, repo)
    print(f"[DEBUG] Done – {len(commits)} commit(s) fetched")

    # ── Step 3: Fetch contributors ─────────────────────────────────────────
    print(f"\n[DEBUG] Fetching contributors for {owner}/{repo} ...")
    contributors = get_contributors(owner, repo)
    print(f"[DEBUG] Done – {len(contributors)} contributor(s) fetched")

    # ── Step 4: Compute file change patterns ───────────────────────────────
    print("\n[DEBUG] Fetching file patterns (aggregating changed files) ...")
    file_patterns = _aggregate_file_changes(commits)
    print(f"[DEBUG] Done – {len(file_patterns)} unique file(s) found")

    # ── Step 5: Build timeline & summary ───────────────────────────────────
    print("\n[DEBUG] Building timeline and repository summary ...")
    timeline = _build_timeline(commits)
    repository_summary = {
        "repo_name": repo,
        "total_commits": len(commits),
        "contributors": len(contributors),
        "most_modified_module": file_patterns[0]["file"] if file_patterns else "",
    }
    print(f"[DEBUG] Done – {len(timeline)} timeline day(s) built")

    # ── Results ────────────────────────────────────────────────────────────
    print("\n=== Repository Summary ===")
    print(json.dumps(repository_summary, indent=2))

    print("\n=== Total Commits Fetched ===")
    print(len(commits))

    print("\n=== Contributors Fetched ===")
    print(len(contributors))

    print("\n=== Timeline Entries (first 10) ===")
    for entry in timeline[:10]:
        print(f"  {entry['date']}: {entry['commits']} commit(s)")

    print("\n[DEBUG] === Finished ===\n")


if __name__ == "__main__":
    main()
