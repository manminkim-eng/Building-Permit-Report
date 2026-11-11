#!/bin/bash
# 매뉴얼 전체 재생성: 캡처 → WebP → HTML → PDF → 검증   usage: bash build.sh <repoDir> <rawDir> <견본PDF> <sample_answers.json>
# 환경: MM_PW(playwright 경로) · NODE(node 실행 파일, 기본 node) · PY(python, 기본 python)
set -e; cd "$(dirname "$0")"; REPO="$(cd "$1" && (pwd -W 2>/dev/null || pwd))"; RAW="$2"; SAMPLE="$3"; ANS="$4"; M="$REPO/manual"; NODE="${NODE:-node}"; PY="${PY:-python}"; rm -rf "$RAW"; mkdir -p "$RAW" "$M/images"
"$NODE" capture_bpr.js "$REPO" "$RAW" "$SAMPLE" "$ANS" > "$RAW/_log.json"
"$PY" -X utf8 - "$RAW" "$M" <<'PY'
import sys,glob,os,shutil
from PIL import Image
raw,M=sys.argv[1],sys.argv[2]
for f in glob.glob(M+'/images/s*.webp'): os.remove(f)
for f in sorted(glob.glob(raw+'/s*.png')): Image.open(f).convert('RGB').save(M+'/images/'+os.path.basename(f)[:-4]+'.webp',quality=82,method=6)
shutil.copy(raw+'/_marks.json',M+'/images/_marks.json'); shutil.copy(raw+'/_example.json',M+'/_tools/_example.json')
PY
MANUAL_DIR="$M" "$PY" -X utf8 gen_manual_bpr.py
"$NODE" pdf_bpr.js "$M" BPR_사용자매뉴얼_Ver-6.1.pdf "건축허가조사 및 검사조서 사용자 매뉴얼 Ver-6.1"
"$PY" -X utf8 verify_manual.py "$REPO"
