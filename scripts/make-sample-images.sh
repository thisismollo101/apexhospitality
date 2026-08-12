#!/usr/bin/env bash
# Build the placeholder image set used by the /samples design references.
#
# Frames are pulled from the card clips already in public/media/cards rather
# than from grey boxes or an external stock service: a sample page is only
# useful if it shows what the layout does with real photography, and these are
# real hospitality footage we already ship. Each clip yields one frame per
# aspect ratio, centre-cropped then scaled.
#
# Idempotent. Re-run after changing a card clip; outputs are committed.
set -euo pipefail

FFMPEG=${FFMPEG:-/opt/node22/lib/node_modules/ffmpeg-static/ffmpeg}
SRC=public/media/cards
OUT=public/media/samples

# Seek far enough in to clear any fade-up on the first frames.
SEEK=2.0

# ratio:width:height — the four shapes a marketing page actually asks for.
RATIOS=(
  "16x9:1600:900"
  "4x3:1200:900"
  "1x1:900:900"
  "9x16:720:1280"
)

CLIPS=(international weddings welcome dining accommodation flagship corporate)

for r in "${RATIOS[@]}"; do
  IFS=: read -r name w h <<<"$r"
  mkdir -p "$OUT/$name"
  i=1
  for clip in "${CLIPS[@]}"; do
    "$FFMPEG" -y -loglevel error -ss "$SEEK" -i "$SRC/$clip.mp4" -frames:v 1 \
      -vf "crop='min(iw,ih*$w/$h)':'min(ih,iw*$h/$w)',scale=$w:$h:flags=lanczos" \
      -q:v 5 "$OUT/$name/$i.jpg"
    i=$((i + 1))
  done
done

# Round avatars for testimonial and team blocks.
mkdir -p "$OUT/avatar"
i=1
for clip in "${CLIPS[@]}"; do
  "$FFMPEG" -y -loglevel error -ss "$SEEK" -i "$SRC/$clip.mp4" -frames:v 1 \
    -vf "crop='min(iw,ih)':'min(iw,ih)',scale=200:200:flags=lanczos" \
    -q:v 6 "$OUT/avatar/$i.jpg"
  i=$((i + 1))
done

du -sh "$OUT"
find "$OUT" -name '*.jpg' | wc -l | xargs echo 'images:'
