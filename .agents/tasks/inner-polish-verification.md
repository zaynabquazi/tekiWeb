# Inner-Page Visual Polish — Verification Record

Iteration: first (no `inner-polish-review.json` present at start).
Scope: visual/layout polish of the four content-heavy inner pages
(`how-it-works.html`, `your-helper.html`, `plans.html`, `help.html`) plus additive
shared CSS in `styles.css`. `index.html` and `app.html` markup untouched; `main.js`
untouched. Copy is verbatim; nav/header/footer unchanged.

## 1. Well-formedness

- `xmllint --noout --html` flags `header/nav/main/section/svg` as "invalid" on ALL six
  pages (including the pre-existing, untouched `index.html`/`app.html`). This is the old
  HTML4 DTD in libxml2 not recognising HTML5/SVG tags — not a real defect.
- Authoritative check: a Python `html.parser` tag-balance pass over all six pages →
  `errors: none, unclosed: none` for every page. All six parse well-formed and balanced.

## 2. Local serve — HTTP status

Served with `python3 -m http.server 8000` (started backgrounded, killed after). `curl`
status for each asset:

```
200  index.html
200  app.html
200  how-it-works.html
200  your-helper.html
200  plans.html
200  help.html
200  styles.css
200  main.js
```

Inter-page nav links (`index.html`, `how-it-works.html`, `your-helper.html`,
`plans.html`, `help.html`, `app.html`) all resolve to served files (all 200). Server
stopped after the run.

## 3. Per-page structure / a11y

Checked by grep + heading-sequence extraction:

| page | h1 | heading order (no skips) | ordered lists | unordered lists | details | aria-current | skip-link first |
|------|----|--------------------------|---------------|-----------------|---------|--------------|-----------------|
| how-it-works | 1 | h1 h2 h2 h2 h2 h2 h3 h3 h3 | 1 (`<ol class="steps steps--iconic">`) | 0 | 0 | 1 | yes → `#main` |
| your-helper | 1 | h1 h2 h2 h2 h3 h3 h3 h3 h2 | 1 (`<ol class="timeline">`) | 1 (`<ul class="check-list">` privacy) | 0 | 1 | yes → `#main` |
| plans | 1 | h1 h2 h3 h3 h3 h3 h2 h2 | 0 | 4 (feature `<ul class="check-list">`) | 3 (FAQ native) | 1 | yes → `#main` |
| help | 1 | h1 h2 h3 h3 h3 h3 h2 h3 h4 h4 h4 h3 | 1 (written steps `<ol class="steps">`) | 0 | 0 | 1 | yes → `#main` |

- Skip-link is the first focusable element on every page and targets `#main`;
  `#main { scroll-margin-top: calc(var(--header-h) + var(--space-4)); }` unchanged in
  `styles.css`.
- Each page keeps exactly one `aria-current="page"` on its own nav link; nav markup is
  byte-identical across all six pages (app.html's last link still reads "Account").
- Ordered lists stayed `<ol>` (how-it-works stepper, your-helper timeline, help written
  steps). Privacy list and plan feature lists stayed `<ul>`. FAQ stayed native
  `<details>/<summary>` (3 on plans.html).
- Search input keeps its `<label for="help-search">` association and is non-functional
  (no JS wiring added; the visual-placeholder note kept verbatim).
- Help topic cards have NO hrefs in the source and remain non-clickable styled icon cards
  (no `.card__link`, no invented links) — nothing becomes a nested interactive control.
- Play/Captions buttons keep `data-toggle="play"`, `aria-controls="tutorial-video"`,
  `aria-pressed`, and label attributes unchanged so `main.js` still toggles them.

### Decorative SVG icons (all `aria-hidden="true" focusable="false"`, `class="icon"`)

- **how-it-works.html (6):** step 1 chat bubble, step 2 screen/monitor, step 3 two people;
  trio: sparkle/animated-guide, slider/pace, lock/shield.
- **your-helper.html (6):** "For You" person-receiving-help, "For Your Helper" helping
  hand (waveform-over-hands), plus 4 reused check marks on the privacy list.
- **plans.html (5):** 5 reused check marks across the four feature lists. FAQ chevron is
  CSS-drawn (no SVG).
- **help.html (5 decorative + 1 kept):** search magnifier; topic icons rocket/flag,
  speaker/sound-wave, look/palette, link/people. The existing media-placeholder `<svg>`
  (`role="img"` + label) is kept as-is — intentionally NOT aria-hidden.

All decorative icons use `currentColor` (stroke) so they inherit their context's ink/blue
text color; no external requests, no icon library.

## 4. Reduced motion

`@media (prefers-reduced-motion: reduce)` extended to neutralise every newly added
transition/transform in addition to the pre-existing kills (`*` duration clamp, reveal
forced-visible, `.media-placeholder.playing`, card lift, arrow nudge, button lift, header):

- `.faq summary::after { transition: none !important; }` — chevron does not animate its
  rotation (open/closed end state still shown statically).
- `.search-box input { transition: none !important; }` — no focus transition.
- New reveal wrappers reuse `.reveal`, already forced fully visible by
  `html.js-reveal .reveal{…}` under reduced motion. New cards/panels add no bespoke hover
  motion beyond the existing `.card` lift (already neutralised). Timeline/check-list/
  feature-band/plan-card have no transitions.

No new animation is left uncovered.

## 5. Payment + HeyGen guards

- `grep -riE '(stripe|checkout|card number|purchase|add to cart|pay now)' *.html styles.css main.js`
  → ZERO matches.
- `grep -n 'heygen.com/embeds/7cd0d0029e8a4803848ebdfc94138bee' index.html` → present,
  src unchanged.
- `grep -niE 'autoplay|muted' index.html` → ZERO matches (no autoplay/muted reintroduced).

## 6. Contrast ratios (WCAG AA) — text on tinted/colored surfaces

Computed from the fixed hex tokens (sRGB relative luminance). Ink `#162f3f`, blue
`#0867ca`, white `#ffffff`.

Soft surfaces (feature-band, soft panels, search, media/transcript, iconic-step cards):
- Ink on `--tint-mint #e6f2eb` ≈ 12.1:1 (feature-band on how-it-works + plans "Why this price")
- Ink on `--tint-blue #e8f2fb` ≈ 12.3:1 (search focus field, transcript panel)
- Ink on `--bg-soft #f6faf8` ≈ 13.2:1 (iconic step cards, media card, plan card)
- Ink on `--card-grey #eff2f4` ≈ 12.4:1 (grey help topic card)

Colored icon cards (how-it-works trio, help topics):
- Ink on `--card-mint #a6d6bd` ≈ 8.6:1
- Ink on `--card-lavender #c3b6ea` ≈ 7.4:1
- Ink on `--card-blue #a9d1f0` ≈ 8.6:1

Numbered badges (timeline + iconic stepper) and primary button:
- White on `--blue #0867ca` ≈ 5.5:1 (passes AA ≥ 4.5:1)

Plan price line + check icons + FAQ chevron use `--blue #0867ca` on light soft surfaces
(ink-on-soft all ≥ 12:1; the blue price text on `--bg-soft` ≈ 5.3:1, passes AA for the
large/bold price). Icons are decorative (`aria-hidden`) so the 3:1 non-text floor is
advisory; they still inherit ≥ 5:1.

No user-facing text is placed on a background below 4.5:1.

## 7. Home / app regression

All new CSS is additive modifier/utility classes (`.icon`, `.card__icon`, `.panel__icon`,
`.steps--iconic`, `.step__icon`, `.feature-band`, `.timeline`, `.check-list`,
`.plan-card--feature`, `.plan-price`, `.faq`, `.search-box`, `.media-card`,
`.transcript`). None are applied to `index.html` or `app.html` markup and none override a
base selector those pages use (base `.card`, `.panel`, `.steps`, `.topic-grid`,
`.plan-card` are unchanged). Home + app render as before; both return 200 and the HeyGen
iframe src is byte-for-byte intact.

## Commands run

- `python3` html.parser balance check (all six pages) → OK
- `python3 -m http.server 8000` + `curl` status loop → all 200
- `grep` sweeps for payment tokens, HeyGen src, autoplay/muted, headings, lists,
  aria-current, skip-link, aria-hidden icons
