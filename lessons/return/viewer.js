const pages=[...document.querySelectorAll('.page')];let index=0,enabled=false;const by=id=>document.getElementById(id);
function fit(){const s=Math.min(by('stage').clientWidth/1280,by('stage').clientHeight/720);pages.forEach(p=>p.style.transform=`scale(${s}) translate(-50%,-50%)`);}
function show(n){index=Math.max(0,Math.min(pages.length-1,n));pages.forEach((p,i)=>{p.classList.toggle('active',i===index);p.setAttribute('aria-hidden',i!==index)});by('count').textContent=`${index+1} מתוך ${pages.length}`;by('prev').disabled=index===0;by('next').disabled=index===pages.length-1;if(enabled)renderLecturer(index);}
function lock(){enabled=false;by('notes').hidden=true;document.body.classList.remove('lecturer');by('lecturer').textContent='פאנל מרצה';show(index);fit();}
by('prev').onclick=()=>show(index-1);by('next').onclick=()=>show(index+1);by('lecturer').onclick=()=>{if(enabled){lock();return}by('key').value='';by('error').textContent='';by('gate').showModal();by('key').focus()};by('cancel').onclick=()=>by('gate').close();
by('login').onsubmit=e=>{e.preventDefault();if(by('key').value!=='123qwe12'){by('error').textContent='הסיסמה אינה נכונה.';return}by('key').value='';enabled=true;by('notes').hidden=false;document.body.classList.add('lecturer');by('lecturer').textContent='יציאה ממצב מרצה';by('gate').close();show(index);fit()};
document.addEventListener('keydown',e=>{if(by('gate').open||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight',' '].includes(e.key)){e.preventDefault();show(index+(e.key==='ArrowRight'?-1:1))}});by('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{}};window.addEventListener('resize',fit);show(0);fit();

window.michalLessonKey='return';
const lecturerNotes=window.RETURN_QUESTIONS.map(([opening,question,concept],i)=>({id:'return-'+i,title:pages[i].dataset.label,opening,concept,branches:[['לפי ההסבר שנשמע בדיון',question,concept]],original:pages[i].dataset.speakerNotes||''}));
const e=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderLecturer(i){
 if(!enabled)return;
 const n=lecturerNotes[i];let frame=by('lecturer-inline');
 if(!frame){frame=document.createElement('iframe');frame.id='lecturer-inline';frame.title='פאנל שאלות למרצה';by('notes').append(frame);by('note-text').hidden=true;by('notes').querySelector('h2').hidden=true;}
 const d=frame.contentDocument;d.open();d.write(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../../lecturer-panel.css"></head><body><header><p>שקופית ${i+1} מתוך ${pages.length}</p><h1>${e(n.title)}</h1><p>הנקודות נשמרות בדפדפן הזה. גיבוי מאפשר להעביר אותן למחשב אחר.</p></header><section class="opening"><h2>השאלה הראשונה</h2><p>${e(n.opening)}</p></section><h2>שאלת המשך</h2><details><summary>${e(n.branches[0][0])}</summary><p class="ask">${e(n.branches[0][1])}</p><p>${e(n.branches[0][2])}</p></details><h2>ההנחיה הקיימת לשקופית</h2><p>${e(n.original)}</p></body></html>`);d.close();
}
window.updateLecturer=renderLecturer;
