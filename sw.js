/* ═══════════════════════════════════════════════════
   v6.1.26 (2026-11-27) — 필수 4건(허가 출력 검증 · 교차검증_2026-11-27): P1 인쇄 · JPG 단추 앞 확인창에 미답 칸 · 답 0/159 · 주차 법정값 경고를 함께 묻는다 / P3 주차 법정 칸을 주차장법 시행령 별표 1 국가 기준(조례 없는 곳 포함 · 0대 포함)과 대조 — 작으면 주황 경고, 크면 회색 안내(값은 바꾸지 않음) / P4 PDF 원문의 「분할」 글자를 숨은 칸 pdfNote 에 보관(저장 · 불러오기) — 선판정 건축 15 대지분할제한 「적합」 + ④ 확인 필요(시행령 제80조 · 법 제57조제2항) / P5 녹지지역과 그 밖의 지역에 걸친 대지는 조경설치 대상 「대상」 + ④ 확인 필요(녹지만이면 지금처럼 예외대상)
   v6.1.26 (2026-11-27) — 별지 제24호서식 사용승인조사 및 검사조서 겸용: 요약 띠 「📑 조서: 허가(제23호) / 사용승인(제24호)」 · 저장 파일 formKind(없는 옛 파일은 23) · 허가번호 · 허가일자 칸(24호, PDF 에서도 읽음) · 24호에서 면허번호 → 자격번호, 등록번호 → 신고번호(이름만) · 현장조사 49행(서식 원문, 앞쪽 19 · 뒤쪽 30) · 「해당 없음」 후보만 개요 · 23호 선판정 규칙으로 채움(🟨 확인 필요) · 「일치 · 불일치」는 고르지 않음 · 건폐율 · 용적률은 조례 값 · 개요 계산으로 미리 채움 · 조경 · 공개공지 조례 % 는 손입력 · A4 2쪽 · 23호 화면 · 인쇄 불변
   v6.1.25 (2026-11-26) — 하단 단추 통일 — 공통 원본 MM-FAB v1.0 주입(오른쪽 아래 안내 · 초기화 · 앱 설치 · 건물개요 단추를 한 기둥으로 — 단추 72×76 · 건물개요 72×28 · 간격 8px · z-index 1200 · 숨은 단추는 자리 없음 · 설치 뒤 · 앱 실행 중 설치 단추 숨김 · 설치 띠가 뜨면 기둥을 그 위로 · 휴대폰 가로 60×60) — 계산 불변 · 인쇄는 설치 · 업데이트 띠만 숨김 · MIN 「권장안대로 승인」 · 캐시명 v6.1.25 (종전 v6.1.24)
   v6.1.24 (2026-11-25) — 헤더 고정 — 공통 원본 MM-HEADER v1.1 주입(태블릿 · 데스크톱만 — 폭 768px · 높이 600px 이상, 휴대폰은 고정 없음 · 머리+탭 sticky · 내리면 제목 한 줄+탭으로 접힘 · 다른 sticky 패널 top 보정) — 계산 · 인쇄 불변 · MIN 「추천안대로 승인」 · 「추천안대로 진행해줘」(모바일 제외) · 캐시명 v6.1.24 (종전 v6.1.23)
   v6.1.3 (2026-11-12) — Pretendard CSS SRI(integrity · crossorigin)(정밀검토 C2) — 화면 · 계산 · 인쇄 불변 · 작업지시서 §25-6-82 · 캐시명 v6.1.3 (종전 v6.1.2)
   건축허가조사 및 검사조서  MANMIN Ver-6.1
   Service Worker — 오프라인 캐시 + 버전 업데이트
   ARCHITECT KIM MANMIN

   v6.1.0 (2026-11-11) — 첫 배포판. 편의시설 v6.1.0 sw 구조(문서 Network-first · 자기 접두어 캐시만 조회 ·
   allSettled 프리캐시 · R25 opaque 가드)를 그대로 쓰고 접두어만 'permit-' 로 바꿨다.
   설계개요 PDF 불러오기용 pdf.js 3.11.174(본체 · worker)도 미리 받아 둔다(글꼴 cMap 은 처음 쓸 때 받아 캐시).
   v6.1.1 (2026-11-11) — 사용자 매뉴얼 연결(탭 막대 「📘 매뉴얼」 · 매뉴얼은 프리캐시 안 함) · 안내 문구를 자동 선판정과 맞춤.
   v6.1.2 (2026-11-12) — 한국건축규정 현행 국토교통부고시 제2026-360호(2026. 7. 8. 발령) 병기(안내 3곳 · A4 꼬리말 · 근거 표) · 체크리스트 데이터 변경 없음
   v6.1.4 (2026-11-12) — 법령 이름 국가법령정보센터 링크 · 국토계획법 제63조/제76조 세부 호 바로잡음 · 자동 선판정 v0.5(③ 묶음 기본 체크 끔 등)
   v6.1.5 (2026-11-12) — 조례 값 적용(전북특별자치도 14개 시 · 군 용도지역별 건폐율 · 용적률) · 자동 선판정 v0.6
   v6.1.6 (2026-11-12) — 건축 조례 값 1단계(전북 14개 시 · 군 조경 비율 · 공개공지 조례 대상 · 대지 분할 최소면적) · 자동 선판정 v0.7
   v6.1.7 (2026-11-12) — 조례 근거 표현(선판정 근거 수치를 비고에 · A4 참고 건물개요에 법정값 근거 · 위임 근거 병기 · 근거 탭 조례 목록 표) · 자동 선판정 v0.8
   v6.1.9 (2026-11-13) — 지역 확대: 전남 22 · 충남 15 시 · 군 건폐율 · 용적률 + 건축 조례(조경 · 공개공지 · 분할)
   v6.1.8 (2026-11-12) — 주차장 조례 · 대지 안의 공지 안내(전북 14개 시 · 군 · 판정에 쓰지 않음) · 조경 「대상」 제안 조건부 · 자동 선판정 v0.9
   v6.1.17 (2026-11-13) — 1112 대조 개선(조경 · 걸치는 대지 · 건폐율 · 용적률 · 공지 · 농지 · 세부 호 · 개요 칸 3개)
   v6.1.16 (2026-11-13) — 설치계획서 제안 ④ 묶음 · 매뉴얼 개정
   v6.1.15 (2026-11-13) — 자동 선판정 전체 항목 1 · 2 · 3단계 · 건축주 구분 칸
   v6.1.14 (2026-11-13) — 체크리스트 4법령 · 층별 · 주차 소수 · 지목
   v6.1.13 (2026-11-13) — 「제」 없는 용도지역 표기 인식 · 두 용도지역 조례 안내
   v6.1.12 (2026-11-13) — 조례 별표 9곳 · 천안시 건폐율 · 용적률 채움
   v6.1.11 (2026-11-13) — html2canvas SRI · 인쇄 공통 원본 MM-PRINT v1.1(정밀검토 B8)
   v6.1.10 (2026-11-13) — 주차장 조례 · 대지 안의 공지 안내 지역 확대(전남 22 · 충남 15 시 · 군, 51곳)
   ⛔ navigate 분기를 제거하지 말 것. 제거하면 배포가 화면에 반영되지 않는다.
═══════════════════════════════════════════════════ */
const PREFIX = 'permit-';
/* ═ R25 (2026-09-04) — SW 캐시 origin 오염 차단 (S10 · 지시서 §21-1 R25)
   전역 caches 의 match 는 origin 전체를 검색한다. manminkim-eng.github.io 는 34종이 한 origin 이라
   다른 도구 캐시의 opaque 응답이 <script crossorigin>(cors) 요청에 돌아가 스크립트가 폐기됐다
   (30 #root 빈 화면 · 40 html2canvas undefined). 자기 접두어 캐시만 조회하고, cross-origin
   프리캐시는 cors 로 받으며, opaque↔cors 불일치 시 캐시를 쓰지 않는다. */
const MM_EXCLUDE = [];   /* 내 접두어로 시작하지만 남의 캐시인 이름 (§17-1 충돌) */
const mmOwn   = (k) => k.indexOf(PREFIX) === 0 && !MM_EXCLUDE.some((x) => k.indexOf(x) === 0);
const mmReq   = (u) => (typeof u === 'string' && u.indexOf('http') === 0) ? new Request(u, { mode: 'cors' }) : u;
const mmMatch = (req, opt) => caches.keys()
  .then((ks) => ks.filter(mmOwn))
  .then((ks) => ks.reduce((p, k) => p.then((r) => r || caches.open(k).then((c) => c.match(req, opt))), Promise.resolve(undefined)))
  .then((r) => (r && r.type === 'opaque' && req && req.mode === 'cors') ? undefined : r);

const CACHE  = 'permit-v6.1.27';   /* 2026-11-27 별지 제24호 준공 설계개요 선판정 (종전 permit-v6.1.26) · 2026-11-27 필수 4건(P1 · P3 · P4 · P5) · 별지 제24호 겸용 (종전 permit-v6.1.25) · 2026-11-24 건축법 제61조 개정 메모 · 정북일조 선판정 근거 (종전 permit-v6.1.22 — 세움터 서식 읽기(U1) — 칸 안 아래 값 · 겹쳐 찍은 글자 · 단위 붙은 칸 이름 · 그 전 permit-v6.1.21 — 붙은 칸 이름 떼기(U5) · 주차 대수 읽기 · 그 전 permit-v6.1.20 — PDF 값 검사 · ③ · ④ 안전장치 · 도면 비율 대조 경고 · 그 전 permit-v6.1.19 — 선판정 ① ~ ④ 기본 체크 · ③ · ④ 「확인 필요」 표시 · 그 전 permit-v6.1.18 — 한국건축규정 적용 고시 날짜별 · 그 전 permit-v6.1.17 — 1112 대조 개선 · 그 전 permit-v6.1.16 — 설치계획서 제안 ④ 묶음 · 매뉴얼 개정 · 그 전 permit-v6.1.15 — 자동 선판정 전체 항목 1 · 2 · 3단계 · 그 전 permit-v6.1.14 — 체크리스트 4법령 · 층별 · 주차 소수 · 지목 · 그 전 permit-v6.1.13 — 「제」 없는 용도지역 표기 · 그 전 permit-v6.1.12 — 조례 별표 9곳 · 천안 건폐율 · 용적률 · 그 전 permit-v6.1.11 — html2canvas SRI · MM-PRINT v1.1 · 그 전 permit-v6.1.10 — 2026-11-13 주차장 조례 · 대지 안의 공지 지역 확대 · 그 전 permit-v6.1.9 — 2026-11-13 건폐율 · 용적률 · 건축 조례 지역 확대) */
const ORPHAN = [];
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './icons/brand-icon.jpg',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  /* v5.0 — 로컬 폴백 폰트. CDN 차단·오프라인 시 한글 깨짐 방지 (§3-7) */
  './assets/fonts/manmin-fonts.css',
  './assets/fonts/NotoSansKR-var.woff2',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

self.addEventListener('install', e => {
  console.log('[SW] Install:', CACHE);
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(
        ASSETS.map(u => c.add(mmReq(u)).catch(err => console.warn('[SW] precache skip:', u, err)))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('[SW] Activate:', CACHE);
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        /* ⛔ 자기 접두어(+ORPHAN)만 지운다. caches.keys() 는 origin 전체를 반환하므로
           manminkim-eng.github.io 를 39종이 공유하는 이 구조에서 무조건 지우면
           나머지 38종의 캐시를 통째로 날린다(§17-1 · §18-7). */
        keys.filter(k => k !== CACHE && (mmOwn(k) || ORPHAN.indexOf(k) !== -1))
            .map(k => { console.log('[SW] 구버전 캐시 삭제:', k); return caches.delete(k); })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;

  /* ══ ⛔ 핵심 ══ HTML 문서는 Network-first.
     네트워크가 되면 항상 최신을 보여주고, 끊겼을 때만 캐시로 떨어진다. */
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => mmMatch(e.request).then(c => c || mmMatch('./index.html')))
    );
    return;
  }

  /* ══ 정적 자산: Cache-First + 백그라운드 갱신 ══ */
  e.respondWith(
    mmMatch(e.request).then(cached => {
      if (cached) {
        fetch(e.request).then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => Response.error());   /* R19 (2026-09-04): 정적 자산 실패 시 index.html 을 돌려주면 SyntaxError 빈 화면 (§20-10) */
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data && e.data.type === 'GET_VERSION' && e.ports[0]) {
    e.ports[0].postMessage({ version: CACHE });
  }
});

console.log('[SW] loaded:', CACHE);
