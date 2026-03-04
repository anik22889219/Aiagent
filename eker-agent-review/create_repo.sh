#!/usr/bin/env bash
# Helper to create a private GitHub repo and push local scaffold using GH CLI
# Usage: ./create_repo.sh <owner> <repo-name>

OWNER=${1:-$GITHUB_OWNER}
REPO=${2:-eker-agent-review}

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install from https://cli.github.com/"
  exit 1
fi

if [ -z "$OWNER" ]; then
  echo "Usage: $0 <owner> [repo-name]"
  exit 1
fi

FULL="$OWNER/$REPO"

echo "Creating private repo $FULL..."
gh repo create "$FULL" --private --source=. --remote=origin --push

if [ $? -eq 0 ]; then
  echo "Repository created and pushed: https://github.com/$FULL"
else
  echo "Failed to create/push repository. Check gh auth and network." 
fi
