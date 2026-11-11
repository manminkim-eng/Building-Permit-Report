/* ═══════════════════════════════════════════════════
   건축허가조사 및 검사조서  MANMIN Ver-6.1
   Service Worker — 오프라인 캐시 + 버전 업데이트
   ARCHITECT KIM MANMIN

   v6.1.0 (2026-11-11) — 첫 배포판. 편의시설 v6.1.0 sw 구조(문서 Network-first · 자기 접두어 캐시만 조회 ·
   allSettled 프리캐시 · R25 opaque 가드)를 그대로 쓰고 접두어만 'permit-' 로 바꿨다.
   설계개요 PDF 불러오기용 pdf.js 3.11.174(본체 · worker)도 미리 받아 둔다(글꼴 cMap 은 처음 쓸 때 받아 캐시).
   v6.1.1 (2026-11-11) — 사용자 매뉴얼 연결(탭 막대 「📘 매뉴얼」 · 매뉴얼은 프리캐시 안 함) · 안내 문구를 자동 선판정과 맞춤.
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

const CACHE  = 'permit-v6.1.1';   /* 2026-11-11 사용자 매뉴얼 연결 */
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
