import {
  makeIds, toSelectorList, matchesTarget,
  insertAtCursor, backspaceAtCursor,
  isDoubleSpace, swapTrailingSpaceForDari,
  suppressNativeAssist, restoreNativeAssist,
  flashKey, positionPanel, makeDraggable
} from './ankanShared.js';

// Namespaced under "ankanbn-" so this standalone module can run on the same
// page as ankan.js (namespaced "ankan-") without their #...-shift, #...-body
// etc. ids colliding.
const id = makeIds('ankanbn');

const KEY_TABLE = {
  Digit1: { base: '১', shift: '!' },
  Digit2: { base: '২', shift: '@' },
  Digit3: { base: '৩', shift: '#' },
  Digit4: { base: '৪', shift: '$' },
  Digit5: { base: '৫', shift: '%' },
  Digit6: { base: '৬', shift: '^' },
  Digit7: { base: '৭', shift: 'ঁ' },
  Digit8: { base: '৮', shift: '*' },
  Digit9: { base: '৯', shift: '(' },
  Digit0: { base: '০', shift: ')' },

  KeyQ: { base: 'ঙ', shift: 'ং' },
  KeyW: { base: 'য', shift: 'য়' },
  KeyE: { base: 'ড', shift: 'ঢ' },
  KeyR: { base: 'প', shift: 'ফ' },
  KeyT: { base: 'ট', shift: 'ঠ' },
  KeyY: { base: 'চ', shift: 'ছ' },
  KeyU: { base: 'জ', shift: 'ঝ' },
  KeyI: { base: 'হ', shift: 'ঞ' },
  KeyO: { base: 'গ', shift: 'ঘ' },
  KeyP: { base: 'ড়', shift: 'ঢ়' },

  KeyA: { base: 'ৃ', shift: 'র্', gBase: 'ঋ' },
  KeyS: { base: 'ু', shift: 'ূ', gBase: 'উ', gShift: 'ঊ' },
  KeyD: { base: 'ি', shift: 'ী', gBase: 'ই', gShift: 'ঈ' },
  KeyF: { base: 'া', shift: 'অ', gBase: 'আ' },
  KeyG: { base: '্', shift: '।' },
  KeyH: { base: 'ব', shift: 'ভ' },
  KeyJ: { base: 'ক', shift: 'খ' },
  KeyK: { base: 'ত', shift: 'থ' },
  KeyL: { base: 'দ', shift: 'ধ' },

  KeyZ: { base: '্র', shift: '্য' },
  KeyX: { base: 'ও', shift: 'ৗ', gShift: 'ঔ' },
  KeyC: { base: 'ে', shift: 'ৈ', gBase: 'এ', gShift: 'ঐ' },
  KeyV: { base: 'র', shift: 'ল' },
  KeyB: { base: 'ন', shift: 'ণ' },
  KeyN: { base: 'স', shift: 'ষ' },
  KeyM: { base: 'ম', shift: 'শ' },
  Slash: { base: 'ঃ', shift: 'ৎ' },
  Comma: { base: ',', shift: '?' },
  Period: { base: '।', shift: '!' }
};

const ROW_LAYOUT = [
  { offset: 0, codes: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'] },
  { offset: 24, codes: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'] },
  { offset: 40, codes: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL'] },
  { offset: 64, codes: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Slash', 'Comma', 'Period'] }
];

const VOWEL_CODES = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyC', 'KeyX'];

let panel = null;
let bodyEl = null;
let shiftOn = false;
let vowelMode = false;
let altHeld = false;
let altConsumed = false;
let activeEl = null;
let closedForever = false;
let matchSelectors = [];
let initialized = false;
let keyElements = {};
let enabled = true;
let autoShowPanel = true;   // showPanel option: auto-open on focus, or leave it to the integrator?
let onPanelToggle = null;   // (visible: boolean) => void
// closeMode controls what happens when the user clicks the panel's own close (x) button:
//  - 'permanent' (default, original behavior): stays closed until the page reloads,
//     or until setBanglaKeyboardEnabled(true) / showBanglaKeyboard() forces it back open.
//  - 'toggle': the x just hides it for now; focusing a matching field again will re-show it.
let closeMode = 'permanent';
let panelView = 'keys'; // 'keys' | 'symbols'
let lastSpaceAt = 0;
let lastSpaceEl = null;

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

// Double-space -> দাঁড়ি, mirroring the "double-space -> period" convention
// mobile keyboards already train people on.
function insertSpaceOrDari(el) {
  const now = Date.now();
  if (isDoubleSpace(el, lastSpaceEl, lastSpaceAt, now)) {
    swapTrailingSpaceForDari(el);
    lastSpaceAt = 0;
    return;
  }
  insertAtCursor(el, ' ');
  lastSpaceAt = now;
  lastSpaceEl = el;
}

function charFor(code, shiftActive, vowelActive) {
  const k = KEY_TABLE[code];
  if (!k) return null;
  if (vowelActive && (k.gBase || k.gShift)) {
    return shiftActive ? (k.gShift ?? k.shift) : (k.gBase ?? k.base);
  }
  return shiftActive ? k.shift : k.base;
}

function buildKeys() {
  let html = '';
  keyElements = {};
  if (panelView === 'symbols') {
    bodyEl.innerHTML = buildSymbolsHTML();
    return;
  }
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
  bodyEl.innerHTML = html;
  bodyEl.querySelectorAll('.bkb-key').forEach(btn => {
    keyElements[btn.dataset.code] = btn;
  });
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
        <span class="bkb-info-wrap" tabindex="0">
          <button type="button" class="bkb-btn" id="${id('info')}" title="How to use">&#9432;</button>
          <div class="bkb-info-panel">
            <strong>ব্যবহারবিধি</strong>
            <ul>
              <li>ইংরেজি কীবোর্ডে টাইপ করুন, বাংলা অক্ষর বসবে।</li>
              <li>Shift চাপুন কী-এর উপরে ডানদিকে দেখানো অক্ষরের জন্য।</li>
              <li>স্বরবর্ণের স্বাধীন রূপের জন্য Alt চেপে ধরুন অথবা "স্বর (Alt)" বোতাম চাপুন।</li>
              <li>হেডার ধরে টেনে প্যানেলটি সরাতে পারবেন।</li>
              <li>মাউস দিয়েও সরাসরি কী ক্লিক করে টাইপ করা যায়।</li>
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

  bodyEl.addEventListener('click', e => {
    const symBtn = e.target.closest('[data-symbol]');
    if (symBtn && activeEl) { insertAtCursor(activeEl, symBtn.dataset.symbol); activeEl.focus(); return; }
    const btn = e.target.closest('.bkb-key');
    if (!btn || !activeEl) return;
    const ch = charFor(btn.dataset.code, shiftOn, vowelMode);
    if (ch == null) return;
    insertAtCursor(activeEl, ch);
    activeEl.focus();
    if (vowelMode) setVowelMode(false);
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
    if (action === 'space') insertSpaceOrDari(activeEl);
    if (action === 'backspace') backspaceAtCursor(activeEl);
    if (action === 'enter') insertAtCursor(activeEl, '\n');
    activeEl.focus();
  });

  panel.querySelector('#' + id('min')).addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.add('bkb-hidden');
    firePanelToggle(false);
  });
  panel.querySelector('#' + id('close')).addEventListener('click', e => {
    e.stopPropagation();
    if (closeMode === 'permanent') {
      closedForever = true;
    }
    panel.classList.add('bkb-hidden');
    firePanelToggle(false);
  });

  makeDraggable(panel, panel.querySelector('#' + id('header')));
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

  // Hold Alt + a vowel key for the alternate ("independent") vowel form.
  if (e.code === 'AltLeft' || e.code === 'AltRight') {
    e.preventDefault();
    altHeld = true;
    altConsumed = false;
    const vBtn = document.getElementById(id('vowel'));
    if (vBtn) vBtn.classList.add('active');
    return;
  }

  if (e.ctrlKey || e.metaKey) return;

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
    altConsumed = true;
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
    altConsumed = false;
  }
}

/**
 * Initialize (or reconfigure) the Bangla keyboard.
 *
 * options:
 *  - selector / selectors: CSS selector(s) (string or array) matching the
 *    inputs/textareas the keyboard should attach to.
 *  - closeMode: 'permanent' (default) | 'toggle'. See `closeMode` above.
 *  - enabled: boolean, whether the keyboard should react to focus events
 *    right away (default true). Useful to init it in a disabled state and
 *    flip it on later with setBanglaKeyboardEnabled(true).
 *  - showPanel: boolean, default true. When false, focusing a matched field
 *    still activates typing (physical keyboard works normally), but the
 *    floating on-screen panel is never auto-opened. Call
 *    showBanglaKeyboard() to open it explicitly (e.g. from your own button);
 *    that call always works regardless of this setting.
 *  - onPanelToggle: (visible: boolean) => void. Fires whenever the panel's
 *    visibility actually changes — auto-open on focus (if showPanel is
 *    true), explicit showBanglaKeyboard()/hideBanglaKeyboard() calls, and
 *    the panel's own Minimize/Close buttons.
 *
 * Safe to call multiple times: subsequent calls just update the selector /
 * closeMode / enabled / showPanel / onPanelToggle state without re-attaching
 * document listeners.
 */
export function initBanglaKeyboard(options = {}) {
  if (options.selector !== undefined || options.selectors !== undefined) {
    matchSelectors = toSelectorList(options.selector || options.selectors);
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
    restoreNativeAssist(e.target);
  });
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('keyup', handleKeyup);
}

/**
 * Turn the keyboard on/off from outside code, independent of focus events.
 * Disabling immediately hides the panel and stops it reacting to focus/typing.
 * Re-enabling clears any "closed forever" state so it can pop back up.
 */
export function setBanglaKeyboardEnabled(isEnabled) {
  enabled = !!isEnabled;
  if (!enabled) {
    hidePanel();
  } else {
    closedForever = false;
  }
}

export function isBanglaKeyboardEnabled() {
  return enabled;
}

/**
 * Force the panel open right now, e.g. right after the user picks "Bangla"
 * from a language switcher, without waiting for a focus event.
 * Pass the target input/textarea if you know it; otherwise the first
 * element matching the configured selector is used (and focused).
 */
export function showBanglaKeyboard(targetEl) {
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

/** Hide the panel right now (e.g. user switched back to English). */
export function hideBanglaKeyboard() {
  hidePanel();
}

// Exported for reuse by other modules (e.g. the combined Ankan keyboard)
// that want the same Bijoy layout data without duplicating it.
export { KEY_TABLE, ROW_LAYOUT, VOWEL_CODES, charFor };