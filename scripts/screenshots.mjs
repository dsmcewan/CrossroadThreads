/**
 * Capture portfolio screenshots from the running preview server.
 * Prereq: `npm run preview:pages` serving a GITHUB_ACTIONS=true build.
 * Output: docs/screenshots/*.png
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:4173/CrossroadThreads";
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

// Gallery — hero shot (header + first rows of masonry)
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200); // let rise animations settle
await page.screenshot({ path: `${OUT}/gallery.png` });

// Gallery — wing filtered
await page.getByRole("button", { name: "Bless Your Heart" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/gallery-wing.png` });

// Exhibit page — placard + audio button
await page.goto(`${BASE}/exhibit/medusa/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/exhibit.png` });

// Exhibit — audio playing state (transcript view)
await page.getByRole("button", { name: /play audio guide/i }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/exhibit-audio.png` });

// Mobile gallery
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobile.goto(`${BASE}/`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${OUT}/gallery-mobile.png` });

await browser.close();
console.log("screenshots saved to", OUT);
