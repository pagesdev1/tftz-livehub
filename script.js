const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('done'),600));
for(let i=0;i<45;i++){let p=document.createElement('i');p.className='particle';p.style.left=Math.random()*100+'%';p.style.animationDuration=7+Math.random()*13+'s';p.style.animationDelay=-Math.random()*15+'s';$('#particles').appendChild(p)}
const dot=$('.cursor-dot'),ring=$('.cursor-ring');addEventListener('mousemove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';ring.animate({left:e.clientX+'px',top:e.clientY+'px'},{duration:150,fill:'forwards'})});
$$('a,button').forEach(x=>{x.onmouseenter=()=>{ring.style.width='50px';ring.style.height='50px'};x.onmouseleave=()=>{ring.style.width='34px';ring.style.height='34px'}});
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(x=>obs.observe(x));
$('#fxBtn').onclick=()=>document.body.classList.toggle('no-fx');
$('#langBtn').onclick=()=>alert('الواجهة الأساسية بالعربي — يمكن إضافة ترجمة كاملة لكل الأقسام لاحقًا.');
async function loadYouTube(){
  const box=$('#youtubeGrid'),stamp=$('#ytUpdated');
  try{
    const r=await fetch('/api/youtube?limit=6',{cache:'no-store'}); if(!r.ok) throw new Error();
    const data=await r.json(); if(!data.items?.length) throw new Error();
    box.innerHTML=data.items.map(v=>`<a class="yt-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener"><div class="yt-thumb"><img loading="lazy" src="${v.thumb}" alt=""></div><div class="yt-info"><strong>${esc(v.title)}</strong><small>${v.date}</small></div></a>`).join('');
    stamp.textContent='آخر تحديث: '+new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});
  }catch(e){
    box.innerHTML='<div class="loading-card">تعذر تحميل الفيديوهات الآن — <a style="color:#ffd24f" href="https://www.youtube.com/@TFTZMo3az" target="_blank">افتح قناة TFTZ على YouTube ↗</a></div>';
    stamp.textContent='يمكن التحديث تلقائيًا بعد تفعيل Pages Functions';
  }
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
loadYouTube();setInterval(loadYouTube,5*60*1000);
