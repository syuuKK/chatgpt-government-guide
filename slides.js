(function(){
  'use strict';
  const pages=[...document.querySelectorAll('.slide')],total=pages.length;
  let current=0;
  const prev=document.getElementById('prev-slide'),next=document.getElementById('next-slide');
  const count=document.getElementById('page-count'),bar=document.getElementById('deck-progress-bar');
  const notesBtn=document.getElementById('notes-toggle'),notesPanel=document.getElementById('notes-panel'),notesText=document.getElementById('notes-text');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let runningAnimation=null;
  function goto(index,animate=true){
    const target=Math.min(total-1,Math.max(0,index));
    if(target===current && animate)return;
    const dir=target>current?1:-1;
    current=target;
    if(runningAnimation){runningAnimation.cancel();runningAnimation=null}
    pages.forEach((page,i)=>{page.hidden=i!==current});
    const active=pages[current];
    count.textContent=String(current+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    bar.style.width=(100*(current+1)/total)+'%';
    prev.disabled=current===0;next.disabled=current===total-1;
    notesText.textContent=active.querySelector('.speaker-note')?.textContent.trim()||'無額外提示';
    history.replaceState(null,'','#slide-'+(current+1));
    /* A subtle entrance effect; reduced-motion users always get an instant change. */
    if(animate&&!reduceMotion.matches&&typeof active.animate==='function'){
      runningAnimation=active.animate([
        {opacity:0,transform:'translate3d('+(dir*17)+'px,7px,0) scale(.995)'},
        {opacity:1,transform:'translate3d(0,0,0) scale(1)'}
      ],{duration:320,easing:'cubic-bezier(.22,.8,.28,1)',fill:'none'});
      runningAnimation.addEventListener('finish',()=>{runningAnimation=null},{once:true});
    }
  }
  prev.addEventListener('click',()=>goto(current-1));next.addEventListener('click',()=>goto(current+1));
  notesBtn.addEventListener('click',()=>{notesPanel.hidden=!notesPanel.hidden;notesBtn.setAttribute('aria-pressed',String(!notesPanel.hidden))});
  document.getElementById('fullscreen').addEventListener('click',()=>{
    if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  });
  document.addEventListener('keydown',e=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
    if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){e.preventDefault();goto(current+1)}
    if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();goto(current-1)}
    if(e.key==='Home'){e.preventDefault();goto(0)}
    if(e.key==='End'){e.preventDefault();goto(total-1)}
    if(e.key.toLowerCase()==='n'){notesBtn.click()}
    if(e.key.toLowerCase()==='f'){document.getElementById('fullscreen').click()}
  });
  window.addEventListener('hashchange',()=>{
    const match=location.hash.match(/^#slide-(\d+)$/);
    if(match&&Number(match[1])-1!==current)goto(Number(match[1])-1);
  });
  const initial=Number((location.hash.match(/^#slide-(\d+)$/)||[])[1]||1);
  goto(initial-1,false);
})();
