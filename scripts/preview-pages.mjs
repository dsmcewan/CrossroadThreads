/**
 * Serve out/ exactly the way GitHub Pages will: under /CrossroadThreads,
 * with trailing-slash directory indexes and a 404.html fallback.
 *
 * Build first with the Pages basePath baked in:
 *   GITHUB_ACTIONS=true npm run build   (PowerShell: $env:GITHUB_ACTIONS="true"; npm run build)
 * then:
 *   npm run preview:pages
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const BASE = "/CrossroadThreads";
const OUT = join(process.cwd(), "out");
const PORT = Number(process.env.PORT ?? 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

function resolve(urlPath) {
  if (!urlPath.startsWith(BASE)) return null;
  let rel = decodeURIComponent(urlPath.slice(BASE.length).split("?")[0]) || "/";
  const file = normalize(join(OUT, rel));
  if (!file.startsWith(OUT)) return null; // path traversal guard
  if (existsSync(file)) {
    if (statSync(file).isDirectory()) {
      const index = join(file, "index.html");
      return existsSync(index) ? index : null;
    }
    return file;
  }
  // Pages redirects /foo -> /foo/ when trailingSlash is on; emulate the final result
  const index = join(file, "index.html");
  return existsSync(index) ? index : null;
}

createServer((req, res) => {
  const file = resolve(req.url ?? "/");
  if (!file) {
    const notFound = join(OUT, "404.html");
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(existsSync(notFound) ? readFileSync(notFound) : "404");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT, () => {
  console.log(`Pages preview: http://localhost:${PORT}${BASE}/`);
  console.log("(build with GITHUB_ACTIONS=true or asset URLs will miss the basePath)");
});
