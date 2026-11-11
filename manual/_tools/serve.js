// [로컬 Windows 실행판 — 원본 serve.js 의 vendor 대체 대신 실제 CDN 을 그대로 씀(2026-11-08, scratch 전용)]
const http=require('http'),fs=require('fs'),path=require('path');
async function setup(ctx){ /* CDN 통과 */ }
function server(repo,port){return new Promise(res=>{const s=http.createServer((q,w)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';
 fs.readFile(path.join(repo,p),(e,d)=>{if(e){w.writeHead(404);w.end();return;}const ext=path.extname(p);const ct={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.pdf':'application/pdf','.ico':'image/x-icon'}[ext]||'application/octet-stream';w.writeHead(200,{'Content-Type':ct});w.end(d);});});s.listen(port,()=>res(s));});}
module.exports={setup,server};
