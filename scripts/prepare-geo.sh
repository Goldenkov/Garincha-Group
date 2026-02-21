#!/usr/bin/env bash
set -euo pipefail
INPUT=${1:-data/geo/russia-federal-districts.geojson}
OUTPUT=${2:-data/geo/russia-federal-districts.simplified.geojson}

if ! command -v mapshaper >/dev/null 2>&1; then
  echo "mapshaper is required: npm i -g mapshaper"
  exit 1
fi

mapshaper "$INPUT" -simplify 10% keep-shapes -o format=geojson "$OUTPUT"
echo "Saved simplified geojson to $OUTPUT"
