"""매뉴얼 캡처용 가상 설계개요 PDF(글자형) — 실제 도면 대신 쓰는 견본. 사업명 · 건축주 · 위치는 가상.
   사용: python -X utf8 make_sample_pdf.py <출력.pdf>"""
import sys, fitz
out = sys.argv[1]
FONT = r'C:\Windows\Fonts\malgun.ttf'
ROWS = [
    ('사업명', '만민 연구동 신축공사'),
    ('건축주', '만민시'),
    ('대지위치', '전북특별자치도 만민시 만민면 만민리 267'),
    ('지번', '267번지 외 8필지'),
    ('지역지구구역', '일반공업지역, 지구단위계획구역'),
    ('건축구분', '신축'),
    ('주용도', '교육연구시설(연구소)'),
    ('대지면적', '2,390.00 ㎡'),
    ('건축면적', '626.14 ㎡'),
    ('건폐율', '26.20 %', '법정 70 % 이하'),
    ('연면적', '712.14 ㎡'),
    ('용적률산정용연면적', '712.14 ㎡'),
    ('용적률', '29.80 %', '법정 350 % 이하'),
    ('규모', '지상 2층 / 지하 0층'),
    ('최고높이', '11.11'),
    ('구조', '일반철골조'),
    ('주차대수', '법정 2대 / 8대 계획'),
]
doc = fitz.open()
p = doc.new_page(width=842, height=595)   # A4 가로(도면 시트처럼)
p.insert_font(fontname='mg', fontfile=FONT)
p.insert_text((60, 60), '■ 건축개요', fontname='mg', fontsize=18)
p.insert_text((560, 60), 'A-011  건축개요  (매뉴얼 견본 — 가상 사업)', fontname='mg', fontsize=9, color=(.4, .4, .4))
y = 100; H = 26
for r in ROWS:
    p.draw_rect(fitz.Rect(55, y - 17, 205, y + H - 17), color=(.3, .3, .3), width=.6)
    p.draw_rect(fitz.Rect(205, y - 17, 560, y + H - 17), color=(.3, .3, .3), width=.6)
    p.insert_text((65, y), r[0], fontname='mg', fontsize=11)
    p.insert_text((215, y), r[1], fontname='mg', fontsize=11)
    if len(r) > 2: p.insert_text((400, y), r[2], fontname='mg', fontsize=10, color=(.2, .2, .5))
    y += H
p.insert_text((600, 500), 'MANMIN 매뉴얼 견본', fontname='mg', fontsize=10, color=(.5, .5, .5))
doc.save(out); print('ok', out)
