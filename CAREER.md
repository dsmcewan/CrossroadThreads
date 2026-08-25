# Crossroad Threads — Engineering Portfolio Brief

> **For hiring managers and engineering reviewers:** Crossroad Threads looks like an art-directed storefront because that is the product. Underneath it is a useful demonstration of rapid product incubation, frontend engineering, deterministic content pipelines, asset processing, testing, and deployment.

## What the project is

Crossroad Threads is a mythology-driven apparel/catalog experience built as a museum rather than a conventional store. The product concept deliberately changes the information architecture: products become exhibits, categories become museum wings, descriptions become curator placards, and audio-guide narration becomes part of the browsing experience.

The repository takes that concept through implementation and deployment: **103 exhibits, five wings, 103 narrated audio stops, static generation, optimized media, CI deployment, and a responsive user experience.**

## Why this matters as engineering work

This is not primarily an AI-governance project. It demonstrates a different part of the engineering portfolio: **taking an unusual product idea from concept to a working, deployable experience and solving the practical problems encountered on the way.**

## Product and design capabilities

### Concept-to-code product incubation

The product began with a strong experiential premise rather than a conventional requirements document. The implementation translates that premise into repeatable product primitives:

- exhibit pages
- museum-wing navigation
- curator metadata
- conservation/provenance language
- audio-guide experiences
- responsive gallery layouts
- automated accessioning of new assets

That is product architecture as much as frontend implementation: deciding which parts of a creative concept need to become data, reusable components, and build rules.

### Content-system design

The catalog is generated from a curated metadata source plus the asset library. New uncurated images are automatically accessioned into a holding wing; curated records pointing to missing assets fail loudly.

This turns a creative catalog into an enforceable content pipeline rather than a collection of manually maintained pages.

### Media engineering

A custom prebuild image pipeline generates AVIF/WebP derivatives and blur-up placeholders. Outputs are content-addressed so unchanged source images do not need to be regenerated.

The repository therefore demonstrates practical work around:

- large asset libraries
- responsive delivery
- static-host constraints
- build caching
- deterministic media processing

### Perceptual matching

The project uses dHash perceptual hashing and Hamming distance to reconnect legacy embedded thumbnails with their correct high-resolution source assets when filenames were insufficient.

That is a small but representative example of the broader working style: when manual matching is ambiguous, turn the problem into a measurable deterministic process.

### Audio pipeline

Each exhibit has an optional locally generated narration. Text is normalized before synthesis, output is cached by content/model hash, and a generated manifest controls which UI elements expose audio.

The model/provider is replaceable; the product behavior is not coupled to one hosted AI service.

### Deployment hardening

GitHub Pages introduces subpath and static-export constraints. The project includes explicit base-path handling and a post-build verifier that checks exported URLs, required exhibit pages, and deployment artifacts before release.

The principle is simple: **the local build should prove the thing being deployed has the structure the hosting environment requires.**

## Stack

- Next.js 15 / App Router
- TypeScript
- CSS Modules
- sharp
- Vitest
- Playwright
- Python-based local TTS
- GitHub Actions / GitHub Pages

## Where to review the engineering

Useful entry points include:

- `content/designs.json` — curated catalog source
- `scripts/build-catalog.ts` — catalog generation and auto-accessioning
- `scripts/image-pipeline.ts` — static media derivatives/cache
- `scripts/verify-export.mjs` — deployment verification
- `tts/` — local narration pipeline
- application components/pages — gallery and exhibit experience
- `.github/workflows/` — deployment automation

## Engineering capabilities demonstrated

Crossroad Threads provides concrete evidence of:

- rapid product prototyping and incubation
- human-centered/product-oriented design thinking
- React/Next.js frontend engineering
- TypeScript
- content modeling
- static-site architecture
- build systems
- image/media processing
- deterministic matching and verification
- testable data transforms
- CI/CD
- deployment troubleshooting
- provider abstraction
- translating a creative concept into maintainable software primitives

## Relationship to the broader portfolio

Crossroad Threads deliberately shows a different surface from the verification-heavy systems:

- **Convergence** — evidence synthesis and deterministic inference
- **TELOS** — AI engineering governance and authority
- **LEXI** — applied evidence-grounded AI product
- **Crossroad Threads** — design-forward product incubation and frontend delivery

Together they demonstrate both sides of AI/product engineering: **reason carefully about the system, then actually ship the experience.**

## Relevant roles

This project is especially relevant to:

- Forward-Deployed Engineer
- AI/Product Prototyping Engineer
- AI Design Facilitator
- Product Engineer
- Creative Technologist
- Frontend Engineer
- Design Engineer
- Technical Product roles

It is particularly useful evidence for roles asking for someone who can move between user experience, rapid prototyping, engineering constraints, and a finished demonstrable product.
