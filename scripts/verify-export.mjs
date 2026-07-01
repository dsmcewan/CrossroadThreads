/**
 * Post-build sanity check for the static export.
 * Fails the build if the export is structurally broken — missing pages,
 * missing image variants, or a missing .nojekyll (Pages would then hide
 * the _next/ directory).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");
const errors = [];

function require_(relPath, why) {
  if (!existsSync(join(OUT, relPath))) errors.push(`missing ${relPath} — ${why}`);
}

if (!existsSync(OUT)) {
  console.error("verify-export: no out/ directory. Did `next build` run with output: 'export'?");
  process.exit(1);
}

require_("index.html", "gallery page");
require_(".nojekyll", "GitHub Pages must not run Jekyll (it drops _next/)");
require_("404.html", "Pages serves this for unknown routes");

const catalog = JSON.parse(
  readFileSync(join(process.cwd(), "src", "data", "catalog.generated.json"), "utf8"),
);

for (const design of catalog.designs) {
  require_(join("exhibit", design.slug, "index.html"), `exhibit page for ${design.slug}`);
  for (const kind of ["card", "full"]) {
    for (const variant of design.images[kind]) {
      // variant.src is site-absolute like /images/designs/<slug>/...
      require_(variant.src.replace(/^\//, ""), `${kind} image variant for ${design.slug}`);
    }
  }
}

if (errors.length) {
  console.error(`verify-export: ${errors.length} problem(s):`);
  for (const e of errors.slice(0, 20)) console.error(`  - ${e}`);
  if (errors.length > 20) console.error(`  … and ${errors.length - 20} more`);
  process.exit(1);
}

console.log(
  `verify-export: OK — ${catalog.designs.length} exhibit pages + gallery, all image variants present.`,
);
