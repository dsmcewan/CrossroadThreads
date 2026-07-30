# Crossroad Threads — building with this design system

A "museum of fake merch" design system: Southern-Gothic-Americana meets mythology, rendered as aged-paper wall labels, framed exhibits, and letterpress facade type. Everything is styled with **CSS custom-property tokens + CSS Modules** — there are **no utility classes**. Style your own layout with the `var(--*)` tokens below; the components carry their own internal styling.

## Setup — no provider, tokens come from the stylesheet

No context provider or theme wrapper is needed. The tokens and the three brand fonts are defined in the design system's `styles.css` closure (`@import`s `fonts/fonts.css` for the `@font-face` faces and `_ds_bundle.css` for tokens + component CSS). As long as that stylesheet is loaded, components render on-brand. Wrap your page in a paper-toned surface so exhibits sit on the right background:

```jsx
<div style={{ background: "var(--paper)", backgroundImage: "var(--grain)", color: "var(--ink)", fontFamily: "var(--font-body), serif", minHeight: "100vh" }}>
  <MuseumHeader />
  {/* your gallery / exhibit layout */}
  <MuseumFooter />
</div>
```

## The token vocabulary (use these exact names)

**Type** — `var(--font-display)` (Ultra; heavy slab, for the biggest headings) · `var(--font-body)` (IM Fell English; body copy, set italic for taglines/quotes) · `var(--font-caps)` (IM Fell English SC; small-caps for kickers, labels, chips). Always include the `, serif` fallback: `font-family: var(--font-caps), serif`.

**Surfaces** — `--paper` (main page bg), `--paper-light`, `--cream` (panels/inverse text), `--overlay` (dark scrim). Apply the `--grain` SVG as a `background-image` over `--paper` for the aged-paper texture.

**Ink & neutrals** — `--ink` (primary text / dark chips), `--ink-soft`, `--brown-muted` (footnotes, muted labels), `--brown-mid`.

**Gold** — `--gold-border`, `--gold-caption`, `--gold-dark` (accent rules, captions, the "In Conservation" status).

**Frame** — `--frame`, `--frame-inner`, `--frame-edge` for the layered exhibit frames.

**Motion** — add the `rise` class (ships in the closure) to fade-and-lift an element in; stagger with an inline `animationDelay`.

## Component data model

The exhibit components (`ExhibitCard`, `ExhibitImage`, `Placard`, `GiftShopPanel`, `GalleryGrid`) take a `design` (and sometimes `wing`) object — see each component's `.d.ts` for the exact shape. Key fields: `title`, `tagline`, `status` (`"ON DISPLAY" | "IN CONSERVATION" | "UNDER STUDY"` — drives `StatusChip` color), `era`/`region`/`medium`/`edition` (the Placard facts table), `placard` prose, `stopNumber`, and `images` (an `ExhibitImages` set with `card`/`full` variant arrays; each variant `src` must be a reachable URL or data URI). `MuseumHeader`/`MuseumFooter` take no props.

## Where the truth lives

Read the bound `styles.css` (and the `_ds_bundle.css` / `fonts/fonts.css` it imports) for the full token + font definitions, and each component's `.prompt.md` + `.d.ts` for its API. Prefer reading those files over guessing token names.

## One idiomatic composition

```jsx
// A gallery section: DS components for the exhibits, tokens for your own layout glue.
<section style={{ background: "var(--paper)", backgroundImage: "var(--grain)", padding: "32px" }}>
  <h2 style={{ fontFamily: "var(--font-display), serif", color: "var(--ink)", textAlign: "center" }}>
    Recent Acquisitions
  </h2>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "24px" }}>
    {designs.map((d, i) => <ExhibitCard key={d.slug} design={d} index={i} />)}
  </div>
</section>
```
