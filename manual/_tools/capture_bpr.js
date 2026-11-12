// 건축허가조사 및 검사조서 매뉴얼 화면 캡처 — usage: node capture_bpr.js <repoDir> <outDir> <견본PDF> <sample_answers.json>
// 편의시설 매뉴얼과 같은 규격: 1440×900 · DSF 1.25 · _marks.json(번호 배지 % 좌표) · _example.json(예제 검증값)
/* 예제 A(가상 사업 「만민 연구동 신축공사」) — 면적 · 층수 · 체크리스트 답은 세움터 견본(특장차 연구동) 출력물 그대로, 사업명 · 건축주 · 위치만 가상
   ① 설계개요 PDF(가상 견본) 불러오기 → ② 종합의견 입력 → ③ 자동 선판정(① · ② 묶음은 기본 체크, ③ 묶음은 토지이용계획을 확인했다고 보고 켬) → ④ 나머지 답은 세움터 견본 답으로 채움 → 조서 출력
   v6.1.10(2026-11-13): 건축 조례 · 주차장 · 대지 안의 공지 안내 그림 s28_pg 추가(서산시 · 제2종일반주거지역 · 공장 — 설명용)
   v6.1.5(2026-11-12): 조례 값 그림 s27_ord 추가 · 법령 링크 표시점 · ③ 묶음 기본 꺼짐 반영 · 선판정 답과 세움터 견본 답 대조(judgeCmp) 기록 */
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]),PDF=path.resolve(process.argv[4]),ANSW=JSON.parse(fs.readFileSync(process.argv[5],'utf8'));fs.mkdirSync(out,{recursive:true});
const VW=1440,VH=900,DSF=1.25,PORT=8896;
const FREEZE=`(()=>{const T=new Date(2026,10,12,10,0,0).getTime();const D=Date;class F extends D{constructor(...a){if(a.length)super(...a);else super(T);}static now(){return T;}}window.Date=F;window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear()}catch(e){}})()`;
const HELP=`window.__vis=e=>e&&e.getClientRects().length>0;
window.__set=(id,v)=>{const e=document.getElementById(id);e.value=String(v);e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));};
window.__card=(t)=>{const h=[...document.querySelectorAll('.card-title')].find(e=>__vis(e)&&e.textContent.trim().startsWith(t));return h?h.closest('.card'):null;};
window.__find=(sel)=>{
 if(sel.startsWith('card:'))return __card(sel.slice(5));
 if(sel.startsWith('ref:'))return [...document.querySelectorAll('#tab-reference .ref-block')][+sel.slice(4)]||null;
 if(sel.startsWith('wrap:')){const e=document.getElementById(sel.slice(5));return e?(e.parentElement):null;}
 if(sel.startsWith('a4info:'))return document.querySelectorAll('#a4Page table.a4-info-tbl')[+sel.slice(7)]||null;
 if(sel.startsWith('a4cl:'))return document.querySelectorAll('#r-cl table')[+sel.slice(5)]||null;
 if(sel.startsWith('itab:'))return [...document.querySelectorAll('.fml-itab')][+sel.slice(5)]||null;
 if(sel.startsWith('pp:'))return document.getElementById('pp-v-'+sel.slice(3))?document.getElementById('pp-v-'+sel.slice(3)).closest('tr'):null;
 if(sel==='jdlastrow'){const r=[...document.querySelectorAll('#jd-ov .jd-tbl tr')];return r[r.length-1]||null;}
 if(sel.startsWith('jdtier:'))return [...document.querySelectorAll('#jd-ov .jd-tier')][+sel.slice(7)]||null;
 if(sel.startsWith('law:')){const [si,no]=sel.slice(4).split('.');return document.querySelector('#pic-list .pic-sec[data-si="'+si+'"] .pic-law:nth-of-type('+(+no+1)+')')||null;}
 if(sel.startsWith('item:')){return document.querySelector('.pic-item[data-k="'+sel.slice(5)+'"]');}
 if(sel.startsWith('subs:')){return document.getElementById('sub-g'+sel.slice(5).replace(/\\./g,'_'));}
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(__vis);if(e)return e;}return null;};
window.__lawOf=(k)=>{const it=document.querySelector('.pic-item[data-k="'+k+'"]');return it?it.closest('.pic-law'):null;};
window.__answers=(A)=>{let n=0;for(const k in A){let I;try{I=findItem(k);}catch(e){continue;}if(answered(k))continue;const oi=I.o.findIndex(o=>o.t.replace(/\\s+/g,'')===A[k].replace(/\\s+/g,''));if(oi>=0){(ANS[k]={}).o=oi;ANS[k].s=[];n++;}}syncAll();return n;};`;
/* 세부 호가 있는 항목을 예제로 하나 고름(캡처 때 찾아서 기록) */
const SHOTS=[
 {id:'s01_overview',tab:'input',clip:'viewport',m:[['.tab-bar-inner','작업 탭'],['.sum-bar-wrap','진행 스트립'],['.law-strip','근거 안내'],['.pic-filebar','PDF · 파일 단추'],['card:조서 표지','조서 표지'],['card:건물개요','건물개요'],['#fab-group','작성 안내']]},
 {id:'s02_tabs',tab:'input',clip:'.app-header',union:'.tab-bar',m:[['.tb:nth-of-type(1)','개요 입력'],['.tb:nth-of-type(2)','체크리스트'],['.tb:nth-of-type(3)','조서 · 체크리스트'],['.tb:nth-of-type(4)','근거'],['.tb-manual','매뉴얼'],['.hdr-right','근거 법령']]},
 {id:'s03_filebar',tab:'input',clip:'.pic-filebar',m:[['.pic-btn-pdf','설계개요 PDF 불러오기'],['.pic-filebar .pic-btn:nth-of-type(2)','파일로 저장'],['.pic-filebar .pic-btn:nth-of-type(3)','파일 불러오기'],['.pic-filebar .pic-btn-warn','전체 초기화']]},
 {id:'s05_cover',tab:'input',clip:'card:조서 표지',m:[['#projectName','사업명'],['#client','건축주'],['#lotNo','지번'],['#siteLoc','대지위치'],['#designDate','설계일자'],['#reportDate','조사 / 검사일자']]},
 {id:'s06_inspector',tab:'input',clip:'card:조사 / 검사자',m:[['#author','성명'],['#licNo','면허번호'],['#memNo','협회 회원번호'],['#regNo','등록번호'],['#firm','사무소명']]},
 {id:'s07_bldinfo',tab:'input',clip:'card:건물개요',m:[['#workType','건축구분'],['#zoning','지역 / 지구 / 구역'],['#siteArea','면적'],['#floorsAbove','층수'],['#bldHeight','최고높이 · 구조'],['#parkLegal','주차'],['#bcrLegal','법정 건폐율 · 용적률'],['#pic-calc','계산 · 대조'],['#pic-ord','조례 값 안내']]},
 {id:'s28_pg',tab:'input',pre:"window.__sv2=['siteLoc','zoning','mainUse'].map(i=>document.getElementById(i).value);__set('siteLoc','충청남도 서산시 (예시)');__set('zoning','제2종일반주거지역');__set('mainUse','공장');recalc()",clip:'#pic-bord',union:'#pic-pg',m:[['#pic-bord','건축 조례 상자'],['#pic-pg','주차장 조례 · 대지 안의 공지 상자']],post:"['siteLoc','zoning','mainUse'].forEach((i,j)=>__set(i,window.__sv2[j]));recalc()"},
 {id:'s27_ord',tab:'input',pre:"window.__sv=['siteLoc','bcrLegal','farLegal'].map(i=>document.getElementById(i).value);__set('siteLoc','전북특별자치도 익산시 (예시)');__set('bcrLegal','');__set('farLegal','');recalc()",clip:'#pic-calc',union:'#pic-ord',m:[['#pic-calc','계산 줄'],['#pic-ord','조례 값 상자'],['#pic-ord .pic-ord-btn','조례 값 채우기']],post:"['siteLoc','bcrLegal','farLegal'].forEach((i,j)=>__set(i,window.__sv[j]));recalc()"},
 {id:'s08_opinion',tab:'input',clip:'card:종합의견',m:[['#opinion','종합의견'],['#etcNote','그 밖의 사항']]},
 {id:'s09_check_top',tab:'check',clip:'viewport',m:[['#pic-prog','진행 표시'],['#pic-filter','보기'],['#pic-q','찾기'],['.pic-toolbar .pic-btn-pdf','자동 선판정'],['.pic-toolbar .pic-btn:nth-of-type(2)','미답 → 대상법규아님'],['.pic-toolbar .pic-btn-warn','답 모두 지우기'],['.pic-sec-h','입지 관련 법령']]},
 {id:'s10_judge',tab:null,pre:"judgeOpen();document.querySelector('#jd-ov .pp-bd').scrollTop=0",wait:700,fixed:true,clip:'#jd-ov .pp-box',m:[['#jd-ov .pp-info','안내 · 항목 수'],['jdtier:0','① 계산'],['jdtier:1','② 규모 문턱']]},
 {id:'s11_judge_tail',tab:null,pre:"const b=document.querySelector('#jd-ov .pp-bd');b.scrollTop=b.scrollHeight",wait:600,fixed:true,clip:'#jd-ov .pp-box',m:[['jdlastrow','③ · ④ 묶음 — 기본 체크 꺼짐'],['#jd-ov .pp-miss,#jd-ov .pp-ref','더 넣을 칸 · 한계'],['#jd-ov .pp-go','체크한 답 채우기']],post:"judgeTier(3,true);judgeApply()"},
 {id:'s12_law_done',tab:'check',pre:"window.scrollTo(0,0)",clip:'LAW:0.1.0',m:[['item:0.1.0','선판정으로 고른 답'],['#mm-g0_1_0','비고'],['LAWA','법령 이름 링크']]},
 {id:'s13_subs',tab:'check',pre:"__answers(window.__ANSW)",clip:'SUBLAW',m:[['SUBITEM','선택지'],['SUBS','세부 호']]},
 {id:'s14_sumbar',tab:'check',clip:'.sum-bar-wrap',m:[['#sb-site','입지'],['#sb-bld','건축물'],['#sb-all','전체'],['#sb-real','실질 답'],['#sb-none','미답']]},
 {id:'s15_result',tab:'result',clip:'viewport',m:[['.mm-btn-print','인쇄 / PDF 저장'],['.mm-btn-jpg','JPG 저장'],['label.bff-figopt:nth-of-type(1)','세부 호 모두 인쇄'],['label.bff-figopt:nth-of-type(2)','대상법규아님 빼고 인쇄'],['#a4Page','A4 조서']]},
 {id:'s16_a4_cover',tab:'result',clip:'#a4Page .pic-formno',union:'a4info:1',m:[['a4info:0','조서 표지(별지 제23호서식)'],['.pic-submit','제출 문구'],['.pic-attach','첨부서류'],['a4info:1','참고 — 건물개요']]},
 {id:'s17_a4_cl',tab:'result',clip:'.pic-cl-head',union:'a4cl:0',maxH:1000,m:[['.pic-cl-head .a4-title','[별표 2] 체크리스트'],['#r-count','답한 항목 수'],['a4cl:0 thead','번호 · 법령 · 체크항목 · 체크 · 비고']]},
 {id:'s18_a4_sign',tab:'result',clip:'.a4-sign',union:'.a4-footer',m:[['.a4-sign-submit','첨부 문구'],['#r-date3','날짜'],['.a4-sign-supervisor','조사 / 검사자'],['.a4-footer-ver','꼬리말']]},
 {id:'s19_onlyreal',tab:'result',pre:"document.getElementById('optOnlyReal').checked=true;renderResult()",clip:'.pic-cl-head',union:'a4cl:0',maxH:900,m:[['#r-count','실질 답만 표시']],post:"document.getElementById('optOnlyReal').checked=false;renderResult()"},
 {id:'s20_reference',tab:'reference',clip:'.ref-two-col',m:[['ref:0','법적 근거'],['ref:1','이 판의 데이터 · 한계']]},
 {id:'s21_help_howto',tab:'input',pre:"openModal()",wait:1500,fixed:true,clip:'#fmlBox',m:[['itab:0','이용방법'],['itab:1','서식 구조'],['itab:2','주의사항']]},
 {id:'s22_help_method',tab:null,pre:"document.querySelectorAll('.fml-itab')[1].click();document.querySelector('.fml-bd').scrollTop=0",wait:1200,fixed:true,clip:'#fmlBox',m:[]},
 {id:'s23_help_caution',tab:null,pre:"document.querySelectorAll('.fml-itab')[2].click();document.querySelector('.fml-bd').scrollTop=0",wait:1200,fixed:true,post:"closeModal()",clip:'#fmlBox',m:[]},
];
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(FREEZE);
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(3000);
 await pg.addStyleTag({content:'#mm-toast{display:none!important}.hdr-shell,.pic-toolbar,.sum-bar-wrap{position:static!important}'});
 await pg.evaluate(HELP);await pg.evaluate(a=>{window.__ANSW=a;},ANSW);
 await pg.evaluate(()=>{const b=document.querySelector('.mm-install-banner,#installBanner,.install-banner');if(b)b.remove();});
 const meta={},ex={};
 const shot=async(S)=>{
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   const res=x=>{if(x==='LAW:0.1.0')return __lawOf('0.1.0');if(x==='LAWA'){const l=__lawOf('0.1.0');return l?l.querySelector('a.pic-law-a'):null;}if(x==='SUBLAW')return __lawOf(window.__SUBK);if(x==='SUBITEM')return __find('item:'+window.__SUBK)&&__find('item:'+window.__SUBK).querySelector('.pic-opts');if(x==='SUBS')return __find('subs:'+window.__SUBK);
     if(x.endsWith(' thead')){const t=__find(x.slice(0,-6));return t?t.querySelector('thead'):null;}return __find(x);};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=res(S.clip);if(!el)return {err:'clip '+S.clip};if(!S.fixed)el.scrollIntoView({block:'start'});const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     if(S.union){const e2=res(S.union);if(e2){const a2=abs(e2);const x0=Math.min(clip.x,a2.x),y0=Math.min(clip.y,a2.y),x1=Math.max(clip.x+clip.width,a2.x+a2.w),y1=Math.max(clip.y+clip.height,a2.y+a2.h);clip={x:x0,y:y0,width:x1-x0,height:y1-y0};}}
     if(S.clip==='.a4-sign'||S.clip==='#a4Page .pic-formno'||S.clip==='.pic-cl-head'){const p=abs(document.getElementById('a4Page'));clip.x=p.x;clip.width=p.w;clip.y-=10;clip.height+=(S.clip==='.a4-sign'?20:16);}
     if(S.maxH&&clip.height>S.maxH)clip.height=S.maxH;}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=res(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(a.w/clip.width*100).toFixed(2),h:+(Math.min(a.h,clip.y+clip.height-a.y)/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);return;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else if(S.fixed){const sx=await pg.evaluate(()=>scrollX),sy=await pg.evaluate(()=>scrollY);await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:c.x-sx,y:c.y-sy,width:c.width,height:Math.min(c.height,VH)}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(S.fixed?Math.min(c.height,VH):cl.height),marks:info.marks};
 };
 const run=async(S)=>{
  if(S.tab){await pg.evaluate(t=>{switchTab(t);window.scrollTo(0,0);},S.tab);await pg.waitForTimeout(600);}
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||700);
  await shot(S);
  if(S.post){try{await pg.evaluate(S.post);}catch(e){errs.push(S.id+' post '+e.message);}await pg.waitForTimeout(500);}
 };
 /* ① 첫 화면 · 탭 · 단추(빈 상태) */
 await run(SHOTS.find(x=>x.id==='s02_tabs'));
 /* ② 설계개요 PDF 불러오기 → 미리보기 */
 await pg.setInputFiles('#pic-pdf',PDF);
 await pg.waitForSelector('#pp-ov:not([hidden]) .pp-box',{timeout:60000});await pg.waitForTimeout(800);
 ex.pdf=await pg.evaluate(()=>({page:window._ppLast.page,pages:window._ppLast.pages,kind:window._ppLast.kind||'',val:window._ppLast.val}));
 await shot({id:'s04_pdf_preview',fixed:true,clip:'#pp-ov .pp-box',m:[['#pp-ov .pp-info','읽은 쪽 · 안내'],['pp:projectName','채움 체크 · 읽은 값'],['pp:zoning','지역 / 지구 / 구역'],['pp:siteArea','면적'],['#pp-ov .pp-go','채우기']]});
 await pg.evaluate(()=>ppFill());await pg.waitForTimeout(600);
 /* ③ 사용자가 직접 넣는 칸 */
 await pg.evaluate(()=>{__set('designDate','2026-10-30');__set('opinion','관계 법령에 적합하게 설계되었음.');recalc();});
 ex.calc=await pg.evaluate(()=>document.getElementById('pic-calc').textContent);
  ex.ordNone=await pg.evaluate(()=>document.getElementById('pic-ord').innerText);
 for(const id of ['s01_overview','s03_filebar','s05_cover','s06_inspector','s07_bldinfo'])await run(SHOTS.find(x=>x.id===id));
 {const S=SHOTS.find(x=>x.id==='s27_ord');await pg.evaluate(S.pre);await pg.waitForTimeout(500);ex.ordBox=await pg.evaluate(()=>document.getElementById('pic-ord').innerText);const p2=S.pre,q2=S.post;S.pre=null;S.post=null;await run(S);S.pre=p2;S.post=q2;await pg.evaluate(S.post);await pg.waitForTimeout(400);}
 {const S=SHOTS.find(x=>x.id==='s28_pg');await pg.evaluate(S.pre);await pg.waitForTimeout(500);ex.pgBox=await pg.evaluate(()=>document.getElementById('pic-pg').innerText);ex.bordBox=await pg.evaluate(()=>document.getElementById('pic-bord').innerText);const p2=S.pre,q2=S.post;S.pre=null;S.post=null;await run(S);S.pre=p2;S.post=q2;await pg.evaluate(S.post);await pg.waitForTimeout(400);}
 ex.calc2=await pg.evaluate(()=>document.getElementById('pic-calc').textContent);
 for(const id of ['s08_opinion','s09_check_top'])await run(SHOTS.find(x=>x.id===id));
 /* ④ 자동 선판정 */
 const pre=await pg.evaluate(()=>{judgeOpen();const P=window._jdLast;judgeClose();return {n:P.rows.length,tiers:[1,2,3,4].map(t=>P.rows.filter(r=>r.tier===t).length),need:P.need,warn:P.warn||[],rows:P.rows.map(r=>({k:r.k,t:r.t,tier:r.tier}))};});
 {const nz=v=>String(v||'').replace(/\s+/g,'');const c={same:0,diff:[],blank:[]};pre.rows.forEach(r=>{if(!(r.k in ANSW))c.blank.push(r.k+':'+r.t+'(묶음 '+r.tier+')');else if(nz(ANSW[r.k])===nz(r.t))c.same++;else c.diff.push(r.k+':'+r.t+' ↔ 견본 '+ANSW[r.k]+'(묶음 '+r.tier+')');});ex.judgeCmp=c;delete pre.rows;}
 ex.judge=pre;
 await run(SHOTS.find(x=>x.id==='s10_judge'));await run(SHOTS.find(x=>x.id==='s11_judge_tail'));
 ex.afterJudge=await pg.evaluate(()=>document.getElementById('pic-prog').textContent);
 await run(SHOTS.find(x=>x.id==='s12_law_done'));
 /* ⑤ 나머지 답(세움터 견본) · 세부 호 예제 항목 */
 const sk=await pg.evaluate(a=>{__answers(a);const it=[...document.querySelectorAll('.pic-subs')].find(x=>!x.hidden&&x.querySelectorAll('.pic-sub').length>=2&&x.querySelectorAll('.pic-sub').length<=8);return it?it.closest('.pic-item').dataset.k:null;},ANSW);
 await pg.evaluate(k=>{window.__SUBK=k;const I=findItem(k);if(ANS[k]&&(!ANS[k].s||!ANS[k].s.length)){ANS[k].s=[0];syncItem(k);}},sk);
 ex.subK=sk;ex.subItem=await pg.evaluate(k=>{const p=k.split('.');const S=CL[+p[0]];const L=S.laws.find(l=>l.no===+p[1]);const I=L.items[+p[2]];return {law:L.law,item:I.n,opt:I.o[ANS[k].o].t,subs:I.o[ANS[k].o].s};},sk);
 await run(SHOTS.find(x=>x.id==='s13_subs'));
 ex.full=await pg.evaluate(()=>({prog:document.getElementById('pic-prog').textContent,site:document.getElementById('sb-site').textContent,bld:document.getElementById('sb-bld').textContent,all:document.getElementById('sb-all').textContent,real:document.getElementById('sb-real').textContent,none:document.getElementById('sb-none').textContent}));
 await run(SHOTS.find(x=>x.id==='s14_sumbar'));
 for(const id of ['s15_result','s16_a4_cover','s17_a4_cl','s18_a4_sign'])await run(SHOTS.find(x=>x.id===id));
 ex.a4count=await pg.evaluate(()=>document.getElementById('r-count').textContent);
 ex.a4cover=await pg.evaluate(()=>[...document.querySelectorAll('#a4Page table.a4-info-tbl tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()));
 await run(SHOTS.find(x=>x.id==='s19_onlyreal'));
 await pg.evaluate(()=>{document.getElementById('optOnlyReal').checked=true;renderResult();});ex.onlyReal=await pg.evaluate(()=>document.getElementById('r-count').textContent);
 await pg.evaluate(()=>{document.getElementById('optOnlyReal').checked=false;renderResult();});
 /* 인쇄 장수(전체 · 선별) */
 for(const only of [false,true]){await pg.evaluate(o=>{switchTab('result');document.getElementById('optOnlyReal').checked=o;renderResult();},only);await pg.emulateMedia({media:'print'});await pg.evaluate(()=>dispatchEvent(new Event('beforeprint')));await pg.waitForTimeout(300);
  const f=path.join(out,'_a4_'+(only?'sel':'all')+'.pdf');await pg.pdf({path:f,preferCSSPageSize:true,printBackground:true});await pg.evaluate(()=>dispatchEvent(new Event('afterprint')));await pg.emulateMedia({media:'screen'});
  ex[only?'pagesSel':'pagesAll']=(fs.readFileSync(f,'latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;}
 await pg.evaluate(()=>{document.getElementById('optOnlyReal').checked=false;renderResult();});
 for(const id of ['s20_reference','s21_help_howto','s22_help_method','s23_help_caution'])await run(SHOTS.find(x=>x.id===id));
 /* 모바일 */
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true});await setup(mctx);
 const mp=await mctx.newPage();await mp.addInitScript(FREEZE);
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(3000);
 await mp.evaluate(()=>{const m=document.getElementById('ios-modal-dem');if(m)m.style.display='none';});
 await mp.screenshot({path:path.join(out,'s24_mobile_main.png')});meta['s24_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(a=>{for(const k in a){let I;try{I=findItem(k);}catch(e){continue;}const oi=I.o.findIndex(o=>o.t.replace(/\s+/g,'')===a[k].replace(/\s+/g,''));if(oi>=0){(ANS[k]={}).o=oi;ANS[k].s=[];}}syncAll();switchTab('check');window.scrollTo(0,0);},ANSW);await mp.waitForTimeout(800);
 await mp.screenshot({path:path.join(out,'s25_mobile_check.png')});meta['s25_mobile_check']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{switchTab('result');window.scrollTo(0,0);});await mp.waitForTimeout(900);
 await mp.screenshot({path:path.join(out,'s26_mobile_a4.png')});meta['s26_mobile_a4']={w:390,h:844,marks:[]};
 const order=['s01_overview','s02_tabs','s03_filebar','s04_pdf_preview','s05_cover','s06_inspector','s07_bldinfo','s08_opinion','s09_check_top','s10_judge','s11_judge_tail','s12_law_done','s13_subs','s14_sumbar','s15_result','s16_a4_cover','s17_a4_cl','s18_a4_sign','s19_onlyreal','s20_reference','s21_help_howto','s22_help_method','s23_help_caution','s24_mobile_main','s25_mobile_check','s26_mobile_a4','s27_ord','s28_pg'];
 const M2={};order.forEach(k=>{if(meta[k])M2[k]=meta[k];});
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(M2,null,1));fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify(ex,null,1));
 const miss=[];Object.entries(M2).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x+m.w>100.5||m.y+m.h>100.5)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y+','+m.w+','+m.h);}));
 console.log(JSON.stringify({pdf:ex.pdf,judge:ex.judge,cmp:ex.judgeCmp,ordNone:ex.ordNone,ordBox:ex.ordBox,calc:ex.calc,calc2:ex.calc2,after:ex.afterJudge,full:ex.full,sub:ex.subItem,pages:[ex.pagesAll,ex.pagesSel],sizes:Object.fromEntries(Object.entries(M2).map(([k,v])=>[k,v.w+'x'+v.h])),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();
