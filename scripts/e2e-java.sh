#!/usr/bin/env bash
set -euo pipefail
cd examples/java-golden
mvn -q -DskipTests=false test || true
mvn -q checkstyle:checkstyle spotbugs:spotbugs || true
cd - >/dev/null
mkdir -p reports/w5
T=$(grep -Ri "BUILD FAILURE" -c examples/java-golden/target/surefire-reports 2>/dev/null || echo 0)
L=$(grep -Ri -c "violation" examples/java-golden/target 2>/dev/null || echo 0)
printf '{"testFailures":%s,"lintWarnings":%s}\n' "$T" "$L" > reports/w5/java-e2e.json
