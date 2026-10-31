const list=document.getElementById('library');
for(const lesson of window.LESSONS){
 const article=document.createElement('article');article.className='lesson';
 const cover=document.createElement('a');cover.href=lesson.url;cover.className='cover';cover.setAttribute('aria-label','פתיחת '+lesson.title);
 const image=document.createElement('img');image.src=lesson.cover;image.alt='';image.loading='lazy';cover.append(image);article.append(cover);
 const copy=document.createElement('div');copy.className='copy';const title=document.createElement('h2');title.textContent=lesson.title;copy.append(title);
 for(const [key,cls] of [['description','description'],['details','meta']]){const p=document.createElement('p');p.className=cls;p.textContent=lesson[key];copy.append(p);}
 const actions=document.createElement('div');actions.className='actions';const start=document.createElement('a');start.href=lesson.url;start.className='start';start.textContent='פתיחת המצגת';actions.append(start);
 if(lesson.worksheet){const a=document.createElement('a');a.href=lesson.worksheet;a.className='worksheet';a.textContent='דף מלווה להדפסה';actions.append(a);}
 copy.append(actions);article.append(copy);list.append(article);
}
