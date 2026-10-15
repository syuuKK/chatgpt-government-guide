(function(){const isSingle=document.body.dataset.single==='1';const pages=[...document.querySelectorAll('[data-pane]')];const links=[...document.querySelectorAll('.nav-link')];const sidebar=document.getElementById('sidebar');const overlay=document.getElementById('menu-overlay');const toggle=()=>{sidebar.classList.toggle('open');overlay.classList.toggle('open')};document.getElementById('menu')?.addEventListener('click',toggle);overlay.addEventListener('click',toggle);
function enter(page){if(!document.querySelector('[data-pane="'+page+'"]'))page='home';if(isSingle){pages.forEach(p=>p.hidden=p.dataset.pane!==page)}links.forEach(a=>a.classList.toggle('active',a.dataset.page===page));document.getElementById('crumb').textContent=({'home':'首頁','foundation':'對話與思考','research':'搜尋與研究','files':'文件與資料','multimodal':'語音與多模態','knowledge':'專案與個人化','automation':'自動化與協作','capabilities':'11 大功能總覽','compare':'功能比較','course':'六小時課程','checklist':'開課檢核','sources':'官方來源'})[page]||'首頁';document.title=(document.getElementById('crumb').textContent+'｜ChatGPT 公務實作功能地圖');window.scrollTo({top:0,behavior:'instant'});if(sidebar.classList.contains('open'))toggle();if(page==='checklist')initCheck();}
function route(){let page=(location.hash.match(/^#\/([a-z]+)$/)||[])[1]||'home';enter(page)}
function initCheck(){const boxes=[...document.querySelectorAll('#checklist-view input[type=checkbox]')];if(!boxes.length)return;try{const saved=JSON.parse(localStorage.getItem('chatgpt_course_checklist')||'[]');boxes.forEach(b=>b.checked=saved.includes(b.dataset.c))}catch(e){}const update=()=>{const checked=boxes.filter(b=>b.checked);boxes.forEach(b=>b.closest('.check').classList.toggle('checked',b.checked));document.getElementById('progress-label').textContent=checked.length+' / '+boxes.length+' 完成';document.getElementById('progress-inner').style.width=(checked.length/boxes.length*100)+'%';try{localStorage.setItem('chatgpt_course_checklist',JSON.stringify(checked.map(b=>b.dataset.c)))}catch(e){}};boxes.forEach(b=>{if(!b.dataset.bound){b.addEventListener('change',update);b.dataset.bound='1'}});update();if(!window._checkClicks){window._checkClicks=true;document.getElementById('copy-checks')?.addEventListener('click',async()=>{let val=boxes.map(b=>(b.checked?'☑':'☐')+' '+b.parentElement.textContent.trim()).join('\n');try{await navigator.clipboard.writeText(val);alert('已複製檢核表')}catch(e){window.prompt('複製以下文字',val)}});document.getElementById('reset-checks')?.addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);update()})}}
if(isSingle){window.addEventListener('hashchange',route);route()}else{const active=document.body.dataset.page||'home';enter(active)}
})();
// Function-list filter: supports traditional Chinese keyword search
(function(){const input=document.getElementById('capability-search');if(!input)return;const rows=[...document.querySelectorAll('[data-function-row]')];const counter=document.getElementById('result-count');const empty=document.getElementById('no-category-results');function update(){const q=input.value.trim().toLocaleLowerCase('zh-Hant');let count=0;rows.forEach(r=>{const hit=r.dataset.search.toLocaleLowerCase('zh-Hant').includes(q);r.hidden=!hit;if(hit)count++});counter.textContent=count+' / '+rows.length+' 類';empty.hidden=count>0;}input.addEventListener('input',update);update()})();


/* Website scroll effects — progressive enhancement, no external dependencies */
(function(){
  'use strict';
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  var progressTrack=document.createElement('div');
  progressTrack.className='reading-progress';
  progressTrack.setAttribute('aria-hidden','true');
  var progressBar=document.createElement('div');
  progressBar.className='reading-progress__bar';
  progressTrack.appendChild(progressBar);
  document.body.appendChild(progressTrack);
  var hero=document.querySelector('.hero-home');
  var needsFrame=false;
  function frame(){
    needsFrame=false;
    var maxScroll=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    var position=Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
    progressBar.style.transform='scaleX('+ (maxScroll ? Math.min(1,position/maxScroll) : 1) +')';
    if(hero){
      if(reduceMotion.matches){hero.style.setProperty('--parallax-shift','0px')}
      else{var rect=hero.getBoundingClientRect();
        if(rect.bottom>-200 && rect.top<window.innerHeight+200){
          var smallScreen=window.innerWidth<=740;
          var limit=smallScreen?24:58;
          var travel=Math.max(-limit,Math.min(limit,((window.innerHeight/2)-(rect.top+rect.height/2))*(smallScreen?.035:.075)));
          hero.style.setProperty('--parallax-shift',travel.toFixed(1)+'px');
        }
      }
    }
  }
  function onScroll(){if(!needsFrame){needsFrame=true;window.requestAnimationFrame(frame)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  reduceMotion.addEventListener?.('change',onScroll);
  onScroll();
  var selectors=['.feature-card','.taxonomy-card','.statbox','.priority-item','.timeline-item','.source-row','.plan-mini','.plan-tier-row > div','.step','.hint','.new-section > .section-title-row','.card:not(.feature-card)'];
  var targets=[...new Set(selectors.flatMap(function(sel){return [...document.querySelectorAll(sel)]}))];
  if(!targets.length||reduceMotion.matches||!('IntersectionObserver' in window))return;
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}
    });
  },{rootMargin:'0px 0px -5% 0px',threshold:0.045});
  targets.forEach(function(el,i){
    el.setAttribute('data-scroll-reveal','');
    /* For adjacent cards, use a short stagger, not a delay proportional to page length. */
    var group=el.parentElement;
    var peers=[...group.children].filter(function(s){return s.matches('.feature-card,.taxonomy-card,.statbox,.priority-item,.plan-mini,.step,.card')});
    var localIndex=peers.indexOf(el);
    el.style.setProperty('--reveal-delay',Math.max(0,localIndex%5)*70+'ms');
    var rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight*.92 && rect.bottom>=0){el.classList.add('is-revealed')}
    else{observer.observe(el)}
  });
  document.documentElement.classList.add('motion-enabled');
  reduceMotion.addEventListener?.('change',function(){
    if(reduceMotion.matches){observer.disconnect();targets.forEach(function(el){el.classList.add('is-revealed')})}
  });
})();
