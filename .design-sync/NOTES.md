# Crossroad Threads — design-sync notes

This is a **Next.js 15 static-export app**, not a packaged component library. The sync treats `src/components/` as the design system in **synth-entry mode** (there is no `dist/`; `npm run build` = `next build`, the whole-app build, which is NOT usable here).

## How the build is wired (why each piece exists)

- **Entry**: pass `--entry ./dist/index.js` (a path that does NOT exist) so the converter's walk-up finds the repo's real `package.json`, then synthesizes an entry from `src/components/*.tsx`. `srcDir` is scoped to `src/components` so Next route files (`app/page.tsx`, `layout.tsx`, `not-found.tsx`) are not swept in as components.
- **Fork `.design-sync/overrides/source-kit.mjs`** (declared in `cfg.libOverrides`): every component is `export default function <Name>`, and a plain `export * from` drops defaults, so nothing lands on `window.CrossroadThreads`. The fork emits `export { default as <Name> }` re-exports AND shims `process` in the synth entry. Needs `.design-sync/node_modules` → `../.ds-sync/node_modules` symlink (recreate on fresh clone).
- **`next/link` shim**: `MuseumHeader` and `ExhibitCard` import `next/link`, whose runtime reads `process.env.__NEXT_*` at **module top level** and throws `process is not defined` in the browser IIFE, aborting the whole bundle (symptom: `[BUNDLE_EXPORT] 9/9 not a component`). Fixed by aliasing `next/link` → `.design-sync/shims/next-link.tsx` (a plain `<a>`) via **`.design-sync/tsconfig.sync.json`** — a sync-only tsconfig that `cfg.tsconfig` points at. It must restate BOTH `@/*` AND the `next/link` alias, because the converter's esbuild paths plugin reads `compilerOptions.paths` directly and does **not** follow `extends`.
- **Fonts**: Ultra / IM Fell English / IM Fell English SC are loaded by the app via `next/font/google` at runtime — no static `@font-face` in source. Real woff2 files were fetched from Google Fonts into `public/fonts/` and wired via `cfg.extraFonts` (`public/fonts/ds-fonts.css`). Families are suffixed `" DS"` (e.g. `"Ultra DS"`) to avoid colliding with the app's own next/font families.
- **CRITICAL — font variable definitions**: component CSS references `var(--font-display|body|caps)`, but the app only defines those via next/font at runtime; they are **never** defined statically. Without a fix, designs built with the DS fall back to `serif`. Fix: `cfg.cssEntry` points at the **generated** `.design-sync/ds-styles.css` = `src/app/globals.css` + a `:root` block mapping the three vars to the `" DS"` families. Verify after any build: `grep -- '--font-display:' ds-bundle/_ds_bundle.css` must return a definition.

## Prerequisite before every build

`npm run catalog` must run first — it generates `src/data/catalog.generated.json` (gitignored) and `public/images/designs/**` (gitignored) from `content/designs.json` + `crossroad_imgs/` via sharp. The bundle imports `catalog.generated.json` (MuseumHeader/GalleryGrid bake it in), and the preview fixtures need the source images. `cfg.buildCmd` runs this + the three generators, so the one-command re-sync (`resync.mjs`) handles it.

## Generated sync inputs (regenerate if the app changes)

All three live in `.design-sync/scripts/` (committed) and are chained in `cfg.buildCmd`:

- `gen-css.mjs` → `.design-sync/ds-styles.css`. **Regenerate if `src/app/globals.css` changes** (it inlines globals + the font vars).
- `gen-fixtures.mjs` → `.design-sync/previews/_fixtures.ts` (319 KB). Real catalog data + **inlined webp data-URI artwork** for designs `persephone`, `rudis`, `boudica`, `artemis` — because site-relative `/images/designs/...` paths don't resolve in the design tool. Regenerate if the catalog changes; if any of those 4 slugs are removed from `content/designs.json`, pick replacements in the script's `PICKS` array or it will throw.
- `gen-dtsprops.mjs` → merges `cfg.dtsPropsFor` into `config.json`. Synth mode can't extract the inline prop types, so accurate `<Name>Props` bodies are hand-authored here (Design/Wing/ExhibitImages shapes inlined, since the emitted `.d.ts` can't reference external types). Regenerate if component prop signatures change.

## Component notes

- `AudioTourButton` "Playing" cell: `audio.play()` rejects on the 404 preview mp3 → harmless (the `onToggle` prop is a noop in the preview).
- `GalleryGrid`, `Placard`, `GiftShopPanel`, `AudioTourButton` are `"use client"` and touch `window` inside effects/handlers — fine in the preview browser.
- `ExhibitImage` uses `cfg.overrides.ExhibitImage.cardMode = "column"` (its Full variant overflowed the grid cell).

## Known render warns

None — final validate was 9/9 clean, `bad`/`thin`/`variantsIdentical` all 0.

## Re-sync risks (what can silently go stale)

- **The three generated inputs** (`ds-styles.css`, `_fixtures.ts`, `cfg.dtsPropsFor`) duplicate/inline upstream data (globals.css, catalog, prop signatures). `cfg.buildCmd` regenerates all three on re-sync, so a plain `resync.mjs` run is safe — but if you build with a bare `package-build.mjs` you must run the three generators yourself first.
- **Everything hinges on this staying a Next.js app.** If it migrates off Next, revisit the `next/link` shim and the synth-entry approach. If font loading changes, revisit `ds-fonts.css` / `gen-css.mjs`.
- **`_fixtures.ts` data-URI art** is inlined at ~300–420px webp; if you need higher-res preview art, bump the sizes in `gen-fixtures.mjs`.
- The font families are `" DS"`-suffixed synthetic names — they exist only in the synced bundle, not in the app.
