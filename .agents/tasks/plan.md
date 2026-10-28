# Implementation Plan — Teki marketing website (static, a11y-first)

Static HTML/CSS/JS, no framework, no build step. All files in workspace root
`/Users/zaynab/Desktop/Teki2`. Open any `.html` directly in a browser to preview.
Grounded in `Teki_Website_Layout_Proposal.pdf` (8 pages, read during exploration).

## Design decisions (made here, grounded in the proposal mock)

- Palette sampled from the proposal's Home mock (page 2):
  - Ink / text: `#162f3f`
  - Primary action (blue buttons, brand): `#0867ca`
  - Backgrounds: white `#ffffff`, off-white `#f6faf8`
  - Soft card tints: mint `#e6f2eb`, lavender `#ede9f8`, blue `#e8f2fb`, grey `#eff2f4`
  Rationale: reuses the exact colors the proposal illustrates, keeping the warm,
  light, calm direction and the existing blue-action brand identity.
- No templating/build step, so the shared nav/footer/skip-link are hand-copied
  into each page (identical markup block). Rationale: the user wants to open files
  directly with no build; a JS-injected nav would break with `file://` in some
  browsers and hurt the no-JS baseline. Duplication across 6 files is acceptable
  and is treated as one change pattern.
- `main.js` is tiny and progressive-enhancement only: the intro Play/Pause toggle
  and the video Play/Captions toggle operate on CSS classes and `aria-pressed`;
  it checks `matchMedia('(prefers-reduced-motion: reduce)')` and starts paused when
  reduced motion is requested. Rationale: no animation framework needed; motion is
  CSS-driven and gated.
- Accessibility baked into tokens: base font ≥ 1.125rem, min 44×44px targets via a
  shared `.btn`/control sizing rule, `:focus-visible` outlines never removed,
  AA contrast (ink `#162f3f` on white ≈ 13:1; white on `#0867ca` ≈ 5.3:1),
  `prefers-reduced-motion` media query disabling transitions/animation, responsive
  single-column stack under ~640px.

## Shared layout (identical on every public page)

- `<a class="skip-link" href="#main">Skip to content</a>` as first body child.
- `<header>` with brand "Teki" (left) + `<nav aria-label="Main">` links:
  Home (`index.html`), How it works (`how-it-works.html`), Your helper
  (`your-helper.html`), Plans (`plans.html`), Help (`help.html`), and Sign in
  (`app.html`). Current page link gets `aria-current="page"` + `.active`.
  On `app.html` the last link reads "Account" instead of "Sign in".
- `<main id="main">` holds page content.
- Shared `<footer>` with brand line, nav repeat, and the proposal note
  "Visual planning only — proposed copy and behavior for team review."
- Semantic order: header → main (sections with ordered headings) → footer.

## Placeholders needing user confirmation (surfaced in UI + noted here)

- Dog animation asset ("George's dog intro") — SVG placeholder box only.
- Plan name / price / billing period — bracketed `[Plan name]`, `[Price] / [billing period]`.
- Helper permission rules (exact shared info, invitation method, revoke behavior).
- Tutorial video + transcript content (Zaynab's walkthrough) — placeholder box.
- "Start with Teki": guest session vs. account — link target assumption `app.html`.

## Ordered items

- [ ] 1. Create `styles.css` with design tokens (CSS custom properties for the
      palette above, spacing scale, radius), base/typography resets, the shared
      component classes (`.skip-link`, `.site-header`, `.nav`, `.nav a.active`,
      `.btn`, `.btn-primary`, `.btn-secondary`, `.card`, `.panel`, `.steps`,
      `.footer`), focus-visible rules, the `prefers-reduced-motion` block, and the
      mobile single-column breakpoint.
      Files: `styles.css`
      Verify: open any page in a browser after item 2; header/cards/buttons render
      with the warm light theme; keyboard Tab shows visible focus rings.

- [ ] 2. Create `main.js`: intro Play/Pause toggle and video Play/Captions toggle
      using `aria-pressed` + CSS classes; detect reduced motion and default to
      paused; no errors when controls are absent on a page.
      Files: `main.js`
      Verify: load `index.html`, click Play intro/Pause — button label and
      `aria-pressed` flip, animation box toggles its `playing` class; browser
      console shows no errors.

- [ ] 3. Build `index.html` (Home) with the shared layout and all Home sections:
      hero (eyebrow MEET TEKI, headline, subtext, Start with Teki + See how it
      works), animation placeholder with Play/Pause control, three soft cards
      (Ask Teki / Choose your helper / Make Teki yours), closing line.
      Files: `index.html`
      Verify: open in browser — matches hero/cards/closing copy; nav Home is
      `aria-current`; buttons reach how-it-works.html; toggle works (item 2).

- [ ] 4. Build `how-it-works.html` with shared layout: eyebrow SIMPLE STEPS,
      heading, intro, three numbered steps, "Why we are building Teki" mission,
      "What makes Teki different" (three ideas, no competitor claims).
      Files: `how-it-works.html`
      Verify: open in browser — copy matches spec; ordered list is a real `<ol>`;
      nav active state correct.

- [ ] 5. Build `your-helper.html` with shared layout: heading + intro, two panels
      (getting help / helper) that stack on mobile, "A connection you control"
      ordered 4-step list, two buttons (Set up my helper / I am a helper), privacy
      note (consent, disconnect, no auto full-chat sharing, chosen-person not
      on-demand).
      Files: `your-helper.html`
      Verify: open in browser; resize below 640px — panels stack single column;
      copy matches spec.

- [ ] 6. Build `plans.html` with shared layout: heading + intro, single plan card
      with bracketed placeholders and feature list, "Why this price" placeholder,
      FAQ via keyboard-accessible `<details>/<summary>`. NO Stripe/card/checkout/
      purchase anywhere.
      Files: `plans.html`
      Verify: open in browser; `<details>` toggles via Enter/Space; grep confirms
      no "stripe/checkout/card/purchase/pay" tokens exist in the file.

- [ ] 7. Build `help.html` with shared layout: heading, labeled search input
      (visual placeholder note), four topic cards, "Watch a quick tutorial" video
      placeholder with Play/Captions controls, written steps stub + transcript
      block.
      Files: `help.html`
      Verify: open in browser — search `<input>` has an associated `<label>`;
      video Play/Captions toggle works (item 2); copy matches spec.

- [ ] 8. Build `app.html` (signed-in mockup) with shared layout but last nav link
      "Account": top note this is a proposed mockup, chat mockup (Teki message +
      input + Send), helper side panel + Choose a helper button, Preferences list,
      Helper view note.
      Files: `app.html`
      Verify: open in browser — nav shows Account with `aria-current`; mockup
      note visible; inputs/buttons present and non-functional (no JS errors).

- [ ] 9. Cross-page accessibility + consistency pass: confirm identical shared
      nav/footer/skip-link on all 6 pages, heading order, 44px targets, AA contrast,
      reduced-motion behavior.
      Files: all 6 `.html`, `styles.css`
      Verify: tab through each page (skip link first, visible focus throughout);
      emulate reduced motion in devtools and confirm intro stays paused / no
      transitions; confirm no payment tokens anywhere in the repo.
