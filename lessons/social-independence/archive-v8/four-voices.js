(() => {
  'use strict';
  const data = window.FOUR_VOICES;
  const openBtn = document.getElementById('four-voices-open');
  if (!data || !data.groups || !openBtn) return;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tabNames = ['הסיפור', 'הדמויות', 'השאלות'];
  const dialog = document.createElement('dialog');
  dialog.id = 'four-voices';
  dialog.setAttribute('aria-label', data.title);
  dialog.innerHTML = '<div class="fv-shell"><header class="fv-bar"><button type="button" class="fv-close" data-fv="close"><span class="fv-x" aria-hidden="true">×</span> סגירה</button><p class="fv-bar-title" id="fv-bar-title"></p><div class="fv-font" aria-label="גודל כתב"><button type="button" data-fv="smaller" aria-label="הקטנת כתב">A−</button><output id="fv-size">100%</output><button type="button" data-fv="larger" aria-label="הגדלת כתב">A+</button></div></header><div class="fv-body" id="fv-body"></div></div>';
  document.body.appendChild(dialog);

  let group = -1;
  let tab = 0;
  let scale = 100;
  let howOpen = true;
  try {
    const saved = Number(localStorage.getItem('yossi-four-voices-size'));
    if (saved >= 80 && saved <= 170) scale = saved;
  } catch {}

  function applyScale() {
    scale = Math.max(80, Math.min(170, scale));
    dialog.style.setProperty('--fv-scale', String(scale / 100));
    const out = dialog.querySelector('#fv-size');
    if (out) out.textContent = scale + '%';
    const smaller = dialog.querySelector('[data-fv="smaller"]');
    const larger = dialog.querySelector('[data-fv="larger"]');
    if (smaller) smaller.disabled = scale <= 80;
    if (larger) larger.disabled = scale >= 170;
    try { localStorage.setItem('yossi-four-voices-size', String(scale)); } catch {}
  }

  function stepsList(items) {
    return '<ol class="fv-steps">' + items.map((item, i) => '<li><span class="fv-num">' + (i + 1) + '</span><span>' + esc(item) + '</span></li>').join('') + '</ol>';
  }

  function homeHtml() {
    const nodes = data.around.map((label, i) => '<p class="fv-node fv-n' + (i + 1) + '">' + esc(label) + '</p>').join('');
    const cards = data.groups.map((g, i) => '<button type="button" class="fv-card" data-fv="group" data-index="' + i + '"><span class="fv-card-kicker">קבוצה ' + g.id + '</span><span class="fv-card-child">' + esc(g.child) + '</span><span class="fv-card-setting">' + esc(g.setting) + '</span></button>').join('');
    return '<div class="fv-wrap fv-home"><h2 class="fv-hero">' + esc(data.title) + '</h2><p class="fv-sub">' + esc(data.subtitle) + '</p>' + stepsList(data.homeSteps) + '<div class="fv-map" role="group" aria-label="תומכת ההוראה במרכז, וסביבה הילד, ההורים, המורה והמחנכת, המנהלת והקולגות"><p class="fv-hub">' + esc(data.center) + '</p>' + nodes + '</div><div class="fv-cards" role="group" aria-label="בחירת קבוצה">' + cards + '</div></div>';
  }

  function groupHtml() {
    const g = data.groups[group];
    const prevDis = group <= 0 ? ' disabled' : '';
    const nextDis = group >= data.groups.length - 1 ? ' disabled' : '';
    const tabs = tabNames.map((name, i) => '<button type="button" class="fv-tab" role="tab" id="fv-tab-' + i + '" aria-selected="' + (tab === i) + '" aria-controls="fv-panel" tabindex="' + (tab === i ? '0' : '-1') + '" data-fv="tab" data-index="' + i + '">' + name + '</button>').join('');
    let panel = '';
    if (tab === 0) {
      panel = '<h3 class="fv-story-title">' + esc(g.storyTitle) + '</h3><div class="fv-story">' + g.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('') + '</div>';
    } else if (tab === 1) {
      panel = '<div class="fv-bubbles">' + g.cards.map(c => '<article class="fv-bubble"><h3>' + esc(c.name) + '</h3><p>' + esc(c.text) + '</p></article>').join('') + '</div>';
    } else {
      panel = '<p class="fv-lead">' + esc(data.questionsIntro) + '</p><ol class="fv-qs">' + g.questions.map(q => '<li>' + esc(q) + '</li>').join('') + '</ol><p class="fv-closing">' + esc(g.closing) + '</p>';
    }
    const work = '<ol class="fv-work">' + data.workSteps.map((item, i) => '<li><span class="fv-num">' + (i + 1) + '</span><span>' + esc(item) + '</span></li>').join('') + '</ol><p class="fv-note">' + esc(data.workNote) + '</p>';
    return '<div class="fv-wrap"><div class="fv-nav"><button type="button" class="fv-navbtn" data-fv="home">לרשימת הקבוצות</button><button type="button" class="fv-navbtn" data-fv="prev"' + prevDis + '>הקבוצה הקודמת</button><p class="fv-pos">קבוצה ' + g.id + ' מתוך ' + data.groups.length + '</p><button type="button" class="fv-navbtn fv-next" data-fv="next"' + nextDis + '>הקבוצה הבאה</button></div><h2 class="fv-kicker">' + esc(g.heading) + '</h2><div class="fv-strip"><p class="fv-purpose">' + esc(data.purpose) + '</p><details id="fv-how"' + (howOpen ? ' open' : '') + '><summary>' + esc(data.workTitle) + '</summary>' + work + '</details></div><div class="fv-tabs" role="tablist" aria-label="חלקי הקבוצה">' + tabs + '</div><div id="fv-panel" role="tabpanel" tabindex="-1" aria-labelledby="fv-tab-' + tab + '">' + panel + '</div></div>';
  }

  function revealTabs() {
    const scroller = dialog.querySelector('.fv-body');
    const tabs = dialog.querySelector('.fv-tabs');
    if (!scroller || !tabs) return;
    const delta = tabs.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    scroller.scrollTop += delta;
  }

  function render(opts) {
    const details = dialog.querySelector('#fv-how');
    if (details) howOpen = details.open;
    dialog.querySelector('#fv-bar-title').textContent = data.title;
    dialog.querySelector('#fv-body').innerHTML = group < 0 ? homeHtml() : groupHtml();
    dialog.dataset.view = group < 0 ? 'home' : String(data.groups[group].id);
    dialog.dataset.tab = group < 0 ? 'home' : ['story', 'people', 'questions'][tab];
    applyScale();
    if (opts && opts.focus) {
      const el = dialog.querySelector(opts.focus);
      if (el) el.focus();
    }
    if (opts && opts.reveal) revealTabs();
    else {
      const scroller = dialog.querySelector('.fv-body');
      if (scroller) scroller.scrollTop = 0;
    }
  }

  function openReader() {
    group = -1;
    tab = 0;
    render();
    try { if (!dialog.open) dialog.showModal(); } catch {}
  }

  function goGroup(index, opts) {
    if (index < 0 || index >= data.groups.length) return;
    group = index;
    tab = 0;
    render(opts);
  }

  openBtn.addEventListener('click', openReader);
  dialog.addEventListener('click', ev => {
    const el = ev.target.closest('[data-fv]');
    if (!el) return;
    const act = el.getAttribute('data-fv');
    if (act === 'close') dialog.close();
    else if (act === 'smaller') { scale -= 10; applyScale(); }
    else if (act === 'larger') { scale += 10; applyScale(); }
    else if (act === 'home') { group = -1; render({focus: '.fv-card'}); }
    else if (act === 'group') goGroup(Number(el.dataset.index));
    else if (act === 'prev') goGroup(group - 1);
    else if (act === 'next') goGroup(group + 1);
    else if (act === 'tab') { tab = Number(el.dataset.index); render({reveal: true}); }
  });

  function focusCard(index) {
    const cards = [...dialog.querySelectorAll('.fv-card')];
    if (!cards.length) return;
    cards[Math.max(0, Math.min(cards.length - 1, index))].focus();
  }

  document.addEventListener('keydown', ev => {
    if (!dialog.open) return;
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'Home', 'End'];
    const digit = ev.key >= '1' && ev.key <= '5';
    if (!navKeys.includes(ev.key) && !digit) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    if (digit) {
      goGroup(Number(ev.key) - 1, {focus: '.fv-tab[aria-selected="true"]'});
      return;
    }
    if (ev.key === 'PageDown' || ev.key === 'PageUp') {
      const scroller = dialog.querySelector('.fv-body');
      if (!scroller) return;
      const delta = Math.max(120, Math.round(scroller.clientHeight * 0.85));
      scroller.scrollTop += ev.key === 'PageDown' ? delta : -delta;
      return;
    }
    if (group < 0) {
      const cards = [...dialog.querySelectorAll('.fv-card')];
      const current = cards.indexOf(document.activeElement);
      if (ev.key === 'Home') focusCard(0);
      else if (ev.key === 'End') focusCard(cards.length - 1);
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') focusCard(current < 0 ? 0 : current + 1);
      else focusCard(current < 0 ? cards.length - 1 : current - 1);
      return;
    }
    if (ev.key === 'ArrowDown') goGroup(group + 1, {focus: '.fv-tab[aria-selected="true"]'});
    else if (ev.key === 'ArrowUp') goGroup(group - 1, {focus: '.fv-tab[aria-selected="true"]'});
    else if (ev.key === 'Home') { tab = 0; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
    else if (ev.key === 'End') { tab = tabNames.length - 1; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
    else if (ev.key === 'ArrowLeft' && tab < tabNames.length - 1) { tab += 1; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
    else if (ev.key === 'ArrowRight' && tab > 0) { tab -= 1; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
  }, true);
})();
