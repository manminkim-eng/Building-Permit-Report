# -*- coding: utf-8 -*-
"""매뉴얼 검사 — usage: python verify_manual.py <repoDir>
   ① 그림 파일·표시점(0~100%) ② 범례 수 = 표시점 수 ③ 예제 수치(_example.json)가 본문에 있음 ④ 내부 링크 ⑤ 앱 매뉴얼 단추 · SW (허가조서판)"""
import sys, os, re, json
repo = sys.argv[1]; M = os.path.join(repo, 'manual'); ok = True
def chk(name, cond, info=''):
    global ok; ok &= bool(cond); print(('✓' if cond else '✗'), name, info)
h = open(os.path.join(M, 'index.html'), encoding='utf-8').read()
marks = json.load(open(os.path.join(M, 'images', '_marks.json'), encoding='utf-8'))
ex = json.load(open(os.path.join(M, '_tools', '_example.json'), encoding='utf-8'))
figs = re.findall(r'<figure class="shot[^"]*" id="fig-([^"]+)">(.*?)</figure>', h, re.S)
chk('그림 수 = 캡처 수', len(figs) == len(marks), f'{len(figs)}/{len(marks)}')
chk('그림 파일 존재', all(os.path.exists(os.path.join(M, 'images', k + '.webp')) for k in marks))
out = [f'{k}:{m.get("label")}' for k, v in marks.items() for m in v['marks'] if 'x' not in m or m['x'] < 0 or m['y'] < 0 or m['x'] + m['w'] > 100.5 or m['y'] + m['h'] > 100.5]
chk('표시점이 이미지 안', not out, str(out[:5]))
bad = [sid for sid, body in figs if body.count('<li><b>') != len(marks[sid]['marks'])]
chk('범례 수 = 표시점 수', not bad, str(bad))
need = [ex['calc'], ex['afterJudge'], ex['full']['prog'], ex['onlyReal'], ex['subItem']['law'], ex['pdf']['val']['projectName']]
miss = [n for n in need if n not in h]
chk('예제 수치가 본문에 있음', not miss, str(miss))
chk('예제 선판정', ex['judge']['n'] == 61 and ex['judge']['tiers'] == [4, 18, 27, 12] and f"{sum(ex['judge']['tiers'][:3])}항목" in h)
chk('예제 출력 쪽수', ex['pagesAll'] == 10 and ex['pagesSel'] == 3 and ex['full']['none'] == '0칸')
ids = set(re.findall(r'id="([^"]+)"', h)); links = set(re.findall(r'href="#([^"]+)"', h))
chk('내부 링크', links <= ids, str(sorted(links - ids)[:5]))
chk('법령 판 표기', '2026.2.27. 시행' in h and '제2026-360호' in h and '제2024-206호' in h and '&lt;개정 2024. 7. 1.&gt;' in h)
chk('주민등록번호 모양 없음', not re.search(r'\d{6}-\d{7}', h))
app = open(os.path.join(repo, 'index.html'), encoding='utf-8').read()
chk('앱 — 매뉴얼 단추', 'class="tb tb-manual"' in app and 'Building-Permit-Report/manual/' in app and '매뉴얼은 인터넷 연결 시 열립니다' in app)
sw = open(os.path.join(repo, 'sw.js'), encoding='utf-8').read()
chk('SW — 매뉴얼 프리캐시 안 함', "'./manual" not in sw and '"./manual' not in sw and 'permit-v6.1.5' in sw)
import json as _j
_m=re.search(r'const ORD=(.*?);\s*function ordFind', app, re.S); _o=_j.loads(_m.group(1)) if _m else {'L':{}}
chk('조례 14개 — 이름 · 시행일 · 조문이 본문에 있음', len(_o['L'])==14 and all((v['n'] in h or k in h) and v['e'] in h and v['bj'] in h and v['fj'] in h for k,v in _o['L'].items()))
chk('v6.1.5 본문', '(v6.1.5)' in h and 'id="s4-5">4-5. 조례 값' in h and 'id="fig-s27_ord"' in h and f"{sum(ex['judge']['tiers'][:2])}항목" in h and '기본 꺼짐 — 토지이용계획확인원 확인 후 체크' in h)
chk('선판정 답 = 세움터 견본', ex['judgeCmp']['diff']==[] and ex['judgeCmp']['same']+len(ex['judgeCmp']['blank'])==ex['judge']['n'])
chk('PDF 있음', os.path.exists(os.path.join(M, 'BPR_사용자매뉴얼_Ver-6.1.pdf')))
sys.exit(0 if ok else 1)
