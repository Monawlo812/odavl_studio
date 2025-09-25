#!/bin/sh
# scripts/guards/protected-paths.sh
# Fails if PR diff touches protected paths. POSIX sh, no deps.

set -e

BASE=${GITHUB_BASE_REF:-origin/main}
HEAD=${GITHUB_HEAD_REF:-HEAD}

echo "[guard] Checking for protected path changes between $BASE and $HEAD..."

git fetch origin main >/dev/null 2>&1 || true
CHANGED=$(git diff --name-only "$BASE" "$HEAD")

PROTECTED=""
for f in $CHANGED; do
  case "$f" in
    */security/*|*.spec.*|*/public-api/*)
      PROTECTED="$PROTECTED $f";;
  esac
done

if [ -n "$PROTECTED" ]; then
  echo "PROTECTED PATHS MODIFIED:$PROTECTED"
  exit 2
else
  echo "[guard] No protected paths modified."
fi
