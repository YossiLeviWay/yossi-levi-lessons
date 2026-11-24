/* Reader adapted from the focus mode and highlighter in pull request 3.
   Used only by this lesson. The social-independence lesson is unchanged. */
(() => {
  'use strict';
  const data = window.STORY_READER;
  const openBtn = document.getElementById('stories-open');
  if (!data || !data.groups || !openBtn) return;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tabNames = ['הסיפור', 'הדמויות', 'השאלות'];
  const parts = ['story', 'people', 'questions'];
  const COLORS = ['yellow', 'green', 'pink'];
  const COLOR_LABEL = {yellow: 'צהוב', green: 'ירוק', pink: 'ורוד'};
  const MARK_KEY = 'yossi-haifa12-review-5-marks';

  const dialog = document.createElement('dialog');
  dialog.id = 'stories-reader';
  dialog.setAttribute('aria-label', data.title);
  dialog.innerHTML = '<div class="fv-shell"><header class="fv-bar"><button type="button" class="fv-close" data-fv="close"><span class="fv-x" aria-hidden="true">×</span> סגירה</button><p class="fv-bar-title" id="fv-bar-title"></p><div id="fv-tools"></div><div class="fv-font" aria-label="גודל כתב"><button type="button" data-fv="smaller" aria-label="הקטנת כתב">A−</button><output class="fv-size-value" id="fv-size">100%</output><button type="button" data-fv="larger" aria-label="הגדלת כתב">A+</button></div></header><div class="fv-body" id="fv-body"></div></div><div class="fv-focus-layer" hidden></div>';
  document.body.appendChild(dialog);

  let group = -1, tab = 0, scale = 100, howOpen = true;
  let focusMode = false, focusIndex = 0, showAll = false;
  let markerOn = false, markerColor = 'yellow', clearAsk = false;
  let suppressClick = false, blockClose = false;
  let marks = {};
  try {
    const saved = Number(localStorage.getItem('yossi-haifa12-review-5-reader-size'));
    if (saved >= 80 && saved <= 170) scale = saved;
  } catch {}
  try {
    const raw = JSON.parse(localStorage.getItem(MARK_KEY) || '{}');
    if (raw && typeof raw === 'object') marks = raw;
  } catch {}

  function gid() { return String(data.groups[group].id); }
  function saveMarks() { try { localStorage.setItem(MARK_KEY, JSON.stringify(marks)); } catch {} }
  function bucket() {
    const id = gid();
    if (!marks[id]) marks[id] = {};
    return marks[id];
  }
  function sourceText(part, index) {
    const g = data.groups[group];
    if (part === 'story') return g.paragraphs[index] || '';
    if (part === 'people') return (g.cards[index] && g.cards[index].text) || '';
    return g.questions[index] || '';
  }
  function cleanRanges(part, index) {
    const text = sourceText(part, index);
    const bag = marks[gid()];
    const raw = bag && bag[part] && bag[part][index];
    if (!Array.isArray(raw)) return [];
    return raw.map(r => ({start: Number(r.start), end: Number(r.end), color: r.color})).filter(r =>
      Number.isInteger(r.start) && Number.isInteger(r.end) && r.start >= 0 && r.end <= text.length && r.end > r.start && COLORS.includes(r.color)
    ).sort((a, b) => a.start - b.start || a.end - b.end);
  }
  function setRanges(part, index, list) {
    const bag = bucket();
    if (!bag[part]) bag[part] = {};
    if (!list.length) delete bag[part][index];
    else bag[part][index] = list;
    saveMarks();
  }
  function subtract(ranges, start, end) {
    const out = [];
    ranges.forEach(r => {
      if (r.end <= start || r.start >= end) { out.push(r); return; }
      if (r.start < start) out.push({start: r.start, end: start, color: r.color});
      if (r.end > end) out.push({start: end, end: r.end, color: r.color});
    });
    return out;
  }
  function mergeAdjacent(ranges) {
    const sorted = ranges.slice().sort((a, b) => a.start - b.start || a.end - b.end);
    const out = [];
    sorted.forEach(r => {
      const prev = out[out.length - 1];
      if (prev && prev.color === r.color && prev.end >= r.start) prev.end = Math.max(prev.end, r.end);
      else out.push({start: r.start, end: r.end, color: r.color});
    });
    return out;
  }
  function markedHtml(part, index) {
    const text = sourceText(part, index);
    const ranges = cleanRanges(part, index);
    if (!ranges.length) return esc(text);
    let html = '', cursor = 0;
    ranges.forEach(r => {
      if (r.start < cursor) return;
      if (r.start > cursor) html += esc(text.slice(cursor, r.start));
      html += '<mark class="fv-mark" data-color="' + r.color + '" data-start="' + r.start + '" data-end="' + r.end + '">' + esc(text.slice(r.start, r.end)) + '</mark>';
      cursor = r.end;
    });
    return html + esc(text.slice(cursor));
  }
  function markable(part, index, className) {
    return '<p class="fv-markable ' + className + '" data-fv-part="' + part + '" data-fv-item="' + index + '">' + markedHtml(part, index) + '</p>';
  }

  function applyScale() {
    scale = Math.max(80, Math.min(170, scale));
    dialog.style.setProperty('--fv-scale', String(scale / 100));
    dialog.querySelectorAll('.fv-size-value').forEach(el => { el.textContent = scale + '%'; });
    dialog.querySelectorAll('[data-fv="smaller"]').forEach(el => { el.disabled = scale <= 80; });
    dialog.querySelectorAll('[data-fv="larger"]').forEach(el => { el.disabled = scale >= 170; });
    try { localStorage.setItem('yossi-haifa12-review-5-reader-size', String(scale)); } catch {}
  }

  function markerControlsHtml(allowClear) {
    const swatches = COLORS.map(c => '<button type="button" class="fv-swatch" data-fv="color" data-color="' + c + '" aria-label="' + COLOR_LABEL[c] + '" aria-pressed="' + (markerColor === c) + '"></button>').join('');
    const clear = !allowClear ? '' : clearAsk
      ? '<span class="fv-confirm">למחוק את הסימונים של הקבוצה? <button type="button" data-fv="clear-yes">כן</button><button type="button" data-fv="clear-no">לא</button></span>'
      : '<button type="button" class="fv-tool" data-fv="clear">מחק סימונים</button>';
    return '<button type="button" class="fv-tool fv-marker" data-fv="marker" aria-pressed="' + markerOn + '">🖍 מרקר</button><span class="fv-colors">' + swatches + '</span>' + clear;
  }
  function paintTools() {
    const host = dialog.querySelector('#fv-tools');
    if (host) host.innerHTML = markerControlsHtml(group >= 0) + (group >= 0 ? '<button type="button" class="fv-tool fv-focus-open" data-fv="focus">תצוגה ממוקדת</button>' : '');
    dialog.classList.toggle('fv-marking', markerOn);
  }

  function stepsList(items) {
    return '<ol class="fv-steps">' + items.map((item, i) => '<li><span class="fv-num">' + (i + 1) + '</span><span>' + esc(item) + '</span></li>').join('') + '</ol>';
  }
  function homeHtml() {
    const cards = data.groups.map((g, i) => '<button type="button" class="fv-card" data-fv="group" data-index="' + i + '"><span class="fv-card-kicker">קבוצה ' + g.id + '</span><span class="fv-card-child">' + esc(g.child) + '</span><span class="fv-card-setting">' + esc(g.setting) + '</span></button>').join('');
    return '<div class="fv-wrap fv-home"><h2 class="fv-hero">' + esc(data.title) + '</h2><p class="fv-sub">' + esc(data.subtitle) + '</p><p class="fv-purpose">' + esc(data.purpose) + '</p>' + stepsList(data.homeSteps) + '<div class="fv-cards" role="group" aria-label="בחירת קבוצה">' + cards + '</div></div>';
  }
  function groupHtml() {
    const g = data.groups[group];
    const prevDis = group <= 0 ? ' disabled' : '';
    const nextDis = group >= data.groups.length - 1 ? ' disabled' : '';
    const tabs = tabNames.map((name, i) => '<button type="button" class="fv-tab" role="tab" id="fv-tab-' + i + '" aria-selected="' + (tab === i) + '" aria-controls="fv-panel" tabindex="' + (tab === i ? '0' : '-1') + '" data-fv="tab" data-index="' + i + '">' + name + '</button>').join('');
    let panel = '';
    if (tab === 0) {
      panel = '<h3 class="fv-story-title">' + esc(g.storyTitle) + '</h3><div class="fv-story">' + g.paragraphs.map((p, i) => markable('story', i, '')).join('') + '</div>';
    } else if (tab === 1) {
      panel = '<div class="fv-bubbles">' + g.cards.map((c, i) => '<article class="fv-bubble"><h3>' + esc(c.name) + '</h3>' + markable('people', i, '') + '</article>').join('') + '</div>';
    } else {
      panel = '<p class="fv-lead">' + esc(data.questionsIntro) + '</p><ol class="fv-qs">' + g.questions.map((q, i) => '<li class="fv-markable" data-fv-part="questions" data-fv-item="' + i + '">' + markedHtml('questions', i) + '</li>').join('') + '</ol><p class="fv-closing">' + esc(g.closing) + '</p>';
    }
    const work = '<ol class="fv-work">' + data.workSteps.map((item, i) => '<li><span class="fv-num">' + (i + 1) + '</span><span>' + esc(item) + '</span></li>').join('') + '</ol>' + (data.workNote ? '<p class="fv-note">' + esc(data.workNote) + '</p>' : '');
    return '<div class="fv-wrap"><div class="fv-nav"><button type="button" class="fv-navbtn" data-fv="home">לרשימת הקבוצות</button><button type="button" class="fv-navbtn" data-fv="prev"' + prevDis + '>הקבוצה הקודמת</button><p class="fv-pos">קבוצה ' + g.id + ' מתוך ' + data.groups.length + '</p><button type="button" class="fv-navbtn fv-next" data-fv="next"' + nextDis + '>הקבוצה הבאה</button></div><h2 class="fv-kicker">' + esc(g.heading) + '</h2><div class="fv-strip"><p class="fv-purpose">' + esc(data.purpose) + '</p><details id="fv-how"' + (howOpen ? ' open' : '') + '><summary>' + esc(data.workTitle) + '</summary>' + work + '</details></div><div class="fv-tabs" role="tablist" aria-label="חלקי הקבוצה">' + tabs + '</div><div class="fv-readbar"><button type="button" class="fv-tool" data-fv="focus">תצוגה ממוקדת</button></div><div id="fv-panel" role="tabpanel" tabindex="-1" aria-labelledby="fv-tab-' + tab + '">' + panel + '</div></div>';
  }

  function itemCount() {
    const g = data.groups[group];
    if (tab === 0) return g.paragraphs.length;
    if (tab === 1) return g.cards.length;
    return g.questions.length;
  }
  function progressLabel() {
    const n = focusIndex + 1, total = itemCount();
    const word = tab === 0 ? 'פסקה' : tab === 1 ? 'דמות' : 'שאלה';
    return word + ' ' + n + ' מתוך ' + total;
  }
  function focusPiece(i, dim) {
    const g = data.groups[group];
    const cls = 'fv-focus-item' + (i === focusIndex ? ' is-current' : '') + (dim && i !== focusIndex ? ' is-dim' : '');
    let inner = '';
    if (tab === 0) inner = markable('story', i, 'fv-focus-copy');
    else if (tab === 1) inner = '<article class="fv-focus-card"><h3>' + esc(g.cards[i].name) + '</h3>' + markable('people', i, 'fv-focus-copy') + '</article>';
    else inner = markable('questions', i, 'fv-focus-copy');
    return '<div class="' + cls + '">' + inner + '</div>';
  }
  function focusHtml() {
    const g = data.groups[group];
    const total = itemCount();
    if (focusIndex > total - 1) focusIndex = total - 1;
    if (focusIndex < 0) focusIndex = 0;
    const prevDis = focusIndex <= 0 ? ' disabled' : '';
    const nextDis = focusIndex >= total - 1 ? ' disabled' : '';
    const items = showAll ? Array.from({length: total}, (_, i) => focusPiece(i, true)).join('') : focusPiece(focusIndex, false);
    return '<header class="fv-focus-top"><div class="fv-focus-meta"><p class="fv-focus-group">' + esc(g.heading) + '</p><p class="fv-focus-progress" aria-live="polite">' + progressLabel() + '</p></div><div class="fv-focus-tools">' + markerControlsHtml(true) + '<button type="button" class="fv-tool" data-fv="show-all" aria-pressed="' + showAll + '">הצג הכל</button><div class="fv-font" aria-label="גודל כתב"><button type="button" data-fv="smaller" aria-label="הקטנת כתב">A−</button><output class="fv-size-value">' + scale + '%</output><button type="button" data-fv="larger" aria-label="הגדלת כתב">A+</button></div><button type="button" class="fv-tool fv-focus-exit" data-fv="focus-exit">יציאה</button></div></header><button type="button" class="fv-edge fv-edge-prev" data-fv="focus-prev" aria-label="הקודם"' + prevDis + '>›</button><button type="button" class="fv-edge fv-edge-next" data-fv="focus-next" aria-label="הבא"' + nextDis + '>‹</button><div class="fv-focus-stage' + (showAll ? ' is-all' : '') + '"><div class="fv-focus-column">' + items + '</div></div>';
  }
  function renderFocus(keepTop) {
    const layer = dialog.querySelector('.fv-focus-layer');
    const on = focusMode && group >= 0;
    dialog.classList.toggle('fv-focus', on);
    if (!on) { layer.hidden = true; layer.innerHTML = ''; return; }
    const stage = layer.querySelector('.fv-focus-stage');
    const top = keepTop && stage ? stage.scrollTop : 0;
    layer.hidden = false;
    layer.innerHTML = focusHtml();
    const next = layer.querySelector('.fv-focus-stage');
    if (next) next.scrollTop = top;
  }

  function revealTabs() {
    const scroller = dialog.querySelector('.fv-body');
    const tabsEl = dialog.querySelector('.fv-tabs');
    if (!scroller || !tabsEl) return;
    scroller.scrollTop += tabsEl.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
  }
  function render(opts) {
    const details = dialog.querySelector('#fv-how');
    if (details) howOpen = details.open;
    const scroller = dialog.querySelector('.fv-body');
    const savedTop = scroller ? scroller.scrollTop : 0;
    dialog.querySelector('#fv-bar-title').textContent = data.title;
    dialog.querySelector('#fv-body').innerHTML = group < 0 ? homeHtml() : groupHtml();
    dialog.dataset.view = group < 0 ? 'home' : String(data.groups[group].id);
    dialog.dataset.tab = group < 0 ? 'home' : parts[tab];
    dialog.dataset.focus = focusMode && group >= 0 ? 'on' : 'off';
    paintTools();
    renderFocus(opts && opts.keepScroll);
    applyScale();
    if (opts && opts.focus) {
      const el = dialog.querySelector(opts.focus);
      if (el) el.focus();
    }
    const body = dialog.querySelector('.fv-body');
    if (opts && opts.reveal) revealTabs();
    else if (opts && opts.keepScroll && body) body.scrollTop = savedTop;
    else if (body) body.scrollTop = 0;
  }

  function openReader() {
    group = -1; tab = 0; focusMode = false; focusIndex = 0; showAll = false; clearAsk = false;
    render();
    try { if (!dialog.open) dialog.showModal(); } catch {}
  }
  function goGroup(index, opts) {
    if (index < 0 || index >= data.groups.length) return;
    group = index; tab = 0; focusIndex = 0; clearAsk = false;
    render(opts);
  }
  function enterFocus() {
    if (group < 0) return;
    focusMode = true; focusIndex = 0; clearAsk = false;
    render();
  }
  function exitFocus() {
    focusMode = false;
    render({keepScroll: true});
  }
  function stepFocus(delta) {
    const next = focusIndex + delta;
    if (next < 0 || next >= itemCount()) return;
    focusIndex = next;
    render();
  }
  function toggleMarker() {
    markerOn = !markerOn; clearAsk = false;
    paintTools();
    if (focusMode) renderFocus(true);
    else dialog.classList.toggle('fv-marking', markerOn);
  }

  function textOffset(root, node, nodeOffset) {
    const range = document.createRange();
    range.selectNodeContents(root);
    range.setEnd(node, nodeOffset);
    return range.toString().length;
  }
  function commitSelection(ev) {
    if (ev && ev.target && ev.target.closest && ev.target.closest('button, a, summary')) return;
    if (!markerOn || !dialog.open) return;
    try { commitSelectionBody(); } catch (err) { return; }
  }
  function commitSelectionBody() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const base = range.commonAncestorContainer;
    const el = base.nodeType === 1 ? base : base.parentElement;
    const block = el && el.closest('.fv-markable');
    if (!block || !block.contains(range.startContainer) || !block.contains(range.endContainer)) return;
    let start = textOffset(block, range.startContainer, range.startOffset);
    let end = textOffset(block, range.endContainer, range.endOffset);
    if (end < start) { const tmp = start; start = end; end = tmp; }
    if (end <= start) return;
    const part = block.dataset.fvPart;
    const index = block.dataset.fvItem;
    if (block.textContent !== sourceText(part, Number(index))) return;
    const list = mergeAdjacent(subtract(cleanRanges(part, Number(index)), start, end).concat([{start, end, color: markerColor}]));
    setRanges(part, index, list);
    sel.removeAllRanges();
    suppressClick = true;
    render({keepScroll: true});
  }
  function removeMark(mark) {
    const block = mark.closest('.fv-markable');
    if (!block) return;
    const part = block.dataset.fvPart;
    const index = block.dataset.fvItem;
    const start = Number(mark.dataset.start);
    const end = Number(mark.dataset.end);
    setRanges(part, index, cleanRanges(part, Number(index)).filter(r => !(r.start === start && r.end === end)));
    render({keepScroll: true});
  }

  [openBtn, ...document.querySelectorAll('[data-open-stories]')].forEach(btn => btn.addEventListener('click', openReader));
  document.addEventListener('mouseup', commitSelection);
  document.addEventListener('touchend', ev => { setTimeout(() => commitSelection(ev), 40); });
  dialog.addEventListener('cancel', ev => {
    if (focusMode || blockClose) { ev.preventDefault(); blockClose = false; if (focusMode) exitFocus(); }
  });
  dialog.addEventListener('click', ev => {
    if (suppressClick) { suppressClick = false; ev.preventDefault(); ev.stopPropagation(); return; }
    const mark = ev.target.closest('.fv-mark');
    if (markerOn && mark && dialog.contains(mark)) { removeMark(mark); return; }
    const el = ev.target.closest('[data-fv]');
    if (!el) return;
    const act = el.getAttribute('data-fv');
    if (act === 'close') dialog.close();
    else if (act === 'smaller') { scale -= 10; applyScale(); }
    else if (act === 'larger') { scale += 10; applyScale(); }
    else if (act === 'home') { group = -1; focusMode = false; focusIndex = 0; clearAsk = false; render({focus: '.fv-card'}); }
    else if (act === 'group') goGroup(Number(el.dataset.index));
    else if (act === 'prev') goGroup(group - 1);
    else if (act === 'next') goGroup(group + 1);
    else if (act === 'tab') { tab = Number(el.dataset.index); focusIndex = 0; clearAsk = false; render({reveal: true}); }
    else if (act === 'focus') enterFocus();
    else if (act === 'focus-exit') exitFocus();
    else if (act === 'focus-next') stepFocus(1);
    else if (act === 'focus-prev') stepFocus(-1);
    else if (act === 'show-all') { showAll = !showAll; render({keepScroll: true}); }
    else if (act === 'marker') toggleMarker();
    else if (act === 'color') { markerColor = el.dataset.color; markerOn = true; paintTools(); if (focusMode) renderFocus(true); }
    else if (act === 'clear' && group >= 0) { clearAsk = true; paintTools(); if (focusMode) renderFocus(true); }
    else if (act === 'clear-no') { clearAsk = false; paintTools(); if (focusMode) renderFocus(true); }
    else if (act === 'clear-yes' && group >= 0) { delete marks[gid()]; saveMarks(); clearAsk = false; render({keepScroll: true}); }
  });

  function focusCard(index) {
    const cards = [...dialog.querySelectorAll('.fv-card')];
    if (!cards.length) return;
    cards[Math.max(0, Math.min(cards.length - 1, index))].focus();
  }
  document.addEventListener('keydown', ev => {
    if (!dialog.open) return;
    const typing = ev.target && (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA');
    if ((ev.code === 'KeyM' || ev.key === 'm' || ev.key === 'M') && !ev.repeat && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !typing) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      toggleMarker();
      return;
    }
    if (ev.key === 'Escape' && focusMode) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      blockClose = true;
      exitFocus();
      setTimeout(() => { blockClose = false; }, 0);
      return;
    }
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'Home', 'End'];
    const digit = ev.key >= '1' && ev.key <= '5';
    if (!navKeys.includes(ev.key) && !digit) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    if (focusMode && group >= 0) {
      if (ev.key === 'ArrowLeft') stepFocus(1);
      else if (ev.key === 'ArrowRight') stepFocus(-1);
      else if (ev.key === 'Home') { focusIndex = 0; render(); }
      else if (ev.key === 'End') { focusIndex = itemCount() - 1; render(); }
      else if (ev.key === 'PageDown' || ev.key === 'PageUp') {
        const stage = dialog.querySelector('.fv-focus-stage');
        if (stage) stage.scrollTop += (ev.key === 'PageDown' ? 1 : -1) * Math.max(120, Math.round(stage.clientHeight * 0.85));
      }
      return;
    }
    if (digit) { goGroup(Number(ev.key) - 1, {focus: '.fv-tab[aria-selected="true"]'}); return; }
    if (ev.key === 'PageDown' || ev.key === 'PageUp') {
      const scroller = dialog.querySelector('.fv-body');
      if (!scroller) return;
      scroller.scrollTop += (ev.key === 'PageDown' ? 1 : -1) * Math.max(120, Math.round(scroller.clientHeight * 0.85));
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
    else if (ev.key === 'Home') { tab = 0; focusIndex = 0; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
    else if (ev.key === 'End') { tab = tabNames.length - 1; focusIndex = 0; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
    else if (ev.key === 'ArrowLeft' && tab < tabNames.length - 1) { tab += 1; focusIndex = 0; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
    else if (ev.key === 'ArrowRight' && tab > 0) { tab -= 1; focusIndex = 0; render({focus: '.fv-tab[aria-selected="true"]', reveal: true}); }
  }, true);
})();
