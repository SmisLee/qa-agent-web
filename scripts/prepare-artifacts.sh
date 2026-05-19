#!/usr/bin/env bash
# 빌드 전 artifacts 복사 + 영상 ffmpeg 압축.
# Source: ../alarmy-qa-output/reports/<PBI>/{screenshots,videos,report.json}
# Dest:   public/artifacts/reports/<PBI>/{screenshots,videos,report.json}
# 영상은 H.265 240p 5fps 로 압축 → GitHub Pages 100MB/file 한도 회피.
#
# Usage: scripts/prepare-artifacts.sh [PBI_ID]
#   PBI_ID 생략 시 _index.json 의 모든 PBI 처리.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT_DIR/reports"
DEST="$ROOT_DIR/public/artifacts/reports"

if [ ! -d "$SRC" ]; then
  echo "[prepare-artifacts] no source dir: $SRC" >&2
  exit 0
fi

mkdir -p "$DEST"
# _index.json 복사
[ -f "$SRC/_index.json" ] && cp "$SRC/_index.json" "$DEST/_index.json"

# 처리할 PBI 목록
if [ -n "${1:-}" ]; then
  PBIS=("$1")
else
  PBIS=()
  for d in "$SRC"/*/; do
    name=$(basename "$d")
    [ -f "$d/report.json" ] && PBIS+=("$name")
  done
fi

for pbi in "${PBIS[@]}"; do
  src_pbi="$SRC/$pbi"
  dst_pbi="$DEST/$pbi"
  [ -d "$src_pbi" ] || continue
  echo "[prepare-artifacts] PBI=$pbi"
  # 기존 dest 비우고 새로
  rm -rf "$dst_pbi"
  mkdir -p "$dst_pbi/screenshots" "$dst_pbi/videos"
  cp "$src_pbi/report.json" "$dst_pbi/report.json"
  # screenshots 그대로 복사 (PNG는 작음)
  [ -d "$src_pbi/screenshots" ] && cp -R "$src_pbi/screenshots/." "$dst_pbi/screenshots/"
  # 영상 압축
  if [ -d "$src_pbi/videos" ] && command -v ffmpeg >/dev/null 2>&1; then
    for v in "$src_pbi"/videos/*.mp4; do
      [ -f "$v" ] || continue
      base=$(basename "$v")
      out="$dst_pbi/videos/$base"
      # H.265 240p 5fps CRF 35 — GitHub Pages 100MB 안쪽 보장
      ffmpeg -y -hide_banner -loglevel error -i "$v" \
        -vf "scale=-2:240,fps=5" -c:v libx265 -tag:v hvc1 -crf 35 -preset fast \
        -an "$out" 2>&1 | tail -3
      orig=$(du -k "$v" | awk '{print $1}')
      new=$(du -k "$out" | awk '{print $1}')
      echo "  $base : ${orig}KB → ${new}KB"
    done
  elif [ -d "$src_pbi/videos" ]; then
    echo "[prepare-artifacts] ffmpeg 없음 — 영상 원본 복사"
    cp -R "$src_pbi/videos/." "$dst_pbi/videos/"
  fi
done

echo "[prepare-artifacts] done"
du -sh "$DEST" 2>&1 | tail -1
