# Ankan (অঙ্কন)

A lightweight, dependency-free Bangla keyboard for the web. Type phonetically (Banglish, e.g. `kemon` → কেমন) or in the classic Bijoy layout — as a floating on-screen panel, or silently in the background with your own UI.

No build step, no framework, no dependencies. Drop in two `<script>`/`<link>` tags and it works.

## Features

- **Two typing systems** — Phonetic (Banglish transliteration) and Bijoy (fixed key-position layout), switchable from one panel.
- **Three independent modules** — use the combined panel, a Bijoy-only keyboard, or headless phonetic conversion with no visual keyboard at all.
- **Works everywhere text goes** — `<input>`, `<textarea>`, and `contenteditable` hosts (chat boxes, rich-text composers).
- **Built-in punctuation & emoji panel**, common marks (`.` `,` `?` `!` `।`) on the main layout.
- **Double-space → দাঁড়ি (।)**, matching the double-space-for-period convention most mobile keyboards already train people on.
- **Headless mode** — run typing/conversion without the on-screen panel, and drive your own trigger UI via a visibility callback.
- **Zero dependencies** — plain ES modules, no bundler required.

## Quick start

Copy this into a file, open it in a browser. That's the whole setup.

```html
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>My Bangla App</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/ankan.css">
</head>
<body>

  <textarea placeholder="Type in English to get Bangla..." rows="6"></textarea>

  <script type="module">
    import { initAnkanKeyboard } from "https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/ankan.js";
    initAnkanKeyboard({ selector: "textarea" });
  </script>

</body>
</html>
```

Replace `USERNAME/REPO` with wherever this repo lives once it's pushed, and pin to a version tag (`@v1.0.0`) instead of `@main` for production.

## Installation

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/ankan.css">
```

```js
import { initAnkanKeyboard } from "https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/ankan.js";

initAnkanKeyboard({ selector: "textarea, input[type=text]" });
```

`ankanBn.js`, `ankanEn.js`, and `ankanShared.js` load automatically — `ankan.js` imports them relatively, so the CDN resolves all three for you. Nothing else to install.

## Modules

Pick whichever matches what you're building — they don't depend on each other except for `ankanShared.js`, which all of them use internally.

### `ankan.js` — combined panel (recommended)

Bijoy and Phonetic in one floating panel, switchable from its own header. Best default for comment boxes, forms, and chat inputs.

```js
import { initAnkanKeyboard } from "./ankan.js";

initAnkanKeyboard({
  selector: "textarea, .chat-input", // string or array of CSS selectors
  defaultMode: "phonetic",           // "bangla" (default) | "phonetic"
  closeMode: "toggle",               // "permanent" (default) | "toggle"
  enabled: true,                     // default true
  showPanel: true,                   // default true — false = no auto-open panel
  onPanelToggle: (visible) => {}     // fires on every real visibility change
});
```

**Exported functions:** `initAnkanKeyboard(options)`, `showAnkanKeyboard(el)`, `hideAnkanKeyboard()`, `setAnkanMode(mode)`, `getAnkanMode()`, `setAnkanKeyboardEnabled(bool)`, `isAnkanKeyboardEnabled()`.

### `ankanBn.js` — Bijoy only

Just the classic key-position layout, for users who already know Bijoy and don't need phonetic mode in the panel.

```js
import { initBanglaKeyboard } from "./ankanBn.js";

initBanglaKeyboard({
  selector: "textarea",
  closeMode: "toggle",             // "permanent" (default) | "toggle"
  enabled: true,                   // default true
  showPanel: true,                 // default true — false = no auto-open panel
  onPanelToggle: (visible) => {}   // fires on every real visibility change
});
```

**Exported functions:** `initBanglaKeyboard(options)`, `showBanglaKeyboard(el)`, `hideBanglaKeyboard()`, `setBanglaKeyboardEnabled(bool)`, `isBanglaKeyboardEnabled()`. Also exports `KEY_TABLE`, `ROW_LAYOUT`, `VOWEL_CODES`, and `charFor()` for anyone building a custom layout renderer.

### `ankanEn.js` — phonetic only, no panel

Silent background conversion as people type romanized Bangla — no floating keyboard, just a tiny optional on/off status badge.

```js
import { initPhoneticBangla } from "./ankanEn.js";

initPhoneticBangla({
  selector: "textarea",
  enabled: true,      // default true
  showBadge: false    // default true — the small on/off status dot
});
```

**Exported functions:** `initPhoneticBangla(options)`, `setPhoneticEnabled(bool)`, `isPhoneticEnabled()`, `convertText(str)` — one-shot string conversion, not tied to any field — and `getConjunctPatterns()`, which returns the engine's own consonant-conjunct (যুক্তাক্ষর) rule table, handy for building a reference UI.

### `ankanShared.js` — internal, not for direct use

Stateless DOM/text utilities shared by `ankan.js` and `ankanBn.js` (contenteditable handling, selection/range math, native-autocorrect suppression, panel dragging/positioning, per-module ID namespacing). Not part of the public API — don't import this directly; it has no `init...()` of its own.

## Typing reference

**Phonetic conjuncts** work through the engine's own rule table — e.g. `borrNo` → বর্ণ (the doubled `rr` triggers the র্ reph form before a following consonant). `getConjunctPatterns()` exposes every direct conjunct pattern for building your own cheat sheet; the demo site's Conjuncts section is built entirely from that call.

**Common punctuation** is on the main layout in both Bijoy and Phonetic modes: `.` `,` `?` `!`, and দাঁড়ি (।). A larger punctuation and emoji set lives behind the 😊 button in the panel footer.

**Double-space → দাঁড়ি**: typing a space twice in quick succession replaces the pair with `। ` (দাঁড়ি + space), on both physical and on-screen keyboards.

## Browser support

Targets evergreen browsers (recent Chrome, Firefox, Safari, Edge). Relies on the `beforeinput` event, `contenteditable` selection APIs, and — for contenteditable text replacement specifically — `document.execCommand`, which is deprecated but still broadly supported; there's currently no fallback for browsers that drop it.

## Project structure

```
ankan.js         Combined phonetic + Bijoy keyboard (recommended entry point)
ankanBn.js       Standalone Bijoy-only keyboard
ankanEn.js       Standalone phonetic-only conversion, no visual panel
ankanShared.js   Shared internal utilities (not a public entry point)
ankan.css        Panel styling
index.html       Documentation site and live demo
```

## Known limitations

- No automated test suite yet — correctness of the phonetic rule table is currently verified by hand.
- `ankanBn.js` and `ankan.js` each assume a single panel instance per page (calling `init...()` twice on the same file is a no-op by design); running one of each simultaneously is supported and namespaced separately.
- `document.execCommand` (used for contenteditable insertion during a live selection) has no modern replacement wired in yet.

## Contributing

Issues and pull requests are welcome. If you're adding phonetic rules or conjunct patterns, please verify new entries against `convertText()` before submitting — the rule table is order-sensitive.

## License

MIT — see [LICENSE](./LICENSE).
