import { KEY_TABLE, ROW_LAYOUT, VOWEL_CODES, charFor } from './ankanBn.js';
import { parsePhonetic } from './ankanEn.js';
import {
  makeIds, toSelectorList, isEditableHost, matchesTarget,
  getFieldValue, getFieldSelection, replaceRange, setRange,
  insertAtCursor, backspaceAtCursor,
  isDoubleSpace, swapTrailingSpaceForDari,
  isCoarsePointer, suppressNativeAssist, restoreNativeAssist,
  flashKey, positionPanel, makeDraggable
} from './ankanShared.js';

// Every internal element id is namespaced under "ankan-" so this module can
// run on the same page as ankanBn.js (namespaced "ankanbn-") without either
// one's #...-shift, #...-body etc. shadowing the other's.
const id = makeIds('ankan');

// ---------------------------------------------------------------------------
// Phonetic-mode on-screen layout (plain QWERTY + the punctuation the Avro
// rule set gives special meaning to). Physical typing in phonetic mode does
// NOT depend on this table — it's only for the clickable on-screen keys and
// for figuring out which key to flash on physical keydown.
// ---------------------------------------------------------------------------

const PHONETIC_ROWS = [
  { offset: 0, keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
  { offset: 24, keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] },
  { offset: 40, keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] },
  { offset: 64, keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'] },
  { offset: 0, keys: [':', '^', '$', '`', '?', '!'] }
];

const SHIFT_MAP = { ',': ',', '.': '.', ':': ':', '^': '^', '$': '$', '`': '`' };

function phoneticGlyph(key, shiftActive) {
  if (/[a-z]/.test(key)) return shiftActive ? key.toUpperCase() : key;
  return SHIFT_MAP[key] ?? key;
}

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

let panel = null;
let bodyEl = null;
let mode = 'bangla'; // 'bangla' | 'phonetic'
let shiftOn = false;
let vowelMode = false;
let altHeld = false;
let activeEl = null;
let closedForever = false;
let matchSelectors = [];
let initialized = false;
let keyElements = {};
let enabled = true;
let closeMode = 'permanent';
let panelView = 'keys'; // 'keys' | 'symbols'
let lastSpaceAt = 0;
let lastSpaceEl = null;
let autoShowPanel = true;   // showPanel option: auto-open on focus, or leave it to the integrator?
let onPanelToggle = null;   // (visible: boolean) => void

// Extra punctuation + a small emoji set for the symbols panel. The 5 most
// common marks (.  ,  ?  !  ।) already live on the main layout — this is
// the overflow drawer for everything else.
const EXTRA_PUNCT = ['-', '—', '(', ')', '"', "'", ';', ':', '…', '॥', '৳', '@', '#', '%', '&'];
const EMOJI = ['😀', '😂', '😍', '👍', '🙏', '❤️', '😢', '🔥', '🎉', '🤔', '😅', '😎', '👏', '🥲', '😴', '💯'];

function buildSymbolsHTML() {
  const key = ch => `<button type="button" class="bkb-key bkb-sym-key" data-symbol="${ch}">${ch}</button>`;
  return `<div class="bkb-sym-group">${EXTRA_PUNCT.map(key).join('')}</div>
          <div class="bkb-sym-group bkb-emoji-grid">${EMOJI.map(key).join('')}</div>`;
}

// Per-element phonetic typing buffer (raw Banglish typed since last word
// boundary), used for both physical typing and on-screen phonetic clicks.
const PHONETIC_STATE = new WeakMap();

function getPhoneticState(el) {
  let s = PHONETIC_STATE.get(el);
  if (!s) { s = { buffer: '', start: null }; PHONETIC_STATE.set(el, s); }
  return s;
}

function resetPhoneticState(el) {
  PHONETIC_STATE.delete(el);
}

function phoneticBufferInSync(el, st) {
  if (st.start === null) return true;
  const value = getFieldValue(el);
  if (st.start < 0 || st.start > value.length) return false;
  const expected = parsePhonetic(st.buffer);
  return value.slice(st.start, st.start + expected.length) === expected;
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Building the on-screen key grid (branches by mode)
// ---------------------------------------------------------------------------

function buildKeys() {
  let html = '';
  keyElements = {};

  if (panelView === 'symbols') {
    bodyEl.innerHTML = buildSymbolsHTML();
    return; // symbol buttons use data-symbol, not data-code/data-key — nothing to index
  }

  if (mode === 'bangla') {
    ROW_LAYOUT.forEach(row => {
      html += `<div class="bkb-row" style="padding-left:${row.offset}px">`;
      row.codes.forEach(code => {
        const k = KEY_TABLE[code];
        const isVowelKey = VOWEL_CODES.includes(code);
        const glyph = charFor(code, shiftOn, vowelMode);
        const sub = shiftOn ? k.base : k.shift;
        html += `<button type="button" class="bkb-key${isVowelKey ? ' bkb-key-vowel' : ''}" data-code="${code}">
          <span class="bkb-key-sub">${sub}</span>
          <span class="bkb-key-main">${glyph}</span>
        </button>`;
      });
      html += '</div>';
    });
  } else {
    PHONETIC_ROWS.forEach(row => {
      html += `<div class="bkb-row" style="padding-left:${row.offset}px">`;
      row.keys.forEach(key => {
        const glyph = phoneticGlyph(key, shiftOn);
        html += `<button type="button" class="bkb-key" data-key="${key}">
          <span class="bkb-key-main">${glyph}</span>
        </button>`;
      });
      html += '</div>';
    });
  }

  bodyEl.innerHTML = html;
  bodyEl.querySelectorAll('.bkb-key').forEach(btn => {
    const keyId = btn.dataset.code || btn.dataset.key;
    keyElements[keyId] = btn;
  });
}

// ---------------------------------------------------------------------------
// Phonetic-mode typing engine (shared by physical beforeinput and clicks)
// ---------------------------------------------------------------------------

function phoneticInsert(el, data) {
  if (!data) return;
  const st = getPhoneticState(el);
  if (!phoneticBufferInSync(el, st)) resetPhoneticState(el);
  const stFresh = getPhoneticState(el);

  const cursor = getFieldSelection(el).start;

  if (data === ' ' || data === '\n') {
    replaceRange(el, cursor, cursor, data);
    setRange(el, cursor + 1, cursor + 1);
    resetPhoneticState(el);
    return;
  }

  if (stFresh.start === null) stFresh.start = cursor;
  const renderedLen = cursor - stFresh.start;
  stFresh.buffer += data;
  const converted = parsePhonetic(stFresh.buffer);
  replaceRange(el, stFresh.start, stFresh.start + renderedLen, converted);
  setRange(el, stFresh.start + converted.length, stFresh.start + converted.length);
}

function phoneticBackspace(el) {
  const st = getPhoneticState(el);
  if (!phoneticBufferInSync(el, st)) resetPhoneticState(el);
  const stFresh = getPhoneticState(el);
  const cursor = getFieldSelection(el).start;
  const currentRendered = stFresh.start !== null ? parsePhonetic(stFresh.buffer) : '';

  if (stFresh.buffer.length > 0 && stFresh.start !== null && cursor === stFresh.start + currentRendered.length) {
    stFresh.buffer = stFresh.buffer.slice(0, -1);
    const converted = parsePhonetic(stFresh.buffer);
    replaceRange(el, stFresh.start, stFresh.start + currentRendered.length, converted);
    setRange(el, stFresh.start + converted.length, stFresh.start + converted.length);
    if (stFresh.buffer.length === 0) resetPhoneticState(el);
    return true;
  }
  resetPhoneticState(el);
  return backspaceAtCursor(el);
}

// Double-space -> দাঁড়ি, mirroring the "double-space -> period" convention
// mobile keyboards already train people on. Shared by physical Space,
// footer Space, and works regardless of mode.
function insertSpaceOrDari(el) {
  const now = Date.now();
  if (isDoubleSpace(el, lastSpaceEl, lastSpaceAt, now)) {
    swapTrailingSpaceForDari(el);
    lastSpaceAt = 0;
    return;
  }
  if (mode === 'phonetic') phoneticInsert(el, ' ');
  else insertAtCursor(el, ' ');
  lastSpaceAt = now;
  lastSpaceEl = el;
}

function handleBeforeInput(e) {
  if (mode !== 'phonetic') return; // Bangla mode is handled by physical keydown instead
  const el = e.target;
  if (!enabled || !matchesTarget(el, matchSelectors)) return;
  const isCE = isEditableHost(el);
  if (!isCE && typeof el.selectionStart !== 'number') return;
  if (!e.cancelable) return;

  const { start: cursor, end: selEnd } = getFieldSelection(el);
  const type = e.inputType;

  if (selEnd !== cursor && type !== 'deleteContentBackward') {
    resetPhoneticState(el);
    return;
  }

  if (type === 'deleteContentBackward') {
    e.preventDefault();
    phoneticBackspace(el);
    flashKey(document.getElementById(id('backspace')));
    return;
  }

  if (type === 'insertLineBreak' || type === 'insertParagraph') {
    e.preventDefault();
    phoneticInsert(el, '\n');
    flashKey(document.getElementById(id('enter')));
    return;
  }

  if (type !== 'insertText' && type !== 'insertCompositionText' && type !== 'insertReplacementText') {
    resetPhoneticState(el);
    return;
  }

  if (!e.data) { resetPhoneticState(el); return; }

  e.preventDefault();
  if (e.data === ' ') {
    flashKey(document.getElementById(id('space')));
    insertSpaceOrDari(el);
    return;
  }
  phoneticInsert(el, e.data);
}

// ---------------------------------------------------------------------------
// Bangla (Bijoy) mode physical typing
// ---------------------------------------------------------------------------

function effectiveShift(e) {
  let eff = false;
  if (e.getModifierState && e.getModifierState('CapsLock')) eff = !eff;
  if (e.shiftKey) eff = !eff;
  return eff;
}

function handleKeydown(e) {
  if (!enabled) return;
  if (!activeEl || document.activeElement !== activeEl) return;
  if (!matchesTarget(activeEl, matchSelectors)) return;

  if (e.code === 'CapsLock') return;

  const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Delete'];
  if (navKeys.includes(e.code) || e.ctrlKey || e.metaKey) {
    resetPhoneticState(activeEl);
    return;
  }

  if (mode === 'phonetic') {
    // Actual character insertion in phonetic mode happens via beforeinput;
    // this handler only manages the on-screen key-press flash here.
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { flashKey(document.getElementById(id('shift'))); return; }
    if (e.code === 'Backspace') { flashKey(document.getElementById(id('backspace'))); return; }
    const glyphKey = e.key && e.key.length === 1 ? e.key.toLowerCase() : null;
    if (glyphKey && keyElements[glyphKey]) flashKey(keyElements[glyphKey]);
    return;
  }

  // --- Bangla (Bijoy) mode ---
  if (e.code === 'AltLeft' || e.code === 'AltRight') {
    e.preventDefault();
    altHeld = true;
    const vBtn = document.getElementById(id('vowel'));
    if (vBtn) vBtn.classList.add('active');
    return;
  }

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { flashKey(document.getElementById(id('shift'))); return; }
  if (e.code === 'Space') { e.preventDefault(); insertSpaceOrDari(activeEl); flashKey(document.getElementById(id('space'))); return; }
  if (e.code === 'Backspace') { flashKey(document.getElementById(id('backspace'))); return; }
  if (e.code === 'Enter') { flashKey(document.getElementById(id('enter'))); return; }

  const k = KEY_TABLE[e.code];
  if (!k) return;
  const shiftActive = effectiveShift(e);

  if (altHeld && VOWEL_CODES.includes(e.code)) {
    const ch = shiftActive ? (k.gShift ?? k.shift) : (k.gBase ?? k.base);
    e.preventDefault();
    insertAtCursor(activeEl, ch);
    flashKey(keyElements[e.code]);
    return;
  }

  const ch = shiftActive ? k.shift : k.base;
  e.preventDefault();
  insertAtCursor(activeEl, ch);
  flashKey(keyElements[e.code]);
}

function handleKeyup(e) {
  if (e.code === 'AltLeft' || e.code === 'AltRight') {
    const vBtn = document.getElementById(id('vowel'));
    if (vBtn) vBtn.classList.remove('active');
    altHeld = false;
  }
}

// ---------------------------------------------------------------------------
// Panel chrome: header (icon/title/mode toggle/info/min/close), footer, drag
// ---------------------------------------------------------------------------

function updateFooter() {
  const vowelBtn = panel.querySelector('#' + id('vowel'));
  if (vowelBtn) vowelBtn.style.display = mode === 'bangla' ? '' : 'none';
}

function updateModeToggle() {
  const btn = panel.querySelector('#' + id('modeToggle'));
  if (!btn) return;
  btn.textContent = mode === 'bangla' ? 'বাংলা' : 'EN';
  btn.title = mode === 'bangla'
    ? 'Bangla (Bijoy) layout — click to switch to Phonetic typing'
    : 'Phonetic (Banglish) typing — click to switch to Bangla layout';
}

function setMode(nextMode) {
  if (nextMode !== 'bangla' && nextMode !== 'phonetic') return;
  if (mode === nextMode) return;
  mode = nextMode;
  shiftOn = false;
  vowelMode = false;
  altHeld = false;
  if (activeEl) resetPhoneticState(activeEl);
  buildKeys();
  updateFooter();
  updateModeToggle();
  const shiftBtn = panel.querySelector('#' + id('shift'));
  if (shiftBtn) shiftBtn.classList.remove('active');
  const vBtn = panel.querySelector('#' + id('vowel'));
  if (vBtn) vBtn.classList.remove('active');
}

function setShift(on) {
  shiftOn = on;
  buildKeys();
  const shiftBtn = panel.querySelector('#' + id('shift'));
  if (shiftBtn) shiftBtn.classList.toggle('active', shiftOn);
}

function setVowelMode(on) {
  vowelMode = on;
  buildKeys();
  const vBtn = panel.querySelector('#' + id('vowel'));
  if (vBtn) vBtn.classList.toggle('active', vowelMode);
}

function createPanel() {
  panel = document.createElement('div');
  panel.className = 'bkb-panel';
  panel.innerHTML = `
    <div class="bkb-header" id="${id('header')}">
      <div class="bkb-title-wrap">
        <svg class="bkb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
          <line x1="16" y1="8" x2="2" y2="22"/>
          <line x1="17.5" y1="15" x2="9" y2="15"/>
        </svg>
        <span class="bkb-title">অঙ্কন</span>
      </div>
      <div class="bkb-actions">
        <button type="button" class="bkb-btn bkb-mode-toggle" id="${id('modeToggle')}" title="Switch typing mode">বাংলা</button>
        <span class="bkb-info-wrap" tabindex="0">
          <button type="button" class="bkb-btn" id="${id('info')}" title="How to use">&#9432;</button>
          <div class="bkb-info-panel">
            <strong>ব্যবহারবিধি</strong>
            <ul>
              <li><b>বাংলা</b> মোডে: ইংরেজি কীবোর্ডের চাবির অবস্থান অনুযায়ী বাংলা অক্ষর বসবে (বিজয় লেআউট)। Shift চাপুন কী-এর উপরে ডানদিকে দেখানো অক্ষরের জন্য। Alt চেপে ধরুন স্বাধীন স্বরবর্ণের জন্য।</li>
              <li><b>EN (ফোনেটিক)</b> মোডে: স্বাভাবিক বানানে টাইপ করুন, বাংলা তৈরি হবে। যেমন: amar → আমার। "ও"-কার পেতে বড় হাতের O লিখুন: sOnar → সোনার।</li>
              <li>হেডারের বাটনে ক্লিক করে দুই মোডের মধ্যে বদল করুন।</li>
              <li>হেডার ধরে টেনে প্যানেলটি সরাতে পারবেন।</li>
            </ul>
          </div>
        </span>
        <button type="button" class="bkb-btn" id="${id('min')}" title="Minimize">&#8211;</button>
        <button type="button" class="bkb-btn" id="${id('close')}" title="Close">&times;</button>
      </div>
    </div>
    <div class="bkb-body" id="${id('body')}"></div>
    <div class="bkb-footer">
      <button type="button" class="bkb-key bkb-key-shift" id="${id('shift')}" data-action="shift">Shift</button>
      <button type="button" class="bkb-key bkb-key-shift" id="${id('vowel')}" data-action="vowel">স্বর (Alt)</button>
      <button type="button" class="bkb-key bkb-key-space" id="${id('space')}" data-action="space">Space</button>
      <button type="button" class="bkb-key bkb-key-ctrl" id="${id('backspace')}" data-action="backspace">&larr;</button>
      <button type="button" class="bkb-key bkb-key-ctrl" id="${id('enter')}" data-action="enter">Enter</button>
      <button type="button" class="bkb-key bkb-key-ctrl bkb-key-symbols" id="${id('symbols')}" data-action="symbols" title="Punctuation &amp; emoji">😊</button>
    </div>
  `;
  document.body.appendChild(panel);
  bodyEl = panel.querySelector('#' + id('body'));
  buildKeys();
  updateModeToggle();

  // Clicking a virtual key normally shifts focus to the button, which fires
  // focusout on the real field first -> resetPhoneticState wipes the buffer
  // -> every click re-parses a single isolated letter instead of the whole
  // word ("kemon achO" -> "কএমঅন আচহও"). Blocking the focus shift on
  // mousedown (before click fires) keeps the field focused throughout, so
  // the buffer survives across clicks exactly like physical typing.
  bodyEl.addEventListener('mousedown', e => {
    if (e.target.closest('.bkb-key')) e.preventDefault();
  });
  panel.querySelector('.bkb-footer').addEventListener('mousedown', e => {
    if (e.target.closest('.bkb-key')) e.preventDefault();
  });

  bodyEl.addEventListener('click', e => {
    const symBtn = e.target.closest('[data-symbol]');
    if (symBtn && activeEl) { insertAtCursor(activeEl, symBtn.dataset.symbol); activeEl.focus(); return; }
    const btn = e.target.closest('.bkb-key');
    if (!btn || !activeEl) return;
    if (mode === 'bangla') {
      const ch = charFor(btn.dataset.code, shiftOn, vowelMode);
      if (ch == null) return;
      insertAtCursor(activeEl, ch);
      if (vowelMode) setVowelMode(false);
    } else {
      const glyph = phoneticGlyph(btn.dataset.key, shiftOn);
      phoneticInsert(activeEl, glyph);
    }
    activeEl.focus();
  });

  panel.querySelector('.bkb-footer').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'shift') { setShift(!shiftOn); return; }
    if (action === 'vowel') { setVowelMode(!vowelMode); return; }
    if (action === 'symbols') {
      panelView = panelView === 'symbols' ? 'keys' : 'symbols';
      btn.classList.toggle('active', panelView === 'symbols');
      buildKeys();
      return;
    }
    if (!activeEl) return;
    if (action === 'space') {
      insertSpaceOrDari(activeEl);
    }
    if (action === 'backspace') {
      if (mode === 'phonetic') phoneticBackspace(activeEl);
      else backspaceAtCursor(activeEl);
    }
    if (action === 'enter') {
      if (mode === 'phonetic') phoneticInsert(activeEl, '\n');
      else insertAtCursor(activeEl, '\n');
    }
    activeEl.focus();
  });

  panel.querySelector('#' + id('modeToggle')).addEventListener('click', e => {
    e.stopPropagation();
    setMode(mode === 'bangla' ? 'phonetic' : 'bangla');
  });

  panel.querySelector('#' + id('min')).addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.add('bkb-hidden');
    firePanelToggle(false);
  });
  panel.querySelector('#' + id('close')).addEventListener('click', e => {
    e.stopPropagation();
    if (closeMode === 'permanent') closedForever = true;
    panel.classList.add('bkb-hidden');
    firePanelToggle(false);
  });

  makeDraggable(panel, panel.querySelector('#' + id('header')), ['.bkb-btn', '.bkb-mode-toggle']);
  updateFooter();
  positionPanel(panel);
  window.addEventListener('resize', () => positionPanel(panel));
}

function firePanelToggle(visible) {
  if (typeof onPanelToggle === 'function') onPanelToggle(visible);
}

function showPanel() {
  if (!enabled) return;
  if (closedForever) return;
  if (!panel) createPanel();
  panel.classList.remove('bkb-hidden');
  firePanelToggle(true);
}

function hidePanel() {
  if (panel) panel.classList.add('bkb-hidden');
  restoreNativeAssist(activeEl);
  firePanelToggle(false);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialize (or reconfigure) the combined Ankan keyboard — Bangla (Bijoy)
 * layout and Phonetic (Banglish) typing in one floating panel, switchable
 * from the header.
 *
 * options:
 *  - selector / selectors: CSS selector(s) (string or array) for target fields.
 *  - defaultMode: 'bangla' (default) | 'phonetic' — which mode is active
 *    when the panel first opens.
 *  - closeMode: 'permanent' (default) | 'toggle'.
 *  - enabled: boolean, default true.
 *  - showPanel: boolean, default true. When false, focusing a matched field
 *    still activates typing/conversion (physical keyboard works normally),
 *    but the floating on-screen panel is never auto-opened. Use this when
 *    you want your own trigger UI — call showAnkanKeyboard() to open it
 *    explicitly (e.g. from a custom button); that call always works
 *    regardless of this setting.
 *  - onPanelToggle: (visible: boolean) => void. Fires every time the panel's
 *    visibility actually changes — auto-open on focus (if showPanel is
 *    true), explicit showAnkanKeyboard()/hideAnkanKeyboard() calls, and the
 *    panel's own Minimize/Close buttons. This is how you drive a custom
 *    trigger button's pressed/active state when showPanel is false.
 */
export function initAnkanKeyboard(options = {}) {
  if (options.selector !== undefined || options.selectors !== undefined) {
    matchSelectors = toSelectorList(options.selector || options.selectors);
  }
  if (options.defaultMode === 'bangla' || options.defaultMode === 'phonetic') {
    mode = options.defaultMode;
  }
  if (options.closeMode === 'permanent' || options.closeMode === 'toggle') {
    closeMode = options.closeMode;
  }
  if (typeof options.enabled === 'boolean') {
    enabled = options.enabled;
    if (!enabled) hidePanel();
  }
  if (typeof options.showPanel === 'boolean') {
    autoShowPanel = options.showPanel;
  }
  if (typeof options.onPanelToggle === 'function') {
    onPanelToggle = options.onPanelToggle;
  }

  if (initialized) return;
  initialized = true;

  document.addEventListener('focusin', e => {
    if (!enabled) return;
    const el = e.target;
    if (matchesTarget(el, matchSelectors)) {
      activeEl = el;
      suppressNativeAssist(el);
      if (autoShowPanel) showPanel();
    }
  });
  document.addEventListener('focusout', e => {
    resetPhoneticState(e.target);
    restoreNativeAssist(e.target);
  });
  document.addEventListener('mouseup', e => resetPhoneticState(e.target));
  document.addEventListener('touchend', e => resetPhoneticState(e.target));
  document.addEventListener('beforeinput', handleBeforeInput, true);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('keyup', handleKeyup);
  console.log('Ankan keyboard initialized. Target selectors:', matchSelectors);
}

/** Turn the keyboard on/off from outside code, independent of focus events. */
export function setAnkanKeyboardEnabled(isEnabled) {
  enabled = !!isEnabled;
  if (!enabled) hidePanel();
  else closedForever = false;
}

export function isAnkanKeyboardEnabled() {
  return enabled;
}

/** Force the panel open right now (see showBanglaKeyboard for behavior). */
export function showAnkanKeyboard(targetEl) {
  if (!enabled) enabled = true;
  closedForever = false;

  if (targetEl) {
    activeEl = targetEl;
  } else if ((!activeEl || !matchesTarget(activeEl, matchSelectors)) && matchSelectors.length) {
    const candidate = document.querySelector(matchSelectors.join(','));
    if (candidate) activeEl = candidate;
  }

  showPanel();
  if (activeEl && document.activeElement !== activeEl) activeEl.focus();
}

/** Hide the panel right now. */
export function hideAnkanKeyboard() {
  hidePanel();
}

/** Programmatically switch typing mode: 'bangla' | 'phonetic'. */
export function setAnkanMode(nextMode) {
  if (!panel) { mode = nextMode === 'phonetic' ? 'phonetic' : 'bangla'; return; }
  setMode(nextMode);
}

export function getAnkanMode() {
  return mode;
}