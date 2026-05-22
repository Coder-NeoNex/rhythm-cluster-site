#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_ROOT="${SCRIPT_DIR:h}"

cd "$PROJECT_ROOT"

export NAS_DEPLOY_TARGET="${NAS_DEPLOY_TARGET:-/Volumes/rhythm-cluster-site}"

if [[ ! -d "$NAS_DEPLOY_TARGET" ]]; then
  echo "NAS target is not mounted: $NAS_DEPLOY_TARGET" >&2
  echo 'Mount it first with: open "smb://192.168.1.240/rhythm-cluster-site"' >&2
  echo "If macOS mounted it with another name, set NAS_DEPLOY_TARGET manually." >&2
  exit 1
fi

exec /bin/zsh "$SCRIPT_DIR/with-codex-node.sh" scripts/deploy-mac.mjs
