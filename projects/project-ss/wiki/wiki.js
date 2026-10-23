(() => {
  'use strict';
  const side=document.getElementById('sidebar'), menu=document.getElementById('menu'), search=document.getElementById('search'), clear=document.getElementById('clear');
  const links=[...side.querySelectorAll('nav a')], sections=links.map(a=>document.getElementById(a.dataset.section));
  const searchable=sections.map(s=>({section:s,text:s.textContent.toLocaleLowerCase(),link:links.find(a=>a.dataset.section===s.id)}));
  const setMenu=open=>{side.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));};
  menu.addEventListener('click',()=>setMenu(!side.classList.contains('open')));
  links.forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);menu.focus();}});
  document.addEventListener('click',e=>{if(!side.contains(e.target)&&!menu.contains(e.target))setMenu(false);});
  function filter(){
    const words=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let count=0;
    searchable.forEach(({section,text,link})=>{const show=words.every(w=>text.includes(w));section.hidden=!show;link.hidden=!show;if(show)count++;});
    document.getElementById('search-result').textContent=words.length?`${count}개 주제 검색됨`:`${sections.length}개 주제`;
    document.getElementById('empty').hidden=count>0;document.querySelector('.intro').hidden=words.length>0;clear.hidden=!words.length;
  }
  search.addEventListener('input',filter);clear.addEventListener('click',()=>{search.value='';filter();search.focus();});
  document.getElementById('expand').addEventListener('click',function(){const details=[...document.querySelectorAll('section:not([hidden]) details')],open=details.some(d=>!d.open);details.forEach(d=>d.open=open);this.textContent=open?'설명 모두 접기':'설명 모두 펼치기';});
  let ticking=false;function update(){let current=sections.find(s=>!s.hidden);sections.forEach(s=>{if(!s.hidden&&s.getBoundingClientRect().top<=130)current=s;});links.forEach(a=>{const active=a.dataset.section===current?.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});ticking=false;}
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();
  document.getElementById('open-ui').addEventListener('click',()=>{if(window.parent!==window)window.parent.postMessage({type:'projectss:navigate',section:'sect-ui'},location.origin);else location.href='../ui/index.html';});
})();
