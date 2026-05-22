#!/bin/zsh
set -euo pipefail

NODE_BIN="${NODE_BIN:-/Users/nigel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node}"

if [[ ! -x "$NODE_BIN" ]]; then
  echo "Codex Node was not found at: $NODE_BIN" >&2
  echo "Set NODE_BIN to a working Node.js executable and try again." >&2
  exit 1
fi

exec "$NODE_BIN" "$@"
