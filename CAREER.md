# Crossroad Threads — Engineering Portfolio Brief

> **Hiring-manager path:** Crossroad Threads is the design-forward product-incubation project in this portfolio. The main README shows the product; this page explains the engineering signal quickly.

## What it is

Crossroad Threads is a mythology-driven storefront designed as a museum experience rather than a conventional product grid.

The concept changes the product model itself: products become exhibits, categories become museum wings, descriptions become curator placards, and narration becomes an audio-guide layer.

The repository carries that concept through implementation and deployment: **103 exhibits, five wings, 103 narrated audio stops, static generation, optimized media, CI deployment, and a responsive frontend.**

## Why it matters as engineering work

This project demonstrates a different skill surface from TELOS, Convergence, and LEXI:

> **Take an unusual product idea, identify the reusable primitives inside it, and turn those primitives into a maintainable system that actually ships.**

## Product architecture

The creative concept is represented as data and repeatable components rather than hand-built pages:

- exhibit records
- museum-wing taxonomy
- curator metadata
- provenance / conservation copy
- audio-guide content
- responsive gallery and exhibit views
- automated accessioning of uncatalogued assets

That is the key design decision: translate aesthetic intent into software primitives without flattening the experience into a generic storefront.

## Content and build pipeline

`content/designs.json` is the curated source of truth. The build scans the image library and merges assets with curated metadata.

- A new image without curated metadata is automatically accessioned into a holding wing.
- A curated record pointing to a missing asset fails loudly.
- Catalog merge behavior is implemented as testable logic rather than manual page maintenance.

## Media engineering

A custom prebuild pipeline creates AVIF and WebP derivatives plus blur-up placeholders for static hosting.

Outputs are content-addressed, which means unchanged source images are not re-encoded unnecessarily. The shipped site reduces roughly **330 MB of source PNGs to about 89 MB of derivatives** while retaining responsive source sets.

## Deterministic asset recovery

The original prototype contained finished metadata attached to embedded thumbnails while the source library contained many similarly named variants.

Instead of manually guessing, the project uses **dHash perceptual hashing + Hamming distance** to reconnect the legacy thumbnails with their source images. The true matches and non-matches separated cleanly enough to make the mapping deterministic.

This is a small example of the broader working style: convert an ambiguous visual/manual problem into something measurable when possible.

## Local narration pipeline

Each exhibit can ship with locally synthesized narration. The TTS pipeline:

- normalizes text before synthesis
- caches output by model + text hash
- generates a manifest consumed by the frontend
- keeps commercial voice replacement separate from product behavior

The experience is therefore not hard-coupled to a hosted AI provider.

## Deployment hardening

GitHub Pages serves project sites under a subpath, which breaks naive absolute asset URLs. The project centralizes path handling and runs a post-build verifier that checks the exported site before deployment.

`npm run preview:pages` reproduces the actual subpath locally so the preview environment matches the hosting constraint rather than pretending localhost root behavior is equivalent.

## Stack

Next.js 15 · React · TypeScript · CSS Modules · sharp · Vitest · Playwright · Python TTS · GitHub Actions / GitHub Pages

## Best code-review entry points

| Area | Start here |
| --- | --- |
| Curated content model | `content/designs.json` |
| Catalog generation / auto-accessioning | `scripts/build-catalog.ts` |
| Image derivatives / caching | `scripts/image-pipeline.ts` |
| Static-export verification | `scripts/verify-export.mjs` |
| Narration pipeline | `tts/` |
| Product UI | application pages/components |
| Deployment | `.github/workflows/` |

## What this demonstrates to an employer

Crossroad Threads is evidence of work in:

- rapid product incubation
- design-forward product architecture
- interaction/frontend engineering
- Next.js / React / TypeScript
- content modeling
- automated build pipelines
- media processing and optimization
- perceptual hashing
- testable transforms
- CI/CD and deployment debugging
- provider abstraction
- turning a creative concept into maintainable engineering primitives

It does **not** claim formal user-research experience by itself; its design signal is product concept, information architecture, interaction design, prototyping, and implementation.

## Relevant roles

Forward-Deployed Engineer · Product Engineer · AI/Product Prototyping Engineer · Design Engineer · Creative Technologist · Frontend Engineer · Technical Product Incubation

## Portfolio connection

**TELOS and Convergence show verification-heavy systems design. LEXI shows applied AI at full-stack scale. Crossroad Threads shows the other half of the job: shape an experience, prototype it rapidly, solve the ugly implementation details, and ship it.**
