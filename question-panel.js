// Adapter around the existing lecturer renderer; content, sources and controls are preserved.
(()=>{
 const original=window.updateLecturer;
 window.updateLecturer=function(i){
  original?.(i);
  const frame=document.getElementById('lecturer-inline');if(!frame||frame.hidden)return;
  const doc=frame.contentDocument, n=lecturerNotes[i];
  const keyBase='yossi-discussion:v1:'+(window.michalLessonKey||location.pathname)+':'+(n.id||i)+':';
  let serial=0;
  const enhance=(details)=>{
   const summary=details.querySelector(':scope > summary');if(!summary)return;
   const question=details.querySelector('.ask');
   if(question && summary.textContent!==question.textContent){const response=summary.textContent;summary.textContent=question.textContent;question.textContent='אם נשמעת התגובה: '+response;}
   const key=keyBase+(serial++);let saved=[];
   try{const parsed=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(parsed))saved=parsed.filter(x=>typeof x==='string');}catch{}
   const list=doc.createElement('ul'), form=doc.createElement('form'), input=doc.createElement('textarea'),button=doc.createElement('button'),status=doc.createElement('p');
   list.className='personal-points';
   const paint=()=>{list.replaceChildren();saved.forEach((text,j)=>{const li=doc.createElement('li'),label=doc.createElement('p'),edit=doc.createElement('textarea'),save=doc.createElement('button');label.textContent=text;edit.value=text;edit.rows=2;edit.maxLength=2000;edit.hidden=true;edit.setAttribute('aria-label','עריכת נקודה '+(j+1));save.type='button';save.textContent='עריכת נקודה';save.onclick=()=>{if(edit.hidden){edit.hidden=false;label.hidden=true;save.textContent='שמירת עריכה';edit.focus();return}const changed=edit.value.trim();if(!changed)return;const next=[...saved];next[j]=changed;try{localStorage.setItem(key,JSON.stringify(next));saved=next;paint();status.textContent='העריכה נשמרה במחשב הזה.'}catch{status.textContent='השמירה המקומית אינה זמינה.'}};li.append(label,edit,save);list.append(li)})};
   input.setAttribute('aria-label','נקודה אישית לדיון');input.placeholder='נקודה שתרצה להוסיף לדיון';input.maxLength=2000;input.rows=3;
   button.textContent='הוספת נקודה';button.type='submit';status.setAttribute('role','status');
   paint();form.append(input,button,status);details.append(list,form);
   form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text)return;const next=[...saved,text];try{localStorage.setItem(key,JSON.stringify(next));saved=next;paint();input.value='';status.textContent='נשמר במחשב הזה.'}catch{status.textContent='השמירה המקומית אינה זמינה. העתק את הנקודה לפני סגירה.'}};
   const depth=doc.createElement('details'),label=doc.createElement('summary'),point=doc.createElement('p');label.textContent='מה כדאי להעמיק בדיון?';point.textContent=n.concept;depth.append(label,point);details.insertBefore(depth,list);
  };
  doc.querySelectorAll('details').forEach(d=>{if(!d.querySelector('a'))enhance(d)});
  const opening=doc.querySelector('.opening');if(opening){const detail=doc.createElement('details'),sum=doc.createElement('summary');sum.textContent=n.opening;detail.append(sum);while(opening.firstChild)detail.append(opening.firstChild);opening.append(detail);enhance(detail);}
  const controls=doc.createElement('div'),backup=doc.createElement('button'),restoreLabel=doc.createElement('label'),restore=doc.createElement('input'),backupStatus=doc.createElement('p');
  const prefix='yossi-discussion:v1:'+(window.michalLessonKey||location.pathname)+':';
  backup.type='button';backup.textContent='גיבוי נקודות לדיון';backupStatus.setAttribute('role','status');
  backup.onclick=()=>{try{const points={};for(let j=0;j<localStorage.length;j++){const key=localStorage.key(j);if(key.startsWith(prefix))points[key.slice(prefix.length)]=JSON.parse(localStorage.getItem(key));}const blob=new Blob([JSON.stringify({version:1,lessonKey:window.michalLessonKey||location.pathname,points},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='discussion-points.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);backupStatus.textContent='קובץ הגיבוי הורד.'}catch{backupStatus.textContent='הגיבוי לא הושלם.'}};
  restore.type='file';restore.accept='application/json,.json';restore.setAttribute('aria-label','שחזור גיבוי נקודות');restoreLabel.textContent='שחזור גיבוי נקודות ';restoreLabel.append(restore);
  restore.onchange=async()=>{try{const file=restore.files[0];if(!file||file.size>1000000)throw Error();const imported=JSON.parse(await file.text());if(imported.version!==1||imported.lessonKey!==(window.michalLessonKey||location.pathname)||!imported.points||Object.getPrototypeOf(imported.points)!==Object.prototype)throw Error();const entries=Object.entries(imported.points);for(const [key,points] of entries){if(key.length>150||key.includes('__proto__')||!Array.isArray(points)||points.length>100||points.some(x=>typeof x!=='string'||x.length>2000))throw Error();}for(const [key,points] of entries){const old=JSON.parse(localStorage.getItem(prefix+key)||'[]');localStorage.setItem(prefix+key,JSON.stringify([...new Set([...old,...points])]));}window.updateLecturer(i);}catch{backupStatus.textContent='הקובץ אינו גיבוי תקין לשיעור הזה. הנקודות הקיימות נשמרו.'}};
  controls.append(backup,restoreLabel,backupStatus);doc.querySelector('header').append(controls);
  const css=doc.createElement('style');css.textContent='textarea[hidden]{display:none!important}input[type=file]{max-width:100%;width:100%;font:inherit}header>div{display:flex;flex-wrap:wrap;gap:10px}header label{max-width:100%;font-size:16px}textarea{display:block;width:100%;box-sizing:border-box;font:inherit;color:#29332e;border:1px solid #bbd3c5;border-radius:12px;padding:12px;background:white;margin:12px 0}details details{padding:12px;background:#f8ebe5;border-radius:12px}li{font-size:18px}';doc.head.append(css);
 };
 renderLecturer=window.updateLecturer;
 // Keyboard navigation must not consume spaces/arrows while the lecturer types.
})();
