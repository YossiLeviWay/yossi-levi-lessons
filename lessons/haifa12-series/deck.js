(() => {
  'use strict';
  const d = window.YOSSI_DECK;
  const $ = id => document.getElementById(id);
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stage = $('stage');
  let index = 0, enabled = false, scale = 100;
  const art = name => (window.HAI_ART && window.HAI_ART[name]) || '';

  function blocks(s) {
    const bits = [];
    if (s.photo) bits.push(`<img class="photo" src="${e(s.photo)}" alt="${e(s.alt || '')}">`);
    else if (s.art) bits.push(art(s.art));
    if (s.lead) bits.push(`<p class="lead">${e(s.lead)}</p>`);
    if (s.statement) bits.push(`<p class="statement">${e(s.statement)}</p>`);
    if (s.columns) bits.push('<div class="cols">' + s.columns.map(c => `<section><h2>${e(c.h)}</h2>${c.p ? `<p>${e(c.p)}</p>` : ''}</section>`).join('') + '</div>');
    if (s.points) {
      const reveal = s.revealPoints;
      bits.push('<ol class="step-list">' + s.points.map((t, i) => `<li${reveal && i ? ' hidden' : ''}>${e(t)}</li>`).join('') + '</ol>');
      if (reveal && s.points.length > 1) bits.push('<button type="button" class="more" data-act="point">הצעד הבא</button>');
    }
    if (s.rows) {
      bits.push('<ol class="flow-list">' + s.rows.map((t, i) => `<li${i ? ' hidden' : ''}>${e(t)}</li>`).join('') + '</ol>');
      if (s.rows.length > 1) bits.push('<button type="button" class="more" data-act="row">השורה הבאה</button>');
    }
    if (s.video) {
      const src = 'https://www.youtube.com/embed/' + e(s.video) + (s.videoEnd ? '?end=' + Number(s.videoEnd) + '&rel=0' : '?rel=0');
      bits.push(`<div class="video-frame"><iframe src="${src}" title="${e(s.videoTitle || s.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
      if (s.videoEnd) bits.push('<button type="button" class="more" data-act="ending">אחרי הניחושים: הסוף</button>');
    }
    if (s.answer) {
      bits.push(`<div class="reveal" hidden><p class="verdict">${e(s.answer)}</p><p class="insight">${e(s.insight || '')}</p></div>`);
      bits.push('<button type="button" class="more" data-act="answer">הצגת התשובה</button>');
    }
    if (s.credit) bits.push(`<p class="credit">${e(s.credit)}</p>`);
    return bits.join('');
  }

  function questions(s, hidden) {
    const list = [].concat(s.question || []).filter(Boolean);
    if (!list.length) return '';
    return `<div class="discussion"${hidden ? ' hidden' : ''}>${list.map(q => `<h2>${e(q)}</h2>`).join('')}</div>`;
  }

  function render() {
    const n = d.slides.length;
    stage.innerHTML = d.slides.map((s, i) => `
      <section class="slide${i === 0 ? ' active' : ''}" id="slide-${i + 1}" aria-hidden="${i ? 'true' : 'false'}">
        <header><p class="section-meta"><bdi>${i + 1} / ${n}</bdi></p><h1>${e(s.title)}</h1></header>
        <div class="slide-body">${blocks(s)}</div>
        ${questions(s, !!s.answer)}
        <footer><span></span><img src="../../assets/signature.png" alt="יוסי לוי"></footer>
      </section>`).join('');
  }

  function noteHtml(block) {
    if (block.time) return `<p class="note-time">${e(block.time)}</p>`;
    if (block.warn) return `<p class="note-warn">${e(block.warn)}</p>`;
    if (block.p) return `<p>${e(block.p)}</p>`;
    if (block.href) return `<p><a href="${e(block.href)}" target="_blank" rel="noopener">${e(block.label || block.href)}</a></p>`;
    if (block.ul) return '<ul>' + block.ul.map(t => `<li>${e(t)}</li>`).join('') + '</ul>';
    return '';
  }
  function panel() {
    const s = d.slides[index];
    $('notes').innerHTML = `<h2>פאנל מרצה · ${e(s.title)}</h2>` + (s.notes || []).map(noteHtml).join('');
  }
  function slides() { return [...stage.querySelectorAll('.slide')]; }
  function show(n) {
    const list = slides();
    index = Math.max(0, Math.min(list.length - 1, n));
    list.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.setAttribute('aria-hidden', String(i !== index));
    });
    $('count').innerHTML = `<bdi>${index + 1} / ${list.length}</bdi>`;
    $('prev').disabled = index === 0;
    $('next').disabled = index === list.length - 1;
    if (enabled) panel();
    history.replaceState(null, '', '#slide-' + (index + 1));
    window.scrollTo({top: 0, behavior: 'instant'});
  }
  render();
  $('overview-list').innerHTML = d.slides.map((s, i) => `<button type="button" data-target="${i}">${i + 1}. ${e(s.title)}</button>`).join('');
  $('prev').onclick = () => show(index - 1);
  $('next').onclick = () => show(index + 1);
  stage.addEventListener('click', ev => {
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;
    const slide = btn.closest('.slide');
    const act = btn.dataset.act;
    if (act === 'answer') {
      slide.querySelector('.reveal').hidden = false;
      const talk = slide.querySelector('.discussion');
      if (talk) talk.hidden = false;
      btn.hidden = true;
    } else if (act === 'row' || act === 'point') {
      const sel = act === 'row' ? '.flow-list li[hidden]' : '.step-list li[hidden]';
      const next = slide.querySelector(sel);
      if (next) next.hidden = false;
      if (!slide.querySelector(sel)) btn.hidden = true;
    } else if (act === 'ending') {
      const frame = slide.querySelector('iframe');
      const id = (frame.getAttribute('src') || '').split('/').pop().split('?')[0];
      frame.src = 'https://www.youtube.com/embed/' + id + '?start=190&rel=0';
      btn.hidden = true;
    }
  });
  document.addEventListener('keydown', ev => {
    if (document.querySelector('dialog[open]') || ['INPUT', 'TEXTAREA', 'BUTTON'].includes(ev.target.tagName)) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); show(index + 1); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); show(index - 1); }
    if (ev.key === 'Home') { ev.preventDefault(); show(0); }
    if (ev.key === 'End') { ev.preventDefault(); show(slides().length - 1); }
  });
  $('overview-open').onclick = () => $('overview').showModal();
  $('overview-close').onclick = () => $('overview').close();
  $('overview-list').onclick = ev => {
    const b = ev.target.closest('[data-target]');
    if (!b) return;
    show(Number(b.dataset.target));
    $('overview').close();
  };
  $('lecturer').onclick = () => {
    if (enabled) {
      enabled = false;
      $('notes').hidden = true;
      document.body.classList.remove('lecturer');
      $('lecturer').textContent = 'פאנל מרצה';
      $('lecturer').setAttribute('aria-expanded', 'false');
      return;
    }
    $('key').value = '';
    $('error').textContent = '';
    $('gate').showModal();
    $('key').focus();
  };
  $('cancel').onclick = () => $('gate').close();
  $('login').onsubmit = ev => {
    ev.preventDefault();
    if ($('key').value !== '123qwe12') { $('error').textContent = 'הסיסמה אינה נכונה.'; return; }
    $('key').value = '';
    enabled = true;
    $('notes').hidden = false;
    document.body.classList.add('lecturer');
    $('lecturer').textContent = 'סגירת פאנל מרצה';
    $('lecturer').setAttribute('aria-expanded', 'true');
    $('gate').close();
    panel();
  };
  function setScale(n) {
    scale = Math.max(100, Math.min(180, n));
    document.body.style.setProperty('--text-scale', String(scale / 100));
    $('text-size-value').textContent = scale + '%';
    try { localStorage.setItem('yossi-text-size:' + d.id, String(scale)); } catch {}
  }
  $('text-smaller').onclick = () => setScale(scale - 10);
  $('text-larger').onclick = () => setScale(scale + 10);
  try { setScale(Number(localStorage.getItem('yossi-text-size:' + d.id)) || 100); } catch { setScale(100); }
  $('full').onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  };
  window.addEventListener('hashchange', () => show(Number((location.hash.match(/^#slide-(\d+)$/) || [])[1] || 1) - 1));
  show(Number((location.hash.match(/^#slide-(\d+)$/) || [])[1] || 1) - 1);
})();
