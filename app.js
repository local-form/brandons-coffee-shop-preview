(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (reduced || !('IntersectionObserver' in window)) items.forEach(el => el.classList.add('is-visible'));
  else {
    const counts = new Map();
    items.forEach(el => { const parent=el.parentElement, i=counts.get(parent)||0;el.style.setProperty('--d',Math.min(i,3)*.08+'s');counts.set(parent,i+1); });
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);} }),{threshold:.01,rootMargin:'0px 0px -8% 0px'});
    items.forEach(el=>io.observe(el));
    setTimeout(()=>items.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('is-visible');}),1500);
  }
  const buttons=[...document.querySelectorAll('[data-category]')];
  const cards=[...document.querySelectorAll('[data-menu]')];
  buttons.forEach(button=>{
    button.disabled=false;
    button.addEventListener('click',()=>{
      const category=button.dataset.category;
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      cards.forEach(card=>{card.hidden=category!=='all'&&card.dataset.menu!==category;card.classList.add('is-visible');});
      document.querySelector('.bcs-menu-grid').classList.toggle('bcs-filtered',category!=='all');
      document.querySelector('#menu-status').textContent=category==='all'?'All menu favorites shown.':button.textContent+' favorites shown.';
    });
  });
  const form=document.querySelector('#bcs-request-form');
  const date=document.querySelector('#bcs-date');
  const result=document.querySelector('#bcs-result');
  const dateError=document.querySelector('#bcs-date-error');
  const localToday=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  date.min=localToday();
  form.querySelector('button[type=submit]').disabled=false;
  form.addEventListener('input',()=>{result.hidden=true;date.setCustomValidity('');dateError.textContent='';date.removeAttribute('aria-invalid');});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    date.min=localToday();
    if(date.value&&date.value<date.min){date.setCustomValidity('Choose today or a future date.');dateError.textContent='Choose today or a future date.';date.setAttribute('aria-invalid','true');}
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const heading=document.createElement('h3');heading.textContent='Your request, at a glance.';
    const list=document.createElement('dl');
    const prettyDate=date.value?new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date(date.value+'T12:00:00')):'Date to discuss';
    [['For',String(data.get('name')).trim()],['Phone',String(data.get('phone')).trim()],['Date',prettyDate],['Guests',data.get('guests')||'Number to discuss'],['Food & drinks',String(data.get('wants')||'To discuss with the shop').trim()]].forEach(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);list.append(row);});
    const note=document.createElement('p');note.textContent='Preview only: nothing was sent. On the real site, the shop confirms by text or call.';
    result.replaceChildren(heading,list,note);result.hidden=false;result.focus({preventScroll:true});result.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});
  });
})();
