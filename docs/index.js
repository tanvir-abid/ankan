import {
initAnkanKeyboard, showAnkanKeyboard, hideAnkanKeyboard,
setAnkanMode, getAnkanMode, setAnkanKeyboardEnabled
} from 'https://cdn.jsdelivr.net/gh/tanvir-abid/ankan@v1.0.0/ankan.js';
import { convertText, getConjunctPatterns } from 'https://cdn.jsdelivr.net/gh/tanvir-abid/ankan@v1.0.0/ankanEn.js';

const demoEl = document.getElementById('conjunct-demo');
const statusVal = document.getElementById('demoStatusVal');
const modeVal = document.getElementById('demoModeVal');
const ctrlShowPanel = document.getElementById('ctrlShowPanel');
const ctrlEnabled = document.getElementById('ctrlEnabled');

initAnkanKeyboard({
selector: '#conjunct-demo',
defaultMode: 'phonetic',
closeMode: 'toggle',
showPanel: ctrlShowPanel.checked,
onPanelToggle: visible => { statusVal.textContent = visible ? 'shown' : 'hidden'; }
});

// showPanel has no dedicated setter — re-calling initAnkanKeyboard() is the
// documented, supported way to update it (and any other option) live.
ctrlShowPanel.addEventListener('change', () => {
initAnkanKeyboard({ showPanel: ctrlShowPanel.checked });
});

ctrlEnabled.addEventListener('change', () => {
setAnkanKeyboardEnabled(ctrlEnabled.checked);
if (!ctrlEnabled.checked) statusVal.textContent = 'hidden';
});

document.getElementById('ctrlShow').addEventListener('click', () => {
showAnkanKeyboard(demoEl);
});
document.getElementById('ctrlHide').addEventListener('click', () => {
hideAnkanKeyboard();
});
document.getElementById('ctrlModeToggle').addEventListener('click', () => {
const next = getAnkanMode() === 'phonetic' ? 'bangla' : 'phonetic';
setAnkanMode(next);
modeVal.textContent = next;
});

const cin = document.getElementById('convert-in');
const cout = document.getElementById('convert-out');
cin.addEventListener('input', () => {
cout.textContent = cin.value ? convertText(cin.value) : 'আমার সোনার বাংলা';
});

// Conjunct (যুক্তাক্ষর) cheat-sheet — built straight from the engine's own
// rule table, so it can never list a pattern the parser doesn't honor.
// Grouped into collapsed-by-default letter sections (like the FAQ accordion)
// instead of one long flat grid, since there are 180+ patterns — a flat
// list is unusable on a phone.
(function(){
const container = document.getElementById('conjunct-groups');
const filterInput = document.getElementById('conjunct-filter');
const countEl = document.getElementById('conjunct-count');
const demo = document.getElementById('conjunct-demo');
if (!container) return;

const patterns = getConjunctPatterns(); // [{ pattern, output }]

const groupsMap = new Map(); // letter -> patterns[]
patterns.forEach(p => {
    const first = p.pattern[0].toLowerCase();
    const key = /[a-z]/.test(first) ? first : '#';
    if (!groupsMap.has(key)) groupsMap.set(key, []);
    groupsMap.get(key).push(p);
});
const groups = [...groupsMap.entries()].sort(([a], [b]) => a.localeCompare(b));

function cardHTML(p) {
    return `<button type="button" class="conjunct-card" data-pattern="${p.pattern}" title="Type: ${p.pattern}">
            <span class="conjunct-glyph bn">${p.output}</span>
            <span class="conjunct-pattern mono">${p.pattern}</span>
            </button>`;
}

function groupHTML([key, list], forceOpen) {
    const label = key === '#' ? 'Punctuation' : key.toUpperCase();
    return `<details class="conjunct-group" data-key="${key}" ${forceOpen ? 'open' : ''}>
            <summary>
                <span class="cg-lead">
                <span class="cg-letter">${label}</span>
                <span class="cg-sample bn">${list[0].output}</span>
                </span>
                <span class="cg-count">${list.length} conjuncts</span>
            </summary>
            <div class="conjunct-group-body">
                <div class="conjunct-grid">${list.map(cardHTML).join('')}</div>
            </div>
            </details>`;
}

function render(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
    container.innerHTML = groups.map(g => groupHTML(g, false)).join('');
    countEl.textContent = `${patterns.length} conjuncts, grouped by starting letter`;
    return;
    }

    const filteredGroups = groups
    .map(([key, list]) => [key, list.filter(p =>
        p.pattern.toLowerCase().includes(q) || p.output.includes(query.trim())
    )])
    .filter(([, list]) => list.length);

    const total = filteredGroups.reduce((n, [, list]) => n + list.length, 0);
    countEl.textContent = total
    ? `${total} of ${patterns.length} conjuncts`
    : 'No matching conjuncts';
    container.innerHTML = filteredGroups.length
    ? filteredGroups.map(g => groupHTML(g, true)).join('')
    : '<div class="conjunct-empty">Try a different pattern or glyph.</div>';
}

render();
filterInput.addEventListener('input', () => render(filterInput.value));

container.addEventListener('click', e => {
    const card = e.target.closest('.conjunct-card');
    if (!card || !demo) return;
    demo.value = convertText(card.dataset.pattern);
    demo.focus();
    const len = demo.value.length;
    demo.setSelectionRange(len, len);
});
})();

// Install-section tabs (scoped separately from the API module tabs below)
document.querySelectorAll('.itab').forEach(btn => {
btn.addEventListener('click', () => {
    document.querySelectorAll('.itab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ipanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('install-' + btn.dataset.itab).classList.add('active');
});
});

// Module tabs
document.querySelectorAll('.mtab').forEach(btn => {
btn.addEventListener('click', () => {
    document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mpanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
});
});

// Hero animation — neumorphic key-caps that float on their own, but wake
// up as the cursor approaches: they lift toward the pointer, flip from a
// Latin letter to its Bangla glyph, fire a light-beam back to the center
// orb, and surface a small "latin → bangla" caption. Idles gently with no
// pointer nearby so the section is never static.
(function(){
const anim = document.getElementById('hero-anim');
const stage = document.getElementById('hero-anim-stage');
const beamsSvg = document.getElementById('hero-beams');
const centerEl = document.getElementById('hero-anim-center');
const caption = document.getElementById('hero-anim-caption');
if (!anim || !stage || !beamsSvg || !centerEl || !caption) return;

const pairs = [
    ['a', 'অ'], ['b', 'ব'], ['k', 'ক'], ['m', 'ম'],
    ['t', 'ত'], ['sh', 'শ'], ['n', 'ন'], ['r', 'র']
];
// Percent-based positions so the whole layout scales with the container.
const layout = [
    { top: 10, left: 12, size: 15 },
    { top: 58, left: 6,  size: 13 },
    { top: 14, left: 76, size: 14 },
    { top: 64, left: 80, size: 16 },
    { top: 4,  left: 46, size: 12 },
    { top: 80, left: 42, size: 13 },
    { top: 38, left: 4,  size: 11 },
    { top: 40, left: 86, size: 12 }
];

const keys = pairs.map((pair, i) => {
    const pos = layout[i % layout.length];
    const key = document.createElement('div');
    key.className = 'hero-key';
    key.style.top = pos.top + '%';
    key.style.left = pos.left + '%';
    key.style.width = pos.size + '%';
    key.style.aspectRatio = '1 / 1';
    key.style.animationDelay = (i * 0.35) + 's';
    key.style.fontSize = 'clamp(.85rem, ' + (pos.size * 0.11) + 'vw, 1.3rem)';
    key.dataset.latin = pair[0];
    key.dataset.bangla = pair[1];
    key.innerHTML =
    '<div class="key-inner">' +
        '<div class="flipper">' +
        '<div class="face front">' + pair[0] + '</div>' +
        '<div class="face back bn">' + pair[1] + '</div>' +
        '</div>' +
    '</div>';
    stage.appendChild(key);
    return {
    el: key, inner: key.querySelector('.key-inner'), pos: pos,
    hover: false, near: false, timer: null,
    // Motion state: JS lerps `now` toward `target` every animation
    // frame instead of relying on a fixed-duration CSS transition, so
    // the pull always tracks the live cursor position smoothly, with
    // no snapping and no fighting a moving target.
    target: { x: 0, y: 0, scale: 1 },
    now: { x: 0, y: 0, scale: 1 }
    };
});

// One SVG beam per key, drawn from the key's resting position to the
// center orb. Its real path length is measured so the "active" state
// can draw the stroke in from nothing rather than just fading it in.
const beams = keys.map((k) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'hero-beam');
    const cx = k.pos.left + k.pos.size / 2;
    const cy = k.pos.top + k.pos.size / 2;
    const mx = (cx + 50) / 2, my = (cy + 50) / 2 - 6;
    path.setAttribute('d', 'M ' + cx + ' ' + cy + ' Q ' + mx + ' ' + my + ' 50 50');
    beamsSvg.appendChild(path);
    let len = 60;
    try { len = path.getTotalLength(); } catch (e) {}
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    return { path: path, len: len };
});

// Idle rhythm: each key flips on its own randomized timer so the whole
// stage feels alive even with no pointer nearby.
function scheduleIdle(k, delay){
    k.timer = setTimeout(function tick(){
    if (!k.hover) k.el.classList.toggle('flipped');
    k.timer = setTimeout(tick, 1600 + Math.random() * 2600);
    }, delay);
}
keys.forEach((k) => scheduleIdle(k, 400 + Math.random() * 1800));

function showCaption(latin, bangla){
    caption.querySelector('.cap-latin').textContent = latin;
    caption.querySelector('.cap-bangla').textContent = bangla;
    caption.classList.add('show');
    clearTimeout(showCaption._t);
    showCaption._t = setTimeout(() => caption.classList.remove('show'), 1300);
}
function pulseCenter(){
    centerEl.classList.remove('pulse');
    void centerEl.offsetWidth; // restart the CSS animation
    centerEl.classList.add('pulse');
}

function activateKey(k, i){
    if (k.hover) return;
    k.hover = true;
    k.near = false;
    clearTimeout(k.timer);
    k.el.classList.add('cursor-active', 'flipped');
    k.el.classList.remove('near');
    k.el.style.boxShadow = '10px 10px 22px var(--sh-dark), -10px -10px 22px var(--sh-light), 0 0 0 2px var(--gold)';
    k.target.x = 0; k.target.y = 0; k.target.scale = 1.2;
    beams[i].path.style.opacity = '.6';
    beams[i].path.style.strokeDashoffset = '0';
    showCaption(k.el.dataset.latin, k.el.dataset.bangla);
    pulseCenter();
}
function nearKey(k, pull){
    if (k.hover) return;
    k.near = true;
    k.el.classList.add('near');
    k.target.x = pull.x; k.target.y = pull.y; k.target.scale = pull.scale;
}
function restKey(k, i){
    const wasHover = k.hover;
    k.hover = false;
    k.near = false;
    k.el.classList.remove('cursor-active', 'near');
    k.el.style.boxShadow = '';
    k.target.x = 0; k.target.y = 0; k.target.scale = 1;
    beams[i].path.style.opacity = '0';
    beams[i].path.style.strokeDashoffset = beams[i].len;
    if (wasHover) {
    clearTimeout(k.timer);
    scheduleIdle(k, 900 + Math.random() * 900);
    }
}

const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

if (!reduceMotion && !isCoarsePointer) {
    const tilt = { target: { x: 0, y: 0 }, now: { x: 0, y: 0 } };

    anim.addEventListener('mousemove', (e) => {
    const rect = anim.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tilt.target.x = nx * 6;
    tilt.target.y = -ny * 6;

    const pxX = (nx + 0.5) * rect.width;
    const pxY = (ny + 0.5) * rect.height;
    const activateR = rect.width * 0.10;
    const nearR = rect.width * 0.26;

    keys.forEach((k, i) => {
        const sizePx = k.pos.size / 100 * rect.width;
        const kx = k.pos.left / 100 * rect.width + sizePx / 2;
        const ky = k.pos.top / 100 * rect.height + sizePx / 2;
        const dx = pxX - kx, dy = pxY - ky;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < activateR) {
        activateKey(k, i);
        } else if (dist < nearR) {
        if (k.hover) restKey(k, i);
        const strength = 1 - (dist - activateR) / (nearR - activateR);
        nearKey(k, { x: dx * 0.14 * strength, y: dy * 0.14 * strength, scale: 1 + 0.09 * strength });
        } else if (k.near || k.hover) {
        restKey(k, i);
        }
    });
    });
    anim.addEventListener('mouseleave', () => {
    tilt.target.x = 0; tilt.target.y = 0;
    keys.forEach((k, i) => restKey(k, i));
    caption.classList.remove('show');
    });

    // A single continuous loop eases the stage tilt and every key's pull
    // toward its live target each frame — smoother than reacting only on
    // mousemove, and it settles gracefully once the cursor stops moving
    // or leaves entirely.
    (function loop(){
    tilt.now.x += (tilt.target.x - tilt.now.x) * 0.09;
    tilt.now.y += (tilt.target.y - tilt.now.y) * 0.09;
    stage.style.transform = 'rotateX(' + tilt.now.y.toFixed(3) + 'deg) rotateY(' + tilt.now.x.toFixed(3) + 'deg)';

    keys.forEach((k) => {
        k.now.x += (k.target.x - k.now.x) * 0.16;
        k.now.y += (k.target.y - k.now.y) * 0.16;
        k.now.scale += (k.target.scale - k.now.scale) * 0.16;
        k.inner.style.transform = 'translate(' + k.now.x.toFixed(2) + 'px,' + k.now.y.toFixed(2) + 'px) scale(' + k.now.scale.toFixed(3) + ')';
    });
    requestAnimationFrame(loop);
    })();
}
})();

// Dark mode toggle
(function(){
var root = document.documentElement;
var toggle = document.getElementById('theme-toggle');
if (!toggle) return;
toggle.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ankan-theme', next); } catch(e){}
});
})();

// Mobile nav toggle
(function(){
var navToggle = document.getElementById('nav-toggle');
var navlinks = document.getElementById('navlinks');
if (!navToggle || !navlinks) return;

function closeMenu(){
    navlinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}
navToggle.addEventListener('click', function(e){
    e.stopPropagation();
    var isOpen = navlinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});
navlinks.addEventListener('click', function(e){
    if (e.target.tagName === 'A') closeMenu();
});
document.addEventListener('click', function(e){
    if (!navlinks.contains(e.target) && e.target !== navToggle) closeMenu();
});
window.addEventListener('resize', function(){
    if (window.innerWidth >= 720) closeMenu();
});
})();

// Wrap every code block with a copy button, so each snippet is copyable in one click
(function(){
document.querySelectorAll('pre').forEach(function(pre){
    if (pre.closest('.code-wrap')) return; // already wrapped
    var wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    wrap.appendChild(btn);

    btn.addEventListener('click', function(){
    var text = pre.innerText;
    var done = function(){
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function(){
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
        }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function(){
        fallbackCopy(text); done();
        });
    } else {
        fallbackCopy(text); done();
    }
    });
});

function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta);
}
})();