document.addEventListener('DOMContentLoaded',()=>{
 const cards=[...document.querySelectorAll('.event-card')], search=document.getElementById('eventSearch'), category=document.getElementById('eventCategory'), when=document.getElementById('eventWhen'), results=document.getElementById('eventResults'), empty=document.getElementById('noEvents'), grid=document.getElementById('eventGrid');
 function filter(){if(!grid)return;const q=(search?.value||'').trim().toLowerCase(),cat=category?.value||'all',time=when?.value||'all';let n=0;cards.forEach(card=>{const dateText=card.innerText.toLowerCase();const isUpcoming=!dateText.includes('verify')&&!dateText.includes('see current announcements');const ok=(cat==='all'||card.dataset.category===cat)&&(time!=='upcoming'||isUpcoming)&&(!q||(card.dataset.search+' '+card.innerText).toLowerCase().includes(q));card.hidden=!ok;if(ok)n++});if(results)results.textContent=n?`${n} ${n===1?'experience':'experiences'} match your search.`:'No matching experiences. Try another keyword or category.';if(empty)empty.hidden=!!n}
 [search,category,when].forEach(el=>el?.addEventListener('input',filter));document.getElementById('resetFilters')?.addEventListener('click',()=>{if(search)search.value='';if(category)category.value='all';if(when)when.value='all';filter()});
 document.querySelectorAll('.view-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.view-btn').forEach(b=>b.classList.toggle('active',b===btn));grid?.classList.toggle('list-view',btn.dataset.view==='list')}));
 const panel=document.getElementById('searchPanel'), trigger=document.getElementById('searchTrigger'), close=document.getElementById('searchClose'), searchInput=document.getElementById('siteSearchInput'), resultsBox=document.getElementById('siteSearchResults'), searchForm=document.getElementById('siteSearchForm'), searchMessage=document.getElementById('siteSearchMessage');
 const searchItems=[
  {title:'Events & Activities',detail:'Browse upcoming events and community gatherings',url:'services.html#events',terms:`events calendar activities what's on gather community festival seasonal celebrations`},
  {title:'Farmers Market',detail:'Find local vendors, produce, and market information',url:'index.html#market',terms:`farmers market produce local vendors vegetables fresh market`},
  {title:'Art Trail Tecumseh',detail:'Explore public art and plan a self-guided art walk',url:'index.html#art-trail',terms:`art trail art sculpture culture gallery public art creative`},
  {title:'Explore Downtown',detail:'Discover local experiences, art, food, and community',url:'index.html#explore',terms:`explore downtown discover visitor experiences things to do`},
  {title:'Shop Local',detail:'Discover independent shops and local businesses',url:'index.html#shop',terms:`shop shopping local stores retail boutiques gifts business`},
  {title:'Dining & Food',detail:'Find places to eat and enjoy local flavor',url:'index.html#shop',terms:`dining restaurants food drink eat cafe meal cuisine`},
  {title:'Business Opportunities',detail:'Resources for business owners and future investors',url:'index.html#businesses',terms:`business opportunities investors business owners directory support`},
  {title:'Downtown Development Authority',detail:'Learn about downtown initiatives and development',url:'index.html#dda',terms:`dda downtown development authority projects programs history community`},
  {title:'Community Updates',detail:'Keep up with downtown news and announcements',url:'index.html#updates',terms:`community updates news announcements latest information`},
  {title:'Gather & Give Back Holiday Open House',detail:'Community gathering · November 21, 2026',url:'services.html#events',terms:`gather give back holiday open house community shopping november`},
  {title:'Tecumseh Christmas Parade & Santa',detail:'Holiday parade · December 4, 2026',url:'services.html#events',terms:`christmas parade santa holiday seasonal december`},
  {title:'Seasonal Celebrations',detail:'Explore seasonal events and local traditions',url:'services.html#events',terms:`seasonal celebrations festivals traditions events`},
  {title:'Contact the DDA',detail:'Get in touch about downtown events and promotion',url:'services.html#contact',terms:`contact email phone dda submit event host event promotion`}
 ];
 const closeSearch=()=>{panel?.classList.remove('open');panel?.setAttribute('aria-hidden','true');trigger?.focus()};
 const renderSearchResults=(raw)=>{if(!resultsBox)return;const q=(raw||'').trim().toLowerCase();if(!q){resultsBox.innerHTML='<p class="search-empty-state">Start typing to find pages, events, places, and local experiences.</p>';if(searchMessage)searchMessage.textContent='Search the Downtown Tecumseh experience.';return;}const words=q.split(/\s+/).filter(Boolean);const matches=searchItems.map(item=>({...item,score:words.reduce((n,w)=>n+((item.title+' '+item.detail+' '+item.terms).toLowerCase().includes(w)?1:0),0)})).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title)).slice(0,6);if(!matches.length){resultsBox.innerHTML='<p class="search-empty-state">No exact match found. Try “events”, “market”, “art”, “shop”, or “business”.</p>';if(searchMessage)searchMessage.textContent='No matching pages found.';return;}resultsBox.innerHTML=matches.map(item=>`<a class="search-result-item" href="${item.url}"><span><strong>${item.title}</strong><small>${item.detail}</small></span><span class="search-result-arrow" aria-hidden="true">↗</span></a>`).join('');if(searchMessage)searchMessage.textContent=`${matches.length} matching ${matches.length===1?'result':'results'} — choose one to continue.`;};
 trigger?.addEventListener('click',()=>{panel?.classList.add('open');panel?.setAttribute('aria-hidden','false');renderSearchResults(searchInput?.value||'');setTimeout(()=>searchInput?.focus(),100)});
 close?.addEventListener('click',closeSearch);panel?.addEventListener('click',e=>{if(e.target===panel)closeSearch()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel?.classList.contains('open'))closeSearch()});
 searchInput?.addEventListener('input',()=>renderSearchResults(searchInput.value));
 document.querySelectorAll('.search-chip').forEach(chip=>chip.addEventListener('click',()=>{if(searchInput){searchInput.value=chip.dataset.query||chip.textContent.trim();renderSearchResults(searchInput.value);searchInput.focus()}}));
 searchForm?.addEventListener('submit',e=>{e.preventDefault();const first=resultsBox?.querySelector('.search-result-item');if(first){const target=first.getAttribute('href')||'';if(/^https?:\/\//i.test(target)){if(searchMessage)searchMessage.textContent='External website links are disabled in this preview.';}else{window.location.href=target}}else if(searchMessage){searchMessage.textContent='No matching pages found. Try a popular search above.';searchInput?.focus()}});
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 // Keep prototype links clickable in appearance without leaving the supplied website.
 document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link)return;const href=link.getAttribute('href')||'';if(/^https?:\/\//i.test(href)){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();}},true);
 // One compact mobile menu matching the five-item desktop navigation.
 const menu=document.querySelector('.menu-btn');
 const setMenuOpen=open=>{
   let panel=document.querySelector('.tc-mobile');
   if(!panel){
     panel=document.createElement('div');
     panel.className='mobile-panel tc-mobile';
     panel.innerHTML='<button class="mobile-close" aria-label="Close menu">×</button><a href="services.html#events">EVENTS</a><a href="index.html#explore">EXPLORE</a><a href="index.html#shop">SHOP</a><a href="index.html#businesses">BUSINESS</a><a href="index.html#dda">ABOUT</a><a class="mobile-cta" href="index.html#explore">PLAN YOUR VISIT ↗</a>';
     document.body.appendChild(panel);
     panel.querySelector('.mobile-close').addEventListener('click',()=>setMenuOpen(false));
     panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuOpen(false)));
   }
   document.body.classList.toggle('mobile-open',open);
   menu?.setAttribute('aria-expanded',String(open));
   panel.style.transform=open?'translateX(0)':'translateX(100%)';
 };
 menu?.addEventListener('click',()=>setMenuOpen(!document.body.classList.contains('mobile-open')));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('mobile-open'))setMenuOpen(false)});
});
