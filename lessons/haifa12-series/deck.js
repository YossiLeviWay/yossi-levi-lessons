(() => {
  'use strict';
  const d = window.YOSSI_DECK;
  const $ = id => document.getElementById(id);
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stage = $('stage');
  let index = 0, enabled = false, scale = 100;
  const art = name => (window.HAI_ART && window.HAI_ART[name]) || '';

  const icon = name => {
    const paths = {
      ask: '<circle cx="13" cy="13" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 18 l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      learn: '<path d="M6 10 h20 v12 H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 10 V8 h12 v2" fill="none" stroke="currentColor" stroke-width="2"/>',
      house: '<path d="M6 16 L16 7 l10 9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 15 v9 h14 v-9" fill="none" stroke="currentColor" stroke-width="2"/>',
      talk: '<circle cx="11" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="21" cy="13" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 24 q6-6 12 0 M16 23 q4-4 9 0" fill="none" stroke="currentColor" stroke-width="2"/>',
      shape: '<path d="M8 24 q8-16 16 0" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="10" r="3" fill="currentColor"/>',
      pack: '<rect x="8" y="12" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 12 v-3 h8 v3" fill="none" stroke="currentColor" stroke-width="2"/>',
      ramp: '<path d="M6 24 h20 M6 24 L22 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      grid: '<rect x="7" y="8" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 14 h18 M16 8 v16" stroke="currentColor" stroke-width="2"/>',
      play: '<circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 13 l6 3-6 3z" fill="currentColor"/>',
      steps: '<path d="M7 24 h6 v-5 h6 v-5 h6" fill="none" stroke="currentColor" stroke-width="2"/>',
      bell: '<path d="M10 20 h12 l-2-8 a4 4 0 0 0-8 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 22 h4" stroke="currentColor" stroke-width="2"/>',
      ring: '<circle cx="12" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="2"/>',
      heart: '<path d="M16 24 l-7-7 a4 4 0 0 1 7-4 a4 4 0 0 1 7 4z" fill="none" stroke="currentColor" stroke-width="2"/>',
      flame: '<path d="M16 6 q6 8 2 12 q4 1 2 6 q-8 2-8-5 q-2-4 4-13z" fill="none" stroke="currentColor" stroke-width="2"/>',
      family: '<circle cx="16" cy="9" r="3" fill="currentColor"/><circle cx="8" cy="13" r="2.5" fill="currentColor"/><path d="M4 24 q4-6 8 0 M12 24 q4-8 8 0" fill="none" stroke="currentColor" stroke-width="2"/>'
    };
    return `<svg class="tool-svg" viewBox="0 0 32 32">${paths[name] || paths.ask}</svg>`;
  };

  function toolbox(s) {
    const tools = s.toolbox || [];
    if (!tools.length) return '';
    const buttons = tools.map((t, i) =>
      `<button type="button" class="tool" data-act="tool" data-tool="${i}" aria-pressed="false"><span class="tool-icon" aria-hidden="true">${icon(t.icon)}</span><span class="tool-name">${e(t.name)}</span></button>`
    ).join('');
    return `<div class="toolbox"><div class="toolbox-lid" aria-hidden="true"></div><div class="toolbox-box" role="group" aria-label="כלים בארגז">${buttons}</div><p class="tool-out" data-tool-out aria-live="polite">לחצי על כלי. תופיע שאלה שמזכירה מה למדנו.</p></div>`;
  }

  function blocks(s) {
    const bits = [];
    if (s.toolbox) bits.push(toolbox(s));
    else if (s.photo) bits.push(`<img class="photo" src="${e(s.photo)}" alt="${e(s.alt || '')}">`);
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
    } else if (act === 'tool') {
      const i = Number(slide.id.replace('slide-', '')) - 1;
      const tool = (d.slides[i].toolbox || [])[Number(btn.dataset.tool)];
      if (!tool) return;
      slide.querySelectorAll('.tool').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      slide.querySelector('[data-tool-out]').textContent = tool.q;
    }
  });
  stage.addEventListener('keydown', ev => {
    const tool = ev.target.closest && ev.target.closest('.tool');
    if (!tool) return;
    const tools = [...tool.closest('.toolbox').querySelectorAll('.tool')];
    const i = tools.indexOf(tool);
    let n = i;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') n = Math.min(tools.length - 1, i + 1);
    else if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') n = Math.max(0, i - 1);
    else if (ev.key === 'Home') n = 0;
    else if (ev.key === 'End') n = tools.length - 1;
    else return;
    ev.preventDefault();
    ev.stopPropagation();
    tools[n].focus();
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
