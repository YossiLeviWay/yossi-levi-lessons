(() => {
  'use strict';
  const d = window.YOSSI_DECK;
  const $ = id => document.getElementById(id);
  const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stage = $('stage');
  let index = 0, enabled = false, scale = 100;

  function blocks(s) {
    return (s.blocks || []).map(b => {
      if (b.type === 'p') return '<p>' + e(b.text) + '</p>';
      if (b.type === 'subtitle') return '<p class="subtitle">' + e(b.text) + '</p>';
      if (b.type === 'claims') return '<ol class="claims">' + b.items.map((t, i) => '<li><span class="num">' + (i + 1) + '</span><span>' + e(t) + '</span></li>').join('') + '</ol>';
      if (b.type === 'cards') return '<ol class="map-grid">' + b.items.map((t, i) => '<li><span class="num">' + (i + 1) + '</span>' + e(t) + '</li>').join('') + '</ol>';
      if (b.type === 'marks') return '<div class="mark-row">' + b.items.map(t => '<section><strong>' + e(t.mark) + '</strong><p>' + e(t.text) + '</p></section>').join('') + '</div>';
      if (b.type === 'steps') return '<ol class="flow">' + b.items.map(t => '<li><span>' + e(t) + '</span></li>').join('') + '</ol>';
      if (b.type === 'list') return '<ul class="prompt-list">' + b.items.map(t => '<li>' + e(t) + '</li>').join('') + '</ul>';
      if (b.type === 'quiz') return '<ol class="quiz-list">' + b.items.map(t => '<li><span class="num">' + e(t.n) + '</span><span>' + e(t.text) + '</span></li>').join('') + '</ol>';
      if (b.type === 'compare') return '<div class="compare">' + b.items.map(t => '<section><h2>' + e(t.h) + '</h2><p>' + e(t.p) + '</p></section>').join('') + '</div>';
      if (b.type === 'groups') return '<div class="group-grid">' + b.items.map(t => '<section><h2>' + e(t.name) + '</h2><p>' + e(t.place) + '</p></section>').join('') + '</div>';
      if (b.type === 'video') return '<div class="video-frame"><iframe src="https://www.youtube.com/embed/' + e(b.id) + '" title="' + e(b.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p class="video-link"><a href="' + e(b.href) + '" target="_blank" rel="noopener">' + e(b.label) + '</a></p>';
      if (b.type === 'button') return '<p class="slide-action"><button type="button" data-open-stories>' + e(b.label) + '</button></p>';
      if (b.type === 'link') return '<p class="slide-action"><a class="assignment-link" href="' + e(b.href) + '">' + e(b.label) + '</a></p>';
      if (b.type === 'examples') return '<div class="example-grid">' + b.items.map(t => '<section><h2>' + e(t.h) + '</h2><p>' + e(t.p) + '</p></section>').join('') + '</div>';
      if (b.type === 'lenses') return '<ol class="lens-row">' + b.items.map((t, i) => '<li><span class="num">' + (i + 1) + '</span><span>' + e(t) + '</span></li>').join('') + '</ol>';
      return '';
    }).join('');
  }

  function renderSlides() {
    const n = d.slides.length;
    stage.innerHTML = d.slides.map((s, i) => {
      const questions = [].concat(s.question || []).filter(Boolean);
      const discussion = questions.length ? '<div class="discussion">' + questions.map(q => '<h2>' + e(q) + '</h2>').join('') + '</div>' : '';
      return '<section class="slide layout-' + e(s.kind) + (i === 0 ? ' active' : '') + '" id="slide-' + (i + 1) + '" data-slide="' + e(s.id) + '" aria-hidden="' + (i === 0 ? 'false' : 'true') + '"><header><p class="section-meta"><bdi>' + (i + 1) + ' / ' + n + '</bdi></p><h1>' + e(s.title) + '</h1></header><div class="slide-body">' + blocks(s) + '</div>' + discussion + '<footer><span></span><img src="../../assets/signature.png" alt="יוסי לוי"></footer></section>';
    }).join('');
  }

  function noteHtml(block) {
    if (block.time) return '<p class="note-time">' + e(block.time) + '</p>';
    if (block.sub) return '<h3>' + e(block.sub) + '</h3>';
    if (block.p) return '<p>' + e(block.p) + '</p>';
    if (block.warn) return '<p class="note-warn">' + e(block.warn) + '</p>';
    if (block.ul) return '<ul>' + block.ul.map(item => '<li>' + e(item) + '</li>').join('') + '</ul>';
    if (block.href) return '<p><a href="' + e(block.href) + '" target="_blank" rel="noopener">' + e(block.label) + '</a></p>';
    if (block.q) return '<details class="guide-question"><summary>' + e(block.q) + '</summary>' + (block.a ? '<details class="possible-answer"><summary>כיוון אפשרי לתשובה</summary><p>' + e(block.a) + '</p></details>' : '') + '</details>';
    return '';
  }

  function panel() {
    const s = d.slides[index];
    $('notes').innerHTML = '<h2>פאנל מרצה · ' + e(s.title) + '</h2>' + (s.notes || []).map(noteHtml).join('');
  }

  function slides() { return [...stage.querySelectorAll('.slide')]; }

  function show(n) {
    const list = slides();
    index = Math.max(0, Math.min(list.length - 1, n));
    list.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.setAttribute('aria-hidden', String(i !== index));
    });
    $('count').innerHTML = '<bdi>' + (index + 1) + ' / ' + list.length + '</bdi>';
    $('prev').disabled = index === 0;
    $('next').disabled = index === list.length - 1;
    if (enabled) panel();
    history.replaceState(null, '', '#slide-' + (index + 1));
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  renderSlides();
  $('overview-list').innerHTML = d.slides.map((s, i) => '<button type="button" data-target="' + i + '">' + (i + 1) + '. ' + e(s.title) + '</button>').join('');
  $('prev').onclick = () => show(index - 1);
  $('next').onclick = () => show(index + 1);
  document.addEventListener('keydown', ev => {
    if (document.querySelector('dialog[open]') || ['INPUT', 'TEXTAREA', 'SUMMARY', 'BUTTON'].includes(ev.target.tagName)) return;
    if (ev.key === 'Home') { ev.preventDefault(); show(0); }
    if (ev.key === 'End') { ev.preventDefault(); show(slides().length - 1); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); show(index + 1); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); show(index - 1); }
  });
  $('overview-open').onclick = () => $('overview').showModal();
  $('overview-close').onclick = () => $('overview').close();
  $('stories-menu').onclick = () => { $('overview').close(); $('stories-open').click(); };
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
    if (matchMedia('(max-width:1000px)').matches) $('notes').scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  function setScale(n) {
    scale = Math.max(100, Math.min(200, n));
    document.body.style.setProperty('--text-scale', scale / 100);
    $('text-size-value').textContent = scale + '%';
    $('text-smaller').disabled = scale === 100;
    $('text-larger').disabled = scale === 200;
    try { localStorage.setItem('yossi-text-size:haifa12-review-4', String(scale)); } catch {}
  }
  $('text-smaller').onclick = () => setScale(scale - 10);
  $('text-larger').onclick = () => setScale(scale + 10);
  try { setScale(Number(localStorage.getItem('yossi-text-size:haifa12-review-4')) || 100); } catch { setScale(100); }
  $('full').onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  };
  window.addEventListener('hashchange', () => show(Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1) - 1));
  show(Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1) - 1);
})();
