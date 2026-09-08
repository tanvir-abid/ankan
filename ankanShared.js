// ---------------------------------------------------------------------------
// ankanShared.js
//
// Stateless DOM/text utilities shared by ankan.js (combined Phonetic+Bijoy
// keyboard) and ankanBn.js (standalone Bijoy keyboard). Nothing in this file
// holds per-panel state — every function takes the element(s) it needs as
// arguments — so it's safe for both modules (and, in principle, any number
// of future ones) to import and call concurrently on the same page.
//
// This also fixes the hardcoded-DOM-id collision between ankan.js and
// ankanBn.js: see makeIds() below. Each module now prefixes every internal
// element id with its own namespace, so both can run on the same page
// without one's #bkbShift shadowing the other's.
// ---------------------------------------------------------------------------

/** Returns an `id(name)` function that prefixes `name` with a namespace
 * unique to the calling module, e.g. makeIds('ankan')('shift') -> 'ankan-shift'.
 * Use one call to makeIds() per module (not per instance) — each of
 * ankan.js / ankanBn.js only ever builds a single panel (guarded by their
 * own `initialized` flag), so a fixed per-module namespace is enough to
 * eliminate collisions without the added complexity of a per-instance
 * counter. */
export function makeIds(namespace) {
  return name => `${namespace}-${name}`;
}

export function toSelectorList(selector) {
  if (!selector) return [];
  if (Array.isArray(selector)) return selector.filter(Boolean);
  return String(selector).split(',').map(s => s.trim()).filter(Boolean);
}

export function isEditableHost(el) {
  return !!el && el.nodeType === 1 && (el.isContentEditable || el.getAttribute('contenteditable') === 'true');
}

export function matchesTarget(el, selectors) {
  if (!el || el.nodeType !== 1) return false;
  if (selectors && selectors.length) {
    const matchesSelector = selectors.some(sel => typeof el.matches === 'function' && el.matches(sel));
    if (!matchesSelector) return false;
  }
  const tag = el.tagName;
  if (tag === 'TEXTAREA') return true;
  if (tag === 'INPUT') {
    const t = (el.type || 'text').toLowerCase();
    return ['text', 'search', 'tel', 'url', 'email', 'password'].includes(t);
  }
  return isEditableHost(el);
}

// --- contenteditable text-offset adapter -----------------------------------
// input/textarea have .value + selectionStart/End; contenteditable has none
// of that, so we compute equivalent linear character offsets by walking text
// nodes. Good enough for plain-text-style composers (chat boxes, comment
// fields); rich formatting inside the field is not specially handled.

export function ceOffsetToRange(el, offset) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let node, count = 0;
  while ((node = walker.nextNode())) {
    const len = node.textContent.length;
    if (count + len >= offset) {
      const range = document.createRange();
      range.setStart(node, offset - count);
      range.collapse(true);
      return range;
    }
    count += len;
  }
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  return range;
}

export function ceGetSelection(el) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !el.contains(sel.getRangeAt(0).startContainer)) {
    return { start: el.textContent.length, end: el.textContent.length };
  }
  const range = sel.getRangeAt(0);
  const preStart = document.createRange();
  preStart.selectNodeContents(el);
  preStart.setEnd(range.startContainer, range.startOffset);
  const preEnd = document.createRange();
  preEnd.selectNodeContents(el);
  preEnd.setEnd(range.endContainer, range.endOffset);
  return { start: preStart.toString().length, end: preEnd.toString().length };
}

export function ceSetSelection(el, start, end) {
  const sel = window.getSelection();
  const s = ceOffsetToRange(el, start);
  const e = end === start ? s : ceOffsetToRange(el, end);
  const range = document.createRange();
  range.setStart(s.startContainer, s.startOffset);
  range.setEnd(e.startContainer, e.startOffset);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function ceReplaceRange(el, start, end, text) {
  el.focus();
  ceSetSelection(el, start, end);
  if (document.execCommand) {
    document.execCommand(text === '' ? 'delete' : 'insertText', false, text);
  }
}

export function getFieldValue(el) {
  return isEditableHost(el) ? el.textContent : el.value;
}

export function getFieldSelection(el) {
  if (isEditableHost(el)) return ceGetSelection(el);
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  return { start, end };
}

export function replaceRange(el, start, end, text) {
  if (isEditableHost(el)) { ceReplaceRange(el, start, end, text); return; }
  const v = el.value;
  el.value = v.slice(0, start) + text + v.slice(end);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

export function setRange(el, start, end) {
  if (isEditableHost(el)) { ceSetSelection(el, start, end); return; }
  if (el.setSelectionRange) el.setSelectionRange(start, end);
}

// Detect when the live browser selection is already valid and inside the
// field, so we can insert directly instead of round-tripping through a
// linear character offset (ambiguous right after a line break).
function hasLiveSelectionIn(el) {
  if (document.activeElement !== el) return false;
  const sel = window.getSelection();
  return !!(sel && sel.rangeCount && el.contains(sel.getRangeAt(0).startContainer));
}

function isAtAbsoluteStart(el) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return true;
  const r = sel.getRangeAt(0);
  const pre = document.createRange();
  pre.selectNodeContents(el);
  pre.setEnd(r.startContainer, r.startOffset);
  return pre.toString().length === 0;
}

export function insertAtCursor(el, text) {
  if (isEditableHost(el)) {
    if (hasLiveSelectionIn(el)) {
      if (document.execCommand) {
        document.execCommand(text === '' ? 'delete' : 'insertText', false, text);
      }
      return;
    }
    const { start, end } = ceGetSelection(el);
    ceReplaceRange(el, start, end, text);
    return;
  }
  if (typeof el.value !== 'string') return; // not a real text host — bail quietly
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  el.value = el.value.slice(0, start) + text + el.value.slice(end);
  const pos = start + text.length;
  if (el.setSelectionRange) el.setSelectionRange(pos, pos);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

export function backspaceAtCursor(el) {
  if (isEditableHost(el)) {
    if (hasLiveSelectionIn(el)) {
      const sel = window.getSelection();
      const r = sel.getRangeAt(0);
      if (r.collapsed && isAtAbsoluteStart(el)) return false;
      if (document.execCommand) document.execCommand('delete', false);
      return true;
    }
    const { start, end } = ceGetSelection(el);
    if (start === end && start === 0) return false;
    ceReplaceRange(el, start === end ? start - 1 : start, end, '');
    return true;
  }
  if (typeof el.value !== 'string') return false;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  if (start === end) {
    if (start === 0) return false;
    el.value = el.value.slice(0, start - 1) + el.value.slice(end);
    const pos = start - 1;
    if (el.setSelectionRange) el.setSelectionRange(pos, pos);
  } else {
    el.value = el.value.slice(0, start) + el.value.slice(end);
    if (el.setSelectionRange) el.setSelectionRange(start, start);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

// Double-space -> দাঁড়ি helper. Callers keep their own lastSpaceAt/lastSpaceEl
// state (it's two numbers/refs, not worth a shared mutable singleton) and
// pass them in; this just does the read-only decision + the actual edit.
export function isDoubleSpace(el, lastSpaceEl, lastSpaceAt, now, windowMs = 600) {
  const { start: pos } = getFieldSelection(el);
  const value = getFieldValue(el);
  return el === lastSpaceEl && now - lastSpaceAt < windowMs && pos > 0 && value[pos - 1] === ' ';
}

export function swapTrailingSpaceForDari(el) {
  const { start: pos } = getFieldSelection(el);
  replaceRange(el, pos - 1, pos, '\u0964 '); // দাঁড়ি + space
  setRange(el, pos + 1, pos + 1);
}

export function isCoarsePointer() {
  return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
}

// ---------------------------------------------------------------------------
// Native mobile-keyboard / autocorrect suppression while a field is active
// ---------------------------------------------------------------------------

const NATIVE_ATTRS = ['autocorrect', 'autocapitalize', 'spellcheck', 'autocomplete'];

export function suppressNativeAssist(el) {
  if (!el || el.dataset.ankOrigSet) return;
  el.dataset.ankOrigSet = '1';
  if (isCoarsePointer()) {
    el.dataset.ankOrigInputmode = el.getAttribute('inputmode') || '';
    el.setAttribute('inputmode', 'none');
  }
  NATIVE_ATTRS.forEach(attr => {
    el.dataset['ankOrig_' + attr] = el.hasAttribute(attr) ? el.getAttribute(attr) : '\u0000';
  });
  el.setAttribute('autocorrect', 'off');
  el.setAttribute('autocapitalize', 'off');
  el.setAttribute('autocomplete', 'off');
  el.spellcheck = false;
}

export function restoreNativeAssist(el) {
  if (!el || !el.dataset || !el.dataset.ankOrigSet) return;
  if (el.dataset.ankOrigInputmode !== undefined) {
    if (el.dataset.ankOrigInputmode) el.setAttribute('inputmode', el.dataset.ankOrigInputmode);
    else el.removeAttribute('inputmode');
    delete el.dataset.ankOrigInputmode;
  }
  NATIVE_ATTRS.forEach(attr => {
    const key = 'ankOrig_' + attr;
    const orig = el.dataset[key];
    if (orig === '\u0000') el.removeAttribute(attr);
    else if (orig !== undefined) el.setAttribute(attr, orig);
    delete el.dataset[key];
  });
  delete el.dataset.ankOrigSet;
}

// ---------------------------------------------------------------------------
// Panel chrome: flashing keys, positioning, dragging
// ---------------------------------------------------------------------------

export function flashKey(el) {
  if (!el) return;
  el.classList.add('bkb-key-pressed');
  setTimeout(() => el.classList.remove('bkb-key-pressed'), 120);
}

export function positionPanel(panel, { mobileBreakpoint = 640 } = {}) {
  if (window.innerWidth <= mobileBreakpoint) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  panel.style.left = Math.max(10, vw - panel.offsetWidth - 30) + 'px';
  panel.style.top = Math.max(10, vh - panel.offsetHeight - 30) + 'px';
}

/** excludeSelectors: clicks/drags starting on any of these never start a
 * drag (buttons inside the header, mode toggle, etc.). */
export function makeDraggable(el, handle, excludeSelectors = ['.bkb-btn'], { mobileBreakpoint = 640 } = {}) {
  let ox = 0, oy = 0, dragging = false;
  handle.addEventListener('pointerdown', e => {
    if (window.innerWidth <= mobileBreakpoint) return;
    if (excludeSelectors.some(sel => e.target.closest(sel))) return;
    dragging = true;
    const r = el.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', e => {
    if (!dragging) return;
    let x = e.clientX - ox;
    let y = e.clientY - oy;
    x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, y));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  });
  handle.addEventListener('pointerup', e => {
    dragging = false;
    try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
  });
}
